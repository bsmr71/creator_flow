import React from 'react';

export default function PlatformIcon({ platform, className = "w-4 h-4", showBg = false }) {
    const p = (platform || '').toLowerCase();

    let icon = null;
    let bgClass = '';
    let textColor = '';

    switch (p) {
        case 'instagram':
            icon = (
                <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
            );
            bgClass = 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white shadow-md shadow-rose-500/20';
            textColor = 'text-rose-400';
            break;

        case 'whatsapp':
            icon = (
                <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
                    <path d="M9.8 10a2.6 2.6 0 0 0 2.2 2.2c.4 0 .7-.1 1-.3l1.1 1.1a4.5 4.5 0 0 1-5.1-5.1l1.1 1.1c-.2.3-.3.6-.3 1Z"/>
                </svg>
            );
            bgClass = 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20';
            textColor = 'text-emerald-400';
            break;

        case 'tiktok':
            icon = (
                <svg className={className} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.86-4.49V8.65a8.28 8.28 0 0 0 4.91 1.54V6.74a4.8 4.8 0 0 1-1-.05Z"/>
                </svg>
            );
            bgClass = 'bg-black text-cyan-400 border border-slate-700 shadow-md';
            textColor = 'text-cyan-400';
            break;

        case 'facebook':
            icon = (
                <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
            );
            bgClass = 'bg-blue-600 text-white shadow-md shadow-blue-500/20';
            textColor = 'text-blue-400';
            break;

        default:
            icon = (
                <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
            );
            bgClass = 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20';
            textColor = 'text-indigo-400';
    }

    if (showBg) {
        return (
            <div className={`inline-flex items-center justify-center rounded-xl p-2 shrink-0 ${bgClass}`}>
                {icon}
            </div>
        );
    }

    return <span className={`shrink-0 ${textColor}`}>{icon}</span>;
}
