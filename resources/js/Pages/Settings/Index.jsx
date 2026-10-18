import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import {
    Settings,
    Copy,
    Check,
    Key,
    Shield,
    Users,
    CreditCard,
    Save,
    Sparkles,
    CheckCircle2
} from 'lucide-react';

export default function SettingsIndex({ workspace, apiToken, webhookSecret }) {
    const [copiedToken, setCopiedToken] = useState(false);
    const [copiedSecret, setCopiedSecret] = useState(false);

    const { data, setData, post, processing } = useForm({
        name: workspace.name || 'Creator Pro Studio',
        notification_email: workspace.settings?.notification_email || 'alex@creatorpro.id',
        timezone: workspace.settings?.timezone || 'Asia/Jakarta',
    });

    const handleCopy = (text, type) => {
        navigator.clipboard.writeText(text);
        if (type === 'token') {
            setCopiedToken(true);
            setTimeout(() => setCopiedToken(false), 2000);
        } else {
            setCopiedSecret(true);
            setTimeout(() => setCopiedSecret(false), 2000);
        }
    };

    const handleSaveWorkspace = (e) => {
        e.preventDefault();
        post('/settings');
    };

    return (
        <AppLayout title="Pengaturan & Developer API">
            <Head title="Settings — CreatorFlow" />

            <div className="space-y-8 max-w-4xl">
                {/* Header */}
                <div>
                    <h2 className="text-xl font-bold text-[#18181b] tracking-tight">
                        Pengaturan Workspace & Akses API
                    </h2>
                    <p className="text-xs text-[#71717a]">
                        Atur profil tim, kunci API developer, dan preferensi notifikasi otomasi kamu.
                    </p>
                </div>

                {/* Workspace Details Form */}
                <form onSubmit={handleSaveWorkspace} className="glass-card p-6 rounded-2xl space-y-5 border border-[#e4e4e7] bg-white shadow-xs">
                    <div className="flex items-center justify-between border-b border-[#e4e4e7] pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-[#f4f4f5] text-[#18181b] flex items-center justify-center font-bold text-xs border border-[#e4e4e7]">
                                🏢
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-[#18181b]">Profil Workspace</h3>
                                <p className="text-xs text-[#71717a]">Informasi utama tim dan zona waktu pengiriman pesan</p>
                            </div>
                        </div>

                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Paket Pro Aktif
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1.5">
                            <label className="text-[#3f3f46] font-semibold">Nama Workspace:</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full px-3.5 py-2 rounded-xl bg-[#fafaf8] border border-[#e4e4e7] text-[#18181b] focus:outline-hidden focus:border-[#18181b] transition-all"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[#3f3f46] font-semibold">Email Notifikasi Leads:</label>
                            <input
                                type="email"
                                value={data.notification_email}
                                onChange={(e) => setData('notification_email', e.target.value)}
                                className="w-full px-3.5 py-2 rounded-xl bg-[#fafaf8] border border-[#e4e4e7] text-[#18181b] focus:outline-hidden focus:border-[#18181b] transition-all"
                            />
                        </div>

                        <div className="space-y-1.5 sm:col-span-2">
                            <label className="text-[#3f3f46] font-semibold">Zona Waktu (Timezone):</label>
                            <select
                                value={data.timezone}
                                onChange={(e) => setData('timezone', e.target.value)}
                                className="w-full px-3.5 py-2 rounded-xl bg-[#fafaf8] border border-[#e4e4e7] text-[#18181b] focus:outline-hidden focus:border-[#18181b] transition-all"
                            >
                                <option value="Asia/Jakarta">WIB (Asia/Jakarta) UTC+7</option>
                                <option value="Asia/Makassar">WITA (Asia/Makassar) UTC+8</option>
                                <option value="Asia/Jayapura">WIT (Asia/Jayapura) UTC+9</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 py-2.5 rounded-xl bg-[#18181b] hover:bg-[#27272a] text-white font-semibold text-xs shadow-xs flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
                        >
                            <Save className="w-3.5 h-3.5" />
                            <span>{processing ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                        </button>
                    </div>
                </form>

                {/* Developer API & Webhooks */}
                <div className="glass-card p-6 rounded-2xl space-y-5 border border-[#e4e4e7] bg-white shadow-xs">
                    <div className="flex items-center gap-3 border-b border-[#e4e4e7] pb-4">
                        <div className="w-8 h-8 rounded-xl bg-[#f4f4f5] text-[#18181b] flex items-center justify-center border border-[#e4e4e7]">
                            <Key className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-[#18181b]">Developer API Key & Token</h3>
                            <p className="text-xs text-[#71717a]">
                                Gunakan token ini untuk integrasi ke CRM eksternal, Zapier, Make, atau backend custom kamu.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4 text-xs">
                        {/* API Token */}
                        <div className="space-y-1.5">
                            <label className="text-[#3f3f46] font-semibold">Live Secret API Key:</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="password"
                                    readOnly
                                    value={apiToken}
                                    className="flex-1 px-3.5 py-2 rounded-xl bg-[#fafaf8] border border-[#e4e4e7] text-[#18181b] font-mono text-xs focus:outline-hidden"
                                />
                                <button
                                    onClick={() => handleCopy(apiToken, 'token')}
                                    className="px-4 py-2 rounded-xl bg-white hover:bg-[#f4f4f5] text-[#18181b] border border-[#e4e4e7] font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                                >
                                    {copiedToken ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#71717a]" />}
                                    <span>{copiedToken ? 'Tersalin' : 'Salin Key'}</span>
                                </button>
                            </div>
                        </div>

                        {/* Webhook Secret */}
                        <div className="space-y-1.5">
                            <label className="text-[#3f3f46] font-semibold">Webhook Signing Secret:</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    readOnly
                                    value={webhookSecret}
                                    className="flex-1 px-3.5 py-2 rounded-xl bg-[#fafaf8] border border-[#e4e4e7] text-[#52525b] font-mono text-xs focus:outline-hidden"
                                />
                                <button
                                    onClick={() => handleCopy(webhookSecret, 'secret')}
                                    className="px-4 py-2 rounded-xl bg-white hover:bg-[#f4f4f5] text-[#18181b] border border-[#e4e4e7] font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                                >
                                    {copiedSecret ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#71717a]" />}
                                    <span>{copiedSecret ? 'Tersalin' : 'Salin Secret'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
