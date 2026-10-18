import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import {
    Edit3,
    HelpCircle,
    CreditCard,
    BookOpen,
    Plus,
    Trash2,
    Save,
    Check,
    X,
    ExternalLink,
    Sparkles,
    CheckCircle2
} from 'lucide-react';

export default function CmsIndex({ settings, faqs, plans, articles }) {
    const [activeTab, setActiveTab] = useState('landing');
    const [isAddFaqOpen, setIsAddFaqOpen] = useState(false);
    const [isAddPlanOpen, setIsAddPlanOpen] = useState(false);
    const [isAddArticleOpen, setIsAddArticleOpen] = useState(false);

    // Form: Landing Page Copy
    const { data: landingData, setData: setLandingData, post: postSettings, processing: savingSettings } = useForm({
        hero_badge: settings?.hero_badge || 'Solusi Otomasi DM Multi-Platform #1 Indonesia',
        hero_title: settings?.hero_title || 'Ubah Setiap Komentar Menjadi Penjualan & Leads Otomatis',
        hero_description: settings?.hero_description || 'Balas komentar dan pesan masuk secara instan dalam 0.1 detik di Instagram, WhatsApp, TikTok, dan Facebook.',
        announcement: settings?.announcement || 'Diskon Launching 30% untuk 100 Kreator Pertama',
        cta_button_text: settings?.cta_button_text || 'Mulai Otomasi Sekarang — Gratis',
    });

    // Form: FAQ
    const { data: faqData, setData: setFaqData, post: postFaq, reset: resetFaq } = useForm({
        question: '',
        answer: '',
        category: 'Umum',
    });

    // Form: Pricing Plan
    const { data: planData, setData: setPlanData, post: postPlan, reset: resetPlan } = useForm({
        name: '',
        price_monthly: 199000,
        description: '',
        features: ['Fitur 1', 'Fitur 2', 'Fitur 3'],
        is_popular: false,
        cta_text: 'Pilih Paket',
    });

    // Form: Article
    const { data: articleData, setData: setArticleData, post: postArticle, reset: resetArticle } = useForm({
        title: '',
        category: 'Tips Monetisasi',
        excerpt: '',
        content: '',
    });

    const handleSaveSettings = (e) => {
        e.preventDefault();
        postSettings('/cms/settings');
    };

    const handleCreateFaq = (e) => {
        e.preventDefault();
        postFaq('/cms/faqs', {
            onSuccess: () => {
                setIsAddFaqOpen(false);
                resetFaq();
            },
        });
    };

    const handleDeleteFaq = (id) => {
        if (confirm('Yakin ingin menghapus FAQ ini?')) {
            router.delete(`/cms/faqs/${id}`, { preserveScroll: true });
        }
    };

    const handleCreatePlan = (e) => {
        e.preventDefault();
        postPlan('/cms/plans', {
            onSuccess: () => {
                setIsAddPlanOpen(false);
                resetPlan();
            },
        });
    };

    const handleDeletePlan = (id) => {
        if (confirm('Yakin ingin menghapus paket harga ini?')) {
            router.delete(`/cms/plans/${id}`, { preserveScroll: true });
        }
    };

    const handleCreateArticle = (e) => {
        e.preventDefault();
        postArticle('/cms/articles', {
            onSuccess: () => {
                setIsAddArticleOpen(false);
                resetArticle();
            },
        });
    };

    const handleDeleteArticle = (id) => {
        if (confirm('Yakin ingin menghapus artikel ini?')) {
            router.delete(`/cms/articles/${id}`, { preserveScroll: true });
        }
    };

    return (
        <AppLayout title="Content Management System (CMS)">
            <Head title="CMS Manager — CreatorFlow" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-[#18181b] tracking-tight">
                            Manajemen Konten Website & Landing Page
                        </h2>
                        <p className="text-xs text-[#71717a] mt-0.5">
                            Ubah teks headline, kelola FAQ, atur harga paket, dan terbitkan artikel panduan langsung ke website publik.
                        </p>
                    </div>

                    <a
                        href="/"
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-[#f4f4f5] text-[#18181b] text-xs font-semibold border border-[#e4e4e7] transition-colors shadow-xs"
                    >
                        <span>Lihat Website Live</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                </div>

                {/* Tab Navigation */}
                <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white border border-[#e4e4e7] overflow-x-auto shadow-xs">
                    {[
                        { id: 'landing', label: 'Teks Landing Page', icon: Edit3 },
                        { id: 'faqs', label: `Kelola FAQ (${faqs.length})`, icon: HelpCircle },
                        { id: 'plans', label: `Paket Harga (${plans.length})`, icon: CreditCard },
                        { id: 'articles', label: `Artikel & Panduan (${articles.length})`, icon: BookOpen },
                    ].map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                                    isActive
                                        ? 'bg-[#18181b] text-white shadow-xs font-semibold'
                                        : 'text-[#71717a] hover:text-[#18181b] hover:bg-[#f4f4f5]'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* TAB 1: Landing Page Copy */}
                {activeTab === 'landing' && (
                    <form onSubmit={handleSaveSettings} className="glass-card p-6 rounded-2xl space-y-5 border border-[#e4e4e7]">
                        <div className="flex items-center justify-between border-b border-[#e4e4e7] pb-3">
                            <h3 className="text-sm font-bold text-[#18181b]">Salinan Teks Hero & Banner Utama</h3>
                            <button
                                type="submit"
                                disabled={savingSettings}
                                className="px-5 py-2 rounded-xl bg-[#18181b] hover:bg-[#27272a] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
                            >
                                <Save className="w-3.5 h-3.5" />
                                <span>{savingSettings ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                            </button>
                        </div>

                        <div className="space-y-4 text-xs">
                            <div className="space-y-1.5">
                                <label className="text-[#18181b] font-semibold">Teks Badge Pengumuman:</label>
                                <input
                                    type="text"
                                    value={landingData.hero_badge}
                                    onChange={(e) => setLandingData('hero_badge', e.target.value)}
                                    className="w-full px-3.5 py-2 rounded-xl bg-[#fafaf8] border border-[#e4e4e7] text-[#18181b] focus:outline-hidden focus:border-[#18181b]"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[#18181b] font-semibold">Headline Judul Utama (H1):</label>
                                <input
                                    type="text"
                                    value={landingData.hero_title}
                                    onChange={(e) => setLandingData('hero_title', e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#fafaf8] border border-[#e4e4e7] text-sm font-bold text-[#18181b] focus:outline-hidden focus:border-[#18181b]"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[#18181b] font-semibold">Sub-Headline / Deskripsi:</label>
                                <textarea
                                    rows={3}
                                    value={landingData.hero_description}
                                    onChange={(e) => setLandingData('hero_description', e.target.value)}
                                    className="w-full p-3.5 rounded-xl bg-[#fafaf8] border border-[#e4e4e7] text-[#18181b] focus:outline-hidden focus:border-[#18181b] resize-none font-sans"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[#18181b] font-semibold">Banner Notifikasi Diskon:</label>
                                    <input
                                        type="text"
                                        value={landingData.announcement}
                                        onChange={(e) => setLandingData('announcement', e.target.value)}
                                        className="w-full px-3.5 py-2 rounded-xl bg-[#fafaf8] border border-[#e4e4e7] text-[#18181b] focus:outline-hidden focus:border-[#18181b]"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[#18181b] font-semibold">Teks Tombol Aksi (CTA Button):</label>
                                    <input
                                        type="text"
                                        value={landingData.cta_button_text}
                                        onChange={(e) => setLandingData('cta_button_text', e.target.value)}
                                        className="w-full px-3.5 py-2 rounded-xl bg-[#fafaf8] border border-[#e4e4e7] text-[#18181b] focus:outline-hidden focus:border-[#18181b]"
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                )}

                {/* TAB 2: FAQs */}
                {activeTab === 'faqs' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-[#71717a]">Pertanyaan yang Sering Diajukan di Landing Page</span>
                            <button
                                onClick={() => setIsAddFaqOpen(true)}
                                className="px-4 py-2 rounded-xl bg-[#18181b] hover:bg-[#27272a] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Tambah FAQ Baru</span>
                            </button>
                        </div>

                        <div className="space-y-3">
                            {faqs.map((faq) => (
                                <div key={faq.id} className="glass-card p-5 rounded-2xl border border-[#e4e4e7] flex items-start justify-between gap-4">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#fafaf8] text-[#18181b] border border-[#e4e4e7] font-semibold">
                                                {faq.category}
                                            </span>
                                            <h4 className="text-xs font-bold text-[#18181b]">{faq.question}</h4>
                                        </div>
                                        <p className="text-xs text-[#52525b] leading-relaxed">{faq.answer}</p>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteFaq(faq.id)}
                                        className="p-1.5 rounded-lg text-[#a1a1aa] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* TAB 3: Pricing Plans */}
                {activeTab === 'plans' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-[#71717a]">Paket Langganan yang Ditampilkan di Website</span>
                            <button
                                onClick={() => setIsAddPlanOpen(true)}
                                className="px-4 py-2 rounded-xl bg-[#18181b] hover:bg-[#27272a] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Tambah Paket Baru</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {plans.map((p) => (
                                <div key={p.id} className="glass-card p-6 rounded-2xl border border-[#e4e4e7] space-y-4 flex flex-col justify-between">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="text-sm font-bold text-[#18181b]">{p.name}</h4>
                                                <span className="text-lg font-black text-[#18181b] font-mono">
                                                    Rp {p.price_monthly?.toLocaleString('id-ID')}
                                                </span>
                                                <span className="text-[10px] text-[#71717a]"> / bulan</span>
                                            </div>
                                            <button
                                                onClick={() => handleDeletePlan(p.id)}
                                                className="p-1 text-[#a1a1aa] hover:text-rose-600"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <p className="text-xs text-[#71717a]">{p.description}</p>
                                        <ul className="space-y-1.5 pt-2 text-xs text-[#52525b]">
                                            {p.features?.map((f, i) => (
                                                <li key={i} className="flex items-center gap-1.5">
                                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                                    <span>{f}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* TAB 4: Articles */}
                {activeTab === 'articles' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-[#71717a]">Artikel & Panduan Edukasi Kreator</span>
                            <button
                                onClick={() => setIsAddArticleOpen(true)}
                                className="px-4 py-2 rounded-xl bg-[#18181b] hover:bg-[#27272a] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Tulis Artikel Baru</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {articles.map((art) => (
                                <div key={art.id} className="glass-card p-5 rounded-2xl border border-[#e4e4e7] space-y-2.5">
                                    <div className="flex items-start justify-between gap-2">
                                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#fafaf8] text-[#18181b] border border-[#e4e4e7] font-semibold">
                                            {art.category}
                                        </span>
                                        <button
                                            onClick={() => handleDeleteArticle(art.id)}
                                            className="p-1 text-[#a1a1aa] hover:text-rose-600"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <h4 className="text-sm font-bold text-[#18181b]">{art.title}</h4>
                                    <p className="text-xs text-[#71717a] line-clamp-2">{art.excerpt}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Modal Add FAQ */}
                {isAddFaqOpen && (
                    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
                        <div className="w-full max-w-md rounded-2xl bg-white border border-[#e4e4e7] p-6 space-y-4 shadow-2xl">
                            <div className="flex justify-between items-center border-b border-[#e4e4e7] pb-2">
                                <h3 className="text-sm font-bold text-[#18181b]">Tambah Pertanyaan FAQ Baru</h3>
                                <button onClick={() => setIsAddFaqOpen(false)}><X className="w-4 h-4 text-[#71717a] hover:text-[#18181b]" /></button>
                            </div>
                            <form onSubmit={handleCreateFaq} className="space-y-3 text-xs">
                                <div className="space-y-1">
                                    <label className="text-[#18181b] font-semibold">Pertanyaan:</label>
                                    <input
                                        type="text"
                                        required
                                        value={faqData.question}
                                        onChange={(e) => setFaqData('question', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-[#fafaf8] border border-[#e4e4e7] text-[#18181b]"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[#18181b] font-semibold">Jawaban:</label>
                                    <textarea
                                        rows={3}
                                        required
                                        value={faqData.answer}
                                        onChange={(e) => setFaqData('answer', e.target.value)}
                                        className="w-full p-3 rounded-xl bg-[#fafaf8] border border-[#e4e4e7] text-[#18181b]"
                                    />
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                    <button type="button" onClick={() => setIsAddFaqOpen(false)} className="px-4 py-2 rounded-xl bg-white border border-[#e4e4e7] text-[#71717a]">Batal</button>
                                    <button type="submit" className="px-4 py-2 rounded-xl bg-[#18181b] text-white font-semibold shadow-xs">Simpan FAQ</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
