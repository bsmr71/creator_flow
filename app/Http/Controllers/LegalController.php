<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class LegalController extends Controller
{
    /**
     * Display the official Privacy Policy compliant with Meta Graph API requirements.
     */
    public function privacy(): Response
    {
        return Inertia::render('Legal/Privacy', [
            'appName' => config('app.name', 'CreatorFlow'),
            'appUrl' => config('app.url', 'https://creatorflow.test'),
            'lastUpdated' => '18 Oktober 2026',
        ]);
    }

    /**
     * Display the official Terms of Service.
     */
    public function terms(): Response
    {
        return Inertia::render('Legal/Terms', [
            'appName' => config('app.name', 'CreatorFlow'),
            'appUrl' => config('app.url', 'https://creatorflow.test'),
            'lastUpdated' => '18 Oktober 2026',
        ]);
    }

    /**
     * Display the User Data Deletion Instructions required by Meta.
     */
    public function dataDeletion(): Response
    {
        return Inertia::render('Legal/DataDeletion', [
            'appName' => config('app.name', 'CreatorFlow'),
            'appUrl' => config('app.url', 'https://creatorflow.test'),
            'lastUpdated' => '18 Oktober 2026',
        ]);
    }

    /**
     * Handle Meta's automated User Data Deletion Callback (signed_request).
     * Meta requires responding with a confirmation code and status tracking URL.
     */
    public function handleMetaDeletionCallback(Request $request): JsonResponse
    {
        $signedRequest = $request->input('signed_request');
        $confirmationCode = 'del_'.Str::random(16);

        if ($signedRequest) {
            Log::info('Meta Data Deletion Request Received', [
                'signed_request' => substr($signedRequest, 0, 50).'...',
                'confirmation_code' => $confirmationCode,
            ]);
        }

        $statusUrl = url("/data-deletion?confirmation={$confirmationCode}");

        return response()->json([
            'url' => $statusUrl,
            'confirmation_code' => $confirmationCode,
        ]);
    }
}
