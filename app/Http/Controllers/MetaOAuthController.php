<?php

namespace App\Http\Controllers;

use App\Models\SocialAccount;
use App\Models\User;
use App\Services\MetaGraphApiService;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class MetaOAuthController extends Controller
{
    /**
     * Redirect to Meta's official OAuth authorization screen (for connecting from dashboard).
     */
    public function connect(Request $request, MetaGraphApiService $metaService): RedirectResponse
    {
        $provider = $request->query('provider', 'instagram');
        $appId = $provider === 'facebook'
            ? config('services.meta.app_id')
            : (config('services.meta.instagram_app_id') ?: config('services.meta.app_id'));

        if (empty($appId)) {
            return redirect()->route('integrations.index')->with(
                'error',
                'INSTAGRAM_APP_ID / META_APP_ID belum diisi di file .env.'
            );
        }

        $state = Str::random(40);
        $request->session()->put('meta_oauth_state', $state);
        $request->session()->put('meta_oauth_flow', 'connect_account');

        $authUrl = $provider === 'facebook'
            ? $metaService->getFacebookAuthorizationUrl($state)
            : $metaService->getInstagramAuthorizationUrl($state);

        return redirect()->away($authUrl);
    }

    /**
     * Redirect to Meta's official OAuth for Single Sign-On (Login directly with Instagram).
     */
    public function loginRedirect(Request $request, MetaGraphApiService $metaService): RedirectResponse
    {
        $state = Str::random(40);
        $request->session()->put('meta_oauth_state', $state);
        $request->session()->put('meta_oauth_flow', 'sso_login');

        $authUrl = $metaService->getInstagramAuthorizationUrl($state);

        return redirect()->away($authUrl);
    }

    /**
     * Handle the OAuth callback redirect from Meta.
     */
    public function callback(Request $request, MetaGraphApiService $metaService): RedirectResponse
    {
        $savedState = $request->session()->pull('meta_oauth_state');
        $flow = $request->session()->pull('meta_oauth_flow', 'connect_account');
        $receivedState = $request->query('state');

        if ($savedState && $receivedState && $savedState !== $receivedState) {
            $fallbackRoute = $flow === 'sso_login' ? 'login' : 'integrations.index';

            return redirect()->route($fallbackRoute)->with(
                'error',
                'Otorisasi gagal: Sesi otentikasi tidak valid. Silakan coba kembali.'
            );
        }

        $code = $request->query('code');
        if (! $code) {
            $errorDesc = $request->query('error_description', 'Akses ditolak oleh pengguna atau izin belum diberikan.');
            $fallbackRoute = $flow === 'sso_login' ? 'login' : 'integrations.index';

            return redirect()->route($fallbackRoute)->with('error', $errorDesc);
        }

        try {
            // 1. Exchange code for short-lived token
            $shortLived = $metaService->exchangeCodeForToken($code);
            $shortLivedToken = $shortLived['access_token'];

            // 2. Upgrade to 60-day long-lived token
            $longLived = $metaService->getLongLivedUserToken($shortLivedToken);
            $userAccessToken = $longLived['access_token'] ?? $shortLivedToken;

            // 3. Discover Instagram accounts connected to user Pages
            $accounts = $metaService->getConnectedInstagramAccounts($userAccessToken);

            if (empty($accounts)) {
                $accounts = $metaService->getInstagramProfile($userAccessToken);
            }

            if (empty($accounts)) {
                $fallbackRoute = $flow === 'sso_login' ? 'login' : 'integrations.index';

                return redirect()->route($fallbackRoute)->with(
                    'error',
                    'Tidak ditemukan Akun Instagram Bisnis/Kreator yang terhubung. Pastikan Instagram Anda bertipe Profesional dan sudah diizinkan saat popup persetujuan.'
                );
            }

            $primaryAccount = $accounts[0];
            $igUsername = $primaryAccount['instagram_username'] ?: 'instagram_'.$primaryAccount['instagram_id'];

            // 4. If guest user is logging in via Instagram SSO:
            if ($flow === 'sso_login' || ! auth()->check()) {
                $email = 'ig_'.Str::slug($igUsername).'@creatorflow.so';
                $user = User::firstOrCreate(
                    ['email' => $email],
                    [
                        'name' => $primaryAccount['instagram_name'] ?: '@'.$igUsername,
                        'password' => Hash::make(Str::random(32)),
                    ]
                );

                auth()->login($user, true);
                $workspace = $user->currentWorkspace();
            } else {
                $workspace = $request->user()->currentWorkspace();
            }

            // 5. Save or update SocialAccount in workspace
            $socialAccount = SocialAccount::updateOrCreate(
                [
                    'workspace_id' => $workspace->id,
                    'platform' => 'instagram',
                ],
                [
                    'account_id' => $primaryAccount['instagram_id'],
                    'username' => $igUsername,
                    'display_name' => $primaryAccount['instagram_name'] ?: '@'.$igUsername,
                    'avatar_url' => $primaryAccount['instagram_avatar'],
                    'access_token' => $primaryAccount['page_access_token'] ?: $userAccessToken,
                    'is_connected' => true,
                    'status' => 'active',
                    'metadata' => [
                        'page_id' => $primaryAccount['page_id'] ?? null,
                        'page_name' => $primaryAccount['page_name'] ?? null,
                        'posts' => $primaryAccount['posts'] ?? [],
                    ],
                ]
            );

            // 6. Automatically subscribe app to Page webhooks
            if (! empty($primaryAccount['page_id']) && ! empty($primaryAccount['page_access_token'])) {
                $metaService->subscribeAppToPage($primaryAccount['page_id'], $primaryAccount['page_access_token']);
            }

            if ($flow === 'sso_login') {
                return redirect()->route('dashboard')->with(
                    'success',
                    "Selamat datang! Anda berhasil masuk dengan akun Instagram @{$socialAccount->username}."
                );
            }

            return redirect()->route('integrations.index')->with(
                'success',
                "Berhasil menghubungkan Instagram @{$socialAccount->username} ke workspace! Akun kini aktif dan siap diotomasi."
            );
        } catch (Exception $e) {
            Log::error('Meta OAuth Callback Exception', ['exception' => $e->getMessage()]);
            $fallbackRoute = $flow === 'sso_login' ? 'login' : 'integrations.index';

            return redirect()->route($fallbackRoute)->with(
                'error',
                'Gagal menyelesaikan otentikasi Meta: '.$e->getMessage()
            );
        }
    }

    /**
     * Connect an Instagram or WhatsApp account directly using custom credentials or System Access Token.
     */
    public function manualConnect(Request $request): RedirectResponse
    {
        $workspace = $request->user()->currentWorkspace();

        $validated = $request->validate([
            'platform' => 'required|in:instagram,whatsapp,tiktok,facebook',
            'username' => 'required|string',
            'account_id' => 'nullable|string',
            'access_token' => 'nullable|string',
            'display_name' => 'nullable|string',
        ]);

        $cleanUsername = ltrim(trim($validated['username']), '@');
        $accountId = $validated['account_id'] ?: 'cf_'.substr(md5($cleanUsername), 0, 12);
        $token = $validated['access_token'] ?: 'EAAB_'.bin2hex(random_bytes(24));
        $displayName = $validated['display_name'] ?: '@'.$cleanUsername;
        $avatar = "https://api.dicebear.com/7.x/identicon/svg?seed={$cleanUsername}";

        SocialAccount::updateOrCreate(
            [
                'workspace_id' => $workspace->id,
                'platform' => $validated['platform'],
            ],
            [
                'account_id' => $accountId,
                'username' => $cleanUsername,
                'display_name' => $displayName,
                'avatar_url' => $avatar,
                'access_token' => $token,
                'is_connected' => true,
                'status' => 'active',
            ]
        );

        return redirect()->route('integrations.index')->with(
            'success',
            "Akun @{$cleanUsername} ({$validated['platform']}) berhasil dihubungkan dan status aktif!"
        );
    }
}
