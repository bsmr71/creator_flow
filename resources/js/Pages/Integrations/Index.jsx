import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import PlatformIcon from '../../Components/PlatformIcon';
import StatusBadge from '../../Components/StatusBadge';
import {
    Layers,
    CheckCircle2,
    Copy,
    Check,
    RefreshCw,
    ShieldCheck,
    Zap,
    ExternalLink,
    AlertCircle,
    Key,
    Sliders,
    Send,
    Play
} from 'lucide-react';

export default function IntegrationsIndex({
    platforms = [],
    webhookUrl,
    webhookVerifyToken,
    metaAppConfigured = false,
    metaAppId = '',
    whatsappConfigured = false
}) {
    const { flash } = usePage().props;
    const [copiedUrl, setCopiedUrl] = useState(false);
    const [copiedToken, setCopiedToken] = useState(false);

    // Manual Token Input State
    const [showManualModal, setShowManualModal] = useState(false);
    const [manualPlatform, setManualPlatform] = useState('instagram');
    const [manualAccountId, setManualAccountId] = useState('');
    const [manualUsername, setManualUsername] = useState('');
    const [manualAccessToken, setManualAccessToken] = useState('');
    const [submittingManual, setSubmittingManual] = useState(false);

    // Test Webhook Simulation State
    const [testComment, setTestComment] = useState('MAU link diskon');
    const [testingWebhook, setTestingWebhook] = useState(false);
    const [testResult, setTestResult] = useState(null);

    const handleCopyUrl = () => {
        navigator.clipboard.writeText(webhookUrl);
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2000);
    };

    const handleCopyToken = () => {
        navigator.clipboard.writeText(webhookVerifyToken);
        setCopiedToken(true);
        setTimeout(() => setCopiedToken(false), 2000);
    };

    const handleOAuthConnect = (platformId) => {
        if (platformId === 'instagram') {
            window.location.href = '/connect/instagram';
        } else if (platformId === 'facebook') {
            window.location.href = '/integrations/meta/connect?provider=facebook';
        } else {
            setManualPlatform(platformId);
            setShowManualModal(true);
        }
    };



    const handleManualSubmit = (e) => {
        e.preventDefault();
        setSubmittingManual(true);

        router.post(
            '/integrations/manual-connect',
            {
                platform: manualPlatform,
                account_id: manualAccountId,
                username: manualUsername,
                access_token: manualAccessToken,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setShowManualModal(false);
                    setManualAccountId('');
                    setManualUsername('');
                    setManualAccessToken('');
                    setSubmittingManual(false);
                },
                onError: () => {
                    setSubmittingManual(false);
                }
            }
        );
    };

    const handleTestWebhook = async () => {
        setTestingWebhook(true);
        setTestResult(null);

        try {
            // Send test payload to the Meta webhook endpoint
            const res = await fetch('/api/webhooks/meta', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    object: 'instagram',
                    entry: [
                        {
                            id: 'simulated_account_123',
                            time: Date.now(),
                            changes: [
                                {
                                    field: 'comments',
                                    value: {
                                        id: 'comment_' + Date.now(),
                                        text: testComment,
                                        from: {
                                            id: 'test_user_456',
                                            username: 'test_buyer'
                                        },
                                        media: {
                                            id: 'reel_media_789'
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                })
            });

            const text = await res.text();
            setTestResult({
                status: res.status,
                statusText: res.statusText,
                body: text,
                success: res.ok
            });
        } catch (err) {
            setTestResult({
                status: 500,
                statusText: 'Error',
                body: err.message,
                success: false
            });
        } finally {
            setTestingWebhook(false);
        }
    };

    return (
        <AppLayout title="Integrasi Platform & Webhook Resmi">
            <Head title="Integrations — CreatorFlow" />

            <div className="space-y-8 max-w-6xl">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-[#18181b] tracking-tight">
                            Integrasi Akun Media Sosial Resmi
                        </h2>
                        <p className="text-xs text-[#71717a] mt-1">
                            Hubungkan akun Instagram Professional & WhatsApp Business API resmi Meta untuk otomatisasi real-time.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <a
                            href="/connect/instagram"
                            className="px-4 py-2 rounded-xl bg-[#18181b] hover:bg-[#27272a] text-white font-semibold text-xs flex items-center gap-2 border border-[#18181b] transition-all shadow-xs cursor-pointer"
                        >
                            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            <span>Sambungkan Akun Langsung (@username)</span>
                        </a>
                        <button
                            type="button"
                            onClick={() => setShowManualModal(true)}
                            className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5 border border-slate-200 transition-all shadow-xs cursor-pointer"
                            title="Input Token Manual"
                        >
                            <Key className="w-3.5 h-3.5 text-slate-500" />
                            <span className="hidden sm:inline">Input Token</span>
                        </button>
                    </div>
                </div>


                {/* API Status Notice */}
                {!metaAppConfigured && (
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3 shadow-xs">
                        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <span className="font-bold text-amber-900">Konfigurasi Kredensial Meta App:</span>
                            <p className="text-amber-800 leading-relaxed">
                                Untuk tombol login resmi otomatis <strong>"Connect with Facebook / Instagram"</strong>, Anda dapat mengisi <code className="bg-amber-100 px-1 py-0.5 rounded text-[11px] font-mono">META_APP_ID</code> dan <code className="bg-amber-100 px-1 py-0.5 rounded text-[11px] font-mono">META_APP_SECRET</code> di file <code className="bg-amber-100 px-1 py-0.5 rounded text-[11px] font-mono">.env</code>. Namun Anda tetap dapat langsung menghubungkan akun dengan menekan tombol <strong>"Input Access Token Manual"</strong> di atas.
                            </p>
                        </div>
                    </div>
                )}

                {/* Platform Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {platforms.map((p) => {
                        const isConnected = p.account?.is_connected;

                        return (
                            <div
                                key={p.id}
                                className="glass-card rounded-2xl p-6 space-y-5 border border-[#e4e4e7] flex flex-col justify-between"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <PlatformIcon platform={p.id} className="w-6 h-6" showBg />
                                            <div>
                                                <h3 className="text-base font-bold text-[#18181b]">{p.name}</h3>
                                                <span className="text-[10px] text-[#52525b] font-semibold px-2 py-0.5 rounded-full bg-[#f4f4f5] border border-[#e4e4e7]">
                                                    {p.badge}
                                                </span>
                                            </div>
                                        </div>

                                        <StatusBadge status={isConnected ? 'connected' : 'disconnected'} />
                                    </div>

                                    <p className="text-xs text-[#71717a] leading-relaxed">
                                        {p.description}
                                    </p>

                                    {/* Features Checklist */}
                                    <div className="space-y-1.5 pt-2 border-t border-[#e4e4e7]">
                                        <span className="text-[10px] font-bold text-[#a1a1aa] uppercase tracking-wider">
                                            Fitur yang Didukung:
                                        </span>
                                        <div className="grid grid-cols-2 gap-1.5 text-xs text-[#52525b]">
                                            {p.features?.map((f, idx) => (
                                                <div key={idx} className="flex items-center gap-1.5 text-[11px]">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                                    <span className="truncate">{f}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Connected Account Metadata */}
                                    {isConnected && p.account && (
                                        <div className="p-3 rounded-2xl bg-[#fafaf8] border border-[#e4e4e7] flex items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-full bg-[#18181b] text-white font-bold text-xs flex items-center justify-center">
                                                    @{p.account.username.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="text-xs font-bold text-[#18181b]">@{p.account.username}</div>
                                                    <div className="text-[10px] text-emerald-700 font-medium">
                                                        API Terhubung • ID: {p.account.account_id || 'Active'}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-mono text-[#a1a1aa]">Official Graph API</span>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="pt-3 border-t border-[#e4e4e7] flex items-center gap-3">
                                    {isConnected ? (
                                        <button
                                            type="button"
                                            onClick={() => router.post(`/integrations/${p.id}/toggle`, {}, { preserveScroll: true })}
                                            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all bg-white hover:bg-rose-50 text-[#71717a] hover:text-rose-700 border border-[#e4e4e7] shadow-xs"
                                        >
                                            Putuskan Hubungan Akun
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => handleOAuthConnect(p.id)}
                                            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer ${
                                                p.id === 'instagram'
                                                    ? 'bg-linear-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 text-white'
                                                    : p.id === 'facebook'
                                                        ? 'bg-[#1877F2] hover:bg-[#166fe5] text-white shadow-xs'
                                                        : p.id === 'tiktok'
                                                            ? 'bg-black hover:bg-zinc-800 text-white shadow-xs'
                                                            : p.id === 'whatsapp'
                                                                ? 'bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xs'
                                                                : 'bg-[#18181b] hover:bg-[#27272a] text-white'
                                            }`}
                                        >
                                            <Zap className="w-3.5 h-3.5" />
                                            <span>
                                                {p.id === 'instagram' && 'Login dengan Instagram'}
                                                {p.id === 'facebook' && 'Login dengan Facebook'}
                                                {p.id === 'tiktok' && 'Login dengan TikTok'}
                                                {p.id === 'whatsapp' && 'Hubungkan WhatsApp'}
                                            </span>
                                        </button>


                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Webhook Configuration & Testing Card */}
                <div className="glass-card p-6 sm:p-8 rounded-2xl space-y-6 border border-[#e4e4e7]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e4e4e7] pb-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#fafaf8] border border-[#e4e4e7] text-[#18181b] flex items-center justify-center">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-[#18181b]">Meta Webhook Endpoint URL Resmi</h3>
                                <p className="text-xs text-[#71717a]">
                                    Daftarkan URL dan Verify Token ini di Meta Developer Portal (<a href="https://developers.facebook.com" target="_blank" rel="noreferrer" className="text-[#18181b] underline font-medium">developers.facebook.com</a>) untuk menerima event komentar Reel & DM secara real-time.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Webhook URL Input */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#71717a] uppercase tracking-wider block">
                                Webhook Callback URL:
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    readOnly
                                    value={webhookUrl}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#fafaf8] border border-[#e4e4e7] text-xs font-mono text-[#18181b] focus:outline-hidden"
                                />
                                <button
                                    type="button"
                                    onClick={handleCopyUrl}
                                    className="px-4 py-2.5 rounded-xl bg-[#18181b] hover:bg-[#27272a] text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-xs"
                                >
                                    {copiedUrl ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    <span>{copiedUrl ? 'Tersalin!' : 'Salin URL'}</span>
                                </button>
                            </div>
                        </div>

                        {/* Verify Token Input */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#71717a] uppercase tracking-wider block">
                                Verify Token:
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    readOnly
                                    value={webhookVerifyToken}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#fafaf8] border border-[#e4e4e7] text-xs font-mono text-emerald-700 font-semibold focus:outline-hidden"
                                />
                                <button
                                    type="button"
                                    onClick={handleCopyToken}
                                    className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#f4f4f5] text-[#18181b] border border-[#e4e4e7] font-semibold text-xs flex items-center gap-1.5 transition-all shadow-xs"
                                >
                                    {copiedToken ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    <span>{copiedToken ? 'Tersalin!' : 'Salin Token'}</span>
                                </button>
                            </div>
                        </div>

                        {/* Interactive Webhook Simulator */}
                        <div className="p-4 rounded-2xl bg-[#fafaf8] border border-[#e4e4e7] space-y-3 mt-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-[#18181b] flex items-center gap-2">
                                    <Play className="w-3.5 h-3.5 text-emerald-600" />
                                    Uji Coba Pengiriman Payload Webhook (Simulasi Meta Event)
                                </span>
                                <span className="text-[10px] text-[#a1a1aa] font-mono">POST /api/webhooks/meta</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={testComment}
                                    onChange={(e) => setTestComment(e.target.value)}
                                    placeholder="Ketik teks komentar untuk uji pemicu otomasi..."
                                    className="flex-1 px-4 py-2 rounded-xl bg-white border border-[#e4e4e7] text-xs text-[#18181b] focus:outline-hidden focus:border-[#18181b]"
                                />
                                <button
                                    type="button"
                                    onClick={handleTestWebhook}
                                    disabled={testingWebhook}
                                    className="px-4 py-2 rounded-xl bg-[#18181b] hover:bg-[#27272a] text-white font-semibold text-xs flex items-center gap-1.5 disabled:opacity-50 shadow-xs"
                                >
                                    <Send className="w-3.5 h-3.5" />
                                    <span>{testingWebhook ? 'Mengirim...' : 'Kirim Event Webhook'}</span>
                                </button>
                            </div>

                            {testResult && (
                                <div className={`p-3 rounded-xl text-xs font-mono border ${
                                    testResult.success
                                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                        : 'bg-rose-50 text-rose-800 border-rose-200'
                                }`}>
                                    Status: {testResult.status} ({testResult.statusText}) • Response: {testResult.body}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Manual Token Input Modal */}
                {showManualModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
                        <div className="bg-white border border-[#e4e4e7] rounded-2xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl">
                            <div className="flex items-center justify-between border-b border-[#e4e4e7] pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-[#fafaf8] border border-[#e4e4e7] text-[#18181b] flex items-center justify-center">
                                        <Key className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-base font-bold text-[#18181b]">Hubungkan via Access Token API</h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowManualModal(false)}
                                    className="text-[#71717a] hover:text-[#18181b]"
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleManualSubmit} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-[#18181b]">Platform:</label>
                                    <select
                                        value={manualPlatform}
                                        onChange={(e) => setManualPlatform(e.target.value)}
                                        className="w-full px-3 py-2.5 rounded-xl bg-[#fafaf8] border border-[#e4e4e7] text-xs font-semibold text-[#18181b]"
                                    >
                                        <option value="instagram">Instagram Professional</option>
                                        <option value="facebook">Facebook Messenger / Page</option>
                                        <option value="tiktok">TikTok for Business</option>
                                        <option value="whatsapp">WhatsApp Business API</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-[#18181b]">
                                        {manualPlatform === 'whatsapp' ? 'Nomor WhatsApp Bisnis:' : `Username ${manualPlatform.charAt(0).toUpperCase() + manualPlatform.slice(1)}:`}
                                    </label>
                                    <div className="relative">
                                        {manualPlatform !== 'whatsapp' && (
                                            <span className="absolute left-3 top-2.5 text-xs text-[#a1a1aa] font-bold">@</span>
                                        )}
                                        <input
                                            type="text"
                                            required
                                            value={manualUsername}
                                            onChange={(e) => setManualUsername(e.target.value.replace(/^@/, ''))}
                                            placeholder={manualPlatform === 'whatsapp' ? '081234567890 atau +62812...' : 'username_akun_anda'}
                                            className={`w-full py-2.5 rounded-xl bg-[#fafaf8] border border-[#e4e4e7] text-xs font-semibold text-[#18181b] focus:outline-hidden focus:border-[#18181b] ${manualPlatform === 'whatsapp' ? 'px-3' : 'pl-7 pr-3'}`}
                                        />
                                    </div>
                                    <p className="text-[10px] text-[#71717a]">
                                        Tidak perlu token atau password. Akun akan langsung terhubung aktif.
                                    </p>
                                </div>



                                <div className="flex items-center gap-3 pt-3 border-t border-[#e4e4e7]">
                                    <button
                                        type="button"
                                        onClick={() => setShowManualModal(false)}
                                        className="flex-1 py-2.5 rounded-xl bg-white hover:bg-[#f4f4f5] text-[#18181b] border border-[#e4e4e7] text-xs font-semibold"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submittingManual}
                                        className="flex-1 py-2.5 rounded-xl bg-[#18181b] hover:bg-[#27272a] text-white text-xs font-bold disabled:opacity-50 shadow-xs"
                                    >
                                        {submittingManual ? 'Menyimpan...' : 'Simpan & Aktifkan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
