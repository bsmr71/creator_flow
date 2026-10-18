<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InboxController extends Controller
{
    public function index(Request $request): Response
    {
        $workspace = $request->user()->currentWorkspace();

        $query = Conversation::with(['contact', 'messages', 'socialAccount'])
            ->where('workspace_id', $workspace->id);

        if ($request->has('platform') && $request->platform !== 'all') {
            $query->where('platform', $request->platform);
        }

        $conversations = $query->latest('last_message_at')->get();

        $selectedId = $request->get('conversation_id', $conversations->first()?->id);
        $activeConversation = $conversations->firstWhere('id', $selectedId) ?? $conversations->first();

        return Inertia::render('Inbox/Index', [
            'conversations' => $conversations,
            'activeConversation' => $activeConversation,
            'currentPlatform' => $request->platform ?? 'all',
        ]);
    }

    public function sendMessage(Request $request, Conversation $conversation)
    {
        $workspace = $request->user()->currentWorkspace();
        abort_if($conversation->workspace_id !== $workspace->id, 403);

        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        Message::create([
            'conversation_id' => $conversation->id,
            'direction' => 'outbound',
            'sender_type' => 'user',
            'content' => $validated['content'],
            'is_read' => true,
            'sent_at' => now(),
        ]);

        $conversation->update([
            'last_message_at' => now(),
            'unread_count' => 0,
        ]);

        return back()->with('success', 'Pesan berhasil terkirim!');
    }

    public function updateStatus(Request $request, Conversation $conversation)
    {
        $workspace = $request->user()->currentWorkspace();
        abort_if($conversation->workspace_id !== $workspace->id, 403);

        $validated = $request->validate([
            'status' => 'required|in:open,closed,snoozed',
        ]);

        $conversation->update(['status' => $validated['status']]);

        return back()->with('success', 'Status percakapan diperbarui.');
    }
}
