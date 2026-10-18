import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import {
    CreditCard,
    Check,
    Zap,
    ShieldCheck,
    Clock,
    AlertCircle,
    ArrowRight,
    QrCode,
    Building2,
    Wallet,
    CheckCircle2,
    X,
    FileText,
    Download,
    Sparkles,
    RefreshCw,
    ExternalLink
} from 'lucide-react';

export default function BillingIndex({
    workspace,
    plans = [],
    currentSubscription,
    payments = [],
    activeCheckout,
    doku = {}
}) {
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState(null);
    const [selectedChannel, setSelectedChannel] = useState('DOKU QRIS (GoPay/ShopeePay/BCA)');
    const [isSimulating, setIsSimulating] = useState(false);

    const { post, processing } = useForm();

    const handleSelectPlan = (plan) => {
        if (workspace?.plan === plan.slug && currentSubscription?.status === 'active') {
            return;
        }

        router.post('/billing/checkout', {
            plan_id: plan.id,
            billing_cycle: billingCycle,
        });
    };

    const handleSimulatePayment = (paymentId) => {
        setIsSimulating(true);
        router.post(`/billing/simulate-payment/${paymentId}`, {
            channel: selectedChannel,
        }, {
            onFinish: () => setIsSimulating(false),
        });
    };

    const handleCancelSubscription = (subscriptionId) => {
        if (confirm('Apakah Anda yakin ingin membatalkan langganan ini? Anda tetap dapat menggunakan fitur hingga akhir periode aktif.')) {
            router.post(`/billing/subscriptions/${subscriptionId}/cancel`);
        }
    };

    const formatRupiah = (val) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(val || 0);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <AppLayout title="Billing & Subscription">
            <Head title="Billing & Paket — CreatorFlow" />

            <div className="space-y-10 max-w-6xl mx-auto pb-12">
                {/* Hero / Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e4e4e7] pb-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2">
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>DOKU Payment Gateway Indonesia</span>
                        </div>
                        <h2 className="text-2xl font-bold text-[#18181b] tracking-tight">
                            Langganan & Pembayaran
                        </h2>
                        <p className="text-xs md:text-sm text-[#71717a] mt-1">
                            Kelola paket langganan workspace Anda dengan sistem pembayaran resmi DOKU (QRIS, VA Bank, E-Wallet & Kartu Kredit).
                        </p>
                    </div>

                    {/* DOKU Security Badge */}
                    <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-[#e4e4e7] shadow-xs shrink-0">
                        <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 font-extrabold text-sm border border-rose-200">
                            DOKU
                        </div>
                        <div>
                            <div className="text-xs font-bold text-[#18181b] flex items-center gap-1.5">
                                <span>Official Partner</span>
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            </div>
                            <div className="text-[10px] text-[#71717a]">
                                Terlisensi Bank Indonesia (PJP)
                            </div>
                        </div>
                    </div>
                </div>

                {/* Active Checkout Modal / Banner if there is a pending payment */}
                {activeCheckout && activeCheckout.status === 'pending' && (
                    <div className="rounded-2xl border-2 border-indigo-500 bg-linear-to-br from-indigo-50/50 via-white to-purple-50/40 p-6 md:p-8 shadow-md relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-300 animate-pulse">
                                <Clock className="w-3.5 h-3.5" />
                                Menunggu Pembayaran
                            </span>
                        </div>

                        <div className="max-w-3xl space-y-5">
                            <div>
                                <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
                                    Invoice Sesi DOKU Aktif
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-[#18181b]">
                                    {activeCheckout.invoice_number}
                                </h3>
                                <p className="text-xs text-[#71717a] mt-0.5">
                                    Paket: <span className="font-semibold text-[#18181b]">{activeCheckout.subscription?.pricing_plan?.name || 'Paket Subscription'}</span> • Siklus: {activeCheckout.subscription?.billing_cycle === 'annual' ? '1 Tahun' : '1 Bulan'}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-white/80 rounded-xl border border-indigo-100 backdrop-blur-xs">
                                <div>
                                    <div className="text-[11px] text-[#71717a]">Total Tagihan</div>
                                    <div className="text-lg font-extrabold text-[#18181b]">
                                        {formatRupiah(activeCheckout.amount)}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[11px] text-[#71717a]">Gateway Pembayaran</div>
                                    <div className="text-sm font-semibold text-[#18181b] flex items-center gap-1 mt-0.5">
                                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                                        DOKU Checkout
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[11px] text-[#71717a]">Batas Waktu Bayar</div>
                                    <div className="text-sm font-medium text-[#18181b] mt-0.5">
                                        {formatDate(activeCheckout.expired_at)}
                                    </div>
                                </div>
                            </div>

                            {/* Payment Channels Grid */}
                            <div className="space-y-3 pt-2">
                                <div className="text-xs font-bold text-[#18181b] flex items-center justify-between">
                                    <span>Pilih Metode Pembayaran (Simulasi / Real Sandbox):</span>
                                    <span className="text-[11px] font-normal text-[#71717a]">Metode resmi DOKU</span>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                    {[
                                        { name: 'QRIS (GoPay/OVO/BCA)', icon: QrCode, badge: 'Instant' },
                                        { name: 'BCA Virtual Account', icon: Building2, badge: 'Otomatis' },
                                        { name: 'Mandiri / BRI VA', icon: Building2, badge: 'Otomatis' },
                                        { name: 'Kartu Kredit / Debit', icon: CreditCard, badge: 'Visa/MC' },
                                    ].map((channel) => (
                                        <button
                                            key={channel.name}
                                            type="button"
                                            onClick={() => setSelectedChannel(channel.name)}
                                            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                                                selectedChannel === channel.name
                                                    ? 'border-indigo-600 bg-indigo-50/80 shadow-xs ring-2 ring-indigo-500/20'
                                                    : 'border-[#e4e4e7] bg-white hover:border-[#d4d4d8]'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <channel.icon className={`w-4 h-4 ${selectedChannel === channel.name ? 'text-indigo-600' : 'text-[#71717a]'}`} />
                                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700">
                                                    {channel.badge}
                                                </span>
                                            </div>
                                            <div className="text-xs font-semibold text-[#18181b] leading-tight">
                                                {channel.name}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center gap-3 pt-3">
                                <button
                                    type="button"
                                    disabled={isSimulating}
                                    onClick={() => handleSimulatePayment(activeCheckout.id)}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                                >
                                    {isSimulating ? (
                                        <>
                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                            <span>Memproses Pembayaran DOKU...</span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="w-4 h-4" />
                                            <span>Selesaikan & Bayar via {selectedChannel}</span>
                                        </>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => router.get('/billing')}
                                    className="px-4 py-2.5 rounded-xl border border-[#e4e4e7] bg-white text-xs font-medium text-[#52525b] hover:bg-[#f4f4f5] transition-colors"
                                >
                                    Tutup / Nanti Saja
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Current Active Plan Card */}
                <div className="p-6 rounded-2xl bg-white border border-[#e4e4e7] shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <div className="text-[11px] font-bold uppercase tracking-wider text-[#71717a]">
                                Status Paket Workspace
                            </div>
                            <div className="flex items-center gap-3">
                                <h3 className="text-xl font-bold text-[#18181b]">
                                    Plan {workspace?.plan?.toUpperCase() || 'FREE'}
                                </h3>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                    currentSubscription?.status === 'active'
                                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                        : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                                }`}>
                                    {currentSubscription?.status === 'active' ? 'Aktif' : 'Aktif (Trial / Free)'}
                                </span>
                            </div>
                            <p className="text-xs text-[#71717a]">
                                Workspace: <span className="font-semibold text-[#18181b]">{workspace?.name}</span>
                                {currentSubscription?.ends_at && (
                                    <> • Berakhir / Diperbarui pada: <span className="font-semibold text-[#18181b]">{formatDate(currentSubscription.ends_at)}</span></>
                                )}
                            </p>
                        </div>

                        {currentSubscription && currentSubscription.status === 'active' && (
                            <button
                                type="button"
                                onClick={() => handleCancelSubscription(currentSubscription.id)}
                                className="text-xs text-rose-600 hover:text-rose-700 font-semibold hover:underline self-start sm:self-auto"
                            >
                                Batalkan Langganan
                            </button>
                        )}
                    </div>
                </div>

                {/* Billing Cycle Switcher */}
                <div className="flex flex-col items-center justify-center space-y-3 pt-4">
                    <div className="text-center">
                        <h3 className="text-lg md:text-xl font-bold text-[#18181b]">
                            Pilih Paket Sesuai Kebutuhan Anda
                        </h3>
                        <p className="text-xs text-[#71717a]">
                            Semua transaksi diproses aman oleh DOKU Payment Gateway tanpa biaya tersembunyi.
                        </p>
                    </div>

                    <div className="inline-flex items-center p-1 rounded-xl bg-[#f4f4f5] border border-[#e4e4e7]">
                        <button
                            type="button"
                            onClick={() => setBillingCycle('monthly')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                billingCycle === 'monthly'
                                    ? 'bg-white text-[#18181b] shadow-xs'
                                    : 'text-[#71717a] hover:text-[#18181b]'
                            }`}
                        >
                            Tagihan Bulanan
                        </button>
                        <button
                            type="button"
                            onClick={() => setBillingCycle('annual')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                                billingCycle === 'annual'
                                    ? 'bg-white text-[#18181b] shadow-xs'
                                    : 'text-[#71717a] hover:text-[#18181b]'
                            }`}
                        >
                            <span>Tagihan Tahunan</span>
                            <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-emerald-500 text-white">
                                Hemat 20%
                            </span>
                        </button>
                    </div>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.map((plan) => {
                        const isCurrent = workspace?.plan === plan.slug;
                        const price = billingCycle === 'annual' ? plan.price_annual : plan.price_monthly;
                        const perMonthInAnnual = Math.round(plan.price_annual / 12);

                        return (
                            <div
                                key={plan.id}
                                className={`rounded-2xl bg-white border p-6 flex flex-col justify-between transition-all relative ${
                                    plan.is_popular
                                        ? 'border-indigo-600 shadow-lg ring-2 ring-indigo-500/20'
                                        : 'border-[#e4e4e7] shadow-xs hover:border-[#d4d4d8]'
                                }`}
                            >
                                {plan.is_popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-extrabold tracking-wider uppercase shadow-xs">
                                        Paling Populer
                                    </div>
                                )}

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-base font-bold text-[#18181b]">{plan.name}</h4>
                                        {isCurrent && (
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                                                Paket Anda
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-xs text-[#71717a] min-h-[36px] mb-4">
                                        {plan.description}
                                    </p>

                                    {/* Price */}
                                    <div className="my-4 pb-4 border-b border-[#f4f4f5]">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-extrabold text-[#18181b] tracking-tight">
                                                {formatRupiah(billingCycle === 'annual' ? perMonthInAnnual : price)}
                                            </span>
                                            <span className="text-xs text-[#71717a] font-medium">/ bulan</span>
                                        </div>
                                        {billingCycle === 'annual' && (
                                            <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                                                Ditagih {formatRupiah(plan.price_annual)} per tahun
                                            </div>
                                        )}
                                    </div>

                                    {/* Features list */}
                                    <div className="space-y-2.5 mb-6">
                                        <div className="text-[11px] font-bold uppercase tracking-wider text-[#a1a1aa]">
                                            Fitur Unggulan:
                                        </div>
                                        {(plan.features || []).map((feat, idx) => (
                                            <div key={idx} className="flex items-start gap-2.5 text-xs text-[#3f3f46]">
                                                <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                                                    <Check className="w-3 h-3 stroke-[3]" />
                                                </div>
                                                <span>{feat}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* CTA Button */}
                                <button
                                    type="button"
                                    disabled={isCurrent}
                                    onClick={() => handleSelectPlan(plan)}
                                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                                        isCurrent
                                            ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed border border-zinc-200'
                                            : plan.is_popular
                                                ? 'bg-[#18181b] hover:bg-[#27272a] text-white shadow-md active:scale-98'
                                                : 'bg-white hover:bg-[#f4f4f5] text-[#18181b] border border-[#e4e4e7] active:scale-98'
                                    }`}
                                >
                                    <span>{isCurrent ? 'Sedang Digunakan' : `Pilih & Bayar via DOKU`}</span>
                                    {!isCurrent && <ArrowRight className="w-3.5 h-3.5" />}
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Transaction & Invoices History Table */}
                <div className="p-6 rounded-2xl bg-white border border-[#e4e4e7] shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-[#e4e4e7] pb-4">
                        <div>
                            <h3 className="text-base font-bold text-[#18181b] flex items-center gap-2">
                                <FileText className="w-4 h-4 text-indigo-600" />
                                <span>Riwayat Transaksi & Invoice DOKU</span>
                            </h3>
                            <p className="text-xs text-[#71717a]">
                                Daftar riwayat transaksi dan status pembayaran langganan Anda.
                            </p>
                        </div>
                    </div>

                    {payments.length === 0 ? (
                        <div className="text-center py-8 text-xs text-[#71717a]">
                            Belum ada riwayat transaksi. Pilih salah satu paket di atas untuk memulai.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-[#e4e4e7] text-[#71717a]">
                                        <th className="py-2.5 px-3 font-semibold">No. Invoice</th>
                                        <th className="py-2.5 px-3 font-semibold">Paket</th>
                                        <th className="py-2.5 px-3 font-semibold">Jumlah</th>
                                        <th className="py-2.5 px-3 font-semibold">Metode / Gateway</th>
                                        <th className="py-2.5 px-3 font-semibold">Status</th>
                                        <th className="py-2.5 px-3 font-semibold">Tanggal</th>
                                        <th className="py-2.5 px-3 font-semibold text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#f4f4f5]">
                                    {payments.map((p) => (
                                        <tr key={p.id} className="hover:bg-[#fafaf8] transition-colors">
                                            <td className="py-3 px-3 font-mono font-semibold text-[#18181b]">
                                                {p.invoice_number}
                                            </td>
                                            <td className="py-3 px-3 text-[#3f3f46]">
                                                {p.subscription?.pricing_plan?.name || p.subscription?.plan_code || 'Paket Subscription'}
                                            </td>
                                            <td className="py-3 px-3 font-semibold text-[#18181b]">
                                                {formatRupiah(p.amount)}
                                            </td>
                                            <td className="py-3 px-3 text-[#52525b]">
                                                {p.payment_channel || 'DOKU Checkout'}
                                            </td>
                                            <td className="py-3 px-3">
                                                {p.status === 'paid' ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                                        <CheckCircle2 className="w-3 h-3" />
                                                        Lunas
                                                    </span>
                                                ) : p.status === 'pending' ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                                        <Clock className="w-3 h-3" />
                                                        Menunggu
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                                                        <AlertCircle className="w-3 h-3" />
                                                        Gagal
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 px-3 text-[#71717a]">
                                                {formatDate(p.created_at)}
                                            </td>
                                            <td className="py-3 px-3 text-right">
                                                {p.status === 'pending' ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => router.get('/billing', { checkout: p.invoice_number })}
                                                        className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] transition-colors"
                                                    >
                                                        Bayar
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => window.print()}
                                                        className="inline-flex items-center gap-1 text-[#52525b] hover:text-[#18181b] font-medium text-[11px]"
                                                    >
                                                        <Download className="w-3 h-3" />
                                                        <span>Kuitansi</span>
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* DOKU Security Guarantee Footer Card */}
                <div className="p-6 rounded-2xl bg-zinc-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
                    <div className="space-y-1.5 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 text-rose-400 text-xs font-bold">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            <span>100% Secure Transaction via DOKU</span>
                        </div>
                        <h4 className="text-base font-bold">
                            Pembayaran Aman, Lisensi Resmi Bank Indonesia
                        </h4>
                        <p className="text-xs text-zinc-400 max-w-xl">
                            Semua data pembayaran dan kartu dilindungi enkripsi standar PCI-DSS Level 1 dan Bank Indonesia. Paket dapat di-upgrade atau dihentikan kapan saja tanpa komitmen jangka panjang.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <div className="px-3 py-1.5 rounded-lg bg-white/10 text-xs font-bold text-zinc-300 border border-white/10">
                            PCI-DSS Level 1
                        </div>
                        <div className="px-3 py-1.5 rounded-lg bg-white/10 text-xs font-bold text-zinc-300 border border-white/10">
                            256-Bit SSL
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
