<?php

namespace App\Http\Controllers;

use App\Services\DokuPaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class DokuWebhookController extends Controller
{
    /**
     * Handle incoming webhook notification from DOKU
     */
    public function handle(Request $request, DokuPaymentService $dokuService): JsonResponse
    {
        Log::info('DOKU Webhook Notification received', [
            'headers' => $request->headers->all(),
            'payload' => $request->all(),
        ]);

        $result = $dokuService->handleNotification($request->all(), $request->headers->all());

        return response()->json([
            'status' => $result['status'] ?? 'success',
            'message' => $result['message'] ?? 'Webhook processed',
            'processed_at' => now()->toIso8601String(),
        ], 200);
    }
}
