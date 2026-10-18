import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import PlatformIcon from '../../Components/PlatformIcon';
import StatusBadge from '../../Components/StatusBadge';
import PhoneMockup from '../../Components/PhoneMockup';
import {
    ArrowLeft,
    Zap,
    Send,
    Play,
    Pause,
    MousePointerClick,
    Users,
    Clock,
    CheckCircle2,
    AlertCircle,
    Sparkles
} from 'lucide-react';

export default function AutomationShow({ automation, socialAccounts }) {
    const trigger = automation.triggers?.[0];
    const action = automation.actions?.[0];

    const [testComment, setTestComment] = useState('Mau dong link ebook gratisnya kak!');
    const [isSimulating, setIsSimulating] = useState(false);
    const [simResult, setSimResult] = useState(null);

    const handleToggle = () => {
        router.post(`/automations/${automation.id}/toggle`, {}, {
            preserveScroll: true,
        });
    };

    const handleRunSimulation = async (e) => {
        e.preventDefault();
        setIsSimulating(true);
        setSimResult(null);

        try {
            const response = await fetch('/automations/simulate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    automation_id: automation.id,
                    test_comment: testComment,
                }),
            });
            const data = await response.json();
            setSimResult(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSimulating(false);
        }
    };

    return (
        <AppLayout title={`Detail Otomasi: ${automation.name}`}>
            <Head title={`${automation.name} — CreatorFlow`} />

            <div className="space-y-6">
                {/* Back Button & Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <Link
                        href="/automations"
                        className="inline-flex items-center gap-2 text-xs font-semibold text-[#71717a] hover:text-[#18181b] transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Kembali ke Daftar Otomasi</span>
                    </Link>

                    <button
                        onClick={handleToggle}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all self-start sm:self-auto shadow-xs cursor-pointer ${
                            automation.status === 'active'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                    >
                        {automation.status === 'active' ? (
                            <>
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span>Status: Aktif Berjalan</span>
                            </>
                        ) : (
                            <>
                                <Pause className="w-3.5 h-3.5" />
                                <span>Status: Dijeda</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Automation Summary Card */}
                <div className="glass-card p-6 rounded-2xl space-y-6 bg-white border border-[#e4e4e7] shadow-xs">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e4e4e7] pb-5">
                        <div className="flex items-center gap-3">
                            <PlatformIcon platform={automation.social_account?.platform} className="w-6 h-6" showBg />
                            <div>
                                <h2 className="text-lg font-bold text-[#18181b]">{automation.name}</h2>
                                <p className="text-xs text-[#71717a]">
                                    Terkoneksi ke akun @{automation.social_account?.username} ({automation.social_account?.platform})
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 text-center">
                            <div className="p-3 rounded-xl bg-[#fafaf8] border border-[#e4e4e7]">
                                <div className="text-[10px] text-[#71717a]">DM Terkirim</div>
                                <div className="font-mono font-bold text-[#18181b] text-sm">{automation.total_sent}</div>
                            </div>
                            <div className="p-3 rounded-xl bg-[#fafaf8] border border-[#e4e4e7]">
                                <div className="text-[10px] text-[#71717a]">Total Klik</div>
                                <div className="font-mono font-bold text-[#18181b] text-sm">{automation.total_clicks}</div>
                            </div>
                            <div className="p-3 rounded-xl bg-[#fafaf8] border border-[#e4e4e7]">
                                <div className="text-[10px] text-[#71717a]">Leads Didapat</div>
                                <div className="font-mono font-bold text-emerald-700 text-sm">{automation.total_leads}</div>
                            </div>
                        </div>
                    </div>

                    {/* Flow Diagram Representation */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Trigger Info */}
                        <div className="p-5 rounded-2xl bg-[#fafaf8] border border-[#e4e4e7] space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-[#18181b] uppercase tracking-wider">
                                    Trigger Kata Kunci
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-200 text-zinc-800 font-mono">
                                    contains
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {trigger?.keywords?.map((kw, i) => (
                                    <span
                                        key={i}
                                        className="px-2.5 py-1 rounded-lg bg-zinc-100 border border-zinc-200 text-zinc-900 font-mono text-xs font-semibold"
                                    >
                                        "{kw}"
                                    </span>
                                ))}
                            </div>
                            <p className="text-xs text-[#71717a] pt-1">
                                Jika komentar atau pesan memuat salah satu kata kunci di atas, bot akan langsung mengirimkan balasan.
                            </p>
                        </div>

                        {/* Action Info */}
                        <div className="p-5 rounded-2xl bg-[#fafaf8] border border-[#e4e4e7] space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-[#18181b] uppercase tracking-wider">
                                    Action Pesan DM
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono">
                                    delay: {action?.delay_seconds || 1}s
                                </span>
                            </div>
                            <p className="text-xs text-[#27272a] whitespace-pre-line bg-white p-3 rounded-xl border border-[#e4e4e7]">
                                {action?.message_body}
                            </p>
                            {action?.buttons && action.buttons.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {action.buttons.map((btn, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1 rounded-lg bg-[#18181b] text-white text-xs font-semibold shadow-xs"
                                        >
                                            {btn.title}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Interactive Live Testing Tool */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-7 glass-card p-6 rounded-2xl space-y-5 bg-white border border-[#e4e4e7] shadow-xs">
                        <div className="flex items-center gap-2.5 border-b border-[#e4e4e7] pb-3">
                            <Sparkles className="w-5 h-5 text-[#18181b]" />
                            <div>
                                <h3 className="text-sm font-bold text-[#18181b]">Simulator Uji Coba Respon DM</h3>
                                <p className="text-xs text-[#71717a]">
                                    Ketik komentar acak untuk menguji apakah trigger mendeteksi dan merespon dengan benar.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleRunSimulation} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-[#3f3f46]">
                                    Ketik Komentar Percobaan:
                                </label>
                                <input
                                    type="text"
                                    value={testComment}
                                    onChange={(e) => setTestComment(e.target.value)}
                                    placeholder="Contoh: Keren banget min, MAU ebooknya dong"
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#fafaf8] border border-[#e4e4e7] text-xs text-[#18181b] focus:outline-hidden focus:border-[#18181b] transition-all"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSimulating}
                                className="px-5 py-2.5 rounded-xl bg-[#18181b] hover:bg-[#27272a] text-white font-semibold text-xs shadow-xs transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                            >
                                <Zap className="w-4 h-4 fill-white" />
                                <span>{isSimulating ? 'Memproses Simulasi...' : 'Uji Respon Bot'}</span>
                            </button>
                        </form>

                        {/* Simulation Feedback Alert */}
                        {simResult && (
                            <div
                                className={`p-4 rounded-2xl border text-xs space-y-3 ${
                                    simResult.success
                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                                        : 'bg-rose-50 border-rose-200 text-rose-900'
                                }`}
                            >
                                <div className="flex items-center gap-2 font-bold">
                                    {simResult.success ? (
                                        <>
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                            <span>Kata Kunci Cocok! Trigger "{simResult.matched_keyword}" Terdeteksi</span>
                                        </>
                                    ) : (
                                        <>
                                            <AlertCircle className="w-4 h-4 text-rose-600" />
                                            <span>Gagal Mencocokkan Trigger</span>
                                        </>
                                    )}
                                </div>
                                <p className="text-[#3f3f46]">{simResult.message || 'Pesan balasan DM berhasil digenerate dan dikirim.'}</p>

                                {simResult.features_triggered && (
                                    <div className="bg-white/80 rounded-xl p-3 border border-emerald-200/60 space-y-2 text-[11px] text-slate-800">
                                        <div className="font-bold text-slate-900 border-b border-slate-100 pb-1">
                                            Fitur yang Dieksekusi Sistem:
                                        </div>
                                        {simResult.features_triggered.public_reply && (
                                            <div className="flex items-start gap-1.5">
                                                <span className="font-semibold text-emerald-700">✓ Balasan Komentar Publik:</span>
                                                <span className="italic text-slate-600">"{simResult.features_triggered.public_reply}"</span>
                                            </div>
                                        )}
                                        {simResult.features_triggered.opening_dm && (
                                            <div className="flex items-start gap-1.5">
                                                <span className="font-semibold text-emerald-700">✓ Opening DM:</span>
                                                <span className="text-slate-600">"{simResult.features_triggered.opening_dm}"</span>
                                            </div>
                                        )}
                                        {simResult.features_triggered.require_follow && (
                                            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                                                <span>✓ Wajib Follow Gate: Aktif (Verifikasi status follower)</span>
                                            </div>
                                        )}
                                        {simResult.features_triggered.collect_email && (
                                            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                                                <span>✓ Tangkap Email Lead: Aktif (Tersimpan ke CRM Kontak)</span>
                                            </div>
                                        )}
                                        <div className="flex items-start gap-1.5">
                                            <span className="font-semibold text-emerald-700">✓ DM Utama & Link:</span>
                                            <span className="text-slate-600">
                                                {simResult.dm_preview?.message?.substring(0, 80)}... ({simResult.dm_preview?.buttons?.length || 0} tombol CTA)
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Log History */}
                        <div className="space-y-3 pt-3">
                            <h4 className="text-xs font-semibold text-[#71717a] uppercase tracking-wider">
                                Riwayat Log Pengiriman Terakhir
                            </h4>
                            <div className="divide-y divide-[#e4e4e7] rounded-xl bg-[#fafaf8] border border-[#e4e4e7] overflow-hidden text-xs">
                                {automation.logs?.map((log) => (
                                    <div key={log.id} className="p-3 flex items-center justify-between">
                                        <div>
                                            <div className="font-semibold text-[#18181b]">{log.triggered_by}</div>
                                            <div className="text-[10px] text-[#71717a] font-mono">
                                                Respon: {log.execution_time_ms}ms
                                            </div>
                                        </div>
                                        <StatusBadge status={log.status} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Phone Mockup with Simulation Preview */}
                    <div className="lg:col-span-5 sticky top-24">
                        <PhoneMockup
                            platform={automation.social_account?.platform || 'instagram'}
                            accountName={automation.social_account?.username || 'alex.creator'}
                            messageBody={action?.message_body?.replace('{{name}}', 'Alex')}
                            triggerKeyword={testComment}
                            buttons={action?.buttons}
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
