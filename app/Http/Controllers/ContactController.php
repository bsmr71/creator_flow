<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function index(Request $request): Response
    {
        $workspace = $request->user()->currentWorkspace();

        $query = Contact::with(['socialAccount', 'conversations.messages'])
            ->where('workspace_id', $workspace->id);

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('username', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->has('platform') && $request->platform !== 'all') {
            $query->where('platform', $request->platform);
        }

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $contacts = $query->latest('last_interacted_at')->get();
        $tags = Tag::where('workspace_id', $workspace->id)->get();

        return Inertia::render('Contacts/Index', [
            'contacts' => $contacts,
            'tags' => $tags,
            'filters' => [
                'search' => $request->search ?? '',
                'platform' => $request->platform ?? 'all',
                'status' => $request->status ?? 'all',
            ],
            'totalLeadsCount' => Contact::where('workspace_id', $workspace->id)->count(),
        ]);
    }

    public function store(Request $request)
    {
        $workspace = $request->user()->currentWorkspace();

        $validated = $request->validate([
            'username' => 'required|string',
            'name' => 'nullable|string',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'platform' => 'required|string',
            'status' => 'required|string',
            'tags' => 'nullable|array',
        ]);

        Contact::create([
            'workspace_id' => $workspace->id,
            'username' => $validated['username'],
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'platform' => $validated['platform'],
            'status' => $validated['status'],
            'tags' => $validated['tags'] ?? [],
            'last_interacted_at' => now(),
        ]);

        return back()->with('success', 'Kontak lead berhasil ditambahkan!');
    }

    public function update(Request $request, Contact $contact)
    {
        $workspace = $request->user()->currentWorkspace();
        abort_if($contact->workspace_id !== $workspace->id, 403);

        $validated = $request->validate([
            'status' => 'nullable|string',
            'tags' => 'nullable|array',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
        ]);

        $contact->update($validated);

        return back()->with('success', 'Data kontak berhasil diperbarui.');
    }
}
