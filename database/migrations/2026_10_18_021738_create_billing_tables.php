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
        // Subscriptions Table
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workspace_id')->constrained()->cascadeOnDelete();
            $table->foreignId('pricing_plan_id')->nullable()->constrained('pricing_plans')->nullOnDelete();
            $table->string('plan_code')->default('free'); // free, creator, pro, agency
            $table->string('billing_cycle')->default('monthly'); // monthly, annual
            $table->string('status')->default('active'); // active, pending, cancelled, expired
            $table->unsignedBigInteger('price')->default(0);
            $table->timestamp('started_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->timestamp('trial_ends_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamps();
        });

        // Payments / Invoices Table
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workspace_id')->constrained()->cascadeOnDelete();
            $table->foreignId('subscription_id')->nullable()->constrained('subscriptions')->nullOnDelete();
            $table->string('invoice_number')->unique();
            $table->unsignedBigInteger('amount');
            $table->string('currency')->default('IDR');
            $table->string('status')->default('pending'); // pending, paid, failed, expired
            $table->string('payment_gateway')->default('doku');
            $table->string('payment_method')->nullable(); // doku_checkout, doku_qris, doku_va, doku_ewallet
            $table->string('payment_channel')->nullable(); // QRIS, BCA VA, Mandiri VA, GoPay, OVO, Credit Card
            $table->string('doku_invoice_id')->nullable();
            $table->text('payment_url')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('expired_at')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
        Schema::dropIfExists('subscriptions');
    }
};
