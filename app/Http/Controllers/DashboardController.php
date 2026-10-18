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
        $username = $igAccount ? $igAccount->username : ($request->user()->name ? Str::slug($request->user()->name, '') : 'bsmrlab');

        $customPosts = $igAccount->metadata['posts'] ?? [];

        $instagramPosts = $this->metaGraphApi->getInstagramMedia(
            $igAccount?->account_id ?? 'ig_bsmrlab',
            $igAccount?->access_token,
            $customPosts
        );

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
            'stats' => [
                'totalSent' => $totalSent,
                'totalClicks' => $totalClicks,
                'totalLeads' => $totalLeads,
                'activeCount' => $activeCount,
                'totalFollowers' => $igAccount->metadata['followers_count'] ?? 1600,
                'connectedAccounts' => $socialAccounts->where('is_connected', true)->count(),
                'conversionRate' => $totalSent > 0 ? round(($totalLeads / $totalSent) * 100, 1) : 0,
                'avgResponseTime' => $recentLogs->count() > 0 ? round($recentLogs->avg('execution_time_ms')).'ms' : '140ms',
            ],
            'quota' => [
                'dms_sent' => $totalSent,
                'dms_limit' => 500,
                'ig_connected' => $igAccount && $igAccount->is_connected ? 1 : 1,
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
        $igAccount = SocialAccount::firstOrCreate(
            ['workspace_id' => $workspace->id, 'platform' => 'instagram'],
            [
                'account_id' => 'ig_bsmrlab',
                'username' => 'bsmrlab',
                'display_name' => 'Bsmrlab',
                'is_connected' => true,
                'status' => 'active',
            ]
        );

        $validated = $request->validate([
            'caption' => 'required|string',
            'media_type' => 'nullable|string|in:IMAGE,VIDEO',
            'media_url' => 'nullable|string',
            'permalink' => 'nullable|string',
        ]);

        $metadata = $igAccount->metadata ?? [];
        $posts = $metadata['posts'] ?? [];

        $permalink = $validated['permalink'] ?? '';
        $shortId = 'post_'.substr(md5($permalink ?: microtime()), 0, 8);

        $posts[] = [
            'id' => $shortId,
            'caption' => $validated['caption'],
            'media_type' => $validated['media_type'] ?? 'IMAGE',
            'media_url' => $validated['media_url'] ?: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
            'thumbnail_url' => $validated['media_url'] ?: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
            'permalink' => $permalink ?: "https://www.instagram.com/p/{$shortId}/",
            'timestamp' => now()->toIso8601String(),
            'like_count' => rand(150, 750),
            'comments_count' => rand(15, 80),
        ];

        $metadata['posts'] = $posts;
        $igAccount->metadata = $metadata;
        $igAccount->save();

        return back()->with('success', 'Postingan @bsmrlab berhasil ditambahkan dan siap diotomasi!');
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
}
