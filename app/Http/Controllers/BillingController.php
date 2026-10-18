<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\PricingPlan;
use App\Models\Subscription;
use App\Services\DokuPaymentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class BillingController extends Controller
{
    public function __construct(
        protected DokuPaymentService $dokuService
    ) {}

    /**
     * Show the Billing & Subscription management page
     */
    public function index(Request $request): Response
    {
        $workspace = $request->user()->currentWorkspace();

        $plans = PricingPlan::where('is_active', true)
            ->orderBy('order_index')
            ->get();

        // If no plans in DB yet, create default plans
        if ($plans->isEmpty()) {
            $defaultPlans = [
                [
                    'name' => 'Creator Starter',
                    'slug' => 'creator',
                    'price_monthly' => 149000,
                    'price_annual' => 1430000,
                    'description' => 'Ideal untuk kreator pemula yang ingin mengotomatiskan DM Instagram & story replies.',
                    'features' => [
                        '1 Akun Instagram Professional',
                        'Otomasi keyword DM tak terbatas',
                        'Auto-reply story mention',
                        'CRM lead collection (hingga 1.000 kontak)',
                        'Integrasi Google Sheets',
                        'Dukungan via Email & Komunitas',
                    ],
                    'is_popular' => false,
                    'order_index' => 1,
                    'cta_text' => 'Pilih Starter',
                ],
                [
                    'name' => 'Pro Growth',
                    'slug' => 'pro',
                    'price_monthly' => 299000,
                    'price_annual' => 2870000,
                    'description' => 'Paling populer untuk kreator, affiliate marketer, dan bisnis yang aktif live & closing tiap hari.',
                    'features' => [
                        'Semua fitur Starter',
                        '3 Akun (Instagram + WhatsApp Cloud)',
                        'Auto-reply live comment real-time',
                        'AI Follow-up Sequence pintar',
                        'Broadcast WhatsApp resmi (Meta Cloud API)',
                        'CRM lead tak terbatas & tagging',
                        'Prioritas Customer Support 24/7',
                    ],
                    'is_popular' => true,
                    'order_index' => 2,
                    'cta_text' => 'Pilih Pro Growth',
                ],
                [
                    'name' => 'Agency / Business',
                    'slug' => 'agency',
                    'price_monthly' => 699000,
                    'price_annual' => 6710000,
                    'description' => 'Untuk agensi digital, brand, atau kreator dengan multi-klien dan volume interaksi tinggi.',
                    'features' => [
                        'Semua fitur Pro Growth',
                        'Hingga 10 Akun media sosial',
                        'Multi-workspace & team member kolaborasi',
                        'Webhooks & Custom API access',
                        'White-label reporting ke klien',
                        'Dedicated Account Manager via WhatsApp',
                    ],
                    'is_popular' => false,
                    'order_index' => 3,
                    'cta_text' => 'Pilih Agency',
                ],
            ];

            foreach ($defaultPlans as $p) {
                PricingPlan::create($p);
            }

            $plans = PricingPlan::where('is_active', true)->orderBy('order_index')->get();
        }

        $currentSubscription = $workspace->subscriptions()
            ->with('pricingPlan')
            ->latest('id')
            ->first();

        $payments = $workspace->payments()
            ->with('subscription.pricingPlan')
            ->latest('id')
            ->take(15)
            ->get();

        $activeCheckout = null;
        if ($request->query('checkout')) {
            $activeCheckout = Payment::where('workspace_id', $workspace->id)
                ->where('invoice_number', $request->query('checkout'))
                ->with('subscription.pricingPlan')
                ->first();
        }

        return Inertia::render('Billing/Index', [
            'workspace' => $workspace,
            'plans' => $plans,
            'currentSubscription' => $currentSubscription,
            'payments' => $payments,
            'activeCheckout' => $activeCheckout,
            'doku' => [
                'environment' => config('doku.environment'),
                'isDemo' => str_starts_with((string) config('doku.client_id'), 'CF-DOKU-SANDBOX'),
            ],
        ]);
    }

    /**
     * Initiate checkout via DOKU Payment Gateway
     */
    public function checkout(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'plan_id' => 'required|exists:pricing_plans,id',
            'billing_cycle' => 'required|in:monthly,annual',
        ]);

        $workspace = $request->user()->currentWorkspace();
        $plan = PricingPlan::findOrFail($validated['plan_id']);

        $price = $validated['billing_cycle'] === 'annual'
            ? $plan->price_annual
            : $plan->price_monthly;

        // Create pending subscription
        $subscription = Subscription::create([
            'workspace_id' => $workspace->id,
            'pricing_plan_id' => $plan->id,
            'plan_code' => $plan->slug,
            'billing_cycle' => $validated['billing_cycle'],
            'status' => 'pending',
            'price' => $price,
        ]);

        $invoiceNumber = 'INV-'.date('Ymd').'-'.strtoupper(Str::random(6));

        // Create pending payment record
        $payment = Payment::create([
            'workspace_id' => $workspace->id,
            'subscription_id' => $subscription->id,
            'invoice_number' => $invoiceNumber,
            'amount' => $price,
            'currency' => 'IDR',
            'status' => 'pending',
            'payment_gateway' => 'doku',
            'payment_method' => 'doku_checkout',
            'expired_at' => now()->addHours(24),
        ]);

        // Request DOKU Checkout session
        $checkoutResult = $this->dokuService->createCheckoutSession($payment, $request->user());

        return redirect()->route('billing.index', [
            'checkout' => $payment->invoice_number,
        ])->with('success', 'Sesi pembayaran DOKU berhasil dibuat. Silakan selesaikan pembayaran invoice '.$payment->invoice_number);
    }

    /**
     * Simulate payment for testing / sandbox development
     */
    public function simulatePayment(Request $request, Payment $payment): RedirectResponse
    {
        $workspace = $request->user()->currentWorkspace();

        if ($payment->workspace_id !== $workspace->id) {
            abort(403, 'Akses tidak diizinkan');
        }

        $channel = $request->input('channel', 'DOKU QRIS Instant (Sandbox)');

        $this->dokuService->markPaymentSuccessful($payment, $channel, [
            'simulated_at' => now()->toIso8601String(),
            'channel' => $channel,
            'notes' => 'Simulasi sukses pembayaran DOKU di lingkungan sandbox/development.',
        ]);

        return redirect()->route('billing.index')
            ->with('success', "Pembayaran DOKU berhasil! Paket {$workspace->fresh()->plan} Anda kini aktif.");
    }

    /**
     * Cancel an active subscription
     */
    public function cancelSubscription(Request $request, Subscription $subscription): RedirectResponse
    {
        $workspace = $request->user()->currentWorkspace();

        if ($subscription->workspace_id !== $workspace->id) {
            abort(403, 'Akses tidak diizinkan');
        }

        $subscription->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
        ]);

        return redirect()->route('billing.index')
            ->with('success', 'Langganan berhasil dibatalkan. Akses tetap aktif hingga akhir periode pembayaran saat ini.');
    }
}
