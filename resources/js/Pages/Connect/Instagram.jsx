import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import PlatformIcon from '../../Components/PlatformIcon';
import {
    ArrowLeft,
    Check,
    CheckCircle2,
    ShieldCheck,
    Zap,
    ExternalLink,
    HelpCircle
} from 'lucide-react';

export default function ConnectInstagram({ workspace, currentAccount }) {
    const defaultUser = currentAccount?.username || '';
    const [username, setUsername] = useState(defaultUser);
    const [isSearching, setIsSearching] = useState(false);
    const [accountFound, setAccountFound] = useState(!!currentAccount);
    const [errorMessage, setErrorMessage] = useState('');
    const [showConsentModal, setShowConsentModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const searchTimerRef = useRef(null);

    // Profile lookup details (dynamically calculated based on username)
    const [profile, setProfile] = useState({
        name: currentAccount?.display_name || '',
        username: defaultUser,
        followers: currentAccount?.metadata?.followers_count || '',
        posts: currentAccount?.metadata?.posts_count || '',
        avatar: currentAccount?.avatar_url || null,
    });

    useEffect(() => {
        if (defaultUser) {
            fetch(`/api/instagram/lookup?username=${encodeURIComponent(defaultUser)}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.found) {
                        setAccountFound(true);
                        setProfile({
                            name: data.name,
                            username: data.username,
                            followers: data.followers_count,
                            posts: data.posts_count,
                            avatar: data.avatar_url,
                        });
                    }
                })
                .catch(() => {});
        }
    }, []);

    const handleUsernameChange = (e) => {
        const val = e.target.value;
        const clean = val.replace(/[@\s]/g, '');
        setUsername(clean);

        if (!clean) {
            setIsSearching(false);
            setAccountFound(false);
            setErrorMessage('');
            return;
        }

        setIsSearching(true);
        setAccountFound(false);
        setErrorMessage('');

        if (searchTimerRef.current) {
            clearTimeout(searchTimerRef.current);
        }

        searchTimerRef.current = setTimeout(async () => {
            try {
                const response = await fetch(`/api/instagram/lookup?username=${encodeURIComponent(clean)}`);
                const data = await response.json();

                setIsSearching(false);
                if (data.found) {
                    setAccountFound(true);
                    setProfile({
                        name: data.name,
                        username: data.username,
                        followers: data.followers_count,
                        posts: data.posts_count,
                        avatar: data.avatar_url,
                    });
                } else {
                    setAccountFound(false);
                    setErrorMessage(data.message || `Akun @${clean} tidak dapat ditemukan di Instagram.`);
                }
            } catch (err) {
                setIsSearching(false);
                setAccountFound(false);
                setErrorMessage(`Gagal mencari akun @${clean}. Silakan periksa koneksi Anda.`);
            }
        }, 400);
    };

    const handleAllowConsent = () => {
        setSubmitting(true);
        const targetUser = (profile.username || username || '').trim();
        router.post('/connect/instagram/confirm', {
            username: targetUser,
            name: profile.name || `@${targetUser}`,
            avatar_url: profile.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${targetUser}`,
            followers_count: profile.followers || 'Akun Aktif',
            posts_count: profile.posts || 'Creator/Business',
        }, {
            onFinish: () => {
                setSubmitting(false);
                setShowConsentModal(false);
            },
        });
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between font-sans selection:bg-slate-900 selection:text-white">
            <Head title="Connect Instagram — CreatorFlow" />

            {/* Top Navigation */}
            <div className="p-6 max-w-5xl w-full mx-auto flex items-center justify-between">
                <Link
                    href="/integrations"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Kembali ke Integrasi</span>
                </Link>

                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-white">
                        <Zap className="w-4 h-4 text-white fill-white" />
                    </div>
                    <span className="font-bold text-sm text-slate-900">CreatorFlow</span>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col justify-center items-center px-4 py-8">
                <div className="w-full max-w-lg space-y-7">
                    {/* Header Title */}
                    <div className="text-center space-y-2">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                            Connect your Creator or<br className="hidden sm:inline" /> Business Instagram
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
                            We'll connect through Meta official login - make sure you are logged in a Creator or Business account in the browser.{' '}
                            <a href="#help" className="text-slate-900 underline font-medium hover:text-indigo-600">
                                Need Help?
                            </a>
                        </p>
                    </div>

                    {/* Input Field Form */}
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-900 block">
                                Your Instagram username
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                                    @
                                </span>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={handleUsernameChange}
                                    placeholder="bsmrlab"
                                    className="w-full pl-9 pr-4 py-3 rounded-2xl bg-white border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all shadow-xs"
                                />
                            </div>
                        </div>

                        {/* Account Found Detection Box */}
                        {accountFound && !isSearching && username.trim().length > 0 && (
                            <div className="p-4 rounded-2xl bg-white border-2 border-emerald-500 space-y-2.5 shadow-sm transition-all animate-in fade-in duration-200">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                                    <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">
                                        ✓
                                    </div>
                                    <span>Account found</span>
                                </div>

                                <div className="flex items-center gap-3.5 pt-1">
                                    {profile.avatar ? (
                                        <img
                                            src={profile.avatar}
                                            alt={profile.name}
                                            referrerPolicy="no-referrer"
                                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-slate-100 shrink-0"
                                        />
                                    ) : null}
                                    <div className="min-w-0">
                                        <div className="text-sm font-extrabold text-slate-900 truncate">
                                            {profile.name || `@${username}`}
                                        </div>
                                        <div className="text-xs text-slate-500 font-medium">
                                            @{username}
                                        </div>
                                        <div className="text-[11px] text-slate-400 mt-0.5 font-medium">
                                            {profile.followers || '1.6K followers'} • {profile.posts || '18 posts'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Button: Finding Account vs Sign In */}
                        {isSearching ? (
                            <button
                                type="button"
                                disabled
                                className="w-full py-4 px-6 rounded-2xl font-extrabold text-sm bg-[#d2f801] text-black shadow-md flex items-center justify-center gap-2.5 transition-all opacity-95 cursor-wait"
                            >
                                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                <span>Mencari akun Instagram...</span>
                            </button>
                        ) : username.trim().length > 0 ? (
                            <a
                                href={`/integrations/meta/connect?provider=instagram&username=${encodeURIComponent((profile.username || username).trim())}`}
                                className="w-full py-4 px-6 rounded-2xl font-extrabold text-sm bg-[#d2f801] hover:bg-[#c3e600] active:scale-98 text-black shadow-md flex items-center justify-center gap-2.5 transition-all cursor-pointer text-center"
                            >
                                <PlatformIcon platform="instagram" className="w-4 h-4 text-black" />
                                <span>Sign In as @{profile.username || username}</span>
                            </a>
                        ) : (
                            <button
                                type="button"
                                disabled
                                className="w-full py-4 px-6 rounded-2xl font-bold text-sm bg-slate-100 text-slate-400 border border-slate-200 shadow-none flex items-center justify-center gap-2.5 cursor-not-allowed"
                            >
                                <span>Ketik username Instagram untuk memulai</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>



            {/* Meta Tech Provider Footer */}
            <div className="py-8 px-4 border-t border-slate-100 text-center space-y-2 text-xs text-slate-400">
                <div className="flex items-center justify-center gap-2 text-slate-700 font-semibold">
                    <span>CreatorFlow is a trusted</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-bold text-[11px] border border-slate-200 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                        Meta Tech Provider
                    </span>
                </div>
                <div className="space-x-3 text-[11px]">
                    <Link href="/privacy" className="text-slate-600 underline hover:text-slate-900">Kebijakan Privasi</Link>
                    <span>•</span>
                    <Link href="/terms" className="text-slate-600 underline hover:text-slate-900">Syarat Layanan</Link>
                    <span>•</span>
                    <Link href="/data-deletion" className="text-slate-600 underline hover:text-slate-900">Hapus Data</Link>
                </div>
            </div>
        </div>
    );
}
