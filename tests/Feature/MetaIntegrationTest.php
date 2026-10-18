<?php

namespace Tests\Feature;

use App\Models\Automation;
use App\Models\AutomationAction;
use App\Models\AutomationTrigger;
use App\Models\SocialAccount;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class MetaIntegrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_meta_webhook_verification_succeeds_with_correct_token(): void
    {
        $challenge = '1158201258';

        $response = $this->get('/api/webhooks/meta?hub_mode=subscribe&hub_verify_token=creatorflow_meta_verify_secret&hub_challenge='.$challenge);

        $response->assertStatus(200);
        $this->assertEquals($challenge, $response->getContent());
    }

    public function test_meta_webhook_verification_fails_with_invalid_token(): void
    {
        $response = $this->get('/api/webhooks/meta?hub_mode=subscribe&hub_verify_token=wrong_token&hub_challenge=123');

        $response->assertStatus(403);
    }

    public function test_meta_webhook_processes_incoming_instagram_comment_and_triggers_dm(): void
    {
        // Fake external Meta Graph API calls
        Http::fake([
            'https://graph.facebook.com/*' => Http::response(['recipient_id' => 'buyer_123', 'message_id' => 'mid.123'], 200),
        ]);

        $user = User::factory()->create();
        $workspace = Workspace::create([
            'name' => 'Test Store',
            'slug' => 'test-store',
            'user_id' => $user->id,
        ]);

        $socialAccount = SocialAccount::create([
            'workspace_id' => $workspace->id,
            'platform' => 'instagram',
            'account_id' => 'ig_biz_999',
            'username' => 'test_store_ig',
            'access_token' => 'EAATestToken123',
            'is_connected' => true,
            'status' => 'active',
        ]);

        $automation = Automation::create([
            'workspace_id' => $workspace->id,
            'social_account_id' => $socialAccount->id,
            'name' => 'Auto DM Katalog',
            'trigger_type' => 'comment',
            'status' => 'active',
            'total_sent' => 0,
            'total_clicks' => 0,
            'total_leads' => 0,
        ]);

        AutomationTrigger::create([
            'automation_id' => $automation->id,
            'trigger_type' => 'comment',
            'keywords' => ['MAU', 'KATALOG'],
            'match_type' => 'contains',
        ]);

        AutomationAction::create([
            'automation_id' => $automation->id,
            'action_type' => 'send_dm',
            'message_body' => 'Halo! Ini link katalog diskon 50% Anda:',
            'buttons' => [['title' => 'Beli Sekarang', 'url' => 'https://example.com/checkout']],
            'order_index' => 0,
        ]);

        // Incoming webhook payload from Meta
        $payload = [
            'object' => 'instagram',
            'entry' => [
                [
                    'id' => 'ig_biz_999',
                    'time' => 1729000000,
                    'changes' => [
                        [
                            'field' => 'comments',
                            'value' => [
                                'id' => 'comm_777',
                                'text' => 'Wah keren banget min, MAU katalognya dong!',
                                'from' => [
                                    'id' => 'buyer_123',
                                    'username' => 'buyer_cantik',
                                ],
                                'media' => [
                                    'id' => 'media_reel_888',
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ];

        $response = $this->postJson('/api/webhooks/meta', $payload);

        $response->assertStatus(200);
        $this->assertEquals('EVENT_RECEIVED', $response->getContent());

        // Verify automation stats incremented
        $this->assertDatabaseHas('automations', [
            'id' => $automation->id,
            'total_sent' => 1,
            'total_leads' => 1,
        ]);

        // Verify contact was created in CRM
        $this->assertDatabaseHas('contacts', [
            'workspace_id' => $workspace->id,
            'platform' => 'instagram',
            'external_id' => 'buyer_123',
            'name' => 'buyer_cantik',
        ]);

        // Verify execution log
        $this->assertDatabaseHas('automation_logs', [
            'automation_id' => $automation->id,
            'status' => 'success',
        ]);
    }

    public function test_user_can_manually_connect_instagram_account_with_token(): void
    {
        $user = User::factory()->create();
        $workspace = $user->currentWorkspace();

        $response = $this->actingAs($user)->post('/integrations/manual-connect', [
            'platform' => 'instagram',
            'account_id' => '178414000111222',
            'username' => 'toko_baru',
            'access_token' => 'EAAFakeTokenExample',
            'display_name' => 'Toko Baru Resmi',
        ]);

        $response->assertRedirect('/integrations');

        $this->assertDatabaseHas('social_accounts', [
            'workspace_id' => $workspace->id,
            'platform' => 'instagram',
            'account_id' => '178414000111222',
            'username' => 'toko_baru',
            'is_connected' => 1,
            'status' => 'active',
        ]);
    }

    public function test_connect_instagram_view_renders_successfully(): void
    {
        $user = User::factory()->create();
        $response = $this->actingAs($user)->get('/connect/instagram');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Connect/Instagram'));
    }

    public function test_confirm_instagram_connect_stores_bsmrlab_and_redirects_to_dashboard(): void
    {
        $user = User::factory()->create();
        $response = $this->actingAs($user)->post('/connect/instagram/confirm', [
            'username' => 'bsmrlab',
            'name' => 'Bsmrlab',
            'followers_count' => '1.6K',
            'posts_count' => '18',
        ]);

        $response->assertRedirect('/dashboard');

        $this->assertDatabaseHas('social_accounts', [
            'platform' => 'instagram',
            'username' => 'bsmrlab',
            'is_connected' => 1,
            'status' => 'active',
        ]);
    }

    public function test_oauth_callback_connects_instagram_account_with_token(): void
    {
        Http::fake([
            'https://api.instagram.com/oauth/access_token' => Http::response([
                'access_token' => 'IG_TEST_SHORT_TOKEN',
                'user_id' => '178414000123456',
            ], 200),
            'https://graph.instagram.com/access_token*' => Http::response([
                'access_token' => 'IG_TEST_LONG_TOKEN',
                'token_type' => 'bearer',
                'expires_in' => 5184000,
            ], 200),
            'https://graph.instagram.com/*' => Http::response([
                'id' => '178414000123456',
                'username' => 'bsmrlab',
            ], 200),
        ]);

        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->withSession([
                'meta_oauth_state' => 'test_state_123',
                'meta_oauth_flow' => 'connect_account',
                'meta_oauth_username' => 'bsmrlab',
            ])
            ->get('/integrations/meta/callback?code=mock_code&state=test_state_123');

        $response->assertRedirect(route('integrations.index'));

        $this->assertDatabaseHas('social_accounts', [
            'platform' => 'instagram',
            'username' => 'bsmrlab',
            'account_id' => '178414000123456',
            'is_connected' => 1,
            'status' => 'active',
        ]);
    }
}
