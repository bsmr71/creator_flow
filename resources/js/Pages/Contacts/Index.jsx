import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import PlatformIcon from '../../Components/PlatformIcon';
import StatusBadge from '../../Components/StatusBadge';
import {
    Users,
    Search,
    Plus,
    Download,
    Mail,
    Phone,
    Filter,
    Flame,
    Tag,
    X,
    Check
} from 'lucide-react';

export default function ContactsIndex({ contacts, tags, filters, totalLeadsCount }) {
    const [search, setSearch] = useState(filters.search || '');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const { data, setData, post, processing, reset } = useForm({
        username: '',
        name: '',
        email: '',
        phone: '',
        platform: 'instagram',
        status: 'hot_lead',
        tags: ['Hot Lead'],
    });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/contacts', { ...filters, search }, { preserveState: true });
    };

    const handleFilterPlatform = (platform) => {
        router.get('/contacts', { ...filters, platform }, { preserveState: true });
    };

    const handleCreateContact = (e) => {
        e.preventDefault();
        post('/contacts', {
            onSuccess: () => {
                setIsAddModalOpen(false);
                reset();
            },
        });
    };

    const handleExportCSV = () => {
        const headers = ['Username', 'Nama', 'Email', 'Telepon', 'Platform', 'Status'];
        const rows = contacts.map(c => [
            c.username,
            c.name || '',
            c.email || '',
            c.phone || '',
            c.platform,
            c.status
        ]);
        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `creatorflow_leads_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <AppLayout title="Kontak & Database Leads">
            <Head title="Contacts CRM — CreatorFlow" />

            <div className="space-y-6">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-[#18181b] tracking-tight">
                            Database Leads & Pelanggan ({totalLeadsCount})
                        </h2>
                        <p className="text-xs text-[#71717a] mt-0.5">
                            Semua kontak yang berinteraksi lewat DM Instagram, WhatsApp, TikTok, dan Facebook.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleExportCSV}
                            className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#f4f4f5] text-[#18181b] text-xs font-semibold border border-[#e4e4e7] flex items-center gap-1.5 transition-colors shadow-xs"
                        >
                            <Download className="w-3.5 h-3.5" />
                            <span>Export CSV</span>
                        </button>

                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="px-4 py-2.5 rounded-xl bg-[#18181b] hover:bg-[#27272a] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Tambah Lead</span>
                        </button>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="p-4 rounded-2xl bg-white border border-[#e4e4e7] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
                    <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto text-xs">
                        {['all', 'instagram', 'whatsapp', 'tiktok', 'facebook'].map((p) => (
                            <button
                                key={p}
                                onClick={() => handleFilterPlatform(p)}
                                className={`px-3.5 py-1.5 rounded-xl capitalize font-semibold transition-all ${
                                    (filters.platform || 'all') === p
                                        ? 'bg-[#18181b] text-white shadow-xs'
                                        : 'bg-[#fafaf8] text-[#71717a] hover:text-[#18181b] hover:bg-[#f4f4f5] border border-[#e4e4e7]'
                                }`}
                            >
                                {p === 'all' ? 'Semua Platform' : p}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSearch} className="relative w-full sm:w-72">
                        <Search className="w-4 h-4 text-[#a1a1aa] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari nama, email, username..."
                            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#fafaf8] border border-[#e4e4e7] text-xs text-[#18181b] placeholder-[#a1a1aa] focus:outline-hidden focus:border-[#18181b]"
                        />
                    </form>
                </div>

                {/* Contacts Table */}
                <div className="glass-card rounded-2xl overflow-hidden border border-[#e4e4e7]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-[#fafaf8] border-b border-[#e4e4e7] text-[#71717a] uppercase tracking-wider text-[10px]">
                                <tr>
                                    <th className="py-3.5 px-5 font-semibold">Kontak / User</th>
                                    <th className="py-3.5 px-5 font-semibold">Platform</th>
                                    <th className="py-3.5 px-5 font-semibold">Email & WhatsApp</th>
                                    <th className="py-3.5 px-5 font-semibold">Segmentasi (Tags)</th>
                                    <th className="py-3.5 px-5 font-semibold">Status Lead</th>
                                    <th className="py-3.5 px-5 text-right font-semibold">Terakhir Aktif</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f4f4f5]">
                                {contacts.map((contact) => (
                                    <tr key={contact.id} className="hover:bg-[#fafaf8] transition-colors">
                                        <td className="py-4 px-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-[#18181b] flex items-center justify-center font-bold text-white text-xs shadow-xs">
                                                    {contact.name?.charAt(0) || contact.username.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-[#18181b] text-xs">{contact.name || contact.username}</div>
                                                    <div className="text-[10px] text-[#71717a] font-mono">@{contact.username}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-5">
                                            <div className="flex items-center gap-2">
                                                <PlatformIcon platform={contact.platform} className="w-4 h-4" showBg />
                                                <span className="capitalize font-medium text-[#18181b]">{contact.platform}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-5">
                                            <div className="space-y-0.5">
                                                <div className="text-[#18181b] font-medium">{contact.email || '-'}</div>
                                                <div className="text-[#71717a] font-mono text-[10px]">{contact.phone || '-'}</div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-5">
                                            <div className="flex flex-wrap gap-1">
                                                {contact.tags?.map((t, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-2 py-0.5 rounded-md bg-[#fafaf8] text-[#18181b] border border-[#e4e4e7] text-[10px] font-semibold"
                                                    >
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="py-4 px-5">
                                            <StatusBadge status={contact.status} type="lead_status" />
                                        </td>
                                        <td className="py-4 px-5 text-right text-[#a1a1aa] font-mono text-[11px]">
                                            Baru saja
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Add Lead Modal */}
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
                        <div className="w-full max-w-md rounded-2xl bg-white border border-[#e4e4e7] p-6 space-y-5 shadow-2xl">
                            <div className="flex items-center justify-between border-b border-[#e4e4e7] pb-3">
                                <h3 className="text-sm font-bold text-[#18181b]">Tambah Lead Baru Manual</h3>
                                <button
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="p-1 rounded-lg hover:bg-[#f4f4f5] text-[#71717a] hover:text-[#18181b]"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateContact} className="space-y-4 text-xs">
                                <div className="space-y-1">
                                    <label className="text-[#18181b] font-semibold">Username Akun</label>
                                    <input
                                        type="text"
                                        required
                                        value={data.username}
                                        onChange={(e) => setData('username', e.target.value)}
                                        placeholder="misal: john_doe"
                                        className="w-full px-3.5 py-2 rounded-xl bg-[#fafaf8] border border-[#e4e4e7] text-[#18181b] focus:outline-hidden focus:border-[#18181b]"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[#18181b] font-semibold">Nama Lengkap</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="John Doe"
                                        className="w-full px-3.5 py-2 rounded-xl bg-[#fafaf8] border border-[#e4e4e7] text-[#18181b] focus:outline-hidden focus:border-[#18181b]"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[#18181b] font-semibold">Email</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="john@example.com"
                                        className="w-full px-3.5 py-2 rounded-xl bg-[#fafaf8] border border-[#e4e4e7] text-[#18181b] focus:outline-hidden focus:border-[#18181b]"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[#18181b] font-semibold">Nomor WhatsApp</label>
                                    <input
                                        type="text"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="+62 812-3456-7890"
                                        className="w-full px-3.5 py-2 rounded-xl bg-[#fafaf8] border border-[#e4e4e7] text-[#18181b] focus:outline-hidden focus:border-[#18181b]"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-[#18181b] font-semibold">Platform</label>
                                        <select
                                            value={data.platform}
                                            onChange={(e) => setData('platform', e.target.value)}
                                            className="w-full px-3 py-2 rounded-xl bg-[#fafaf8] border border-[#e4e4e7] text-[#18181b]"
                                        >
                                            <option value="instagram">Instagram</option>
                                            <option value="whatsapp">WhatsApp</option>
                                            <option value="tiktok">TikTok</option>
                                            <option value="facebook">Facebook</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[#18181b] font-semibold">Status Lead</label>
                                        <select
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            className="w-full px-3 py-2 rounded-xl bg-[#fafaf8] border border-[#e4e4e7] text-[#18181b]"
                                        >
                                            <option value="hot_lead">🔥 Hot Lead</option>
                                            <option value="customer">⭐ VIP Customer</option>
                                            <option value="lead">🎯 New Lead</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="px-4 py-2 rounded-xl bg-white border border-[#e4e4e7] text-[#71717a] font-semibold hover:bg-[#f4f4f5]"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-5 py-2 rounded-xl bg-[#18181b] text-white font-semibold hover:bg-[#27272a] disabled:opacity-50 shadow-xs"
                                    >
                                        Simpan Lead
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
