import React from 'react';

export default function StatusBadge({ status, type = 'status' }) {
    const s = (status || '').toLowerCase();

    if (type === 'lead_status') {
        const config = {
            hot_lead: { bg: 'bg-rose-50 text-rose-700 border-rose-200', label: '🔥 Hot Lead' },
            customer: { bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', label: '⭐ VIP Customer' },
            lead: { bg: 'bg-zinc-100 text-zinc-800 border-zinc-200', label: '🎯 New Lead' },
            unresponsive: { bg: 'bg-zinc-100 text-zinc-500 border-zinc-200', label: '💤 Unresponsive' },
        };
        const item = config[s] || config.lead;
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${item.bg}`}>
                {item.label}
            </span>
        );
    }

    if (s === 'active' || s === 'connected' || s === 'open' || s === 'success') {
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                {s === 'active' ? 'Aktif' : s === 'connected' ? 'Terhubung' : s === 'open' ? 'Terbuka' : 'Sukses'}
            </span>
        );
    }

    if (s === 'paused' || s === 'closed' || s === 'disconnected') {
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                {s === 'paused' ? 'Dijeda' : s === 'closed' ? 'Selesai' : 'Terputus'}
            </span>
        );
    }

    return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">
            {status}
        </span>
    );
}
