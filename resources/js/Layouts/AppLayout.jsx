import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Zap,
    MessageSquare,
    Users,
    Layers,
    BarChart3,
    Settings,
    Plus,
    Bell,
    CheckCircle2,
    Menu,
    X,
    ExternalLink,
    ChevronDown,
    ShieldCheck,
    Globe,
    LogOut,
    CreditCard
} from 'lucide-react';

export default function AppLayout({ children, title }) {
    const { flash, auth } = usePage().props;
    const [mobileOpen, setMobileOpen] = useState(false);

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Automations', href: '/automations', icon: Zap },
        { name: 'Unified Inbox', href: '/inbox', icon: MessageSquare },
        { name: 'Contacts CRM', href: '/contacts', icon: Users },
        { name: 'Integrations', href: '/integrations', icon: Layers },
        { name: 'Analytics', href: '/analytics', icon: BarChart3 },
        { name: 'CMS Website', href: '/cms', icon: Globe, badge: 'CMS' },
        { name: 'Billing & Paket', href: '/billing', icon: CreditCard, badge: 'DOKU' },
        { name: 'Settings', href: '/settings', icon: Settings },
    ];

    const currentUrl = typeof window !== 'undefined' ? window.location.pathname : '';

    return (
        <div className="min-h-screen bg-[#fafaf8] text-[#18181b] flex flex-col md:flex-row font-sans selection:bg-[#18181b] selection:text-white">
            {/* Sidebar for Desktop */}
            <aside className="hidden md:flex flex-col w-64 border-r border-[#e4e4e7] bg-white shrink-0 p-4 justify-between fixed h-screen z-30 shadow-[1px_0_4px_rgba(0,0,0,0.02)]">
                <div className="space-y-6">
                    {/* Brand Logo */}
                    <div className="flex items-center justify-between px-2 pt-2">
                        <Link href="/dashboard" className="flex items-center gap-2.5 group">
                            <div className="w-9 h-9 rounded-xl bg-[#18181b] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                                <Zap className="w-4 h-4 text-white fill-white" />
                            </div>
                            <div>
                                <div className="font-bold text-base tracking-tight text-[#18181b] flex items-center">
                                    <span>Creator</span>
                                    <span className="font-serif italic font-normal ml-0.5">Flow</span>
                                </div>
                                <span className="text-[10px] text-[#71717a] font-medium tracking-wide">
                                    Automation Platform
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Workspace Selector */}
                    <div className="p-2.5 rounded-xl bg-[#fafaf8] border border-[#e4e4e7] flex items-center justify-between hover:border-[#d4d4d8] transition-colors">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-[#18181b] text-white flex items-center justify-center font-bold text-xs shrink-0">
                                {auth?.workspace?.name ? auth.workspace.name.substring(0, 2).toUpperCase() : 'CF'}
                            </div>
                            <div className="truncate">
                                <div className="text-xs font-semibold text-[#18181b] truncate">
                                    {auth?.workspace?.name || 'Workspace Saya'}
                                </div>
                                <div className="text-[10px] text-emerald-700 font-medium flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                                    Plan {auth?.workspace?.plan?.toUpperCase() || 'PRO'}
                                </div>
                            </div>
                        </div>
                        <ChevronDown className="w-4 h-4 text-[#71717a] shrink-0" />
                    </div>

                    {/* Navigation Menu */}
                    <nav className="space-y-1">
                        <div className="text-[10px] font-bold text-[#a1a1aa] tracking-wider uppercase px-3 py-1">
                            Main Menu
                        </div>
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = currentUrl === item.href || (item.href !== '/dashboard' && currentUrl.startsWith(item.href));

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                                        isActive
                                            ? 'bg-[#18181b] text-white shadow-xs font-semibold'
                                            : 'text-[#52525b] hover:text-[#18181b] hover:bg-[#f4f4f5]'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#71717a] group-hover:text-[#18181b]'}`} />
                                        <span>{item.name}</span>
                                    </div>
                                    {item.badge && (
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                                            isActive ? 'bg-white/20 text-white' : 'bg-[#f4f4f5] text-[#52525b] border border-[#e4e4e7]'
                                        }`}>
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Sidebar Bottom Banner & Profile */}
                <div className="space-y-3 pt-4 border-t border-[#e4e4e7]">
                    {/* Live Engine Status */}
                    <div className="p-3 rounded-xl bg-[#fafaf8] border border-[#e4e4e7] text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold text-[#18181b] flex items-center gap-1.5">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                Bot Engine Active
                            </span>
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        </div>
                        <p className="text-[10px] text-[#71717a] leading-tight">
                            Semua webhook & auto DM Instagram aktif 100%.
                        </p>
                    </div>

                    {/* User Profile & Real Logout */}
                    <div className="flex items-center justify-between p-2 rounded-xl bg-[#fafaf8] border border-[#e4e4e7]">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-[#18181b] text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                                {auth?.user?.name ? auth.user.name.charAt(0) : 'U'}
                            </div>
                            <div className="truncate min-w-0">
                                <div className="text-xs font-semibold text-[#18181b] truncate">{auth?.user?.name || 'User'}</div>
                                <div className="text-[10px] text-[#71717a] truncate">{auth?.user?.email || ''}</div>
                            </div>
                        </div>

                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="p-1.5 rounded-lg text-[#71717a] hover:text-rose-600 hover:bg-[#f4f4f5] transition-colors shrink-0"
                            title="Keluar dari Akun"
                        >
                            <LogOut className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-[#e4e4e7] sticky top-0 z-40">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#18181b] flex items-center justify-center text-white">
                        <Zap className="w-4 h-4 text-white fill-white" />
                    </div>
                    <span className="font-bold text-[#18181b] text-base">CreatorFlow</span>
                </Link>
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="p-2 rounded-lg bg-[#f4f4f5] text-[#18181b] hover:bg-[#e4e4e7]"
                >
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Mobile Dropdown Nav */}
            {mobileOpen && (
                <div className="md:hidden bg-white border-b border-[#e4e4e7] p-4 space-y-2 z-40 fixed top-16 inset-x-0 shadow-xl">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-[#52525b] hover:bg-[#f4f4f5] hover:text-[#18181b]"
                        >
                            <span className="flex items-center gap-2.5">
                                <item.icon className="w-4 h-4 text-[#18181b]" />
                                {item.name}
                            </span>
                            {item.badge && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-[#f4f4f5] text-[#52525b] border border-[#e4e4e7]">
                                    {item.badge}
                                </span>
                            )}
                        </Link>
                    ))}
                </div>
            )}

            {/* Main Content Area */}
            <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
                {/* Top Bar Header */}
                <header className="h-16 border-b border-[#e4e4e7] bg-white/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
                    <div className="flex items-center gap-3">
                        <h1 className="text-base font-bold text-[#18181b] tracking-tight">{title || 'Dashboard'}</h1>
                        <span className="hidden sm:inline-block text-xs px-2.5 py-0.5 rounded-full bg-[#f4f4f5] text-[#52525b] border border-[#e4e4e7] font-mono">
                            v1.0 Live
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Quick Action Button */}
                        <Link
                            href="/automations/create"
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#18181b] hover:bg-[#27272a] active:scale-95 text-white font-medium text-xs shadow-xs transition-all cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Buat Otomasi</span>
                        </Link>

                        {/* Landing Page Preview Link */}
                        <Link
                            href="/"
                            target="_blank"
                            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-[#f4f4f5] text-[#52525b] hover:text-[#18181b] text-xs border border-[#e4e4e7] transition-colors shadow-xs"
                        >
                            <span>Lihat Landing Page</span>
                            <ExternalLink className="w-3 h-3" />
                        </Link>

                        {/* Notifications */}
                        <div className="relative p-2 rounded-xl bg-white border border-[#e4e4e7] text-[#71717a] hover:text-[#18181b] cursor-pointer transition-colors shadow-xs">
                            <Bell className="w-4 h-4" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500"></span>
                        </div>
                    </div>
                </header>

                {/* Flash Messages Alert */}
                {flash?.success && (
                    <div className="mx-6 mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2.5 shadow-xs">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                        <span>{flash.success}</span>
                    </div>
                )}

                {/* Page Content Body */}
                <div className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
