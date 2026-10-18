<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Workspace;
use App\Models\WorkspaceMember;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed CMS content (FAQs, Pricing, Landing Settings)
        $this->call(CmsSeeder::class);

        // 2. Create Default Admin/Demo User if not exists
        $user = User::firstOrCreate(
            ['email' => 'admin@creatorflow.so'],
            [
                'name' => 'Creator Admin',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        $workspace = Workspace::firstOrCreate(
            ['slug' => 'my-creator-workspace'],
            [
                'user_id' => $user->id,
                'name' => 'My Creator Workspace',
                'plan' => 'pro',
                'settings' => [
                    'currency' => 'IDR',
                    'timezone' => 'Asia/Jakarta',
                    'notification_email' => 'admin@creatorflow.so',
                ],
            ]
        );

        WorkspaceMember::firstOrCreate(
            [
                'workspace_id' => $workspace->id,
                'user_id' => $user->id,
            ],
            ['role' => 'owner']
        );
    }
}
