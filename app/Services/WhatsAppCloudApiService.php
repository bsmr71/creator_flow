<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppCloudApiService
{
    protected string $defaultPhoneNumberId;

    protected string $defaultAccessToken;

    protected string $graphVersion;

    public function __construct()
    {
        $this->defaultPhoneNumberId = (string) config('services.whatsapp.phone_number_id');
        $this->defaultAccessToken = (string) config('services.whatsapp.access_token');
        $this->graphVersion = (string) config('services.meta.graph_version', 'v21.0');
    }

    /**
     * Normalize Indonesian or international phone number (e.g. 08123456 -> 628123456).
     */
    public function formatPhoneNumber(string $phoneNumber): string
    {
        $cleaned = preg_replace('/[^0-9]/', '', $phoneNumber);

        if (str_starts_with($cleaned, '0')) {
            $cleaned = '62'.substr($cleaned, 1);
        }

        return $cleaned;
    }

    /**
     * Send a standard text message via WhatsApp Cloud API.
     */
    public function sendTextMessage(
        string $toPhoneNumber,
        string $text,
        ?string $phoneNumberId = null,
        ?string $token = null
    ): array {
        $pId = $phoneNumberId ?: $this->defaultPhoneNumberId;
        $accessToken = $token ?: $this->defaultAccessToken;
        $recipient = $this->formatPhoneNumber($toPhoneNumber);

        $url = "https://graph.facebook.com/{$this->graphVersion}/{$pId}/messages";

        $response = Http::withToken($accessToken)->post($url, [
            'messaging_product' => 'whatsapp',
            'recipient_type' => 'individual',
            'to' => $recipient,
            'type' => 'text',
            'text' => [
                'preview_url' => true,
                'body' => $text,
            ],
        ]);

        if ($response->failed()) {
            Log::error('WhatsApp Send Text Failed', [
                'recipient' => $recipient,
                'status' => $response->status(),
                'error' => $response->json(),
            ]);

            return ['success' => false, 'error' => $response->json()];
        }

        return ['success' => true, 'data' => $response->json()];
    }

    /**
     * Send interactive action buttons in WhatsApp chat.
     */
    public function sendInteractiveButtons(
        string $toPhoneNumber,
        string $bodyText,
        array $buttons,
        ?string $phoneNumberId = null,
        ?string $token = null
    ): array {
        $pId = $phoneNumberId ?: $this->defaultPhoneNumberId;
        $accessToken = $token ?: $this->defaultAccessToken;
        $recipient = $this->formatPhoneNumber($toPhoneNumber);

        $url = "https://graph.facebook.com/{$this->graphVersion}/{$pId}/messages";

        $buttonElements = [];
        foreach (array_slice($buttons, 0, 3) as $idx => $btn) {
            $buttonElements[] = [
                'type' => 'reply',
                'reply' => [
                    'id' => 'btn_'.($idx + 1),
                    'title' => mb_substr($btn['title'] ?? 'Lihat Tautan', 0, 20),
                ],
            ];
        }

        $payload = [
            'messaging_product' => 'whatsapp',
            'recipient_type' => 'individual',
            'to' => $recipient,
            'type' => 'interactive',
            'interactive' => [
                'type' => 'button',
                'body' => [
                    'text' => $bodyText,
                ],
                'action' => [
                    'buttons' => $buttonElements,
                ],
            ],
        ];

        $response = Http::withToken($accessToken)->post($url, $payload);

        if ($response->failed()) {
            Log::error('WhatsApp Interactive Message Failed', [
                'recipient' => $recipient,
                'error' => $response->json(),
            ]);

            return ['success' => false, 'error' => $response->json()];
        }

        return ['success' => true, 'data' => $response->json()];
    }
}
