<?php

namespace App\Http\Controllers;

use App\Services\AutomationEngineService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class MetaWebhookController extends Controller
{
    /**
     * Meta Webhook Verification Challenge (GET /api/webhooks/meta).
     * Meta ping this endpoint to verify server ownership.
     */
    public function verify(Request $request): Response
    {
        $mode = $request->query('hub_mode');
        $token = $request->query('hub_verify_token');
        $challenge = $request->query('hub_challenge');

        $expectedToken = config('services.meta.webhook_verify_token');

        if ($mode === 'subscribe' && $token === $expectedToken) {
            Log::info('Meta Webhook Verified Successfully', ['hub_challenge' => $challenge]);

            return response($challenge, 200)->header('Content-Type', 'text/plain');
        }

        Log::warning('Meta Webhook Verification Rejected', [
            'received_token' => $token,
            'expected_token' => $expectedToken,
        ]);

        return response('Forbidden', 403);
    }

    /**
     * Handle incoming real-time events from Meta (POST /api/webhooks/meta).
     * Dispatches events to AutomationEngineService.
     */
    public function handle(Request $request, AutomationEngineService $engine): Response
    {
        $payload = $request->all();

        Log::info('Meta Webhook Payload Received', ['payload' => $payload]);

        $object = $payload['object'] ?? '';

        if ($object === 'instagram') {
            $entries = $payload['entry'] ?? [];

            foreach ($entries as $entry) {
                $accountId = $entry['id'] ?? null;

                // 1. Comments on Reels / Posts
                if (! empty($entry['changes'])) {
                    foreach ($entry['changes'] as $change) {
                        $field = $change['field'] ?? '';
                        $value = $change['value'] ?? [];

                        if ($field === 'comments' && ! empty($value)) {
                            $commentId = $value['id'] ?? null;
                            $text = $value['text'] ?? '';
                            $from = $value['from'] ?? [];
                            $senderId = $from['id'] ?? null;
                            $senderUsername = $from['username'] ?? "user_{$senderId}";
                            $media = $value['media'] ?? [];
                            $mediaId = $media['id'] ?? null;

                            // Skip if comment is from the account itself
                            if ($senderId && $senderId !== $accountId) {
                                $engine->processEvent([
                                    'platform' => 'instagram',
                                    'account_id' => $accountId,
                                    'sender_id' => $senderId,
                                    'sender_username' => $senderUsername,
                                    'text' => $text,
                                    'trigger_type' => 'comment',
                                    'comment_id' => $commentId,
                                    'media_id' => $mediaId,
                                ]);
                            }
                        }
                    }
                }

                // 2. Direct Messages (DMs) / Story Replies
                if (! empty($entry['messaging'])) {
                    foreach ($entry['messaging'] as $messaging) {
                        $senderId = $messaging['sender']['id'] ?? null;
                        $recipientId = $messaging['recipient']['id'] ?? null;
                        $message = $messaging['message'] ?? [];
                        $text = $message['text'] ?? '';

                        // Skip bot's own echo messages
                        if ($senderId && $senderId !== $accountId && $text !== '') {
                            $isStoryReply = ! empty($message['reply_to']['story']);

                            $engine->processEvent([
                                'platform' => 'instagram',
                                'account_id' => $accountId,
                                'sender_id' => $senderId,
                                'text' => $text,
                                'trigger_type' => $isStoryReply ? 'story_reply' : 'dm_keyword',
                            ]);
                        }
                    }
                }
            }
        } elseif ($object === 'whatsapp_business_account') {
            $entries = $payload['entry'] ?? [];

            foreach ($entries as $entry) {
                $changes = $entry['changes'] ?? [];
                foreach ($changes as $change) {
                    $value = $change['value'] ?? [];
                    $messages = $value['messages'] ?? [];
                    $metadata = $value['metadata'] ?? [];
                    $phoneNumberId = $metadata['phone_number_id'] ?? null;

                    foreach ($messages as $msg) {
                        $sender = $msg['from'] ?? null;
                        $text = $msg['text']['body'] ?? '';

                        if ($sender && $text !== '') {
                            $engine->processEvent([
                                'platform' => 'whatsapp',
                                'account_id' => $phoneNumberId,
                                'sender_id' => $sender,
                                'text' => $text,
                                'trigger_type' => 'whatsapp_message',
                            ]);
                        }
                    }
                }
            }
        }

        // Must return 200 within 20 seconds to prevent Meta retries
        return response('EVENT_RECEIVED', 200);
    }
}
