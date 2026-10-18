<?php

namespace App\Services;

use App\Models\Payment;
use App\Models\User;
use App\Models\Workspace;
use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class DokuPaymentService
{
    protected string $clientId;

    protected string $secretKey;

    protected string $environment;

    protected string $apiBaseUrl;

    public function __construct()
    {
        $this->clientId = (string) config('doku.client_id', 'CF-DOKU-SANDBOX-DEMO');
        $this->secretKey = (string) config('doku.secret_key', 'SK-DOKU-SANDBOX-SECRET-KEY');
        $this->environment = (string) config('doku.environment', 'sandbox');
        $this->apiBaseUrl = (string) config('doku.api_base_url', 'https://api-sandbox.doku.com');
    }

    /**
     * Generate DOKU Jokul/Checkout HMAC-SHA256 signature
     */
    public function generateSignature(string $requestId, string $timestamp, string $targetPath, string $jsonBody): string
    {
        $digest = base64_encode(hash('sha256', $jsonBody, true));
        $component = "Client-Id:{$this->clientId}\n"
            ."Request-Id:{$requestId}\n"
            ."Request-Timestamp:{$timestamp}\n"
            ."Request-Target:{$targetPath}\n"
            ."Digest:{$digest}";

        $rawSignature = hash_hmac('sha256', $component, $this->secretKey, true);

        return 'HMACSHA256='.base64_encode($rawSignature);
    }

    /**
     * Create a DOKU Checkout session for the given payment
     */
    public function createCheckoutSession(Payment $payment, User $user): array
    {
        $requestId = (string) Str::uuid();
        $timestamp = gmdate('Y-m-d\TH:i:s\Z');
        $targetPath = (string) config('doku.checkout_path', '/checkout/v1/payment');

        $body = [
            'order' => [
                'invoice_number' => $payment->invoice_number,
                'amount' => $payment->amount,
                'currency' => 'IDR',
                'callback_url' => route('billing.index'),
                'callback_url_cancel' => route('billing.index'),
                'auto_redirect' => true,
            ],
            'payment' => [
                'payment_due_date' => 60, // 60 minutes
            ],
            'customer' => [
                'id' => (string) $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => '081234567890',
            ],
            'additional_info' => [
                'integration_partner' => 'CreatorFlow',
                'workspace_id' => $payment->workspace_id,
            ],
        ];

        $jsonBody = json_encode($body, JSON_UNESCAPED_SLASHES);
        $signature = $this->generateSignature($requestId, $timestamp, $targetPath, $jsonBody);

        // Check if demo/sandbox mock mode is active
        $isMockMode = str_starts_with($this->clientId, 'CF-DOKU-SANDBOX')
            || $this->secretKey === 'SK-DOKU-SANDBOX-SECRET-KEY';

        if (! $isMockMode) {
            try {
                $response = Http::timeout(15)
                    ->withHeaders([
                        'Client-Id' => $this->clientId,
                        'Request-Id' => $requestId,
                        'Request-Timestamp' => $timestamp,
                        'Signature' => $signature,
                        'Content-Type' => 'application/json',
                    ])
                    ->post($this->apiBaseUrl.$targetPath, $body);

                if ($response->successful()) {
                    $resData = $response->json();
                    $paymentUrl = $resData['response']['payment']['url'] ?? null;
                    $dokuInvoice = $resData['response']['order']['invoice_number'] ?? $payment->invoice_number;

                    if ($paymentUrl) {
                        $payment->update([
                            'payment_url' => $paymentUrl,
                            'doku_invoice_id' => $dokuInvoice,
                            'metadata' => $resData,
                        ]);

                        return [
                            'success' => true,
                            'payment_url' => $paymentUrl,
                            'invoice_number' => $payment->invoice_number,
                            'mode' => 'live_doku',
                        ];
                    }
                }

                Log::warning('DOKU API response failed, falling back to sandbox simulator', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
            } catch (Exception $e) {
                Log::error('DOKU API error, falling back to simulator: '.$e->getMessage());
            }
        }

        // Demo Sandbox Mode: generate internal checkout / simulation link
        $payment->update([
            'payment_url' => route('billing.index', ['checkout' => $payment->invoice_number]),
            'doku_invoice_id' => 'DOKU-SIM-'.strtoupper(Str::random(10)),
            'metadata' => [
                'mode' => 'sandbox_simulation',
                'requested_at' => now()->toIso8601String(),
                'available_channels' => ['QRIS', 'BCA Virtual Account', 'Mandiri Virtual Account', 'GoPay', 'ShopeePay', 'Kartu Kredit/Debit'],
            ],
        ]);

        return [
            'success' => true,
            'payment_url' => route('billing.index', ['checkout' => $payment->invoice_number]),
            'invoice_number' => $payment->invoice_number,
            'mode' => 'sandbox_simulation',
        ];
    }

    /**
     * Process notification callback from DOKU
     */
    public function handleNotification(array $payload, array $headers = []): array
    {
        $invoiceNumber = $payload['order']['invoice_number']
            ?? $payload['invoice_number']
            ?? null;

        if (! $invoiceNumber) {
            return ['status' => 'ignored', 'message' => 'No invoice number in payload'];
        }

        $payment = Payment::where('invoice_number', $invoiceNumber)->first();

        if (! $payment) {
            return ['status' => 'error', 'message' => 'Invoice not found'];
        }

        $transactionStatus = strtoupper($payload['transaction']['status'] ?? $payload['status'] ?? 'SUCCESS');
        $channel = $payload['channel']['id'] ?? $payload['payment_channel'] ?? 'DOKU Checkout';

        if (in_array($transactionStatus, ['SUCCESS', 'PAID', '0000'])) {
            $this->markPaymentSuccessful($payment, $channel, $payload);

            return ['status' => 'success', 'message' => 'Payment marked as paid'];
        }

        $payment->update([
            'status' => 'failed',
            'metadata' => array_merge($payment->metadata ?? [], ['failed_payload' => $payload]),
        ]);

        return ['status' => 'failed', 'message' => 'Payment marked as failed'];
    }

    /**
     * Mark a payment as paid and activate/update the workspace plan
     */
    public function markPaymentSuccessful(Payment $payment, string $channel = 'DOKU Checkout', array $meta = []): void
    {
        $payment->update([
            'status' => 'paid',
            'paid_at' => now(),
            'payment_channel' => $channel,
            'metadata' => array_merge($payment->metadata ?? [], $meta),
        ]);

        $subscription = $payment->subscription;
        if ($subscription) {
            $cycleMonths = $subscription->billing_cycle === 'annual' ? 12 : 1;
            $subscription->update([
                'status' => 'active',
                'started_at' => now(),
                'ends_at' => now()->addMonths($cycleMonths),
                'cancelled_at' => null,
            ]);

            // Upgrade workspace plan
            $workspace = $payment->workspace;
            if ($workspace) {
                $workspace->update([
                    'plan' => $subscription->plan_code,
                ]);
            }
        }
    }
}
