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

        // 2. Create Primary Admin User (Bismar)
        $user = User::updateOrCreate(
            ['email' => 'bismar71@gmail.com'],
            [
                'name' => 'Bismar',
                'password' => Hash::make('Z@buza71'),
                'email_verified_at' => now(),
            ]
        );

        $workspace = Workspace::firstOrCreate(
            ['slug' => 'bismar-workspace'],
            [
                'user_id' => $user->id,
                'name' => 'Bismar Workspace',
                'plan' => 'pro',
                'settings' => [
                    'currency' => 'IDR',
                    'timezone' => 'Asia/Jakarta',
                    'notification_email' => 'bismar71@gmail.com',
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
