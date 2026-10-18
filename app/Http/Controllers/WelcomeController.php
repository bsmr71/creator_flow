<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\CmsSetting;
use App\Models\Faq;
use App\Models\PricingPlan;
use Inertia\Inertia;
use Inertia\Response;

class WelcomeController extends Controller
{
    public function __invoke(): Response
    {
        $settings = CmsSetting::where('group', 'landing')->get()->pluck('value', 'key');
        $faqs = Faq::where('is_active', true)->orderBy('order_index')->get();
        $plans = PricingPlan::where('is_active', true)->orderBy('order_index')->get();
        $articles = Article::where('is_published', true)->latest()->take(3)->get();

        return Inertia::render('Welcome', [
            'cmsSettings' => $settings,
            'faqs' => $faqs,
            'plans' => $plans,
            'articles' => $articles,
        ]);
    }
}
