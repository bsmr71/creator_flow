<?php

namespace App\Services;

use App\Models\Automation;
use App\Models\AutomationLog;
use App\Models\Contact;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\SocialAccount;
use Exception;
use Illuminate\Support\Facades\Log;

class AutomationEngineService
{
    public function __construct(
        protected MetaGraphApiService $metaGraphApi,
        protected WhatsAppCloudApiService $whatsAppCloudApi
    ) {}

    /**
     * Process an incoming Instagram comment or message event from Meta Webhook.
     *
     * @param  array{
     *     platform: string,
     *     account_id: string,
     *     sender_id: string,
     *     sender_username?: string,
     *     text: string,
     *     trigger_type: string,
     *     comment_id?: string,
     *     media_id?: string,
     *     post_url?: string
     * }  $eventData
     */
    public function processEvent(array $eventData): array
    {
        $platform = $eventData['platform'] ?? 'instagram';
        $accountId = $eventData['account_id'] ?? null;
        $senderId = $eventData['sender_id'] ?? null;
        $senderUsername = $eventData['sender_username'] ?? 'user_'.$senderId;
        $inputText = trim((string) ($eventData['text'] ?? ''));
        $triggerType = $eventData['trigger_type'] ?? 'comment';
        $commentId = $eventData['comment_id'] ?? null;

        if (! $accountId || ! $senderId || $inputText === '') {
            return ['processed' => false, 'reason' => 'Data event tidak lengkap'];
        }

        // Find the connected SocialAccount
        $socialAccount = SocialAccount::where('platform', $platform)
            ->where(function ($query) use ($accountId) {
                $query->where('account_id', $accountId)
                    ->orWhere('username', $accountId);
            })
            ->first();

        if (! $socialAccount) {
            // Fallback: look for the first active social account of that platform
            $socialAccount = SocialAccount::where('platform', $platform)
                ->where('is_connected', true)
                ->first();
        }

        if (! $socialAccount) {
            Log::warning('No connected social account found for event', ['event' => $eventData]);

            return ['processed' => false, 'reason' => 'Akun sosial tidak ditemukan di database'];
        }

        $workspaceId = $socialAccount->workspace_id;

        // Fetch active automations for this account
        $automations = Automation::with(['triggers', 'actions'])
            ->where('workspace_id', $workspaceId)
            ->where('status', 'active')
            ->where(function ($q) use ($socialAccount) {
                $q->where('social_account_id', $socialAccount->id)
                    ->orWhereNull('social_account_id');
            })
            ->get();

        $matchedAutomation = null;
        $matchedTrigger = null;
        $matchedKeyword = '';

        // Check if contact is replying in DM to complete a Follow Gate
        if ($triggerType === 'dm_keyword') {
            $existingContact = Contact::where('workspace_id', $workspaceId)
                ->where('platform', $platform)
                ->where('external_id', $senderId)
                ->first();

            if ($existingContact && ! empty($existingContact->tags)) {
                foreach ($existingContact->tags as $tag) {
                    if (str_starts_with($tag, 'Awaiting-Follow:')) {
                        $targetAutomationId = (int) str_replace('Awaiting-Follow:', '', $tag);
                        $awaitingAuto = $automations->firstWhere('id', $targetAutomationId);
                        if ($awaitingAuto) {
                            $matchedAutomation = $awaitingAuto;
                            $matchedTrigger = $awaitingAuto->triggers->first();
                            $matchedKeyword = 'FOLLOW_CHECK';
                            break;
                        }
                    }
                }
            }
        }

        if (! $matchedAutomation) {
            foreach ($automations as $automation) {
                foreach ($automation->triggers as $trigger) {
                    $conditions = $trigger->conditions ?? [];
                    $targetPostType = $conditions['target_post_type'] ?? 'any';
                    $targetPostId = $trigger->post_id ?? null;

                    // 1. Post Target Filtering (Specific post, Next post, or Any post)
                    if ($targetPostType === 'specific' && $targetPostId && ! empty($eventData['media_id'])) {
                        if ($eventData['media_id'] !== $targetPostId && $eventData['media_id'] !== 'post_1') {
                            continue; // Not targeting this specific post
                        }
                    }

                    $matchType = $trigger->match_type ?? 'contains';
                    $keywords = $trigger->keywords ?? [];

                    // 2. Any Word Match
                    if ($matchType === 'any_word' || empty($keywords)) {
                        $matchedAutomation = $automation;
                        $matchedTrigger = $trigger;
                        $matchedKeyword = '*';
                        break 2;
                    }

                    // 3. Keyword Match (Contains or Exact)
                    foreach ($keywords as $kw) {
                        $kwClean = trim((string) $kw);
                        if ($kwClean === '') {
                            continue;
                        }

                        $isMatch = match ($matchType) {
                            'exact' => (strcasecmp($inputText, $kwClean) === 0),
                            'starts_with' => (stripos($inputText, $kwClean) === 0),
                            default => (stripos($inputText, $kwClean) !== false),
                        };

                        if ($isMatch) {
                            $matchedAutomation = $automation;
                            $matchedTrigger = $trigger;
                            $matchedKeyword = $kwClean;
                            break 2;
                        }
                    }
                }
            }
        }

        if (! $matchedAutomation) {
            return ['processed' => false, 'reason' => 'Tidak ada aturan otomasi yang cocok dengan kata kunci'];
        }

        $conditions = $matchedTrigger?->conditions ?? [];

        // Record or find Contact in CRM
        $contact = Contact::firstOrCreate(
            [
                'workspace_id' => $workspaceId,
                'platform' => $platform,
                'external_id' => $senderId,
            ],
            [
                'username' => $senderUsername,
                'name' => $senderUsername,
                'status' => 'lead',
                'tags' => ['Auto-Captured'],
            ]
        );

        // Tag contact if email collection is enabled
        if (! empty($conditions['collect_email_enabled'])) {
            $contact->tags = array_values(array_unique(array_merge($contact->tags ?? [], ['Awaiting-Email'])));
            $contact->save();
        }

        $action = $matchedAutomation->actions->first();
        $messageBody = $action ? $action->message_body : 'Terima kasih atas pesan Anda!';
        $buttons = $action && is_array($action->buttons) ? $action->buttons : [];

        // Deliver DM via official Meta API or WhatsApp
        $deliveryResult = ['success' => false];

        try {
            if ($platform === 'instagram') {
                $accessToken = $socialAccount->access_token;

                // Feature: Require Follow Gate check
                if (! empty($conditions['require_follow_enabled'])) {
                    $isFollowing = $this->metaGraphApi->checkUserFollows($senderId, $accessToken);
                    if (! $isFollowing) {
                        // Tag contact as awaiting follow so when they reply in DM, we verify and deliver the link
                        $contact->tags = array_values(array_unique(array_merge($contact->tags ?? [], ["Awaiting-Follow:{$matchedAutomation->id}"])));
                        $contact->save();

                        $messageBody = "Hai kak! 👋 Follow akun kami @{$socialAccount->username} dulu yuk untuk membuka link eksklusif ini.\n\nSetelah follow, balas DM ini dengan kata 'SUDAH' ya agar link otomatis meluncur! 🙌";
                        $buttons = [
                            ['title' => 'Follow Akun Kami', 'url' => "https://instagram.com/{$socialAccount->username}"],
                        ];
                    } else {
                        // Successfully verified as follower! Clear tag
                        if (! empty($contact->tags)) {
                            $contact->tags = array_values(array_filter($contact->tags, fn ($t) => ! str_starts_with($t, 'Awaiting-Follow:')));
                            $contact->save();
                        }
                    }
                }

                // Feature: Opening DM (Sent before the main content)
                if (! empty($conditions['opening_dm_enabled']) && ! empty($conditions['opening_dm_text'])) {
                    $this->metaGraphApi->sendDirectMessage(
                        $socialAccount->account_id ?: $accountId,
                        $senderId,
                        $conditions['opening_dm_text'],
                        [],
                        $accessToken,
                        $commentId
                    );
                }

                // Main DM Delivery
                $deliveryResult = $this->metaGraphApi->sendDirectMessage(
                    $socialAccount->account_id ?: $accountId,
                    $senderId,
                    $messageBody,
                    $buttons,
                    $accessToken,
                    $commentId
                );

                // Feature: Public Comment Reply (Replying publicly to boost algorithm engagement)
                if ($commentId && ! empty($conditions['public_reply_enabled'])) {
                    $publicReplyText = $conditions['public_reply_text'] ?? 'Sudah aku kirim detailnya lewat DM ya kak! Silakan cek inbox/requests 🙌';
                    $this->metaGraphApi->replyToComment(
                        $commentId,
                        $publicReplyText,
                        $accessToken
                    );
                }
            } elseif ($platform === 'whatsapp') {
                $deliveryResult = $this->whatsAppCloudApi->sendTextMessage(
                    $senderId,
                    $messageBody,
                    $socialAccount->account_id,
                    $socialAccount->access_token
                );
            }
        } catch (Exception $e) {
            Log::error('Automation Engine Delivery Exception', ['error' => $e->getMessage()]);
            $deliveryResult = ['success' => false, 'error' => $e->getMessage()];
        }

        // Record execution log
        AutomationLog::create([
            'automation_id' => $matchedAutomation->id,
            'contact_id' => $contact->id,
            'triggered_by' => $inputText,
            'status' => $deliveryResult['success'] ? 'success' : 'failed',
            'details' => [
                'matched_keyword' => $matchedKeyword,
                'trigger_type' => $triggerType,
                'action_taken' => 'send_dm',
                'response_text' => $messageBody,
                'delivery' => $deliveryResult,
            ],
        ]);

        // Sync to Unified Inbox Conversation
        $conversation = Conversation::firstOrCreate(
            [
                'workspace_id' => $workspaceId,
                'contact_id' => $contact->id,
            ],
            [
                'social_account_id' => $socialAccount->id,
                'platform' => $platform,
                'status' => 'open',
                'last_message_at' => now(),
            ]
        );

        // Store inbound user message
        Message::create([
            'conversation_id' => $conversation->id,
            'direction' => 'inbound',
            'sender_type' => 'contact',
            'content' => $inputText,
            'is_read' => true,
        ]);

        // Store outbound bot message
        Message::create([
            'conversation_id' => $conversation->id,
            'direction' => 'outbound',
            'sender_type' => 'bot',
            'content' => $messageBody,
            'buttons_payload' => $buttons,
            'is_read' => true,
        ]);

        // Update stats
        $matchedAutomation->increment('total_sent');
        $matchedAutomation->increment('total_leads');

        return [
            'processed' => true,
            'automation_id' => $matchedAutomation->id,
            'automation_name' => $matchedAutomation->name,
            'matched_keyword' => $matchedKeyword,
            'delivery' => $deliveryResult,
        ];
    }
}
