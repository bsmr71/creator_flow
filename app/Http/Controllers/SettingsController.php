<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function index(Request $request): Response
    {
        $workspace = $request->user()->currentWorkspace();
        $workspace->load('owner');

        return Inertia::render('Settings/Index', [
            'workspace' => $workspace,
            'apiToken' => 'cf_live_'.substr(md5($workspace->id.'_'.$workspace->slug.'_secret'), 0, 32),
            'webhookSecret' => 'whsec_'.substr(sha1($workspace->slug.$workspace->id), 0, 24),
        ]);
    }

    public function update(Request $request)
    {
        $workspace = $request->user()->currentWorkspace();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'notification_email' => 'nullable|email',
            'timezone' => 'nullable|string',
        ]);

        $settings = $workspace->settings ?? [];
        if (isset($validated['notification_email'])) {
            $settings['notification_email'] = $validated['notification_email'];
        }
        if (isset($validated['timezone'])) {
            $settings['timezone'] = $validated['timezone'];
        }

        $workspace->update([
            'name' => $validated['name'],
            'settings' => $settings,
        ]);

        return back()->with('success', 'Pengaturan workspace berhasil disimpan!');
    }
}
