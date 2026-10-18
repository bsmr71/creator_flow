<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\CmsSetting;
use App\Models\Faq;
use App\Models\PricingPlan;
use Illuminate\Database\Seeder;

class CmsSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Landing Page CMS Settings
        CmsSetting::set('hero_badge', 'Solusi Otomasi DM Multi-Platform #1 Indonesia', 'landing');
        CmsSetting::set('hero_title', 'Ubah Setiap Komentar Menjadi Penjualan & Leads Otomatis', 'landing');
        CmsSetting::set('hero_description', 'Balas komentar dan pesan masuk secara instan dalam 0.1 detik di Instagram, WhatsApp, TikTok, dan Facebook. Tidak ada lagi calon pembeli yang kabur karena telat dibalas.', 'landing');
        CmsSetting::set('announcement', 'Diskon Launching 30% untuk 100 Kreator Pertama', 'landing');
        CmsSetting::set('cta_button_text', 'Mulai Otomasi Sekarang — Gratis', 'landing');

        // 2. FAQs
        $faqs = [
            [
                'question' => 'Apakah akun saya aman dari banned?',
                'answer' => 'Ya, 100% aman. CreatorFlow hanya menggunakan integrasi Meta Graph API resmi dan TikTok Developer API tanpa teknik scraping yang melanggar ketentuan.',
                'category' => 'Keamanan & Akun',
                'order_index' => 0,
            ],
            [
                'question' => 'Apakah saya butuh kartu kredit untuk mendaftar?',
                'answer' => 'Tidak! Kamu bisa langsung mendaftar gratis tanpa perlu memasukkan kartu kredit untuk mencoba fitur otomasi.',
                'category' => 'Pembayaran & Langganan',
                'order_index' => 1,
            ],
            [
                'question' => 'Bagaimana cara menghubungkan WhatsApp Business?',
                'answer' => 'Kami menyediakan panduan setup resmi WhatsApp Cloud API Meta. Kamu hanya butuh nomor HP aktif yang belum terdaftar di aplikasi WA biasa.',
                'category' => 'Integrasi Platform',
                'order_index' => 2,
            ],
            [
                'question' => 'Apakah bisa membalas komentar di TikTok Live?',
                'answer' => 'Bisa! Fitur TikTok Live Trigger kami mendeteksi kata kunci saat kamu sedang siaran langsung dan mengirimkan link checkout langsung ke DM penonton.',
                'category' => 'Fitur Otomasi',
                'order_index' => 3,
            ],
        ];

        foreach ($faqs as $f) {
            Faq::firstOrCreate(['question' => $f['question']], $f);
        }

        // 3. Pricing Plans
        $plans = [
            [
                'name' => 'Creator Starter',
                'slug' => 'creator-starter',
                'price_monthly' => 199000,
                'price_annual' => 1990000,
                'description' => 'Cocok untuk kreator pemula yang baru mulai monetisasi konten.',
                'features' => [
                    '1 Akun Instagram Professional',
                    '5 Alur Otomasi Aktif',
                    '2.500 DM Terkirim / bulan',
                    'Balas Komentar & Story Otomatis',
                    'Basic Lead CRM List',
                ],
                'is_popular' => false,
                'order_index' => 0,
                'cta_text' => 'Pilih Starter',
            ],
            [
                'name' => 'Creator Pro Scale',
                'slug' => 'creator-pro-scale',
                'price_monthly' => 499000,
                'price_annual' => 4990000,
                'description' => 'Untuk kreator & bisnis yang ingin scale traffic secara masif.',
                'features' => [
                    'Instagram + WhatsApp + TikTok',
                    'Unlimited Alur Otomasi Aktif',
                    '15.000 DM Terkirim / bulan',
                    'TikTok Live Comment DM Trigger',
                    'WhatsApp Cloud API Integration',
                    'Advanced Analytics & Lead Funnel',
                ],
                'is_popular' => true,
                'order_index' => 1,
                'cta_text' => 'Mulai Paket Pro',
            ],
            [
                'name' => 'Agency & Enterprise',
                'slug' => 'agency-enterprise',
                'price_monthly' => 1299000,
                'price_annual' => 12990000,
                'description' => 'Untuk agensi digital yang mengelola banyak akun client.',
                'features' => [
                    '10 Workspace Multi-Client',
                    'Unlimited DM & Percakapan',
                    '4 Platform Lengkap (IG, WA, TT, FB)',
                    'White-label Branding & Custom Domain',
                    'Dedicated Account Manager & VIP Support',
                ],
                'is_popular' => false,
                'order_index' => 2,
                'cta_text' => 'Hubungi Tim Agency',
            ],
        ];

        foreach ($plans as $p) {
            PricingPlan::firstOrCreate(['slug' => $p['slug']], $p);
        }

        // 4. Articles
        Article::firstOrCreate(
            ['slug' => 'panduan-monetisasi-dm-instagram-2026'],
            [
                'title' => 'Panduan Lengkap Monetisasi DM Instagram untuk Kreator 2026',
                'excerpt' => 'Pelajari strategi mengubah komentar di postingan dan Reels menjadi ribuan lead email dan penjualan otomatis.',
                'content' => 'Banyak kreator membuang traffic berharga karena telat membalas komentar. Dengan otomasi trigger keyword, setiap orang yang berkomentar langsung menerima DM berisi link penawaran dalam 0.1 detik...',
                'category' => 'Strategi DM',
                'is_published' => true,
                'published_at' => now(),
            ]
        );
    }
}
