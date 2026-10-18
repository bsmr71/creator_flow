import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Zap, User, Mail, Lock, Building, ArrowRight, CheckCircle2 } from 'lucide-react';
import PlatformIcon from '../../Components/PlatformIcon';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        workspace_name: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <div className="min-h-screen bg-[#fafaf8] text-[#18181b] flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans selection:bg-[#18181b] selection:text-white">
            <Head title="Daftar Akun Baru — CreatorFlow" />

            <div className="w-full max-w-md space-y-6 relative z-10">
                {/* Brand Header */}
                <div className="text-center space-y-2">
                    <Link href="/" className="inline-flex items-center gap-2.5 group">
                        <div className="w-11 h-11 rounded-xl bg-[#18181b] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                            <Zap className="w-5 h-5 text-white fill-white" />
                        </div>
                    </Link>
                    <h1 className="text-2xl font-bold text-[#18181b] tracking-tight">
                        Mulai Otomasi dengan <span className="font-serif italic font-normal text-[#52525b]">CreatorFlow</span>
                    </h1>
                    <p className="text-xs text-[#71717a]">
                        Buat akun gratis dan hubungkan media sosialmu dalam 2 menit.
                    </p>
                </div>

                {/* Register Form Card */}
                <div className="p-7 rounded-2xl border border-[#e4e4e7] bg-white space-y-5 shadow-xs">
                    {/* 1-Click Official Instagram Register/Login */}
                    <a
                        href="/auth/instagram"
                        className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-linear-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 text-white shadow-md flex items-center justify-center gap-2.5 transition-all cursor-pointer"
                    >
                        <PlatformIcon platform="instagram" className="w-4 h-4 text-white" />
                        <span>Daftar Cepat dengan Akun Instagram</span>
                    </a>

                    <div className="relative flex items-center justify-center my-1">
                        <div className="border-t border-[#e4e4e7] w-full"></div>
                        <span className="bg-white px-3 text-[10px] font-bold text-[#a1a1aa] uppercase tracking-wider absolute">
                            Atau isi form manual
                        </span>
                    </div>

                    <form onSubmit={submit} className="space-y-4">

                        {/* Full Name */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-[#3f3f46]">Nama Lengkap:</label>
                            <div className="relative">
                                <User className="w-4 h-4 text-[#a1a1aa] absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    required
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Nama kamu"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#fafaf8] border border-[#e4e4e7] text-xs text-[#18181b] placeholder-[#a1a1aa] focus:outline-hidden focus:border-[#18181b] transition-colors"
                                />
                            </div>
                            {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-[#3f3f46]">Alamat Email:</label>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-[#a1a1aa] absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="email"
                                    required
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="kamu@email.com"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#fafaf8] border border-[#e4e4e7] text-xs text-[#18181b] placeholder-[#a1a1aa] focus:outline-hidden focus:border-[#18181b] transition-colors"
                                />
                            </div>
                            {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
                        </div>

                        {/* Workspace Name */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-[#3f3f46]">Nama Workspace / Brand Bisnis:</label>
                            <div className="relative">
                                <Building className="w-4 h-4 text-[#a1a1aa] absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    required
                                    value={data.workspace_name}
                                    onChange={(e) => setData('workspace_name', e.target.value)}
                                    placeholder="Contoh: Media Scale Studio"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#fafaf8] border border-[#e4e4e7] text-xs text-[#18181b] placeholder-[#a1a1aa] focus:outline-hidden focus:border-[#18181b] transition-colors"
                                />
                            </div>
                            {errors.workspace_name && <p className="text-xs text-rose-600 mt-1">{errors.workspace_name}</p>}
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-[#3f3f46]">Kata Sandi (Password):</label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-[#a1a1aa] absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="password"
                                    required
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Minimal 8 karakter"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#fafaf8] border border-[#e4e4e7] text-xs text-[#18181b] placeholder-[#a1a1aa] focus:outline-hidden focus:border-[#18181b] transition-colors"
                                />
                            </div>
                            {errors.password && <p className="text-xs text-rose-600 mt-1">{errors.password}</p>}
                        </div>

                        {/* Password Confirmation */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-[#3f3f46]">Konfirmasi Kata Sandi:</label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-[#a1a1aa] absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="password"
                                    required
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="Ulangi kata sandi"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#fafaf8] border border-[#e4e4e7] text-xs text-[#18181b] placeholder-[#a1a1aa] focus:outline-hidden focus:border-[#18181b] transition-colors"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3 px-4 rounded-xl bg-[#18181b] hover:bg-[#27272a] active:scale-98 text-white font-semibold text-xs shadow-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50 pt-2 cursor-pointer"
                        >
                            <span>{processing ? 'Membuat Akun...' : 'Daftar & Masuk Dashboard'}</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                    <div className="pt-2 border-t border-[#e4e4e7] text-center text-xs text-[#71717a]">
                        Sudah punya akun?{' '}
                        <Link href="/login" className="font-semibold text-[#18181b] hover:underline">
                            Masuk di sini
                        </Link>
                    </div>
                </div>

                <div className="text-center">
                    <Link href="/" className="text-xs text-[#71717a] hover:text-[#18181b] transition-colors">
                        ← Kembali ke Halaman Utama
                    </Link>
                </div>
            </div>
        </div>
    );
}
