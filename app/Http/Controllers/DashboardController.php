<?php

namespace App\Http\Controllers;

use App\Models\Automation;
use App\Models\AutomationLog;
use App\Models\Contact;
use App\Models\Conversation;
use App\Models\SocialAccount;
use App\Models\Workspace;
use App\Models\WorkspaceMember;
use App\Services\MetaGraphApiService;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        protected MetaGraphApiService $metaGraphApi
    ) {}

    protected function getOrCreateUserWorkspace(Request $request): Workspace
    {
        $user = $request->user();
        $workspace = $user->workspaces()->first();

        if (! $workspace) {
            $baseSlug = Str::slug($user->name.'-workspace');
            $slug = $baseSlug;
            $counter = 1;
            while (Workspace::where('slug', $slug)->exists()) {
                $slug = $baseSlug.'-'.$counter;
                $counter++;
            }

            $workspace = Workspace::create([
                'user_id' => $user->id,
                'name' => $user->name.' Workspace',
                'slug' => $slug,
                'plan' => 'pro',
                'settings' => [
                    'currency' => 'IDR',
                    'timezone' => 'Asia/Jakarta',
                    'notification_email' => $user->email,
                ],
            ]);

            WorkspaceMember::create([
                'workspace_id' => $workspace->id,
                'user_id' => $user->id,
                'role' => 'owner',
            ]);
        }

        return $workspace;
    }

    public function index(Request $request): Response
    {
        $workspace = $this->getOrCreateUserWorkspace($request);

        $automations = Automation::with(['socialAccount', 'triggers', 'actions'])
            ->where('workspace_id', $workspace->id)
            ->latest()
            ->get();

        $totalSent = $automations->sum('total_sent');
        $totalClicks = $automations->sum('total_clicks');
        $totalLeads = $automations->sum('total_leads');
        $activeCount = $automations->where('status', 'active')->count();

        $recentLogs = AutomationLog::whereHas('automation', function ($q) use ($workspace) {
            $q->where('workspace_id', $workspace->id);
        })
            ->with(['automation', 'contact'])
            ->latest()
            ->take(6)
            ->get();

        $socialAccounts = SocialAccount::where('workspace_id', $workspace->id)->get();

        $recentConversations = Conversation::with(['contact', 'messages'])
            ->where('workspace_id', $workspace->id)
            ->latest('last_message_at')
            ->take(5)
            ->get();

        // Calculate REAL 7-day stats
        $chartData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $dayName = match ($date->format('w')) {
                '0' => 'Min',
                '1' => 'Sen',
                '2' => 'Sel',
                '3' => 'Rab',
                '4' => 'Kam',
                '5' => 'Jum',
                '6' => 'Sab',
                default => $date->format('D'),
            };

            $sentCount = AutomationLog::whereHas('automation', function ($q) use ($workspace) {
                $q->where('workspace_id', $workspace->id);
            })->whereDate('created_at', $date)->count();

            $leadsCount = Contact::where('workspace_id', $workspace->id)
                ->whereDate('created_at', $date)
                ->count();

            $chartData[] = [
                'date' => $dayName,
                'sent' => $sentCount,
                'leads' => $leadsCount,
            ];
        }

        $igAccount = $socialAccounts->firstWhere('platform', 'instagram');
        $hasConnectedIg = (bool) ($igAccount && $igAccount->is_connected);
        $username = $igAccount ? $igAccount->username : null;

        $customPosts = $igAccount ? ($igAccount->metadata['posts'] ?? []) : [];

        // Purge any mock/dummy posts from metadata
        $cleanCustomPosts = array_values(array_filter($customPosts, function ($p) {
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

        if ($igAccount && count($cleanCustomPosts) !== count($customPosts)) {
            $meta = $igAccount->metadata ?? [];
            $meta['posts'] = $cleanCustomPosts;
            $igAccount->metadata = $meta;
            $igAccount->save();
        }

        $instagramPosts = $hasConnectedIg ? $this->metaGraphApi->getInstagramMedia(
            $igAccount->account_id ?? '',
            $igAccount->access_token,
            $cleanCustomPosts,
            $username
        ) : [];

        // If live posts were fetched, save them to metadata
        if (! empty($instagramPosts) && $igAccount && $instagramPosts !== $cleanCustomPosts) {
            $meta = $igAccount->metadata ?? [];
            $meta['posts'] = $instagramPosts;
            $igAccount->metadata = $meta;
            $igAccount->save();
        }

        $existingAutomationPostIds = $automations->pluck('triggers')->flatten()->pluck('post_id')->filter()->toArray();
        foreach ($instagramPosts as &$post) {
            $post['has_automation'] = in_array($post['id'], $existingAutomationPostIds);
        }

        return Inertia::render('Dashboard', [
            'workspace' => $workspace,
            'currentUser' => [
                'name' => $request->user()->name,
                'email' => $request->user()->email,
                'avatar' => $igAccount?->avatar_url ?? '/images/user_avatar.jpg',
                'username' => $username,
            ],
            'igAccount' => $igAccount ? [
                'id' => $igAccount->id,
                'username' => $igAccount->username,
                'display_name' => $igAccount->display_name,
                'avatar_url' => $igAccount->avatar_url,
                'is_connected' => (bool) $igAccount->is_connected,
                'followers_count' => $igAccount->metadata['followers_count'] ?? 0,
            ] : null,
            'stats' => [
                'totalSent' => $totalSent,
                'totalClicks' => $totalClicks,
                'totalLeads' => $totalLeads,
                'activeCount' => $activeCount,
                'totalFollowers' => $igAccount ? ($igAccount->metadata['followers_count'] ?? 0) : 0,
                'connectedAccounts' => $socialAccounts->where('is_connected', true)->count(),
                'conversionRate' => $totalSent > 0 ? round(($totalLeads / $totalSent) * 100, 1) : 0,
                'avgResponseTime' => $recentLogs->count() > 0 ? round($recentLogs->avg('execution_time_ms')).'ms' : '140ms',
            ],
            'quota' => [
                'dms_sent' => $totalSent,
                'dms_limit' => 500,
                'ig_connected' => $hasConnectedIg ? 1 : 0,
                'ig_limit' => 1,
            ],
            'instagramPosts' => $instagramPosts,
            'automations' => $automations,
            'recentLogs' => $recentLogs,
            'socialAccounts' => $socialAccounts,
            'recentConversations' => $recentConversations,
            'chartData' => $chartData,
        ]);
    }

    public function storeCustomPost(Request $request): RedirectResponse
    {
        $workspace = $this->getOrCreateUserWorkspace($request);
        $igAccount = SocialAccount::where('workspace_id', $workspace->id)
            ->where('platform', 'instagram')
            ->first();

        $validated = $request->validate([
            'caption' => 'nullable|string',
            'media_type' => 'nullable|string|in:IMAGE,VIDEO',
            'media_url' => 'nullable|string',
            'permalink' => 'nullable|string',
        ]);

        $permalink = trim($validated['permalink'] ?? '');
        $mediaUrl = trim($validated['media_url'] ?? '');

        // If user provided an Instagram permalink, attempt to fetch the real post image via og:image
        if (empty($mediaUrl) && ! empty($permalink)) {
            try {
                $ch = curl_init($permalink);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_USERAGENT, 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)');
                curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
                curl_setopt($ch, CURLOPT_TIMEOUT, 6);
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                $html = curl_exec($ch);
                curl_close($ch);

                if (! empty($html) && preg_match('/<meta property="og:image" content="([^"]+)"/i', $html, $m)) {
                    $mediaUrl = html_entity_decode($m[1], ENT_QUOTES | ENT_HTML5, 'UTF-8');
                }
            } catch (Exception $e) {
                // ignore
            }
        }

        if (empty($mediaUrl) && $igAccount) {
            $mediaUrl = $igAccount->avatar_url;
        }

        $shortId = 'post_'.substr(md5($permalink ?: microtime()), 0, 8);
        if (! empty($permalink) && preg_match('#/(?:p|reel|tv)/([a-zA-Z0-9_-]+)#', $permalink, $pm)) {
            $shortId = $pm[1];
        }

        $caption = ! empty(trim($validated['caption'] ?? ''))
            ? trim($validated['caption'])
            : ('Postingan Instagram @'.($igAccount?->username ?: 'bsmrlab'));

        $mediaType = $validated['media_type'] ?? (str_contains($permalink, '/reel/') ? 'VIDEO' : 'IMAGE');

        $metadata = $igAccount ? ($igAccount->metadata ?? []) : [];
        $posts = $metadata['posts'] ?? [];

        $posts[] = [
            'id' => $shortId,
            'caption' => $caption,
            'media_type' => $mediaType,
            'media_url' => $mediaUrl,
            'thumbnail_url' => $mediaUrl,
            'permalink' => $permalink ?: "https://www.instagram.com/p/{$shortId}/",
            'timestamp' => now()->toIso8601String(),
            'like_count' => 0,
            'comments_count' => 0,
        ];

        if ($igAccount) {
            $metadata['posts'] = $posts;
            $igAccount->metadata = $metadata;
            $igAccount->save();
        }

        return back()->with('success', 'Postingan berhasil ditambahkan ke dashboard dan siap diotomasi!');
    }

    public function deleteCustomPost(Request $request, string $id): RedirectResponse
    {
        $workspace = $this->getOrCreateUserWorkspace($request);
        $igAccount = SocialAccount::where('workspace_id', $workspace->id)
            ->where('platform', 'instagram')
            ->first();

        if ($igAccount) {
            $metadata = $igAccount->metadata ?? [];
            $posts = $metadata['posts'] ?? [];
            $posts = array_values(array_filter($posts, fn ($p) => ($p['id'] ?? '') !== $id));
            $metadata['posts'] = $posts;
            $igAccount->metadata = $metadata;
            $igAccount->save();
        }

        return back()->with('success', 'Postingan berhasil dihapus.');
    }

    public function syncInstagramPosts(Request $request): RedirectResponse
    {
        $workspace = $this->getOrCreateUserWorkspace($request);
        $igAccount = SocialAccount::where('workspace_id', $workspace->id)
            ->where('platform', 'instagram')
            ->first();

        if (! $igAccount) {
            return back()->with('error', 'Belum ada akun Instagram yang terhubung.');
        }

        $username = $igAccount->username ?: 'bsmrlab';

        // Filter out any previous dummy/mock posts
        $existing = array_values(array_filter($igAccount->metadata['posts'] ?? [], function ($p) {
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

        // Force fresh live fetch from Meta Graph API
        $posts = [];
        if ($igAccount->access_token) {
            $posts = $this->metaGraphApi->fetchLiveInstagramMedia(
                $igAccount->account_id,
                $igAccount->access_token
            );
        }

        $finalPosts = ! empty($posts) ? $posts : $existing;

        $meta = $igAccount->metadata ?? [];
        $meta['posts'] = $finalPosts;
        $igAccount->metadata = $meta;
        $igAccount->save();

        if (! empty($posts)) {
            return back()->with('success', 'Berhasil menarik '.count($posts)." postingan asli dari akun Instagram @{$username}!");
        }

        if (! empty($finalPosts)) {
            return back()->with('success', "Postingan @{$username} berhasil diperbarui.");
        }

        return back()->with('info', "Meta Graph API belum mengembalikan postingan untuk @{$username} (karena aplikasi Meta masih dalam mode Development atau memerlukan izin akses media). Anda dapat memasukkan link postingan @{$username} secara langsung melalui tombol 'Tambah Postingan'.");
    }
}
