import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import PlatformIcon from '../../Components/PlatformIcon';
import {
    BarChart3,
    TrendingUp,
    Users,
    MousePointerClick,
    Send,
    Sparkles,
    CheckCircle2,
    Flame
} from 'lucide-react';

export default function AnalyticsIndex({ funnelData, platformComparison, topKeywords, automations, totalLeads }) {
    return (
        <AppLayout title="Analitik & Konversi">
            <Head title="Analytics — CreatorFlow" />

            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h2 className="text-xl font-bold text-[#18181b] tracking-tight">
                        Analisis Corong Konversi & Performa Bot
                    </h2>
                    <p className="text-xs text-[#71717a] mt-0.5">
                        Pantau seberapa efektif komentar netizen diubah menjadi klik tautan dan leads penjualan.
                    </p>
                </div>

                {/* Conversion Funnel Card */}
                <div className="glass-card p-6 rounded-2xl space-y-6 border border-[#e4e4e7]">
                    <div className="flex items-center justify-between border-b border-[#e4e4e7] pb-4">
                        <div>
                            <h3 className="text-sm font-bold text-[#18181b]">Full-Funnel Komentar ke Sales (30 Hari)</h3>
                            <p className="text-xs text-[#71717a]">Tingkat drop-off dari setiap langkah alur interaksi</p>
                        </div>
                        <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold font-mono">
                            38.6% End-to-End Conversion
                        </span>
                    </div>

                    <div className="space-y-4">
                        {funnelData.map((item, index) => {
                            const colors = [
                                'bg-[#18181b]',
                                'bg-[#27272a]',
                                'bg-[#3f3f46]',
                                'bg-emerald-600',
                                'bg-emerald-700',
                            ];
                            const bg = colors[index] || 'bg-[#18181b]';

                            return (
                                <div key={index} className="space-y-1.5">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="font-semibold text-[#18181b]">{item.stage}</span>
                                        <div className="flex items-center gap-3">
                                            <span className="font-mono font-bold text-[#18181b]">
                                                {item.count.toLocaleString()}
                                            </span>
                                            <span className="text-[11px] text-[#71717a] font-mono w-12 text-right">
                                                {item.percentage}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-full h-3 rounded-full bg-[#f4f4f5] overflow-hidden p-0.5 border border-[#e4e4e7]">
                                        <div
                                            style={{ width: item.percentage }}
                                            className={`h-full rounded-full ${bg} transition-all duration-500`}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Platform Comparison & Top Keywords Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Platform Comparison */}
                    <div className="lg:col-span-7 glass-card p-6 rounded-2xl space-y-5 border border-[#e4e4e7]">
                        <div className="border-b border-[#e4e4e7] pb-3">
                            <h3 className="text-sm font-bold text-[#18181b]">Performa per Platform Media Sosial</h3>
                            <p className="text-xs text-[#71717a]">Tingkat konversi leads di setiap channel</p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="text-[10px] uppercase text-[#71717a] border-b border-[#e4e4e7]">
                                    <tr>
                                        <th className="py-2.5 px-3">Platform</th>
                                        <th className="py-2.5 px-3">DM Dikirim</th>
                                        <th className="py-2.5 px-3">Klik Link</th>
                                        <th className="py-2.5 px-3">Leads</th>
                                        <th className="py-2.5 px-3 text-right">Konversi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#f4f4f5]">
                                    {platformComparison.map((p, idx) => (
                                        <tr key={idx} className="hover:bg-[#fafaf8]">
                                            <td className="py-3 px-3 font-semibold text-[#18181b] flex items-center gap-2">
                                                <PlatformIcon platform={p.platform} className="w-4 h-4" showBg />
                                                <span>{p.platform}</span>
                                            </td>
                                            <td className="py-3 px-3 font-mono text-[#52525b]">{p.sent.toLocaleString()}</td>
                                            <td className="py-3 px-3 font-mono text-[#52525b]">{p.clicks.toLocaleString()}</td>
                                            <td className="py-3 px-3 font-mono text-emerald-700 font-bold">{p.leads.toLocaleString()}</td>
                                            <td className="py-3 px-3 text-right font-mono font-bold text-[#18181b]">{p.rate}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Top Performing Keywords */}
                    <div className="lg:col-span-5 glass-card p-6 rounded-2xl space-y-5 border border-[#e4e4e7]">
                        <div className="border-b border-[#e4e4e7] pb-3">
                            <h3 className="text-sm font-bold text-[#18181b]">Kata Kunci Paling Viral (Top Keywords)</h3>
                            <p className="text-xs text-[#71717a]">Kata pemicu dengan volume komentar terbanyak</p>
                        </div>

                        <div className="space-y-3">
                            {topKeywords.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="p-3 rounded-xl bg-[#fafaf8] border border-[#e4e4e7] flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="w-6 h-6 rounded-lg bg-[#18181b] text-white font-bold text-xs flex items-center justify-center">
                                            #{idx + 1}
                                        </span>
                                        <div>
                                            <div className="font-mono font-bold text-xs text-[#18181b]">"{item.keyword}"</div>
                                            <div className="text-[10px] text-[#71717a]">{item.count.toLocaleString()} komentar masuk</div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <span className="text-xs font-bold text-emerald-700 font-mono">
                                            {item.conversion}
                                        </span>
                                        <div className="text-[9px] text-[#a1a1aa]">Konversi</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
