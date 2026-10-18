import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ShieldCheck, Zap, Lock, Eye, FileText, Mail, CheckCircle2 } from 'lucide-react';

export default function Privacy({ appName = 'CreatorFlow', appUrl = 'https://creatorflow.id', lastUpdated = '18 Oktober 2026' }) {
    return (
        <div className="min-h-screen bg-[#fafaf8] text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
            <Head title={`Kebijakan Privasi (Privacy Policy) — ${appName}`} />

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
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-700">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Sesuai Kebijakan Resmi Meta Platform & WhatsApp</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        Kebijakan Privasi ({appName})
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500">
                        Terakhir diperbarui: <strong>{lastUpdated}</strong> • Berlaku untuk seluruh pengguna platform {appName}.
                    </p>
                </div>

                {/* Content Sections */}
                <div className="space-y-8 text-sm leading-relaxed text-slate-700">
                    <section className="space-y-3">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Eye className="w-5 h-5 text-indigo-600" />
                            <span>1. Pendahuluan & Komitmen Privasi</span>
                        </h2>
                        <p>
                            {appName} ("kami", "layanan kami") adalah platform otomasi pesan Instagram dan WhatsApp resmi yang dirancang untuk membantu kreator konten, pemilik toko online, dan agensi bisnis dalam mengotomatisasi interaksi dengan audiens mereka.
                        </p>
                        <p>
                            Privasi data Anda dan audiens Anda adalah prioritas utama kami. Kami beroperasi secara patuh menggunakan <strong>Meta Graph API</strong> dan <strong>WhatsApp Business Cloud API</strong> resmi. Kami tidak pernah meminta, melihat, ataupun menyimpan kata sandi (password) akun Instagram maupun Facebook Anda.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-indigo-600" />
                            <span>2. Data yang Kami Kumpulkan</span>
                        </h2>
                        <p>Ketika Anda menggunakan {appName}, kami hanya mengumpulkan data yang diperlukan untuk menjalankan layanan otomasi:</p>
                        <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                            <li><strong>Informasi Akun {appName}:</strong> Nama lengkap, alamat email, dan kata sandi terenkripsi (bcrypt).</li>
                            <li><strong>Data Profil Instagram & Facebook:</strong> Instagram Business Account ID, nama pengguna (username), foto profil, dan token akses OAuth yang dienkripsi.</li>
                            <li><strong>Data Interaksi (Webhook Meta):</strong> Komentar publik di Reel/Feed dan pesan masuk (DM) yang ditujukan ke akun bisnis Anda, untuk keperluan memicu balasan otomatis sesuai aturan (rules) yang Anda buat.</li>
                            <li><strong>Data Kontak CRM:</strong> Username atau nomor kontak pelanggan yang berinteraksi dengan otomasi Anda untuk dicatat dalam daftar prospek Anda.</li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-indigo-600" />
                            <span>3. Bagaimana Kami Menggunakan Data Anda</span>
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            <div className="p-4 rounded-xl bg-white border border-slate-200">
                                <div className="font-bold text-slate-900 text-xs mb-1">Menjalankan Auto-Reply Instan</div>
                                <div className="text-xs text-slate-500">Mendeteksi kata kunci (misal: "MAU", "INFO") di komentar dan mengirim link kupon/katalog melalui DM.</div>
                            </div>
                            <div className="p-4 rounded-xl bg-white border border-slate-200">
                                <div className="font-bold text-slate-900 text-xs mb-1">Pemeriksaan Follow Gate</div>
                                <div className="text-xs text-slate-500">Memeriksa apakah akun yang berkomentar sudah mengikuti akun Anda sebelum link dikirimkan.</div>
                            </div>
                            <div className="p-4 rounded-xl bg-white border border-slate-200">
                                <div className="font-bold text-slate-900 text-xs mb-1">Analitik & Performa</div>
                                <div className="text-xs text-slate-500">Menghitung jumlah pesan terkirim, rasio konversi klik, dan kecepatan respon server.</div>
                            </div>
                            <div className="p-4 rounded-xl bg-white border border-slate-200">
                                <div className="font-bold text-slate-900 text-xs mb-1">Pengelolaan Kontak Leads</div>
                                <div className="text-xs text-slate-500">Menyimpan daftar kontak pembeli agar Anda dapat mengekspor atau melakukan follow-up pesan.</div>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Lock className="w-5 h-5 text-indigo-600" />
                            <span>4. Keamanan & Enkripsi Data</span>
                        </h2>
                        <p>
                            Semua token akses Meta Graph API disimpan di basis data menggunakan enkripsi standar industri (AES-256). Komunikasi data antara server kami, Meta, dan browser Anda selalu dilindungi dengan protokol aman <strong>HTTPS / TLS 1.3</strong>.
                        </p>
                        <p>
                            Kami <strong>tidak pernah menjual, menyewakan, atau membagikan</strong> data pribadi maupun data kontak audiens Anda kepada pihak ketiga pengiklan mana pun.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                            <span>5. Penghapusan Data Pengguna (User Data Deletion)</span>
                        </h2>
                        <p>
                            Sesuai dengan Kebijakan Pengembang Meta (Meta Platform Terms), Anda memiliki hak penuh untuk meminta penghapusan seluruh data akun, token otentikasi, dan histori pesan Anda kapan saja.
                        </p>
                        <p>
                            Panduan lengkap dan formulir penghapusan data otomatis dapat diakses di halaman resmi kami:
                        </p>
                        <div className="pt-1">
                            <Link
                                href="/data-deletion"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all shadow-xs"
                            >
                                <span>Instruksi Penghapusan Data Pengguna →</span>
                            </Link>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Mail className="w-5 h-5 text-indigo-600" />
                            <span>6. Hubungi Kami</span>
                        </h2>
                        <p>
                            Jika Anda memiliki pertanyaan seputar Kebijakan Privasi ini, perlakuan data Anda, atau ingin mengajukan pertanyaan hak privasi, silakan hubungi tim perlindungan data kami melalui:
                        </p>
                        <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs space-y-1">
                            <div><strong>Platform:</strong> {appName} Automation System</div>
                            <div><strong>Email Dukungan:</strong> support@creatorflow.id / privacy@creatorflow.id</div>
                            <div><strong>Situs Web:</strong> {appUrl}</div>
                        </div>
                    </section>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
                <div className="max-w-4xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>© {new Date().getFullYear()} {appName}. Hak Cipta Dilindungi.</div>
                    <div className="flex items-center gap-4 font-medium">
                        <Link href="/privacy" className="text-slate-900 underline">Kebijakan Privasi</Link>
                        <Link href="/terms" className="hover:text-slate-900">Syarat Layanan</Link>
                        <Link href="/data-deletion" className="hover:text-slate-900">Hapus Data</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
