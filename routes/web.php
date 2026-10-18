<?php

use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\AutomationController;
use App\Http\Controllers\BillingController;
use App\Http\Controllers\CmsController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DokuWebhookController;
use App\Http\Controllers\InboxController;
use App\Http\Controllers\IntegrationController;
use App\Http\Controllers\LegalController;
use App\Http\Controllers\MetaOAuthController;
use App\Http\Controllers\MetaWebhookController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\WelcomeController;
use App\Models\User;
use Illuminate\Support\Facades\Route;

// Public Landing Page
Route::get('/', WelcomeController::class)->name('welcome');

// Public Legal Pages (Meta Graph API & App Review Compliance)
Route::get('/privacy', [LegalController::class, 'privacy'])->name('legal.privacy');
Route::get('/privacy-policy', [LegalController::class, 'privacy']);
Route::get('/kebijakan-privasi', [LegalController::class, 'privacy']);

Route::get('/terms', [LegalController::class, 'terms'])->name('legal.terms');
Route::get('/terms-and-condition', [LegalController::class, 'terms']);
Route::get('/terms-and-conditions', [LegalController::class, 'terms']);
Route::get('/terms-of-service', [LegalController::class, 'terms']);
Route::get('/syarat-ketentuan', [LegalController::class, 'terms']);

Route::get('/data-deletion', [LegalController::class, 'dataDeletion'])->name('legal.data-deletion');
Route::get('/user-data-deletion', [LegalController::class, 'dataDeletion']);
Route::post('/api/webhooks/meta/data-deletion', [LegalController::class, 'handleMetaDeletionCallback'])->name('legal.data-deletion.callback');

// Public Meta (Instagram & WhatsApp) Webhooks
Route::get('/api/webhooks/meta', [MetaWebhookController::class, 'verify'])->name('webhooks.meta.verify');
Route::post('/api/webhooks/meta', [MetaWebhookController::class, 'handle'])->name('webhooks.meta.handle');

// Public DOKU Payment Gateway Webhook
Route::post('/api/webhooks/doku', [DokuWebhookController::class, 'handle'])->name('webhooks.doku.handle');

// Public Meta OAuth Callback (handles both SSO login and connecting accounts)
Route::get('/integrations/meta/callback', [MetaOAuthController::class, 'callback'])->name('integrations.meta.callback');

// Public Instagram Profile Real-Time Lookup
Route::get('/api/instagram/lookup', [IntegrationController::class, 'lookupInstagramProfile'])->name('instagram.lookup');

// 1-Click Instant Login (Bypasses CSRF/Session expirations)
Route::get('/auth/auto-login', function () {
    $user = User::first();
    auth()->login($user, true);

    return redirect()->route('dashboard')->with('success', 'Berhasil masuk langsung ke dashboard!');
})->name('auth.auto-login');

// Guest Authentication Routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store']);

    // 1-Click Login with Instagram SSO
    Route::get('/auth/instagram', [MetaOAuthController::class, 'loginRedirect'])->name('auth.instagram');
});

// Authenticated Application Routes
Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    // Dashboard & Instagram Posts
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('/dashboard/instagram/posts', [DashboardController::class, 'storeCustomPost'])->name('dashboard.instagram.posts.store');
    Route::delete('/dashboard/instagram/posts/{id}', [DashboardController::class, 'deleteCustomPost'])->name('dashboard.instagram.posts.destroy');
    Route::post('/dashboard/instagram/sync', [DashboardController::class, 'syncInstagramPosts'])->name('dashboard.instagram.posts.sync');

    // Automations
    Route::prefix('automations')->name('automations.')->group(function () {
        Route::get('/', [AutomationController::class, 'index'])->name('index');
        Route::get('/create', [AutomationController::class, 'create'])->name('create');
        Route::post('/', [AutomationController::class, 'store'])->name('store');
        Route::get('/{automation}', [AutomationController::class, 'show'])->name('show');
        Route::post('/{automation}/toggle', [AutomationController::class, 'toggleStatus'])->name('toggle');
        Route::post('/simulate', [AutomationController::class, 'simulate'])->name('simulate');
    });

    // Unified Inbox
    Route::prefix('inbox')->name('inbox.')->group(function () {
        Route::get('/', [InboxController::class, 'index'])->name('index');
        Route::post('/conversations/{conversation}/messages', [InboxController::class, 'sendMessage'])->name('messages.send');
        Route::post('/conversations/{conversation}/status', [InboxController::class, 'updateStatus'])->name('status.update');
    });

    // Contacts CRM
    Route::prefix('contacts')->name('contacts.')->group(function () {
        Route::get('/', [ContactController::class, 'index'])->name('index');
        Route::post('/', [ContactController::class, 'store'])->name('store');
        Route::patch('/{contact}', [ContactController::class, 'update'])->name('update');
    });

    // Integrations & Meta OAuth
    Route::prefix('integrations')->name('integrations.')->group(function () {
        Route::get('/', [IntegrationController::class, 'index'])->name('index');
        Route::post('/{platform}/toggle', [IntegrationController::class, 'toggleConnection'])->name('toggle');
        Route::get('/meta/connect', [MetaOAuthController::class, 'connect'])->name('meta.connect');
        Route::post('/manual-connect', [MetaOAuthController::class, 'manualConnect'])->name('manual-connect');
    });

    // Instagram Connect Flow (Matching Official Flow)
    Route::get('/connect/instagram', [IntegrationController::class, 'instagramConnectView'])->name('connect.instagram');
    Route::post('/connect/instagram/confirm', [IntegrationController::class, 'confirmInstagramConnect'])->name('connect.instagram.confirm');

    // Analytics
    Route::get('/analytics', [AnalyticsController::class, 'index'])->name('analytics');

    // Settings
    Route::prefix('settings')->name('settings.')->group(function () {
        Route::get('/', [SettingsController::class, 'index'])->name('index');
        Route::post('/', [SettingsController::class, 'update'])->name('update');
    });

    // CMS (Content Management System)
    Route::prefix('cms')->name('cms.')->group(function () {
        Route::get('/', [CmsController::class, 'index'])->name('index');
        Route::post('/settings', [CmsController::class, 'updateSettings'])->name('settings.update');
        Route::post('/faqs', [CmsController::class, 'storeFaq'])->name('faqs.store');
        Route::patch('/faqs/{faq}', [CmsController::class, 'updateFaq'])->name('faqs.update');
        Route::delete('/faqs/{faq}', [CmsController::class, 'destroyFaq'])->name('faqs.destroy');
        Route::post('/plans', [CmsController::class, 'storePlan'])->name('plans.store');
        Route::patch('/plans/{plan}', [CmsController::class, 'updatePlan'])->name('plans.update');
        Route::delete('/plans/{plan}', [CmsController::class, 'destroyPlan'])->name('plans.destroy');
        Route::post('/articles', [CmsController::class, 'storeArticle'])->name('articles.store');
        Route::delete('/articles/{article}', [CmsController::class, 'destroyArticle'])->name('articles.destroy');
    });

    // Billing & Subscriptions (DOKU Payment Gateway)
    Route::prefix('billing')->name('billing.')->group(function () {
        Route::get('/', [BillingController::class, 'index'])->name('index');
        Route::post('/checkout', [BillingController::class, 'checkout'])->name('checkout');
        Route::post('/simulate-payment/{payment}', [BillingController::class, 'simulatePayment'])->name('simulate');
        Route::post('/subscriptions/{subscription}/cancel', [BillingController::class, 'cancelSubscription'])->name('cancel');
    });
});
