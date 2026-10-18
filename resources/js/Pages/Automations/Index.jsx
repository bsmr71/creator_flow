import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import PlatformIcon from '../../Components/PlatformIcon';
import StatusBadge from '../../Components/StatusBadge';
import {
    Plus,
    Search,
    Play,
    Pause,
    MoreVertical,
    Send,
    MousePointerClick,
    Users,
    Sparkles,
    ArrowUpRight,
    ExternalLink,
    Trash2
} from 'lucide-react';

export default function AutomationsIndex({ automations, socialAccounts }) {
    const [selectedPlatform, setSelectedPlatform] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filtered = automations.filter((auto) => {
        const matchesPlatform =
            selectedPlatform === 'all' || auto.social_account?.platform === selectedPlatform;
        const matchesSearch =
            auto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            auto.triggers?.[0]?.keywords?.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesPlatform && matchesSearch;
    });

    const handleToggle = (id) => {
        router.post(`/automations/${id}/toggle`, {}, {
            preserveScroll: true,
        });
    };

    const handleDelete = (id, name) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus otomasi "${name}"?`)) {
            router.delete(`/automations/${id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout title="Daftar Otomasi DM">
            <Head title="Automations — CreatorFlow" />

            <div className="space-y-6">
                {/* Header & Create Action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-[#18181b] tracking-tight">
                            Semua Otomasi Alur Percakapan
                        </h2>
                        <p className="text-xs text-[#71717a] mt-0.5">
                            Kelola trigger kata kunci, auto DM balasan, dan alur konversi leads kamu di semua platform.
                        </p>
                    </div>

                    <Link
                        href="/automations/create"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#18181b] hover:bg-[#27272a] text-white font-semibold text-xs shadow-xs transition-all self-start sm:self-auto"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Buat Otomasi Baru</span>
                    </Link>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#e4e4e7] shadow-xs">
                    <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
                        {['all', 'instagram', 'whatsapp', 'tiktok', 'facebook'].map((plat) => (
                            <button
                                key={plat}
                                onClick={() => setSelectedPlatform(plat)}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                                    selectedPlatform === plat
                                        ? 'bg-[#18181b] text-white shadow-xs'
                                        : 'bg-[#fafaf8] text-[#71717a] hover:text-[#18181b] hover:bg-[#f4f4f5] border border-[#e4e4e7]'
                                }`}
                            >
                                {plat === 'all' ? 'Semua Platform' : plat}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full sm:w-64">
                        <Search className="w-4 h-4 text-[#a1a1aa] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Cari nama atau keyword..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#fafaf8] border border-[#e4e4e7] text-xs text-[#18181b] placeholder-[#a1a1aa] focus:outline-hidden focus:border-[#18181b]"
                        />
                    </div>
                </div>

                {/* Automations Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((auto) => {
                        const trigger = auto.triggers?.[0];
                        const action = auto.actions?.[0];
                        const conversionRate = auto.total_sent > 0
                            ? Math.round((auto.total_leads / auto.total_sent) * 100)
                            : 0;

                        return (
                            <div
                                key={auto.id}
                                className="glass-card rounded-2xl p-5 space-y-4 flex flex-col justify-between"
                            >
                                <div className="space-y-3">
                                    {/* Top Row: Platform Badge + Status Toggle */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <PlatformIcon platform={auto.social_account?.platform} className="w-4 h-4" showBg />
                                            <span className="text-xs font-bold text-[#18181b]">
                                                @{auto.social_account?.username || 'Akun'}
                                            </span>
                                        </div>

                                        <button
                                            onClick={() => handleToggle(auto.id)}
                                            className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
                                                auto.status === 'active'
                                                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                                                    : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                                            }`}
                                        >
                                            {auto.status === 'active' ? (
                                                <>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                                                    <span>Aktif</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Pause className="w-3 h-3" />
                                                    <span>Jeda</span>
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    {/* Automation Title */}
                                    <Link
                                        href={`/automations/${auto.id}`}
                                        className="text-sm font-bold text-[#18181b] hover:text-[#3f3f46] transition-colors line-clamp-2"
                                    >
                                        {auto.name}
                                    </Link>

                                    {/* Trigger Keywords */}
                                    <div className="space-y-1.5">
                                        <span className="text-[10px] font-bold text-[#a1a1aa] uppercase tracking-wider">
                                            Trigger Keyword:
                                        </span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {trigger?.keywords?.map((kw, i) => (
                                                <span
                                                    key={i}
                                                    className="px-2 py-0.5 rounded-md bg-[#fafaf8] text-[#18181b] border border-[#e4e4e7] font-mono text-xs font-semibold"
                                                >
                                                    "{kw}"
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action Preview */}
                                    <div className="p-3 rounded-xl bg-[#fafaf8] border border-[#e4e4e7] text-xs text-[#52525b] line-clamp-2">
                                        {action?.message_body || 'Kirim pesan DM'}
                                    </div>
                                </div>

                                {/* Bottom Analytics Row & Detail Action */}
                                <div className="space-y-3 pt-3 border-t border-[#e4e4e7]">
                                    <div className="grid grid-cols-3 gap-2 text-center">
                                        <div className="p-2 rounded-lg bg-[#fafaf8] border border-[#e4e4e7]">
                                            <div className="text-[10px] text-[#71717a]">Terkirim</div>
                                            <div className="font-mono font-bold text-[#18181b] text-xs">{auto.total_sent}</div>
                                        </div>
                                        <div className="p-2 rounded-lg bg-[#fafaf8] border border-[#e4e4e7]">
                                            <div className="text-[10px] text-[#71717a]">Klik Link</div>
                                            <div className="font-mono font-bold text-[#18181b] text-xs">{auto.total_clicks}</div>
                                        </div>
                                        <div className="p-2 rounded-lg bg-[#fafaf8] border border-[#e4e4e7]">
                                            <div className="text-[10px] text-[#71717a]">Konversi</div>
                                            <div className="font-mono font-bold text-emerald-700 text-xs">{conversionRate}%</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/automations/${auto.id}`}
                                            className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-[#f4f4f5] text-[#18181b] border border-[#e4e4e7] text-xs font-semibold text-center transition-all flex items-center justify-center gap-1.5 shadow-xs"
                                        >
                                            <Sparkles className="w-3.5 h-3.5 text-[#18181b]" />
                                            <span>Buka Alur & Live Test</span>
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(auto.id, auto.name)}
                                            className="p-2 rounded-xl bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-[#e4e4e7] hover:border-rose-200 transition-all shadow-xs cursor-pointer"
                                            title="Hapus Otomasi Ini"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-3xl border border-[#e4e4e7] space-y-4 shadow-xs">
                        <div className="w-12 h-12 rounded-2xl bg-[#fafaf8] border border-[#e4e4e7] text-[#18181b] mx-auto flex items-center justify-center">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-bold text-[#18181b]">Tidak ada otomasi yang cocok</h3>
                        <p className="text-xs text-[#71717a] max-w-sm mx-auto">
                            Coba ubah kata pencarian atau pilih platform lain.
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
