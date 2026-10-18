import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';
import PlatformIcon from '../Components/PlatformIcon';
import StatusBadge from '../Components/StatusBadge';
import {
    Zap,
    Send,
    MousePointerClick,
    Users,
    TrendingUp,
    Clock,
    Plus,
    ArrowUpRight,
    CheckCircle2,
    Play,
    Pause,
    ChevronRight,
    Sparkles,
    ShieldCheck,
    MessageSquare,
    Heart,
    MessageCircle,
    Bookmark,
    Film,
    Layers,
    Trash2,
    X,
    ExternalLink,
    RefreshCw
} from 'lucide-react';

export default function Dashboard({
    workspace,
    currentUser,
    stats,
    automations = [],
    recentLogs = [],
    socialAccounts = [],
    chartData = [],
    instagramPosts = []
}) {
    const [showAddPostModal, setShowAddPostModal] = useState(false);
    const [newPostCaption, setNewPostCaption] = useState('');
    const [newPostPermalink, setNewPostPermalink] = useState('');
    const [newPostMediaType, setNewPostMediaType] = useState('IMAGE');
    const [newPostMediaUrl, setNewPostMediaUrl] = useState('');
    const [savingPost, setSavingPost] = useState(false);
    const [syncing, setSyncing] = useState(false);

    const handleSyncPosts = () => {
        setSyncing(true);
        router.post('/dashboard/instagram/sync', {}, {
            preserveScroll: true,
            onFinish: () => setSyncing(false),
        });
    };

    const handleToggle = (automationId) => {
        router.post(`/automations/${automationId}/toggle`, {}, {
            preserveScroll: true,
        });
    };

    const handleAddPost = (e) => {
        e.preventDefault();
        setSavingPost(true);
        router.post('/dashboard/instagram/posts', {
            caption: newPostCaption,
            permalink: newPostPermalink,
            media_type: newPostMediaType,
            media_url: newPostMediaUrl,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setShowAddPostModal(false);
                setNewPostCaption('');
                setNewPostPermalink('');
                setNewPostMediaUrl('');
                setSavingPost(false);
            },
            onError: () => setSavingPost(false)
        });
    };

    const handleDeletePost = (postId) => {
        if (confirm('Hapus postingan ini dari dashboard?')) {
            router.delete(`/dashboard/instagram/posts/${postId}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout title="Dashboard Utama">
            <Head title="Dashboard — CreatorFlow" />

            <div className="space-y-8">
                {/* Top Banner Alert (Original CreatorFlow Hero) */}
                <div className="relative rounded-3xl p-6 md:p-8 bg-[#18181b] text-white border border-[#27272a] overflow-hidden shadow-sm">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                    Bot Engine Ready • 140ms
                                </span>
                                <span className="text-xs text-zinc-500">|</span>
                                <span className="text-xs text-zinc-300">
                                    Instagram @{currentUser?.username || 'bsmrlab'} Terhubung
                                </span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                                Selamat datang kembali, @{currentUser?.username || 'bsmrlab'} 👋
                            </h2>
                            <p className="text-sm text-zinc-300 max-w-xl leading-relaxed">
                                Bot CreatorFlow siap membalas komentar publik dan mengirim DM link otomatis ke audiens di setiap postingan Instagram Anda.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                            <Link
                                href="/automations/create"
                                className="px-5 py-3 rounded-xl bg-white hover:bg-zinc-100 text-[#18181b] font-semibold text-xs shadow-xs active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Buat Otomasi Baru</span>
                            </Link>

                            <Link
                                href="/inbox"
                                className="px-5 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs border border-zinc-700 transition-all flex items-center gap-2 cursor-pointer"
                            >
                                <MessageSquare className="w-4 h-4 text-zinc-300" />
                                <span>Buka Inbox Chat</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Primary Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Stat 1: Total Sent */}
                    <div className="p-5 rounded-2xl bg-white border border-[#e4e4e7] space-y-3 shadow-xs">
                        <div className="flex items-center justify-between text-[#71717a] text-xs">
                            <span className="font-medium">Total DM Terkirim</span>
                            <div className="w-8 h-8 rounded-lg bg-[#f4f4f5] text-[#18181b] flex items-center justify-center">
                                <Send className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="flex items-baseline justify-between">
                            <span className="text-2xl font-bold text-[#18181b] font-mono">
                                {(stats?.totalSent || 0).toLocaleString()}
                            </span>
                            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                <TrendingUp className="w-3 h-3" /> +28%
                            </span>
                        </div>
                        <div className="text-[11px] text-[#71717a]">
                            Respon bot rata-rata <strong className="text-[#18181b]">{stats?.avgResponseTime || '140ms'}</strong>
                        </div>
                    </div>

                    {/* Stat 2: Total Clicks */}
                    <div className="p-5 rounded-2xl bg-white border border-[#e4e4e7] space-y-3 shadow-xs">
                        <div className="flex items-center justify-between text-[#71717a] text-xs">
                            <span className="font-medium">Total Klik Link</span>
                            <div className="w-8 h-8 rounded-lg bg-[#f4f4f5] text-[#18181b] flex items-center justify-center">
                                <MousePointerClick className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="flex items-baseline justify-between">
                            <span className="text-2xl font-bold text-[#18181b] font-mono">
                                {(stats?.totalClicks || 0).toLocaleString()}
                            </span>
                            <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                                {stats?.conversionRate || 0}% CTR
                            </span>
                        </div>
                        <div className="text-[11px] text-[#71717a]">
                            Konversi interaksi ke klik tautan CTA
                        </div>
                    </div>

                    {/* Stat 3: Total Leads */}
                    <div className="p-5 rounded-2xl bg-white border border-[#e4e4e7] space-y-3 shadow-xs">
                        <div className="flex items-center justify-between text-[#71717a] text-xs">
                            <span className="font-medium">Leads Tertangkap</span>
                            <div className="w-8 h-8 rounded-lg bg-[#f4f4f5] text-[#18181b] flex items-center justify-center">
                                <Users className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="flex items-baseline justify-between">
                            <span className="text-2xl font-bold text-[#18181b] font-mono">
                                {(stats?.totalLeads || 0).toLocaleString()}
                            </span>
                            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                Lead CRM
                            </span>
                        </div>
                        <div className="text-[11px] text-[#71717a]">
                            Tersimpan rapi di menu Kontak CRM
                        </div>
                    </div>

                    {/* Stat 4: Followers / Active Accounts */}
                    <div className="p-5 rounded-2xl bg-white border border-[#e4e4e7] space-y-3 shadow-xs">
                        <div className="flex items-center justify-between text-[#71717a] text-xs">
                            <span className="font-medium">Akun Instagram</span>
                            <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center">
                                <PlatformIcon platform="instagram" className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="flex items-baseline justify-between">
                            <span className="text-xl font-bold text-[#18181b] truncate max-w-[140px]">
                                @{currentUser?.username || 'bsmrlab'}
                            </span>
                            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                Terhubung
                            </span>
                        </div>
                        <div className="text-[11px] text-[#71717a]">
                            Followers: <strong className="text-[#18181b]">{stats?.totalFollowers || '1.6K'}</strong>
                        </div>
                    </div>
                </div>

                {/* Section: Semua Postingan Instagram yang Bisa Diotomasi */}
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e4e4e7] pb-3">
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-bold text-[#18181b] tracking-tight">
                                    Postingan & Reels @{currentUser?.username || 'Instagram'}
                                </h3>
                                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                                    {instagramPosts.length} Postingan Siap Diotomasi
                                </span>
                            </div>
                            <p className="text-xs text-[#71717a] mt-0.5">
                                Klik tombol <strong>"⚡ Otomasi Postingan Ini"</strong> untuk langsung mengatur pemicu komentar, auto public reply, dan kirim link DM otomatis.
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleSyncPosts}
                                disabled={syncing}
                                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                                title="Sinkronkan postingan dari Instagram"
                            >
                                <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${syncing ? 'animate-spin' : ''}`} />
                                <span>{syncing ? 'Sinkronisasi...' : 'Sinkronkan Postingan'}</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowAddPostModal(true)}
                                className="px-3.5 py-2 rounded-xl bg-[#18181b] hover:bg-[#27272a] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Tambah Postingan</span>
                            </button>
                        </div>
                    </div>

                    {/* Empty State when no posts */}
                    {instagramPosts.length === 0 ? (
                        <div className="rounded-2xl border-2 border-dashed border-[#e4e4e7] p-8 text-center bg-[#fafaf8] space-y-4">
                            <div className="w-12 h-12 rounded-2xl bg-white border border-[#e4e4e7] flex items-center justify-center mx-auto text-[#18181b] shadow-xs">
                                <Layers className="w-6 h-6" />
                            </div>
                            <div className="max-w-md mx-auto space-y-1">
                                <h4 className="text-sm font-bold text-[#18181b]">Belum Ada Postingan @{currentUser?.username || 'Instagram'} di Dashboard</h4>
                                <p className="text-xs text-[#71717a] leading-relaxed">
                                    Kamu bisa klik tombol <strong>"Muat Ulang Postingan"</strong> untuk menarik postingan dari akun Instagram Anda, atau menambahkan link/judul postingan secara langsung.
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center justify-center gap-2.5">
                                <button
                                    type="button"
                                    onClick={handleSyncPosts}
                                    disabled={syncing}
                                    className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-semibold inline-flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                                >
                                    <RefreshCw className={`w-4 h-4 text-slate-600 ${syncing ? 'animate-spin' : ''}`} />
                                    <span>{syncing ? 'Menghubungi Instagram...' : `Muat Ulang Postingan @${currentUser?.username || 'Instagram'}`}</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAddPostModal(true)}
                                    className="px-4 py-2.5 rounded-xl bg-[#18181b] hover:bg-[#27272a] text-white text-xs font-semibold inline-flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Tambah Postingan Manual</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Grid of All Instagram Posts */
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {instagramPosts.map((post) => (
                                <div
                                    key={post.id}
                                    className="rounded-2xl bg-white border border-[#e4e4e7] overflow-hidden shadow-xs hover:border-[#18181b] transition-all flex flex-col justify-between group relative"
                                >
                                    <div>
                                        {/* Post Image Container */}
                                        <div className="relative aspect-square w-full bg-slate-900 overflow-hidden">
                                            <img
                                                src={post.thumbnail_url || post.media_url || '/images/tkangcapu_post.jpg'}
                                                alt={post.caption}
                                                referrerPolicy="no-referrer"
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />

                                            {/* Media Type Badge */}
                                            <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold flex items-center gap-1">
                                                {post.media_type === 'VIDEO' ? (
                                                    <>
                                                        <Film className="w-3 h-3" />
                                                        <span>Reel / Video</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Layers className="w-3 h-3" />
                                                        <span>Foto Post</span>
                                                    </>
                                                )}
                                            </div>

                                            {/* Delete & Status Badges */}
                                            <div className="absolute top-3 right-3 flex items-center gap-1.5">
                                                {post.has_automation ? (
                                                    <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold shadow-xs flex items-center gap-1">
                                                        <CheckCircle2 className="w-3 h-3" />
                                                        <span>Otomasi Aktif</span>
                                                    </span>
                                                ) : (
                                                    <span className="px-2.5 py-1 rounded-full bg-zinc-900/80 backdrop-blur-xs text-zinc-300 text-[10px] font-medium border border-zinc-700">
                                                        Belum Ada Otomasi
                                                    </span>
                                                )}

                                                <button
                                                    type="button"
                                                    onClick={() => handleDeletePost(post.id)}
                                                    title="Hapus dari dashboard"
                                                    className="p-1 rounded-lg bg-black/60 text-white/80 hover:text-rose-400 hover:bg-black/90 transition-all cursor-pointer"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Post Details & Caption */}
                                        <div className="p-4 space-y-2.5">
                                            <div className="flex items-center justify-between text-xs text-[#71717a]">
                                                <div className="flex items-center gap-3">
                                                    <span className="flex items-center gap-1 font-semibold text-[#18181b]">
                                                        <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                                                        {post.like_count || 0}
                                                    </span>
                                                    <span className="flex items-center gap-1 font-semibold text-[#18181b]">
                                                        <MessageCircle className="w-3.5 h-3.5 text-indigo-500" />
                                                        {post.comments_count || 0} komen
                                                    </span>
                                                </div>
                                                <span className="text-[10px] font-mono text-[#a1a1aa]">
                                                    {post.id}
                                                </span>
                                            </div>

                                            <p className="text-xs text-[#3f3f46] line-clamp-2 leading-relaxed">
                                                {post.caption || 'Postingan Instagram'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className="p-4 pt-0">
                                        <Link
                                            href={`/automations/create?post_id=${post.id}&post_title=${encodeURIComponent(post.caption || '')}`}
                                            className="w-full py-2.5 px-4 rounded-xl bg-[#18181b] hover:bg-[#27272a] active:scale-95 text-white font-semibold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                                        >
                                            <Zap className="w-3.5 h-3.5 fill-white" />
                                            <span>{post.has_automation ? 'Atur Ulang Otomasi' : '⚡ Otomasi Postingan Ini'}</span>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Section: Daftar Otomasi Aktif */}
                <div className="rounded-2xl bg-white border border-[#e4e4e7] p-6 space-y-5 shadow-xs">
                    <div className="flex items-center justify-between border-b border-[#e4e4e7] pb-4">
                        <div>
                            <h3 className="text-base font-bold text-[#18181b]">Otomasi Berjalan Saat Ini</h3>
                            <p className="text-xs text-[#71717a]">Daftar alur auto-reply yang sedang aktif membalas interaksi</p>
                        </div>

                        <Link
                            href="/automations"
                            className="text-xs font-semibold text-[#18181b] hover:underline flex items-center gap-1"
                        >
                            <span>Lihat Semua ({automations.length})</span>
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {automations.length === 0 ? (
                        <div className="text-center py-8 space-y-3">
                            <p className="text-xs text-[#71717a]">
                                Belum ada otomasi yang dibuat. Pilih salah satu postingan di atas untuk memulai!
                            </p>
                            <Link
                                href="/automations/create"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#18181b] text-white text-xs font-semibold"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Buat Otomasi Pertama</span>
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-[#e4e4e7]">
                            {automations.map((auto) => (
                                <div key={auto.id} className="py-3.5 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-8 h-8 rounded-lg bg-[#fafaf8] border border-[#e4e4e7] flex items-center justify-center shrink-0">
                                            <Zap className="w-4 h-4 text-[#18181b]" />
                                        </div>
                                        <div className="truncate">
                                            <div className="text-xs font-bold text-[#18181b] truncate">{auto.name}</div>
                                            <div className="text-[11px] text-[#71717a] flex items-center gap-2 mt-0.5">
                                                <span>Keyword: <strong className="text-[#18181b]">{auto.triggers?.[0]?.keywords?.join(', ') || 'Semua Komen'}</strong></span>
                                                <span>•</span>
                                                <span>{auto.total_sent || 0} DM Terkirim</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        <button
                                            onClick={() => handleToggle(auto.id)}
                                            className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                                                auto.status === 'active'
                                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                                    : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                                            }`}
                                            title="Ubah Status Otomasi"
                                        >
                                            {auto.status === 'active' ? (
                                                <Pause className="w-3.5 h-3.5" />
                                            ) : (
                                                <Play className="w-3.5 h-3.5" />
                                            )}
                                        </button>

                                        <Link
                                            href={`/automations/${auto.id}`}
                                            className="px-3 py-1.5 rounded-lg bg-[#fafaf8] hover:bg-[#f4f4f5] border border-[#e4e4e7] text-xs font-semibold text-[#18181b]"
                                        >
                                            Detail & Uji
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Tambah Postingan @bsmrlab */}
            {showAddPostModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl max-w-lg w-full border border-[#e4e4e7] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="p-6 border-b border-[#e4e4e7] flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-bold text-[#18181b]">
                                    Tambah Postingan @{currentUser?.username || 'Instagram'}
                                </h3>
                                <p className="text-xs text-[#71717a] mt-0.5">
                                    Postingan akan langsung muncul di dashboard dan siap dipasangi auto-reply DM.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowAddPostModal(false)}
                                className="p-2 rounded-xl text-[#71717a] hover:bg-zinc-100 transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleAddPost} className="p-6 space-y-4">
                            {/* Link Postingan */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-[#18181b]">
                                    Link Postingan / Reels Instagram (Opsional)
                                </label>
                                <div className="relative">
                                    <input
                                        type="url"
                                        value={newPostPermalink}
                                        onChange={(e) => setNewPostPermalink(e.target.value)}
                                        placeholder="https://www.instagram.com/p/... atau https://www.instagram.com/reel/..."
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#e4e4e7] bg-[#fafaf8] text-xs text-[#18181b] focus:border-[#18181b] focus:ring-1 focus:ring-[#18181b] outline-hidden"
                                    />
                                </div>
                            </div>

                            {/* Caption Postingan */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-[#18181b]">
                                    Caption Postingan <span className="text-rose-500">*</span>
                                </label>
                                <textarea
                                    required
                                    rows={3}
                                    value={newPostCaption}
                                    onChange={(e) => setNewPostCaption(e.target.value)}
                                    placeholder="Contoh: Komen 'MAU' untuk dapatkan free template design & sistem otomatisasi CreatorFlow 🚀"
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e4e4e7] bg-[#fafaf8] text-xs text-[#18181b] focus:border-[#18181b] focus:ring-1 focus:ring-[#18181b] outline-hidden resize-none"
                                />
                                <span className="text-[11px] text-[#71717a]">
                                    Tip: Sertakan kata ajakan (Call-to-Action) seperti komen "MAU", "INFO", atau "LINK".
                                </span>
                            </div>

                            {/* Tipe Media */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-[#18181b]">
                                    Tipe Postingan
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setNewPostMediaType('IMAGE')}
                                        className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                                            newPostMediaType === 'IMAGE'
                                                ? 'bg-[#18181b] text-white border-[#18181b]'
                                                : 'bg-white text-[#71717a] border-[#e4e4e7] hover:bg-zinc-50'
                                        }`}
                                    >
                                        <Layers className="w-3.5 h-3.5" />
                                        <span>Foto / Feed</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setNewPostMediaType('VIDEO')}
                                        className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                                            newPostMediaType === 'VIDEO'
                                                ? 'bg-[#18181b] text-white border-[#18181b]'
                                                : 'bg-white text-[#71717a] border-[#e4e4e7] hover:bg-zinc-50'
                                        }`}
                                    >
                                        <Film className="w-3.5 h-3.5" />
                                        <span>Reels / Video</span>
                                    </button>
                                </div>
                            </div>

                            {/* URL Foto (Opsional) */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-[#18181b]">
                                    Link Gambar Thumbnail (Opsional)
                                </label>
                                <input
                                    type="url"
                                    value={newPostMediaUrl}
                                    onChange={(e) => setNewPostMediaUrl(e.target.value)}
                                    placeholder="https://... (Biarkan kosong untuk preview otomatis)"
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e4e4e7] bg-[#fafaf8] text-xs text-[#18181b] focus:border-[#18181b] focus:ring-1 focus:ring-[#18181b] outline-hidden"
                                />
                            </div>

                            {/* Footer Buttons */}
                            <div className="pt-3 border-t border-[#e4e4e7] flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowAddPostModal(false)}
                                    className="px-4 py-2.5 rounded-xl border border-[#e4e4e7] hover:bg-zinc-100 text-xs font-semibold text-[#71717a] transition-all cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={savingPost || !newPostCaption.trim()}
                                    className="px-5 py-2.5 rounded-xl bg-[#18181b] hover:bg-[#27272a] disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>{savingPost ? 'Menyimpan...' : 'Simpan & Tampilkan'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
