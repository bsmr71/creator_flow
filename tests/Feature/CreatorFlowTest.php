<?php

namespace Tests\Feature;

use App\Models\Payment;
use App\Models\PricingPlan;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CreatorFlowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_landing_page_renders_with_cms(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }

    public function test_login_page_renders(): void
    {
        $response = $this->get('/login');

        $response->assertStatus(200);
    }

    public function test_register_page_renders(): void
    {
        $response = $this->get('/register');

        $response->assertStatus(200);
    }

    public function test_user_can_register_and_creates_real_workspace(): void
    {
        $response = $this->post('/register', [
            'name' => 'Budi Pratama',
            'email' => 'budi@scale.id',
            'workspace_name' => 'Scale Up Media',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertRedirect('/dashboard');
        $this->assertAuthenticated();

        $user = User::where('email', 'budi@scale.id')->first();
        $this->assertNotNull($user);
        $this->assertNotNull($user->currentWorkspace());
        $this->assertEquals('Scale Up Media', $user->currentWorkspace()->name);
    }

    public function test_user_can_login_with_valid_credentials(): void
    {
        $user = User::factory()->create([
            'email' => 'member@creatorflow.so',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->post('/login', [
            'email' => 'member@creatorflow.so',
            'password' => 'password123',
        ]);

        $response->assertRedirect('/dashboard');
        $this->assertAuthenticatedAs($user);
    }

    public function test_unauthenticated_guests_are_redirected_to_login(): void
    {
        $response = $this->get('/dashboard');
        $response->assertRedirect('/login');

        $response = $this->get('/cms');
        $response->assertRedirect('/login');

        $response = $this->get('/automations');
        $response->assertRedirect('/login');
    }

    public function test_user_can_logout(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/logout');

        $response->assertRedirect('/login');
        $this->assertGuest();
    }

    public function test_authenticated_user_can_access_dashboard_with_clean_workspace(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertStatus(200);
    }

    public function test_authenticated_user_can_access_cms(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/cms');

        $response->assertStatus(200);
    }

    public function test_user_can_add_faq_in_cms(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/cms/faqs', [
            'question' => 'Apakah bisa integrasi dengan TikTok Shop?',
            'answer' => 'Bisa, melalui webhook TikTok for Business.',
            'category' => 'Integrasi',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('faqs', [
            'question' => 'Apakah bisa integrasi dengan TikTok Shop?',
        ]);
    }

    public function test_authenticated_user_can_access_billing_page(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/billing');

        $response->assertStatus(200);
    }

    public function test_user_can_checkout_plan_and_creates_doku_session(): void
    {
        $user = User::factory()->create();
        $workspace = $user->currentWorkspace();

        $plan = PricingPlan::firstOrCreate(
            ['slug' => 'pro'],
            [
                'name' => 'Pro Growth',
                'price_monthly' => 299000,
                'price_annual' => 2870000,
                'description' => 'Test Pro plan',
                'features' => ['Fitur 1', 'Fitur 2'],
                'is_popular' => true,
                'is_active' => true,
            ]
        );

        $response = $this->actingAs($user)->post('/billing/checkout', [
            'plan_id' => $plan->id,
            'billing_cycle' => 'monthly',
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('subscriptions', [
            'workspace_id' => $workspace->id,
            'plan_code' => 'pro',
            'status' => 'pending',
            'price' => 299000,
        ]);

        $this->assertDatabaseHas('payments', [
            'workspace_id' => $workspace->id,
            'amount' => 299000,
            'status' => 'pending',
            'payment_gateway' => 'doku',
        ]);
    }

    public function test_user_can_simulate_payment_and_upgrades_workspace_plan(): void
    {
        $user = User::factory()->create();
        $workspace = $user->currentWorkspace();
        $workspace->update(['plan' => 'free']);

        $plan = PricingPlan::firstOrCreate(
            ['slug' => 'agency'],
            [
                'name' => 'Agency Plan',
                'price_monthly' => 699000,
                'price_annual' => 6710000,
                'description' => 'Agency description',
                'features' => ['Fitur A'],
                'is_popular' => false,
                'is_active' => true,
            ]
        );

        $subscription = Subscription::create([
            'workspace_id' => $workspace->id,
            'pricing_plan_id' => $plan->id,
            'plan_code' => 'agency',
            'billing_cycle' => 'monthly',
            'status' => 'pending',
            'price' => 699000,
        ]);

        $payment = Payment::create([
            'workspace_id' => $workspace->id,
            'subscription_id' => $subscription->id,
            'invoice_number' => 'INV-TEST-999',
            'amount' => 699000,
            'status' => 'pending',
            'payment_gateway' => 'doku',
        ]);

        $response = $this->actingAs($user)->post("/billing/simulate-payment/{$payment->id}", [
            'channel' => 'DOKU QRIS',
        ]);

        $response->assertRedirect('/billing');

        $this->assertDatabaseHas('payments', [
            'id' => $payment->id,
            'status' => 'paid',
            'payment_channel' => 'DOKU QRIS',
        ]);

        $this->assertDatabaseHas('subscriptions', [
            'id' => $subscription->id,
            'status' => 'active',
        ]);

        $this->assertEquals('agency', $workspace->fresh()->plan);
    }

    public function test_doku_webhook_handles_payment_notification(): void
    {
        $user = User::factory()->create();
        $workspace = $user->currentWorkspace();

        $subscription = Subscription::create([
            'workspace_id' => $workspace->id,
            'plan_code' => 'pro',
            'billing_cycle' => 'monthly',
            'status' => 'pending',
            'price' => 299000,
        ]);

        $payment = Payment::create([
            'workspace_id' => $workspace->id,
            'subscription_id' => $subscription->id,
            'invoice_number' => 'INV-DOKU-NOTIF-01',
            'amount' => 299000,
            'status' => 'pending',
            'payment_gateway' => 'doku',
        ]);

        $response = $this->postJson('/api/webhooks/doku', [
            'order' => [
                'invoice_number' => 'INV-DOKU-NOTIF-01',
                'amount' => 299000,
            ],
            'transaction' => [
                'status' => 'SUCCESS',
            ],
            'channel' => [
                'id' => 'VIRTUAL_ACCOUNT_BCA',
            ],
        ]);

        $response->assertStatus(200);
        $response->assertJson(['status' => 'success']);

        $this->assertDatabaseHas('payments', [
            'invoice_number' => 'INV-DOKU-NOTIF-01',
            'status' => 'paid',
            'payment_channel' => 'VIRTUAL_ACCOUNT_BCA',
        ]);

        $this->assertEquals('pro', $workspace->fresh()->plan);
    }

    public function test_user_can_connect_instagram_via_official_screen(): void
    {
        $user = User::factory()->create();
        $workspace = $user->currentWorkspace();

        $response = $this->actingAs($user)->post('/connect/instagram/confirm', [
            'username' => 'bsmrlab',
            'name' => 'Bismar',
            'avatar_url' => 'https://api.dicebear.com/7.x/identicon/svg?seed=bsmrlab',
            'followers_count' => '1.6K followers',
            'posts_count' => '18 posts',
        ]);

        $response->assertRedirect('/dashboard');

        $this->assertDatabaseHas('social_accounts', [
            'workspace_id' => $workspace->id,
            'platform' => 'instagram',
            'username' => 'bsmrlab',
            'is_connected' => true,
            'status' => 'active',
        ]);
    }

    public function test_dashboard_loads_with_creator_actions_and_post(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Dashboard')
            ->has('instagramPosts')
            ->has('quota')
        );
    }

    public function test_create_automation_from_builder(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/automations', [
            'name' => 'Auto DM keyword "link"',
            'trigger_type' => 'comment',
            'keywords' => ['link', 'shop'],
            'message_body' => 'Ini link yang kamu cari: https://creatorflow.so',
            'buttons' => [
                ['title' => 'Beli Sekarang', 'url' => 'https://creatorflow.so/buy'],
            ],
            'delay_seconds' => 2,
        ]);

        $response->assertRedirect('/automations');
        $this->assertDatabaseHas('automations', [
            'name' => 'Auto DM keyword "link"',
            'trigger_type' => 'comment',
        ]);
    }
}
