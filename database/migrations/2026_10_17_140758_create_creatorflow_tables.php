<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Workspaces
        Schema::create('workspaces', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('logo')->nullable();
            $table->string('plan')->default('pro'); // free, creator, pro, agency
            $table->json('settings')->nullable();
            $table->timestamps();
        });

        // Workspace Members
        Schema::create('workspace_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workspace_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('role')->default('member'); // owner, admin, member
            $table->timestamps();
            $table->unique(['workspace_id', 'user_id']);
        });

        // Social Accounts (Instagram, WhatsApp, TikTok, Facebook)
        Schema::create('social_accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workspace_id')->constrained()->cascadeOnDelete();
            $table->string('platform'); // instagram, whatsapp, tiktok, facebook
            $table->string('account_id')->nullable();
            $table->string('username');
            $table->string('display_name')->nullable();
            $table->string('avatar_url')->nullable();
            $table->text('access_token')->nullable();
            $table->text('refresh_token')->nullable();
            $table->timestamp('token_expires_at')->nullable();
            $table->boolean('is_connected')->default(true);
            $table->string('status')->default('active'); // active, error, disconnected
            $table->json('metadata')->nullable();
            $table->timestamps();
        });

        // Tags
        Schema::create('tags', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workspace_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('color')->default('#6366f1');
            $table->timestamps();
        });

        // Contacts (Leads captured across all platforms)
        Schema::create('contacts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workspace_id')->constrained()->cascadeOnDelete();
            $table->foreignId('social_account_id')->nullable()->constrained()->nullOnDelete();
            $table->string('platform'); // instagram, whatsapp, tiktok, facebook
            $table->string('external_id')->nullable();
            $table->string('username');
            $table->string('name')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('avatar_url')->nullable();
            $table->string('status')->default('lead'); // lead, customer, hot_lead, unresponsive
            $table->json('tags')->nullable();
            $table->json('custom_fields')->nullable();
            $table->timestamp('last_interacted_at')->nullable();
            $table->timestamps();
        });

        // Automations
        Schema::create('automations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workspace_id')->constrained()->cascadeOnDelete();
            $table->foreignId('social_account_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('trigger_type')->default('keyword'); // keyword, story_reply, welcome, live_comment
            $table->string('status')->default('active'); // active, paused, draft
            $table->unsignedInteger('total_sent')->default(0);
            $table->unsignedInteger('total_clicks')->default(0);
            $table->unsignedInteger('total_leads')->default(0);
            $table->json('settings')->nullable();
            $table->timestamps();
        });

        // Automation Triggers
        Schema::create('automation_triggers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('automation_id')->constrained()->cascadeOnDelete();
            $table->string('trigger_type')->default('keyword');
            $table->json('keywords'); // e.g. ["MAU", "INFO", "HARGA", "LINK"]
            $table->string('match_type')->default('contains'); // exact, contains, regex
            $table->string('post_id')->nullable();
            $table->string('post_url')->nullable();
            $table->string('post_media_url')->nullable();
            $table->json('conditions')->nullable();
            $table->timestamps();
        });

        // Automation Actions
        Schema::create('automation_actions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('automation_id')->constrained()->cascadeOnDelete();
            $table->string('action_type')->default('send_dm'); // send_dm, delay, ask_email, condition, ai_reply
            $table->text('message_body');
            $table->json('buttons')->nullable(); // e.g. [{"text": "Daftar Sekarang", "url": "https://..."}]
            $table->json('quick_replies')->nullable();
            $table->unsignedInteger('delay_seconds')->default(0);
            $table->unsignedInteger('order_index')->default(0);
            $table->timestamps();
        });

        // Automation Logs
        Schema::create('automation_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('automation_id')->constrained()->cascadeOnDelete();
            $table->foreignId('contact_id')->nullable()->constrained()->nullOnDelete();
            $table->string('status')->default('success'); // success, failed, skipped
            $table->string('triggered_by')->nullable(); // comment text or DM text
            $table->unsignedInteger('execution_time_ms')->default(120);
            $table->json('details')->nullable();
            $table->timestamps();
        });

        // Conversations (Unified Inbox)
        Schema::create('conversations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workspace_id')->constrained()->cascadeOnDelete();
            $table->foreignId('contact_id')->constrained()->cascadeOnDelete();
            $table->foreignId('social_account_id')->nullable()->constrained()->nullOnDelete();
            $table->string('platform'); // instagram, whatsapp, tiktok, facebook
            $table->string('status')->default('open'); // open, closed, snoozed
            $table->timestamp('last_message_at')->nullable();
            $table->unsignedInteger('unread_count')->default(0);
            $table->timestamps();
        });

        // Messages
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('conversation_id')->constrained()->cascadeOnDelete();
            $table->string('direction'); // inbound, outbound
            $table->string('sender_type')->default('contact'); // contact, user, bot
            $table->text('content');
            $table->string('media_url')->nullable();
            $table->json('buttons_payload')->nullable();
            $table->boolean('is_read')->default(false);
            $table->timestamp('sent_at')->useCurrent();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
        Schema::dropIfExists('conversations');
        Schema::dropIfExists('automation_logs');
        Schema::dropIfExists('automation_actions');
        Schema::dropIfExists('automation_triggers');
        Schema::dropIfExists('automations');
        Schema::dropIfExists('contacts');
        Schema::dropIfExists('tags');
        Schema::dropIfExists('social_accounts');
        Schema::dropIfExists('workspace_members');
        Schema::dropIfExists('workspaces');
    }
};
