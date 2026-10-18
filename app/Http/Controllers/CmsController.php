<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\CmsSetting;
use App\Models\Faq;
use App\Models\PricingPlan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CmsController extends Controller
{
    public function index(): Response
    {
        $settings = CmsSetting::where('group', 'landing')->get()->pluck('value', 'key');
        $faqs = Faq::orderBy('order_index')->get();
        $plans = PricingPlan::orderBy('order_index')->get();
        $articles = Article::latest()->get();

        return Inertia::render('Cms/Index', [
            'settings' => $settings,
            'faqs' => $faqs,
            'plans' => $plans,
            'articles' => $articles,
        ]);
    }

    public function updateSettings(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'hero_badge' => 'nullable|string',
            'hero_title' => 'nullable|string',
            'hero_description' => 'nullable|string',
            'announcement' => 'nullable|string',
            'cta_button_text' => 'nullable|string',
        ]);

        foreach ($validated as $key => $val) {
            CmsSetting::set($key, $val, 'landing');
        }

        return back()->with('success', 'Pengaturan konten landing page berhasil disimpan!');
    }

    public function storeFaq(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'question' => 'required|string|max:255',
            'answer' => 'required|string',
            'category' => 'nullable|string',
        ]);

        Faq::create([
            'question' => $validated['question'],
            'answer' => $validated['answer'],
            'category' => $validated['category'] ?? 'Umum',
            'order_index' => Faq::count(),
            'is_active' => true,
        ]);

        return back()->with('success', 'FAQ baru berhasil ditambahkan!');
    }

    public function updateFaq(Request $request, Faq $faq): RedirectResponse
    {
        $validated = $request->validate([
            'question' => 'required|string|max:255',
            'answer' => 'required|string',
            'is_active' => 'nullable|boolean',
        ]);

        $faq->update($validated);

        return back()->with('success', 'FAQ berhasil diperbarui!');
    }

    public function destroyFaq(Faq $faq): RedirectResponse
    {
        $faq->delete();

        return back()->with('success', 'FAQ berhasil dihapus.');
    }

    public function storePlan(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price_monthly' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'features' => 'required|array',
            'is_popular' => 'nullable|boolean',
            'cta_text' => 'nullable|string',
        ]);

        PricingPlan::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'price_monthly' => $validated['price_monthly'],
            'description' => $validated['description'] ?? '',
            'features' => $validated['features'],
            'is_popular' => $validated['is_popular'] ?? false,
            'cta_text' => $validated['cta_text'] ?? 'Pilih Paket',
            'order_index' => PricingPlan::count(),
        ]);

        return back()->with('success', 'Paket harga baru berhasil dibuat!');
    }

    public function updatePlan(Request $request, PricingPlan $plan): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price_monthly' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'features' => 'required|array',
            'is_popular' => 'nullable|boolean',
            'cta_text' => 'nullable|string',
        ]);

        $plan->update($validated);

        return back()->with('success', 'Paket harga berhasil diperbarui!');
    }

    public function destroyPlan(PricingPlan $plan): RedirectResponse
    {
        $plan->delete();

        return back()->with('success', 'Paket harga berhasil dihapus.');
    }

    public function storeArticle(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'excerpt' => 'nullable|string',
            'content' => 'required|string',
            'category' => 'nullable|string',
        ]);

        Article::create([
            'user_id' => $request->user()->id,
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']).'-'.time(),
            'excerpt' => $validated['excerpt'] ?? Str::limit(strip_tags($validated['content']), 120),
            'content' => $validated['content'],
            'category' => $validated['category'] ?? 'Growth Tips',
            'is_published' => true,
            'published_at' => now(),
        ]);

        return back()->with('success', 'Artikel panduan berhasil diterbitkan!');
    }

    public function destroyArticle(Article $article): RedirectResponse
    {
        $article->delete();

        return back()->with('success', 'Artikel berhasil dihapus.');
    }
}
