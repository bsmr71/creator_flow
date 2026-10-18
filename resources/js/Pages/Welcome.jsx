import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Zap,
    MessageCircle,
    CheckCircle2,
    ArrowRight,
    Sparkles,
    Shield,
    BarChart3,
    Users,
    Clock,
    Play,
    Send,
    ExternalLink,
    ChevronDown,
    Award,
    HelpCircle,
    Check,
    X,
    Star,
    Layers,
    UserCheck,
    Repeat,
    Calculator,
    Workflow,
    Share2,
    ShoppingBag,
    Store,
    Smartphone
} from 'lucide-react';
import PlatformIcon from '../Components/PlatformIcon';
import PhoneMockup from '../Components/PhoneMockup';

export default function Welcome({ cmsSettings, faqs = [], plans = [], articles = [] }) {
    const { auth } = usePage().props;

    // Interactive Demo State
    const [demoKeyword, setDemoKeyword] = useState('MAU');
    const [demoComment, setDemoComment] = useState('Mau link katalog diskon 50% nya dong kak!');
    const [demoMessage, setDemoMessage] = useState(
        "Halo kak! Makasih udah tertarik dengan produk kami 🙌\n\nBerikut link katalog & voucher diskon 50% spesial hari ini:\n\nKlik link di bawah sebelum promo berakhir:"
    );
    const [demoButtons, setDemoButtons] = useState([
        { title: '🛍️ Buka Katalog & Checkout', url: '#' },
        { title: '💬 Chat CS via WhatsApp', url: '#' }
    ]);

    const presetSimulations = [
        {
            label: 'Toko Online / Fashion (Komen "MAU")',
            keyword: 'MAU',
            comment: 'Keren banget dress-nya, MAU link belinya kak!',
            message: "Halo kak! Terima kasih sudah suka dengan koleksi kami ✨\n\nIni tautan checkout langsung ke toko online kami dengan diskon 30% hari ini:",
            buttons: [{ title: '🛍️ Checkout di Shopee / Web', url: '#' }, { title: '💬 Konsultasi Size via WA', url: '#' }]
        },
        {
            label: 'Ebook / Edukasi (Komen "MATERI")',
            keyword: 'MATERI',
            comment: 'Mau dong MATERI PDF rahasia monetisasi bisnisnya!',
            message: "Halo! Ini modul PDF *'Rahasia 100 Juta Pertama dari Konten'* yang kamu minta 🚀\n\nKlik tombol di bawah untuk langsung download gratis:",
            buttons: [{ title: '📥 Download Modul PDF', url: '#' }, { title: '🎓 Gabung Grup Telegram VIP', url: '#' }]
        },
        {
            label: 'F&B / Bisnis Jasa (Komen "PROMO")',
            keyword: 'PROMO',
            comment: 'Kak minta kupon PROMO paket hemat minggu ini',
            message: "Kupon promo berhasil diklaim! 🎉\n\nTunjukkan pesan ini atau klik link berikut untuk reservasi meja / klaim cashback:",
            buttons: [{ title: '🎟️ Klaim Voucher Cashback', url: '#' }, { title: '📍 Cek Lokasi Outlet Terdekat', url: '#' }]
        }
    ];

    const [activePreset, setActivePreset] = useState(0);
    const [openFaq, setOpenFaq] = useState(0);

    // ROI Calculator States
    const [monthlyComments, setMonthlyComments] = useState(2500);
    const [avgProductPrice, setAvgProductPrice] = useState(150000);

    // Calculations
    const convertedDMs = Math.round(monthlyComments * 0.88);
    const estimatedLeads = Math.round(monthlyComments * 0.42);
    const estimatedSalesCount = Math.round(convertedDMs * 0.04);
    const estimatedExtraRevenue = estimatedSalesCount * avgProductPrice;
    const hoursSaved = Math.round((monthlyComments * 1.5) / 60);

    const handleSelectPreset = (idx) => {
        setActivePreset(idx);
        const item = presetSimulations[idx];
        setDemoKeyword(item.keyword);
        setDemoComment(item.comment);
        setDemoMessage(item.message);
        setDemoButtons(item.buttons);
    };

    // Authentic Indonesian FAQ defaults
    const defaultFaqs = [
        {
            question: 'Apakah CreatorFlow aman dan resmi dari Meta (Instagram)?',
            answer: 'Ya, 100% aman dan bergaransi resmi. CreatorFlow menggunakan API resmi Meta Graph API dan WhatsApp Cloud API. Kami tidak pernah meminta kata sandi akun Anda, dan otentikasi dilakukan langsung melalui halaman login OAuth resmi Meta. Tidak ada risiko akun terkena shadowban atau pemblokiran seperti memakai bot ilegal.'
        },
        {
            question: 'Apakah saya bisa menghubungkan akun WhatsApp selain Instagram?',
            answer: 'Tentu saja! CreatorFlow adalah platform Multi-Channel terpadu. Anda dapat mengotomatisasi komentar dan DM Instagram, sekaligus menghubungkan WhatsApp Business API untuk follow-up prospek, kirim katalog, dan konfirmasi transaksi dalam satu layar rapi.'
        },
        {
            question: 'Bagaimana cara kerja fitur Follow Gate?',
            answer: 'Fitur Follow Gate memeriksa apakah akun yang berkomentar sudah mem-follow akun Anda atau belum. Jika belum, sistem akan mengirimkan pesan sopan meminta mereka follow terlebih dahulu, dan secara otomatis mengirimkan link/kupon begitu mereka follow. Fitur ini sangat efektif menambah ribuan pengikut organik.'
        },
        {
            question: 'Apakah saya perlu keahlian coding atau teknis?',
            answer: 'Sama sekali tidak. Anda hanya perlu login akun Instagram/WhatsApp Anda, ketik kata kunci yang ingin dipantau (misal: "MAU", "LINK", "INFO"), lalu tulis pesan respons Anda. Kurang dari 2 menit, sistem otomatis sudah aktif berjalan 24 jam sehari.'
        },
        {
            question: 'Bagaimana metode pembayaran langganan di Indonesia?',
            answer: 'Kami mendukung pembayaran lokal terlengkap termasuk QRIS (GoPay, OVO, Dana, ShopeePay), Transfer Bank Virtual Account (BCA, Mandiri, BRI, BNI), serta Kartu Kredit/Debit berlogo Visa/Mastercard.'
        },
        {
            question: 'Apakah ada batasan jumlah postingan atau reel yang bisa diotomasi?',
            answer: 'Tidak ada batasan postingan! Anda bisa menyetel otomatisasi untuk semua postingan, Reel masa lalu, Reel baru, hingga balasan Instagram Story secara bersamaan tanpa biaya per-postingan.'
        }
    ];

    const activeFaqs = faqs && faqs.length > 0 ? faqs : defaultFaqs;

    // Indonesian Pricing Plans
    const defaultPlans = [
        {
            id: 'free',
            name: 'Starter',
            slug: 'free',
            price: 0,
            formatted_price: 'Gratis',
            period: 'selamanya',
            description: 'Untuk kreator pemula yang ingin mulai merasakan keajaiban respon instan.',
            features: [
                '500 DM otomatis / bulan',
                'Otomasi Komentar Reel & Post Feed',
                'Balasan Story Instagram',
                'Kecepatan respon 0.1 detik',
                'Integrasi 1 Akun Instagram',
                'Laporan performa analitik dasar'
            ],
            is_popular: false,
            cta_text: 'Daftar Gratis'
        },
        {
            id: 'pro',
            name: 'Creator Pro',
            slug: 'pro',
            price: 149000,
            formatted_price: 'Rp 149.000',
            period: '/bulan',
            description: 'Paling diminati online shop, affiliate, coach & kreator yang jualan aktif.',
            features: [
                '5.000 DM & WhatsApp / bulan',
                'Semua fitur paket Starter',
                'Fitur Follow Gate (Wajib Follow)',
                'Database Kontak CRM & Ekspor CSV',
                'Fitur Rewind (Otomasi Komen Lama)',
                'Pelacakan klik link konversi',
                'Integrasi WhatsApp Cloud API',
                'Prioritas server pengiriman instan'
            ],
            is_popular: true,
            cta_text: 'Mulai Uji Coba Pro'
        },
        {
            id: 'agency',
            name: 'Brand & Agensi',
            slug: 'growth',
            price: 349000,
            formatted_price: 'Rp 349.000',
            period: '/bulan',
            description: 'Solusi lengkap agensi periklanan, brand besar, dan pengelola multi-akun.',
            features: [
                '15.000 DM & WhatsApp / bulan',
                'Semua fitur Creator Pro',
                '5 Workspace terpisah per klien/brand',
                'Multi-akun Instagram & WhatsApp',
                'Akses Multi-User & Manajemen Tim',
                'Kustom Webhook & Integrasi API',
                'Dedicated Account Manager 24/7'
            ],
            is_popular: false,
            cta_text: 'Pilih Paket Agensi'
        }
    ];

    const activePlans = plans && plans.length > 0 ? plans : defaultPlans;
    const announcementText = cmsSettings?.announcement || '⚡ PROMO HARI INI: Coba Gratis 500 Otomasi DM/Bulan & Dapatkan Setup Kilat 2 Menit!';

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-slate-900 selection:text-white antialiased">
            <Head>
                <title>CreatorFlow — Otomasi DM Instagram & WhatsApp untuk Kreator & Bisnis</title>
                <meta name="description" content="Balas komentar Reel, Feed, Story, dan DM Instagram & WhatsApp otomatis dalam 0.1 detik. Meta Tech Provider terpercaya untuk toko online, affiliate, dan kreator Indonesia." />
            </Head>

            {/* Top Announcement Bar (Subtle, Clean & Warm) */}
            <div className="bg-[#f4f4f0] text-slate-800 border-b border-slate-200/80 text-xs sm:text-sm py-2 px-4 text-center flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="font-medium">{announcementText}</span>
                <a href="#pricing" className="text-slate-900 font-bold underline hover:opacity-75 ml-1 hidden sm:inline">
                    Lihat Paket →
                </a>
            </div>

            {/* Main Navigation Bar */}
            <header className="sticky top-0 z-50 bg-[#fafaf8]/90 backdrop-blur-md border-b border-slate-200/80">
                <div className="max-w-7xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between">
                    {/* Brand Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
                            <Zap className="w-5 h-5 fill-white text-white" />
                        </div>
                        <span className="font-extrabold text-2xl tracking-tight text-slate-900">
                            Creator<span className="text-slate-600 font-normal">Flow</span>
                        </span>
                    </Link>

                    {/* Navigation Menu */}
                    <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-600">
                        <a href="#peluang" className="hover:text-slate-900 transition-colors">Peluang</a>
                        <a href="#fitur" className="hover:text-slate-900 transition-colors">Fitur</a>
                        <a href="#demo" className="hover:text-slate-900 transition-colors">Simulasi Live</a>
                        <a href="#kalkulator" className="hover:text-slate-900 transition-colors">Kalkulator Omset</a>
                        <a href="#testimoni" className="hover:text-slate-900 transition-colors">Testimoni</a>
                        <a href="#pricing" className="hover:text-slate-900 transition-colors">Harga</a>
                        <a href="#faq" className="hover:text-slate-900 transition-colors">FAQ</a>
                    </nav>

                    {/* Right Action Buttons */}
                    <div className="flex items-center gap-3">
                        {auth?.user ? (
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm active:scale-95 transition-all"
                            >
                                <span>Buka Dashboard</span>
                                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                            </Link>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/login"
                                    className="px-4 py-2.5 rounded-xl text-slate-700 hover:text-slate-900 text-xs font-semibold transition-colors"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    href="/register"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm hover:scale-[1.02] active:scale-95 transition-all"
                                >
                                    <span>Mulai Gratis</span>
                                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* HERO SECTION (Warm Editorial Canvas — #fafaf8) */}
            <section className="relative bg-[#fafaf8] pt-14 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200/80 rounded-b-[36px] sm:rounded-b-[48px]">
                <div className="max-w-7xl mx-auto px-5 sm:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                        {/* Left Hero Content */}
                        <div className="lg:col-span-7 flex flex-col items-start text-left">
                            {/* Meta Tech Provider & Proof Badge */}
                            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-xs mb-7">
                                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800">
                                    <svg className="w-3.5 h-3.5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
                                    </svg>
                                    <span>Meta Tech Provider</span>
                                </div>
                                <span className="text-slate-300">•</span>
                                <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                                    <div className="flex -space-x-1.5 overflow-hidden">
                                        <span className="w-4 h-4 rounded-full bg-rose-500 text-[8px] text-white font-bold flex items-center justify-center">D</span>
                                        <span className="w-4 h-4 rounded-full bg-blue-500 text-[8px] text-white font-bold flex items-center justify-center">R</span>
                                        <span className="w-4 h-4 rounded-full bg-emerald-500 text-[8px] text-white font-bold flex items-center justify-center">K</span>
                                    </div>
                                    <span>Dipercaya +20.000 kreator & toko</span>
                                </div>
                            </div>

                            {/* Main Title */}
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.08] mb-6">
                                Ubah Komentar & Pesan Menjadi{' '}
                                <span className="relative inline-block text-slate-900">
                                    Penjualan Otomatis
                                    <span className="absolute bottom-1 left-0 w-full h-3 bg-[#d1fe17]/60 -z-10 rounded"></span>
                                </span>
                            </h1>

                            {/* Subtitle */}
                            <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mb-8">
                                Otomatisasi DM Instagram, balasan Story, dan WhatsApp Business resmi. Balas komentar calon pembeli dalam 0.1 detik, kirim link katalog Shopee/Web, dan kumpulkan database kontak tanpa repot ngetik manual.
                            </p>

                            {/* Value Features Checklist */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-10 text-sm font-semibold text-slate-700">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                        <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[3]" />
                                    </div>
                                    <span>Respon kilat 0.1 detik di Reel & Story</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                        <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[3]" />
                                    </div>
                                    <span>Fitur Follow Gate (Wajibkan Follow Akun)</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                        <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[3]" />
                                    </div>
                                    <span>Integrasi WhatsApp Business API Resmi</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                        <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[3]" />
                                    </div>
                                    <span>Setup mudah kurang dari 2 menit</span>
                                </div>
                            </div>

                            {/* CTA Action Buttons */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
                                <Link
                                    href="/register"
                                    className="px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-base sm:text-lg flex items-center justify-center gap-3 shadow-md hover:scale-[1.02] active:scale-95 transition-all"
                                >
                                    <span>Mulai Gratis Sekarang</span>
                                    <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                                </Link>

                                <a
                                    href="#kalkulator"
                                    className="px-6 py-4 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-2xs"
                                >
                                    <Calculator className="w-4 h-4 text-slate-600" />
                                    <span>Hitung Estimasi Omset</span>
                                </a>
                            </div>

                            {/* Microcopy Trust Assurance */}
                            <div className="flex items-center gap-3 mt-4 text-xs text-slate-500 font-medium">
                                <span className="flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                    500 Otomasi Gratis/Bulan
                                </span>
                                <span>•</span>
                                <span>Tanpa Kartu Kredit</span>
                                <span>•</span>
                                <span>Batalkan Kapan Saja</span>
                            </div>
                        </div>

                        {/* Right Hero Visual (Tactile iPhone Frame on Clean Canvas) */}
                        <div className="lg:col-span-5 relative flex flex-col items-center">
                            <PhoneMockup
                                platform="instagram"
                                accountName="lumina.hijab"
                                triggerKeyword="MAU"
                                userComment="Mau link diskon 50% nya dong kak!"
                                messageBody="Halo kak! Terima kasih sudah komentar di Reel kami ✨\n\nIni kupon diskon 50% & link checkout produknya:"
                                buttons={[
                                    { title: '🛍️ Beli di Shopee / Web', url: '#' },
                                    { title: '💬 Chat CS via WhatsApp', url: '#' }
                                ]}
                            />

                            {/* Trust Indicator Pill */}
                            <div className="mt-4 flex items-center gap-3 bg-white border border-slate-200/90 px-4 py-2.5 rounded-xl shadow-xs">
                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                <span className="text-xs font-semibold text-slate-700">
                                    Kecepatan respon server: <strong className="text-slate-900 font-mono">0.08 detik</strong>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 2: PELUANGNYA (Opportunity) */}
            <section id="peluang" className="py-20 bg-white border-b border-slate-200/80">
                <div className="max-w-6xl mx-auto px-5 sm:px-8 text-center">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 inline-block">
                        PELUANG BESAR
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 max-w-3xl mx-auto">
                        Instagram & WhatsApp Anda sudah penuh calon pembeli.
                    </h2>
                    <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto mb-14 leading-relaxed">
                        Setiap komentar di Reel dan balasan Story adalah orang yang berminat membeli. Jika dibalas telat beberapa jam, minat mereka hilang. CreatorFlow menjawab semuanya seketika.
                    </p>

                    {/* Chips Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-5xl mx-auto text-left">
                        {[
                            { title: 'Komentar ke DM', desc: 'Otomatis kirim link saat ada yang komen di postingan/Reel' },
                            { title: 'WhatsApp Cloud API', desc: 'Koneksikan nomor CS untuk follow-up dan closing pesanan' },
                            { title: 'Simpan Database Lead', desc: 'Dapatkan email dan nomor WhatsApp pembeli secara rapi' },
                            { title: 'Kirim Link Shopee & Toko', desc: 'Arahkan traffic langsung ke checkout marketplace' },
                            { title: 'Adakan Giveaway Viral', desc: 'Komentar berlipat ganda dengan auto-reply rules cerdas' },
                            { title: 'Bagikan Voucher & Diskon', desc: 'Kirim kupon promo khusus untuk follower setia' },
                            { title: 'Fitur Follow Gate', desc: 'Wajibkan follow akun terlebih dahulu sebelum link dikirim' },
                            { title: 'Fitur Rewind', desc: 'Kirim DM ke semua orang yang pernah komen di postingan lalu' }
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                className="p-5 rounded-2xl bg-[#fafaf8] border border-slate-200/80 hover:border-slate-400/80 hover:bg-white transition-all group"
                            >
                                <div className="w-8 h-8 rounded-lg bg-slate-200/70 text-slate-800 flex items-center justify-center font-bold text-xs mb-3 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                                    0{idx + 1}
                                </div>
                                <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1">{item.title}</h3>
                                <p className="text-xs text-slate-500 leading-normal">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 3: 3 LANGKAH MUDAH (How It Works) */}
            <section className="py-20 bg-[#fafaf8] border-b border-slate-200/80">
                <div className="max-w-6xl mx-auto px-5 sm:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-14">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 inline-block">
                            AKTIF HARI INI JUGA
                        </span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
                            Tiga langkah sederhana. Tanpa coding.
                        </h2>
                        <p className="text-slate-600 text-base sm:text-lg">
                            Jika Anda bisa menulis caption di Instagram, Anda bisa menyiapkan CreatorFlow dalam 2 menit.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-7 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
                            <div>
                                <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-black text-sm flex items-center justify-center mb-5">
                                    1
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">Sambungkan Akun Anda</h3>
                                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                                    Login aman dengan otentikasi resmi Meta OAuth. Tanpa perlu berbagi password, 100% aman dan bergaransi.
                                </p>
                            </div>
                            <div className="p-3 rounded-xl bg-[#fafaf8] border border-slate-200/80 flex items-center justify-between text-xs">
                                <span className="font-semibold text-slate-800">@brandkamu</span>
                                <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                                    <Check className="w-3.5 h-3.5" /> Terhubung
                                </span>
                            </div>
                        </div>

                        <div className="p-7 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
                            <div>
                                <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-black text-sm flex items-center justify-center mb-5">
                                    2
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">Pilih Pemicu & Tulis Pesan</h3>
                                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                                    Tentukan kata kunci seperti "MAU" atau "KATALOG", tulis pesan dengan gaya bahasa khas Anda, dan tempelkan link produk.
                                </p>
                            </div>
                            <div className="p-3 rounded-xl bg-[#fafaf8] border border-slate-200/80 flex items-center justify-between text-xs">
                                <span className="text-slate-600">Kata kunci: <strong className="text-slate-900">MAU</strong></span>
                                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                                <span className="text-slate-900 font-semibold">Kirim Link DM</span>
                            </div>
                        </div>

                        <div className="p-7 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
                            <div>
                                <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-black text-sm flex items-center justify-center mb-5">
                                    3
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">Aktifkan & Nikmati Penjualan</h3>
                                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                                    Nyalakan saklar otomatisasi dan CreatorFlow mulai membalas calon pembeli 24 jam sehari bahkan saat Anda tidur.
                                </p>
                            </div>
                            <div className="p-3 rounded-xl bg-[#fafaf8] border border-slate-200/80 flex items-center justify-between text-xs">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                    <span className="font-semibold text-emerald-800">Status: LIVE</span>
                                </div>
                                <span className="text-slate-500 text-[11px]">Membalas otomatis</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 4: KALKULATOR POTENSI OMSET (Clean White Surface) */}
            <section id="kalkulator" className="py-20 bg-white border-b border-slate-200/80">
                <div className="max-w-5xl mx-auto px-5 sm:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 inline-block">
                            KALKULATOR KEUNTUNGAN
                        </span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
                            Berapa omset yang bisa Anda dapatkan?
                        </h2>
                        <p className="text-slate-600 text-base sm:text-lg">
                            Geser slider di bawah ini untuk melihat estimasi tambahan penjualan dan waktu admin yang bisa dihemat.
                        </p>
                    </div>

                    <div className="p-8 sm:p-12 rounded-3xl bg-[#fafaf8] border border-slate-200/90 shadow-sm">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                            {/* Sliders Input */}
                            <div className="lg:col-span-6 space-y-7">
                                {/* Slider 1: Comments */}
                                <div className="space-y-2.5">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-bold text-slate-800">Rata-rata Komentar & DM / Bulan:</span>
                                        <span className="font-mono font-extrabold text-slate-900 text-base">
                                            {monthlyComments.toLocaleString('id-ID')} interaksi
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min="500"
                                        max="30000"
                                        step="500"
                                        value={monthlyComments}
                                        onChange={(e) => setMonthlyComments(Number(e.target.value))}
                                        className="w-full h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-slate-900"
                                    />
                                    <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                                        <span>500</span>
                                        <span>15.000</span>
                                        <span>30.000+</span>
                                    </div>
                                </div>

                                {/* Slider 2: Product Price */}
                                <div className="space-y-2.5">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-bold text-slate-800">Rata-rata Harga Produk Anda:</span>
                                        <span className="font-mono font-extrabold text-slate-900 text-base">
                                            Rp {avgProductPrice.toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min="25000"
                                        max="1000000"
                                        step="25000"
                                        value={avgProductPrice}
                                        onChange={(e) => setAvgProductPrice(Number(e.target.value))}
                                        className="w-full h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-slate-900"
                                    />
                                    <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                                        <span>Rp 25.000</span>
                                        <span>Rp 500.000</span>
                                        <span>Rp 1.000.000</span>
                                    </div>
                                </div>

                                <p className="text-xs text-slate-500 leading-relaxed">
                                    *Perhitungan berbasis konversi rata-rata industri online shop Indonesia (88% deliverability DM, 4% closing rate dari pembeli yang meminta link katalog).
                                </p>
                            </div>

                            {/* Result Card */}
                            <div className="lg:col-span-6 p-7 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-6">
                                <div>
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                        Estimasi Tambahan Omset Bulanan:
                                    </span>
                                    <div className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                                        + Rp {estimatedExtraRevenue.toLocaleString('id-ID')}
                                    </div>
                                    <div className="text-xs text-emerald-700 font-semibold mt-1">
                                        ≈ {estimatedSalesCount} transaksi penjualan tambahan / bulan
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                                    <div>
                                        <div className="text-xs text-slate-500 mb-0.5">Waktu Admin Terhemat:</div>
                                        <div className="text-xl font-bold text-slate-900 font-mono">
                                            ~ {hoursSaved} Jam
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-500 mb-0.5">Database Leads Baru:</div>
                                        <div className="text-xl font-bold text-slate-900 font-mono">
                                            + {estimatedLeads} Kontak
                                        </div>
                                    </div>
                                </div>

                                <Link
                                    href="/register"
                                    className="w-full py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                                >
                                    <span>Raih Potensi Omset Ini</span>
                                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 5: LIVE DEMO SANDBOX */}
            <section id="demo" className="py-20 bg-[#fafaf8] border-b border-slate-200/80">
                <div className="max-w-7xl mx-auto px-5 sm:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-14">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 inline-block">
                            SIMULASI INTERAKTIF
                        </span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
                            Coba langsung di simulator ini.
                        </h2>
                        <p className="text-slate-600 text-base sm:text-lg">
                            Ketik kata kunci atau pilih skenario bisnis Anda untuk melihat bagaimana bot membalas secara real-time.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                        {/* Simulation Left */}
                        <div className="lg:col-span-6 space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                                    Pilih Contoh Skenario:
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    {presetSimulations.map((preset, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => handleSelectPreset(idx)}
                                            className={`p-3 rounded-xl text-xs font-semibold text-left transition-all border ${
                                                activePreset === idx
                                                    ? 'bg-slate-900 text-white border-slate-900 font-bold shadow-xs'
                                                    : 'bg-white text-slate-700 border-slate-200/90 hover:border-slate-400'
                                            }`}
                                        >
                                            {preset.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                                    Kata Kunci Pemicu (Trigger):
                                </label>
                                <input
                                    type="text"
                                    value={demoKeyword}
                                    onChange={(e) => setDemoKeyword(e.target.value.toUpperCase())}
                                    className="w-full bg-white border border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 rounded-xl px-4 py-3 text-slate-900 font-mono text-sm uppercase tracking-wider"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                                    Komentar Audiens di Postingan / Reel:
                                </label>
                                <input
                                    type="text"
                                    value={demoComment}
                                    onChange={(e) => setDemoComment(e.target.value)}
                                    className="w-full bg-white border border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 rounded-xl px-4 py-3 text-slate-900 text-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                                    Pesan DM / WhatsApp yang Terkirim Otomatis:
                                </label>
                                <textarea
                                    rows="4"
                                    value={demoMessage}
                                    onChange={(e) => setDemoMessage(e.target.value)}
                                    className="w-full bg-white border border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 rounded-xl p-4 text-slate-900 text-sm leading-relaxed"
                                />
                            </div>

                            <div className="pt-2">
                                <Link
                                    href="/register"
                                    className="inline-flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm shadow-xs transition-all"
                                >
                                    <span>Gunakan Otomasi Ini di Akun Saya</span>
                                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                                </Link>
                            </div>
                        </div>

                        {/* Interactive Phone Mockup Right */}
                        <div className="lg:col-span-6 flex justify-center">
                            <PhoneMockup
                                platform="instagram"
                                accountName="lumina.hijab"
                                triggerKeyword={demoKeyword}
                                userComment={demoComment}
                                messageBody={demoMessage}
                                buttons={demoButtons}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 6: TESTIMONI NYATA KREATOR & BISNIS LOKAL */}
            <section id="testimoni" className="py-20 bg-white border-b border-slate-200/80">
                <div className="max-w-6xl mx-auto px-5 sm:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-14">
                        <div className="flex items-center justify-center gap-1 mb-2 text-amber-500">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                            ))}
                            <span className="font-extrabold text-slate-900 ml-2 text-sm">4.9 / 5 dari Pengguna</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
                            Cerita sukses bisnis di Indonesia
                        </h2>
                        <p className="text-slate-600 text-base sm:text-lg">
                            Pengalaman nyata pemilik toko online, agensi, dan kreator yang telah membuktikannya.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-7 rounded-2xl bg-[#fafaf8] border border-slate-200/80 flex flex-col justify-between">
                            <div className="space-y-4 mb-6">
                                <div className="flex items-center gap-1 text-amber-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                                    ))}
                                </div>
                                <p className="text-sm text-slate-700 leading-relaxed italic">
                                    "Sebelum pakai CreatorFlow, kami kewalahan balas 800+ komen di video Reel peluncuran gamis terbaru. Banyak yang batal beli karena dibalas 4 jam kemudian. Sekarang respon dalam 1 detik, omset penjualan kami naik 140%!"
                                </p>
                            </div>
                            <div className="border-t border-slate-200/80 pt-4">
                                <div className="font-bold text-slate-900 text-sm">Dian Puspitasari</div>
                                <div className="text-xs text-slate-500">Owner @lumina.hijab • Bandung</div>
                            </div>
                        </div>

                        <div className="p-7 rounded-2xl bg-[#fafaf8] border-2 border-slate-900 flex flex-col justify-between shadow-xs">
                            <div className="space-y-4 mb-6">
                                <div className="flex items-center gap-1 text-amber-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                                    ))}
                                </div>
                                <p className="text-sm text-slate-700 leading-relaxed italic">
                                    "Fitur Multi-Workspace dan integrasi WhatsApp API-nya juara! Agensi kami mengelola 12 akun klien brand kecantikan dan F&B tanpa ribet. Klien senang karena leads mereka langsung terkumpul ke CRM otomatis."
                                </p>
                            </div>
                            <div className="border-t border-slate-200/80 pt-4">
                                <div className="font-bold text-slate-900 text-sm">Rian Pratama</div>
                                <div className="text-xs text-slate-600 font-semibold">Managing Director @scaleup.id • Jakarta</div>
                            </div>
                        </div>

                        <div className="p-7 rounded-2xl bg-[#fafaf8] border border-slate-200/80 flex flex-col justify-between">
                            <div className="space-y-4 mb-6">
                                <div className="flex items-center gap-1 text-amber-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                                    ))}
                                </div>
                                <p className="text-sm text-slate-700 leading-relaxed italic">
                                    "Fitur Follow Gate benar-benar luar biasa! Dari yang cuma minta PDF materi gratis, mereka wajib follow dulu. Akun kami tumbuh dari 8.000 jadi 45.000 followers dalam waktu 2 bulan saja tanpa pasang iklan berbayar."
                                </p>
                            </div>
                            <div className="border-t border-slate-200/80 pt-4">
                                <div className="font-bold text-slate-900 text-sm">dr. Kevin Santoso</div>
                                <div className="text-xs text-slate-500">Kreator & Klinik Estetika • Surabaya</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 7: HARGA TRANSPARAN (Indonesian Rupiah) */}
            <section id="pricing" className="py-20 bg-[#fafaf8] border-b border-slate-200/80">
                <div className="max-w-7xl mx-auto px-5 sm:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-14">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 inline-block">
                            HARGA TRANSPARAN TANPA BIAYA TERSEMBUNYI
                        </span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
                            Investasi terbaik untuk bisnis Anda.
                        </h2>
                        <p className="text-slate-600 text-base sm:text-lg">
                            Mulai gratis tanpa kartu kredit. Upgrade kapan saja saat bisnis Anda semakin bertumbuh.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                        {activePlans.map((plan, idx) => {
                            const isPop = plan.is_popular;
                            return (
                                <div
                                    key={idx}
                                    className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all ${
                                        isPop
                                            ? 'bg-white border-2 border-slate-900 shadow-md lg:-translate-y-2'
                                            : 'bg-white border border-slate-200/90 hover:border-slate-300'
                                    }`}
                                >
                                    {isPop && (
                                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-slate-900 text-white font-extrabold text-xs uppercase tracking-wider shadow-xs">
                                            Paling Favorit
                                        </div>
                                    )}

                                    <div>
                                        <div className="mb-4">
                                            <h3 className="text-2xl font-bold text-slate-900">{plan.name}</h3>
                                            <p className="text-xs text-slate-500 mt-1">{plan.description}</p>
                                        </div>

                                        <div className="flex items-baseline gap-1 my-6">
                                            <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                                                {(() => {
                                                    const price = plan.price_monthly ?? plan.price ?? 0;
                                                    if (plan.formatted_price) return plan.formatted_price;
                                                    if (price === 0) return 'Gratis';
                                                    return `Rp ${Number(price).toLocaleString('id-ID')}`;
                                                })()}
                                            </span>
                                            <span className="text-slate-500 text-sm font-semibold">{plan.period || '/bulan'}</span>
                                        </div>

                                        <div className="border-t border-slate-100 pt-6 space-y-3.5 mb-8">
                                            <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
                                                Fitur Termasuk:
                                            </div>
                                            {plan.features && plan.features.map((feat, fIdx) => (
                                                <div key={fIdx} className="flex items-start gap-3 text-sm text-slate-700">
                                                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                        <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[3]" />
                                                    </div>
                                                    <span>{feat}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <Link
                                        href={auth?.user ? '/billing' : '/register'}
                                        className={`w-full py-4 rounded-xl font-extrabold text-center text-sm transition-all flex items-center justify-center gap-2 ${
                                            isPop
                                                ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                                                : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                                        }`}
                                    >
                                        <span>{plan.cta_text || 'Pilih Paket'}</span>
                                        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* SECTION 8: FAQ ACCORDION */}
            <section id="faq" className="py-20 bg-white border-b border-slate-200/80">
                <div className="max-w-4xl mx-auto px-5 sm:px-8">
                    <div className="text-center mb-14">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 inline-block">
                            PERTANYAAN UMUM
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                            Semua yang perlu Anda ketahui
                        </h2>
                        <p className="text-slate-600 text-base">
                            Informasi seputar keamanan akun, metode pembayaran lokal, dan API resmi Meta.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {activeFaqs.map((faq, idx) => (
                            <div
                                key={idx}
                                className="rounded-2xl border border-slate-200/80 bg-[#fafaf8] overflow-hidden transition-all"
                            >
                                <button
                                    type="button"
                                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                    className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-base sm:text-lg hover:text-slate-700 transition-colors"
                                >
                                    <span>{faq.question}</span>
                                    <ChevronDown
                                        className={`w-5 h-5 text-slate-500 flex-shrink-0 transition-transform duration-200 ${
                                            openFaq === idx ? 'rotate-180 text-slate-900' : ''
                                        }`}
                                    />
                                </button>
                                {openFaq === idx && (
                                    <div className="px-6 pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 pt-4">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 9: FINAL CALL TO ACTION (Clean High-Contrast Charcoal Surface) */}
            <section className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-5 sm:px-8">
                    <div className="rounded-[36px] bg-slate-900 p-10 sm:p-16 text-center text-white shadow-xl">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 inline-block">
                            SIAP MELIPATGANDAKAN PENJUALAN?
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-5 max-w-2xl mx-auto leading-tight">
                            Mulai Otomasi Bisnis Anda Hari Ini
                        </h2>
                        <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                            Jangan biarkan calon pelanggan kabur karena telat dibalas. Mulai gratis dan rasakan otomatisasi respon dalam hitungan detik.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/register"
                                className="w-full sm:w-auto px-9 py-4.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-base shadow-sm hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                <span>Daftar Akun Gratis Sekarang</span>
                                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                            </Link>
                        </div>

                        <p className="mt-5 text-xs text-slate-400">
                            Setup dalam 2 menit • Gratis 500 Otomasi/Bulan • Tanpa kartu kredit
                        </p>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="border-t border-slate-200/80 bg-[#fafaf8] py-16 text-slate-600 text-xs">
                <div className="max-w-7xl mx-auto px-5 sm:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
                        <div className="space-y-4 md:col-span-1">
                            <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-white font-black">
                                    <Zap className="w-4 h-4 fill-white text-white" />
                                </div>
                                <span className="font-extrabold text-lg text-slate-900">CreatorFlow</span>
                            </div>
                            <p className="text-slate-500 text-xs leading-relaxed">
                                Platform otomatisasi Multi-Channel Instagram DM & WhatsApp Business API resmi untuk toko online, kreator, dan agensi Indonesia.
                            </p>
                        </div>

                        <div>
                            <div className="font-bold text-slate-900 text-sm mb-4">Fitur Produk</div>
                            <ul className="space-y-2.5">
                                <li><a href="#fitur" className="hover:text-slate-900 transition-colors">Otomasi Komentar Reel</a></li>
                                <li><a href="#fitur" className="hover:text-slate-900 transition-colors">Balasan Story Instagram</a></li>
                                <li><a href="#fitur" className="hover:text-slate-900 transition-colors">WhatsApp Cloud API</a></li>
                                <li><a href="#peluang" className="hover:text-slate-900 transition-colors">Fitur Follow Gate</a></li>
                                <li><a href="#kalkulator" className="hover:text-slate-900 transition-colors">Kalkulator Potensi Omset</a></li>
                            </ul>
                        </div>

                        <div>
                            <div className="font-bold text-slate-900 text-sm mb-4">Akses & Manajemen</div>
                            <ul className="space-y-2.5">
                                <li><Link href="/login" className="hover:text-slate-900 transition-colors">Masuk ke Akun</Link></li>
                                <li><Link href="/register" className="hover:text-slate-900 transition-colors">Daftar Akun Baru</Link></li>
                                <li><Link href="/dashboard" className="hover:text-slate-900 transition-colors">Dashboard Aplikasi</Link></li>
                                <li><Link href="/cms" className="hover:text-slate-900 transition-colors">Kelola Konten (CMS)</Link></li>
                                <li><a href="#faq" className="hover:text-slate-900 transition-colors">Pusat Bantuan & FAQ</a></li>
                            </ul>
                        </div>

                        <div>
                            <div className="font-bold text-slate-900 text-sm mb-4">Keamanan Resmi</div>
                            <p className="text-[11px] leading-relaxed text-slate-500 mb-3">
                                CreatorFlow beroperasi secara patuh menggunakan integrasi resmi Meta Graph API & WhatsApp Business Platform.
                            </p>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-700 shadow-2xs">
                                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                                <span>100% Meta API Approved</span>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-200/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
                        <div>
                            &copy; {new Date().getFullYear()} CreatorFlow. Seluruh hak cipta dilindungi undang-undang.
                        </div>
                        <div className="flex items-center gap-6">
                            <Link href="/terms" className="hover:text-slate-900 transition-colors">Syarat & Ketentuan</Link>
                            <Link href="/privacy" className="hover:text-slate-900 transition-colors">Kebijakan Privasi</Link>
                            <Link href="/data-deletion" className="hover:text-slate-900 transition-colors">Penghapusan Data</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
