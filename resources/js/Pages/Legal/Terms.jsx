import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ShieldCheck, Zap, Scale, AlertCircle, RefreshCw } from 'lucide-react';

export default function Terms({ appName = 'CreatorFlow', appUrl = 'https://creatorflow.id', lastUpdated = '18 Oktober 2026' }) {
    return (
        <div className="min-h-screen bg-[#fafaf8] text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
            <Head title={`Syarat & Ketentuan Layanan (Terms of Service) — ${appName}`} />

            {/* Navigation Header */}
            <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-4xl mx-auto px-5 h-16 flex items-center justify-between">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Kembali ke Beranda</span>
                    </Link>

                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-white">
                            <Zap className="w-4 h-4 fill-white text-white" />
                        </div>
                        <span className="font-extrabold text-sm text-slate-900">{appName}</span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-5 py-12 space-y-8">
                {/* Header Banner */}
                <div className="space-y-3 pb-6 border-b border-slate-200">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[11px] font-bold text-blue-700">
                        <Scale className="w-3.5 h-3.5" />
                        <span>Ketentuan Penggunaan Platform Resmi</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        Syarat & Ketentuan Layanan
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500">
                        Terakhir diperbarui: <strong>{lastUpdated}</strong> • Harap baca dengan saksama sebelum menggunakan {appName}.
                    </p>
                </div>

                {/* Content Sections */}
                <div className="space-y-8 text-sm leading-relaxed text-slate-700">
                    <section className="space-y-3">
                        <h2 className="text-lg font-bold text-slate-900">1. Penerimaan Ketentuan</h2>
                        <p>
                            Dengan mendaftar, mengakses, atau menggunakan layanan {appName}, Anda menyatakan telah membaca, memahami, dan menyetujui untuk terikat oleh Syarat dan Ketentuan ini serta Kebijakan Privasi kami. Jika Anda tidak menyetujui ketentuan ini, Anda tidak diperkenankan menggunakan layanan ini.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-lg font-bold text-slate-900">2. Kepatuhan terhadap Kebijakan Meta Platform</h2>
                        <p>
                            {appName} beroperasi secara patuh menggunakan antarmuka resmi <strong>Meta Graph API</strong> dan <strong>WhatsApp Business Platform</strong>. Sebagai pengguna {appName}, Anda wajib mematuhi seluruh:
                        </p>
                        <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                            <li>Standar Komunitas Meta (Meta Community Standards).</li>
                            <li>Ketentuan Platform Meta (Meta Platform Terms).</li>
                            <li>Kebijakan Pesan Instagram & WhatsApp Business (tidak mengirim spam, penipuan, atau konten ilegal).</li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-lg font-bold text-slate-900">3. Tanggung Jawab Konten Pengguna</h2>
                        <p>
                            Anda bertanggung jawab penuh atas seluruh pesan otomatis, kata kunci pemicu, link produk, dan materi promosi yang Anda atur melalui dashboard {appName}. Kami berhak menonaktifkan akun yang terbukti menggunakan layanan ini untuk kegiatan spamming atau tindakan yang merugikan pihak lain.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-lg font-bold text-slate-900">4. Langganan, Pembayaran & Pembatalan</h2>
                        <p>
                            {appName} menyediakan paket Starter (Gratis), Creator Pro (Bulanan), dan Paket Agensi. Pembayaran diproses secara aman melalui payment gateway resmi berizin (DOKU) menggunakan QRIS dan Virtual Account perbankan Indonesia. Anda dapat membatalkan langganan kapan saja melalui menu Tagihan di dashboard.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-lg font-bold text-slate-900">5. Batasan Tanggung Jawab</h2>
                        <p>
                            {appName} berupaya keras menjaga ketersediaan server 99.9% dan kecepatan respon pesan di bawah 0.1 detik. Namun demikian, {appName} tidak bertanggung jawab atas gangguan yang disebabkan oleh pemeliharaan sistem Meta, gangguan koneksi ISP pengguna, atau kebijakan pembatasan sepihak dari Meta terhadap akun pengguna.
                        </p>
                    </section>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
                <div className="max-w-4xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>© {new Date().getFullYear()} {appName}. Hak Cipta Dilindungi.</div>
                    <div className="flex items-center gap-4 font-medium">
                        <Link href="/privacy" className="hover:text-slate-900">Kebijakan Privasi</Link>
                        <Link href="/terms" className="text-slate-900 underline">Syarat Layanan</Link>
                        <Link href="/data-deletion" className="hover:text-slate-900">Hapus Data</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
