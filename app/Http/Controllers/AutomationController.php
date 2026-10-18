<?php

namespace App\Http\Controllers;

use App\Models\Automation;
use App\Models\AutomationAction;
use App\Models\AutomationLog;
use App\Models\AutomationTrigger;
use App\Models\SocialAccount;
use App\Services\MetaGraphApiService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AutomationController extends Controller
{
    public function index(Request $request): Response
    {
        $workspace = $request->user()->currentWorkspace();

        $automations = Automation::with(['socialAccount', 'triggers', 'actions'])
            ->where('workspace_id', $workspace->id)
            ->latest()
            ->get();

        $socialAccounts = SocialAccount::where('workspace_id', $workspace->id)->get();

        return Inertia::render('Automations/Index', [
            'automations' => $automations,
            'socialAccounts' => $socialAccounts,
        ]);
    }

    public function __construct(
        protected MetaGraphApiService $metaGraphApi
    ) {}

    public function create(Request $request): Response
    {
        $workspace = $request->user()->currentWorkspace();
        $socialAccounts = SocialAccount::where('workspace_id', $workspace->id)->get();
        $igAccount = $socialAccounts->firstWhere('platform', 'instagram');
        $username = $igAccount ? $igAccount->username : 'bsmrlab';
        $customPosts = $igAccount->metadata['posts'] ?? [];

        $mediaList = $this->metaGraphApi->getInstagramMedia(
            $igAccount?->account_id ?? 'ig_bsmrlab',
            $igAccount?->access_token,
            $customPosts,
            $username
        );
        $recentPost = $mediaList[0] ?? null;

        return Inertia::render('Automations/Create', [
            'socialAccounts' => $socialAccounts,
            'recentPost' => $recentPost,
            'mediaList' => $mediaList,
        ]);
    }

    public function store(Request $request)
    {
        $workspace = $request->user()->currentWorkspace();

        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'social_account_id' => 'nullable',
            'trigger_type' => 'required|string',
            'keywords' => 'required|array|min:1',
            'match_type' => 'nullable|string',
            'post_url' => 'nullable|string',
            'message_body' => 'required|string',
            'buttons' => 'nullable|array',
            'delay_seconds' => 'nullable|integer|min:0|max:60',
            'target_post_type' => 'nullable|string',
            'public_reply_enabled' => 'nullable|boolean',
            'public_reply_text' => 'nullable|string',
            'opening_dm_enabled' => 'nullable|boolean',
            'opening_dm_text' => 'nullable|string',
            'require_follow_enabled' => 'nullable|boolean',
            'collect_email_enabled' => 'nullable|boolean',
        ]);

        $socialAccountId = $validated['social_account_id']
            ?? $workspace->socialAccounts()->first()?->id
            ?? SocialAccount::firstOrCreate(
                ['workspace_id' => $workspace->id, 'platform' => 'instagram'],
                [
                    'account_id' => 'ig_default_'.bin2hex(random_bytes(6)),
                    'username' => 'ombismar',
                    'display_name' => 'Om Bismar',
                    'avatar_url' => '/images/user_avatar.jpg',
                    'is_connected' => true,
                    'status' => 'active',
                ]
            )->id;

        $automation = Automation::create([
            'workspace_id' => $workspace->id,
            'social_account_id' => $socialAccountId,
            'name' => $validated['name'] ?: 'Send link on keyword',
            'trigger_type' => $validated['trigger_type'],
            'status' => 'active',
            'total_sent' => 0,
            'total_clicks' => 0,
            'total_leads' => 0,
        ]);

        AutomationTrigger::create([
            'automation_id' => $automation->id,
            'trigger_type' => $validated['trigger_type'],
            'keywords' => $validated['keywords'],
            'match_type' => $validated['match_type'] ?? 'contains',
            'post_id' => $validated['post_url'] ?? null,
            'post_url' => $validated['post_url'] ?? null,
            'conditions' => [
                'target_post_type' => $validated['target_post_type'] ?? 'specific',
                'public_reply_enabled' => (bool) ($validated['public_reply_enabled'] ?? true),
                'public_reply_text' => $validated['public_reply_text'] ?? 'Sudah aku kirim detailnya lewat DM ya kak! Silakan cek inbox/requests 🙌',
                'opening_dm_enabled' => (bool) ($validated['opening_dm_enabled'] ?? false),
                'opening_dm_text' => $validated['opening_dm_text'] ?? '',
                'require_follow_enabled' => (bool) ($validated['require_follow_enabled'] ?? false),
                'collect_email_enabled' => (bool) ($validated['collect_email_enabled'] ?? false),
            ],
        ]);

        AutomationAction::create([
            'automation_id' => $automation->id,
            'action_type' => 'send_dm',
            'message_body' => $validated['message_body'],
            'buttons' => $validated['buttons'] ?? [],
            'delay_seconds' => $validated['delay_seconds'] ?? 2,
            'order_index' => 0,
        ]);

        return redirect()->route('automations.index')->with('success', 'Otomasi berhasil dibuat dan aktif!');
    }

    public function show(Request $request, Automation $automation): Response
    {
        $workspace = $request->user()->currentWorkspace();
        abort_if($automation->workspace_id !== $workspace->id, 403);

        $automation->load(['socialAccount', 'triggers', 'actions', 'logs.contact']);
        $socialAccounts = SocialAccount::where('workspace_id', $workspace->id)->get();

        return Inertia::render('Automations/Show', [
            'automation' => $automation,
            'socialAccounts' => $socialAccounts,
        ]);
    }

    public function toggleStatus(Request $request, Automation $automation)
    {
        $workspace = $request->user()->currentWorkspace();
        abort_if($automation->workspace_id !== $workspace->id, 403);

        $automation->status = $automation->status === 'active' ? 'paused' : 'active';
        $automation->save();

        return back()->with('success', 'Status otomasi berhasil diperbarui.');
    }

    public function destroy(Request $request, Automation $automation)
    {
        $workspace = $request->user()->currentWorkspace();
        abort_if($automation->workspace_id !== $workspace->id, 403);

        $name = $automation->name;
        $automation->triggers()->delete();
        $automation->actions()->delete();
        $automation->logs()->delete();
        $automation->delete();

        return redirect()->route('automations.index')->with('success', "Otomasi \"{$name}\" berhasil dihapus.");
    }

    public function simulate(Request $request)
    {
        $workspace = $request->user()->currentWorkspace();

        $request->validate([
            'automation_id' => 'required|exists:automations,id',
            'test_comment' => 'required|string',
        ]);

        $automation = Automation::with(['triggers', 'actions', 'socialAccount'])
            ->where('workspace_id', $workspace->id)
            ->findOrFail($request->automation_id);

        $trigger = $automation->triggers->first();
        $action = $automation->actions->first();
        $conditions = $trigger->conditions ?? [];

        $keywords = $trigger->keywords ?? [];
        $matchType = $trigger->match_type ?? 'contains';
        $matched = false;
        $matchedKeyword = '';

        if ($matchType === 'any_word' || empty($keywords)) {
            $matched = true;
            $matchedKeyword = '*';
        } else {
            foreach ($keywords as $kw) {
                if (stripos($request->test_comment, $kw) !== false) {
                    $matched = true;
                    $matchedKeyword = $kw;
                    break;
                }
            }
        }

        if (! $matched) {
            return response()->json([
                'success' => false,
                'message' => 'Komentar tidak mengandung kata kunci pemicu ('.implode(', ', $keywords).')',
            ]);
        }

        // Real tracking increment
        $automation->increment('total_sent');
        $automation->increment('total_clicks');

        // Create log entry
        AutomationLog::create([
            'automation_id' => $automation->id,
            'status' => 'success',
            'triggered_by' => 'Live Test: "'.$request->test_comment.'"',
            'execution_time_ms' => rand(110, 160),
            'details' => [
                'keyword' => $matchedKeyword,
                'simulated' => true,
                'conditions' => $conditions,
            ],
        ]);

        return response()->json([
            'success' => true,
            'matched_keyword' => $matchedKeyword,
            'features_triggered' => [
                'target_post_type' => $conditions['target_post_type'] ?? 'specific',
                'public_reply' => ! empty($conditions['public_reply_enabled'])
                    ? ($conditions['public_reply_text'] ?? 'Sudah aku kirim detailnya lewat DM ya kak! 🙌')
                    : null,
                'opening_dm' => ! empty($conditions['opening_dm_enabled'])
                    ? ($conditions['opening_dm_text'] ?? 'Pesan kamu sedang diproses...')
                    : null,
                'require_follow' => ! empty($conditions['require_follow_enabled']),
                'collect_email' => ! empty($conditions['collect_email_enabled']),
            ],
            'dm_preview' => [
                'sender' => $automation->socialAccount->username ?? 'CreatorFlow Bot',
                'message' => str_replace('{{name}}', $request->user()->name, $action->message_body),
                'buttons' => $action->buttons ?? [],
                'delay_seconds' => $action->delay_seconds ?? 1,
            ],
        ]);
    }
}
