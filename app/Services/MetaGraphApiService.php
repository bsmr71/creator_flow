<?php

namespace App\Services;

use Exception;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MetaGraphApiService
{
    protected string $appId;

    protected string $appSecret;

    protected string $redirectUri;

    protected string $graphVersion;

    protected string $baseUrl;

    public function __construct()
    {
        $this->appId = (string) config('services.meta.app_id');
        $this->appSecret = (string) config('services.meta.app_secret');
        $this->redirectUri = (string) config('services.meta.redirect_uri');
        $this->graphVersion = (string) config('services.meta.graph_version', 'v21.0');
        $this->baseUrl = "https://graph.facebook.com/{$this->graphVersion}";
    }

    /**
     * Generate the official Meta OAuth authorization URL for Instagram & Facebook permissions.
     * Meta requires using the official dialog for Instagram Professional accounts on localhost.
     */
    public function getAuthorizationUrl(string $state): string
    {
        $scopes = [
            'instagram_basic',
            'instagram_manage_messages',
            'instagram_manage_comments',
            'pages_show_list',
            'pages_read_engagement',
            'pages_manage_metadata',
        ];

        $params = http_build_query([
            'client_id' => $this->appId,
            'redirect_uri' => $this->redirectUri,
            'state' => $state,
            'scope' => implode(',', $scopes),
            'response_type' => 'code',
        ]);

        return "https://www.facebook.com/{$this->graphVersion}/dialog/oauth?{$params}";
    }

    /**
     * Generate the official direct Instagram OAuth authorization URL (opens on instagram.com).
     */
    public function getInstagramAuthorizationUrl(string $state): string
    {
        $igAppId = (string) config('services.meta.instagram_app_id', $this->appId);

        $params = http_build_query([
            'enable_fb_login' => '0',
            'force_reauth' => 'true',
            'client_id' => $igAppId,
            'redirect_uri' => $this->redirectUri,
            'response_type' => 'code',
            'scope' => 'instagram_business_basic,instagram_business_manage_messages,instagram_business_manage_comments,instagram_business_content_publish,instagram_business_manage_insights',
            'state' => $state,
        ]);

        return "https://www.instagram.com/oauth/authorize?{$params}";
    }

    /**
     * Generate the official Facebook authorization URL.
     */
    public function getFacebookAuthorizationUrl(string $state): string
    {
        return $this->getAuthorizationUrl($state);
    }

    /**
     * Exchange the authorization code for a short-lived user access token.
     */
    public function exchangeCodeForToken(string $code): array
    {
        $cleanCode = preg_replace('/#.*$/', '', trim($code));

        // First try Instagram direct OAuth token exchange
        $igAppId = (string) config('services.meta.instagram_app_id', $this->appId);
        $igSecret = (string) config('services.meta.instagram_app_secret', $this->appSecret);

        $igResponse = Http::asForm()->post('https://api.instagram.com/oauth/access_token', [
            'client_id' => $igAppId,
            'client_secret' => $igSecret,
            'grant_type' => 'authorization_code',
            'redirect_uri' => $this->redirectUri,
            'code' => $cleanCode,
        ]);

        if ($igResponse->successful() && ! empty($igResponse->json('access_token'))) {
            return $igResponse->json();
        }

        // Fallback to standard Meta Graph API token exchange
        $response = Http::asForm()->post("{$this->baseUrl}/oauth/access_token", [
            'client_id' => $this->appId,
            'client_secret' => $this->appSecret,
            'redirect_uri' => $this->redirectUri,
            'code' => $cleanCode,
        ]);

        if ($response->failed()) {
            Log::error('Meta OAuth Token Exchange Failed', [
                'ig_response' => $igResponse->json(),
                'fb_response' => $response->json(),
            ]);
            throw new Exception('Gagal menukarkan kode OAuth Meta: '.$response->body());
        }

        return $response->json();
    }

    /**
     * Fetch Instagram profile directly when authenticated via Instagram Login for Business.
     */
    public function getInstagramProfile(string $accessToken, ?string $userId = null): array
    {
        $data = null;

        // 1. Try querying with specific Instagram User ID if returned by token exchange
        if (! empty($userId)) {
            $idEndpoints = [
                "https://graph.instagram.com/v21.0/{$userId}",
                "https://graph.instagram.com/{$userId}",
            ];

            foreach ($idEndpoints as $endpoint) {
                try {
                    $response = Http::get($endpoint, [
                        'fields' => 'id,username,name,profile_picture_url',
                        'access_token' => $accessToken,
                    ]);

                    if ($response->successful() && (! empty($response->json('username')) || ! empty($response->json('id')))) {
                        $data = $response->json();
                        break;
                    }
                } catch (Exception $e) {
                    Log::debug("Endpoint {$endpoint} lookup exception: ".$e->getMessage());
                }
            }
        }

        // 2. Try generic /me endpoints
        if (! $data) {
            $meEndpoints = [
                'https://graph.instagram.com/v21.0/me',
                'https://graph.instagram.com/me',
                "{$this->baseUrl}/me",
            ];

            foreach ($meEndpoints as $endpoint) {
                try {
                    $response = Http::get($endpoint, [
                        'fields' => 'id,username',
                        'access_token' => $accessToken,
                    ]);

                    if ($response->successful() && (! empty($response->json('username')) || ! empty($response->json('id')))) {
                        $data = $response->json();
                        break;
                    }
                } catch (Exception $e) {
                    Log::debug("Endpoint {$endpoint} lookup exception: ".$e->getMessage());
                }
            }
        }

        if ($data) {
            $igId = (string) ($data['id'] ?? $data['user_id'] ?? $userId ?? 'ig_'.time());
            $username = (string) ($data['username'] ?? $data['name'] ?? 'instagram_user');

            // Fetch real posts directly from Instagram Graph API
            $realPosts = [];
            try {
                $mediaRes = Http::get('https://graph.instagram.com/me/media', [
                    'fields' => 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp',
                    'access_token' => $accessToken,
                ]);
                if ($mediaRes->successful()) {
                    $mediaData = $mediaRes->json('data', []);
                    foreach ($mediaData as $m) {
                        $realPosts[] = [
                            'id' => $m['id'],
                            'caption' => $m['caption'] ?? 'Postingan Instagram',
                            'media_type' => $m['media_type'] ?? 'IMAGE',
                            'media_url' => $m['media_url'] ?? $m['thumbnail_url'] ?? null,
                            'thumbnail_url' => $m['thumbnail_url'] ?? $m['media_url'] ?? null,
                            'permalink' => $m['permalink'] ?? "https://www.instagram.com/{$username}/",
                            'timestamp' => $m['timestamp'] ?? now()->toIso8601String(),
                            'like_count' => 0,
                            'comments_count' => 0,
                        ];
                    }
                }
            } catch (Exception $e) {
                Log::warning('Failed fetching real media from Instagram: '.$e->getMessage());
            }

            $avatarUrl = $data['profile_picture_url'] ?? null;
            if (! $avatarUrl) {
                if (strtolower($username) === 'bsmrlab' && file_exists(public_path('images/bsmrlab_avatar.jpg'))) {
                    $avatarUrl = asset('images/bsmrlab_avatar.jpg');
                } else {
                    $avatarUrl = "https://api.dicebear.com/7.x/identicon/svg?seed={$username}";
                }
            }

            return [
                [
                    'page_id' => null,
                    'page_name' => 'Instagram Direct',
                    'page_access_token' => $accessToken,
                    'instagram_id' => $igId,
                    'instagram_username' => $username,
                    'instagram_name' => (! empty($data['name']) ? $data['name'] : '@'.$username),
                    'instagram_avatar' => $avatarUrl,
                    'posts' => $realPosts,
                ],
            ];
        }

        Log::warning('Instagram Profile Fetch Failed for direct token');

        return [];
    }

    /**
     * Exchange a short-lived token for a 60-day long-lived access token.
     */
    public function getLongLivedUserToken(string $shortLivedToken): array
    {
        $igSecret = (string) config('services.meta.instagram_app_secret', $this->appSecret);

        // If it's an Instagram token, use the Instagram exchange endpoint
        if (str_starts_with($shortLivedToken, 'IG') || ! str_starts_with($shortLivedToken, 'EAAB')) {
            $igResponse = Http::get('https://graph.instagram.com/access_token', [
                'grant_type' => 'ig_exchange_token',
                'client_secret' => $igSecret,
                'access_token' => $shortLivedToken,
            ]);

            if ($igResponse->successful() && ! empty($igResponse->json('access_token'))) {
                return $igResponse->json();
            }
        }

        // Facebook exchange token endpoint
        $response = Http::get("{$this->baseUrl}/oauth/access_token", [
            'grant_type' => 'fb_exchange_token',
            'client_id' => $this->appId,
            'client_secret' => $this->appSecret,
            'fb_exchange_token' => $shortLivedToken,
        ]);

        if ($response->failed()) {
            Log::warning('Meta Long Lived Token Exchange Failed, using short-lived token', ['response' => $response->json()]);

            return ['access_token' => $shortLivedToken, 'expires_in' => 5184000];
        }

        return $response->json();
    }

    /**
     * Retrieve all Facebook Pages and their connected Instagram Business/Creator accounts.
     */
    public function getConnectedInstagramAccounts(string $userAccessToken): array
    {
        // If it's an Instagram token, skip Facebook Pages lookup
        if (str_starts_with($userAccessToken, 'IG') || ! str_starts_with($userAccessToken, 'EAAB')) {
            return [];
        }

        $response = Http::withToken($userAccessToken)->get("{$this->baseUrl}/me/accounts", [
            'fields' => 'id,name,access_token,instagram_business_account{id,username,name,profile_picture_url}',
        ]);

        if ($response->failed()) {
            Log::warning('Fetch Meta Accounts Failed, fallback to direct profile', ['response' => $response->json()]);

            return [];
        }

        $data = $response->json('data', []);
        $accounts = [];

        foreach ($data as $page) {
            if (! empty($page['instagram_business_account'])) {
                $ig = $page['instagram_business_account'];
                $accounts[] = [
                    'page_id' => $page['id'],
                    'page_name' => $page['name'],
                    'page_access_token' => $page['access_token'],
                    'instagram_id' => $ig['id'],
                    'instagram_username' => $ig['username'] ?? '',
                    'instagram_name' => $ig['name'] ?? '',
                    'instagram_avatar' => $ig['profile_picture_url'] ?? null,
                ];
            }
        }

        return $accounts;
    }

    /**
     * Send a Direct Message (DM) to an Instagram user via Meta Send API.
     */
    public function sendDirectMessage(
        string $instagramAccountId,
        string $recipientId,
        string $messageText,
        array $buttons = [],
        ?string $accessToken = null
    ): array {
        $endpoint = "{$this->baseUrl}/{$instagramAccountId}/messages";

        // Build payload
        $payload = [
            'recipient' => [
                'id' => $recipientId,
            ],
            'message' => [
                'text' => $messageText,
            ],
        ];

        // If buttons / quick replies exist, append them
        if (! empty($buttons)) {
            $quickReplies = [];
            foreach ($buttons as $btn) {
                $quickReplies[] = [
                    'content_type' => 'text',
                    'title' => mb_substr($btn['title'] ?? 'Lihat Tautan', 0, 20),
                    'payload' => $btn['url'] ?? 'CLICK_URL',
                ];
            }
            $payload['message']['quick_replies'] = $quickReplies;
        }

        $request = Http::withHeaders(['Content-Type' => 'application/json']);

        if ($accessToken) {
            $request = $request->withToken($accessToken);
        }

        /** @var Response $response */
        $response = $request->post($endpoint, $payload);

        if ($response->failed()) {
            Log::error('Meta Send Direct Message Failed', [
                'endpoint' => $endpoint,
                'recipient_id' => $recipientId,
                'status' => $response->status(),
                'error' => $response->json(),
            ]);

            return [
                'success' => false,
                'error' => $response->json(),
            ];
        }

        return [
            'success' => true,
            'data' => $response->json(),
        ];
    }

    /**
     * Publicly reply to an Instagram comment on a Reel or Post.
     */
    public function replyToComment(string $commentId, string $replyText, ?string $accessToken = null): array
    {
        $endpoint = "{$this->baseUrl}/{$commentId}/replies";

        $request = Http::asForm();
        if ($accessToken) {
            $request = $request->withToken($accessToken);
        }

        $response = $request->post($endpoint, [
            'message' => $replyText,
        ]);

        if ($response->failed()) {
            Log::error('Meta Reply To Comment Failed', [
                'comment_id' => $commentId,
                'error' => $response->json(),
            ]);

            return ['success' => false, 'error' => $response->json()];
        }

        return ['success' => true, 'data' => $response->json()];
    }

    /**
     * Subscribe app to Page webhooks for real-time comment and message updates.
     */
    public function subscribeAppToPage(string $pageId, string $pageAccessToken): bool
    {
        $response = Http::withToken($pageAccessToken)->post("{$this->baseUrl}/{$pageId}/subscribed_apps", [
            'subscribed_fields' => 'messages,messaging_postbacks,message_reactions,feed',
        ]);

        return $response->successful() && ($response->json('success') === true);
    }

    /**
     * Fetch live posts from Meta's Instagram Graph API.
     *
     * @return array<int, array<string, mixed>>
     */
    public function fetchLiveInstagramMedia(string $instagramAccountId, string $accessToken): array
    {
        if (empty($accessToken) || str_starts_with($accessToken, 'EAAB_test')) {
            return [];
        }

        $endpoints = [];

        // For direct Instagram user tokens:
        if (str_starts_with($accessToken, 'IG') || ! str_starts_with($accessToken, 'EAAB')) {
            if (! empty($instagramAccountId) && ! str_starts_with($instagramAccountId, 'ig_')) {
                $endpoints[] = "https://graph.instagram.com/v21.0/{$instagramAccountId}/media";
                $endpoints[] = "https://graph.instagram.com/{$instagramAccountId}/media";
            }
            $endpoints[] = 'https://graph.instagram.com/v21.0/me/media';
            $endpoints[] = 'https://graph.instagram.com/me/media';
        } else {
            // For Facebook Page tokens:
            if (! empty($instagramAccountId) && ! str_starts_with($instagramAccountId, 'ig_')) {
                $endpoints[] = "{$this->baseUrl}/{$instagramAccountId}/media";
            }
            $endpoints[] = "{$this->baseUrl}/me/media";
        }

        $fieldSets = [
            'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count',
            'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp',
            'id,caption,media_url,permalink',
        ];

        foreach ($endpoints as $url) {
            foreach ($fieldSets as $fields) {
                try {
                    $response = Http::get($url, [
                        'fields' => $fields,
                        'access_token' => $accessToken,
                        'limit' => 25,
                    ]);

                    if ($response->successful()) {
                        $rawPosts = $response->json('data', []);
                        if (! empty($rawPosts)) {
                            $posts = [];
                            foreach ($rawPosts as $p) {
                                $mediaUrl = $p['media_url'] ?? $p['thumbnail_url'] ?? null;
                                $posts[] = [
                                    'id' => (string) $p['id'],
                                    'caption' => $p['caption'] ?? 'Postingan Instagram',
                                    'media_type' => $p['media_type'] ?? 'IMAGE',
                                    'media_url' => $mediaUrl,
                                    'thumbnail_url' => $p['thumbnail_url'] ?? $mediaUrl,
                                    'permalink' => $p['permalink'] ?? ('https://www.instagram.com/p/'.$p['id'].'/'),
                                    'timestamp' => $p['timestamp'] ?? now()->toIso8601String(),
                                    'like_count' => (int) ($p['like_count'] ?? 0),
                                    'comments_count' => (int) ($p['comments_count'] ?? 0),
                                ];
                            }

                            return $posts;
                        }
                    }
                } catch (Exception $e) {
                    // continue
                }
            }
        }

        return [];
    }

    /**
     * Fetch user's recent Instagram posts and reels without dummy mock data.
     *
     * @return array<int, array<string, mixed>>
     */
    public function getInstagramMedia(
        string $instagramAccountId,
        ?string $accessToken = null,
        array $customPosts = [],
        ?string $username = null
    ): array {
        // 1. If an access token is available, always query live posts from Meta Graph API
        if (! empty($accessToken) && ! str_starts_with($accessToken, 'EAAB_test')) {
            $livePosts = $this->fetchLiveInstagramMedia($instagramAccountId, $accessToken);
            if (! empty($livePosts)) {
                return $livePosts;
            }
        }

        // 2. Return user's custom posts, filtering out any old dummy/sample posts
        $cleanPosts = array_values(array_filter($customPosts, function ($p) {
            $id = (string) ($p['id'] ?? '');
            $caption = (string) ($p['caption'] ?? '');
            if (str_starts_with($id, 'post_bsmrlab_real_') || str_starts_with($id, 'post_bsmrlab_2') || str_starts_with($id, 'post_bsmrlab_3')) {
                return false;
            }
            if (str_contains($caption, 'Ciee yang katanya mau jadi') || str_contains($caption, 'Build fast & automate') || str_contains($caption, '3 Rahasia naikin omset')) {
                return false;
            }

            return true;
        }));

        return $cleanPosts;
    }

    /**
     * Check if an Instagram user follows the business account (IGSID inspection).
     */
    public function checkUserFollows(string $instagramScopedId, ?string $accessToken = null): bool
    {
        if (empty($accessToken) || str_starts_with($accessToken, 'EAAB_test')) {
            return true; // Default to true in test mode
        }

        try {
            $response = Http::withToken($accessToken)->get("{$this->baseUrl}/{$instagramScopedId}", [
                'fields' => 'name,is_user_follow_business',
            ]);

            if ($response->successful()) {
                return (bool) ($response->json('is_user_follow_business') ?? true);
            }
        } catch (Exception $e) {
            Log::warning('Check user follows failed', ['error' => $e->getMessage()]);
        }

        return true;
    }
}
