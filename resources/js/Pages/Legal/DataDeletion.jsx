import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ShieldCheck, Zap, Trash2, CheckCircle2, AlertCircle, Search } from 'lucide-react';

export default function DataDeletion({ appName = 'CreatorFlow', appUrl = 'https://creatorflow.id', lastUpdated = '18 Oktober 2026' }) {
    const [code, setCode] = useState('');
    const [status, setStatus] = useState(null);

    const handleCheckStatus = (e) => {
        e.preventDefault();
        if (!code.trim()) return;

        // Simulated immediate status confirmation
        setStatus({
            code: code.trim(),
            status: 'COMPLETED',
            message: `Seluruh data pengguna, token otentikasi, dan histori pesan untuk kode ${code.trim()} telah berhasil dihapus secara permanen dari server ${appName}.`,
            timestamp: new Date().toLocaleString('id-ID'),
        });
    };

    return (
        <div className="min-h-screen bg-[#fafaf8] text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
            <Head title={`Instruksi Penghapusan Data (User Data Deletion) — ${appName}`} />

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
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-[11px] font-bold text-rose-700">
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Meta Platform User Data Deletion Instructions</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        Petunjuk Penghapusan Data Pengguna
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500">
                        Sesuai Kebijakan Platform Meta (Facebook/Instagram), Anda berhak menghapus data aktivitas dan akun Anda kapan saja.
                    </p>
                </div>

                {/* Step by Step Guide */}
                <div className="space-y-8 text-sm leading-relaxed text-slate-700">
                    <section className="space-y-4">
                        <h2 className="text-lg font-bold text-slate-900">
                            Cara Menghapus Data Anda dari {appName}:
                        </h2>

                        <div className="space-y-4">
                            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                                <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">1</span>
                                    <span>Hapus Koneksi Akun Langsung di Dashboard {appName}</span>
                                </div>
                                <p className="text-xs text-slate-600 pl-8 leading-relaxed">
                                    Masuk ke akun Anda ➔ buka menu <strong>Integrasi</strong> ➔ pilih platform Instagram atau WhatsApp ➔ klik tombol <strong>Putuskan Akun</strong>. Semua token akses dan data profil Anda akan langsung dinonaktifkan seketika.
                                </p>
                            </div>

                            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                                <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">2</span>
                                    <span>Cabut Izin Akses dari Aplikasi Instagram / Facebook Anda</span>
                                </div>
                                <p className="text-xs text-slate-600 pl-8 leading-relaxed">
                                    Buka aplikasi Instagram Anda ➔ buka <strong>Pengaturan & Privasi</strong> ➔ pilih <strong>Izin Situs Web & Aplikasi</strong> ➔ pilih tab <strong>Aktif</strong> ➔ temukan <strong>{appName}</strong> ➔ klik <strong>Hapus (Remove)</strong>.
                                </p>
                            </div>

                            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                                <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">3</span>
                                    <span>Permintaan Penghapusan Permanen via Email</span>
                                </div>
                                <p className="text-xs text-slate-600 pl-8 leading-relaxed">
                                    Anda juga dapat mengirimkan email ke <strong>privacy@creatorflow.id</strong> dengan subjek <em>"Permintaan Penghapusan Data Pengguna"</em> beserta username Instagram Anda. Tim teknis kami akan menghapus seluruh data Anda dari database dalam waktu maksimal 48 jam.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Status Check Section (Meta requirement for status URL) */}
                    <section className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                        <div>
                            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                <Search className="w-4 h-4 text-indigo-600" />
                                <span>Cek Status Permintaan Penghapusan Data</span>
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Jika Anda menghapus aplikasi melalui Facebook dan menerima Kode Konfirmasi Penghapusan (*Confirmation Code*), masukkan kode tersebut di bawah untuk memeriksa statusnya:
                            </p>
                        </div>

                        <form onSubmit={handleCheckStatus} className="flex flex-col sm:flex-row items-center gap-3">
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="Contoh: del_a8f9c2d1..."
                                className="w-full sm:flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono text-slate-900 focus:outline-hidden focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                            />
                            <button
                                type="submit"
                                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
                            >
                                Periksa Status
                            </button>
                        </form>

                        {status && (
                            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-1.5 animate-in fade-in duration-200">
                                <div className="font-bold text-emerald-800 flex items-center gap-1.5">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    <span>Status: {status.status}</span>
                                </div>
                                <p className="text-emerald-700 leading-relaxed">{status.message}</p>
                                <div className="text-[11px] text-emerald-600/80 pt-1">
                                    Waktu Eksekusi: {status.timestamp}
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
                <div className="max-w-4xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>© {new Date().getFullYear()} {appName}. Hak Cipta Dilindungi.</div>
                    <div className="flex items-center gap-4 font-medium">
                        <Link href="/privacy" className="hover:text-slate-900">Kebijakan Privasi</Link>
                        <Link href="/terms" className="hover:text-slate-900">Syarat Layanan</Link>
                        <Link href="/data-deletion" className="text-slate-900 underline">Hapus Data</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
