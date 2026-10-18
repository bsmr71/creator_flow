<?php

namespace Tests\Feature;

use App\Models\SocialAccount;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class IntegrationsPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_access_integrations_page_with_inertia(): void
    {
        $user = User::factory()->create();
        $workspace = Workspace::create([
            'user_id' => $user->id,
            'name' => 'Main Workspace',
            'slug' => 'main-workspace',
            'plan' => 'pro',
        ]);

        SocialAccount::create([
            'workspace_id' => $workspace->id,
            'platform' => 'instagram',
            'account_id' => 'ig_123',
            'username' => 'bsmrlab',
            'is_connected' => true,
            'status' => 'active',
            'metadata' => [
                'posts' => [],
            ],
        ]);

        $response = $this->actingAs($user)->get('/integrations');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Integrations/Index'));
    }

    public function test_manual_connect_succeeds_without_error(): void
    {
        $user = User::factory()->create();
        $workspace = Workspace::create([
            'user_id' => $user->id,
            'name' => 'Main Workspace',
            'slug' => 'main-workspace',
            'plan' => 'pro',
        ]);

        $response = $this->actingAs($user)->post('/integrations/manual-connect', [
            'platform' => 'instagram',
            'username' => 'bsmrlab',
            'account_id' => '29390086840577217',
            'access_token' => 'EAAB_test_sample',
        ]);

        $response->assertRedirect('/integrations');
        $this->assertDatabaseHas('social_accounts', [
            'workspace_id' => $workspace->id,
            'platform' => 'instagram',
            'username' => 'bsmrlab',
        ]);
    }
}
