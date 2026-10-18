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
                            Connect your Creator or Business Instagram
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
                                    placeholder="Contoh: bsmrlab, cristiano, brandkamu"
                                    className="w-full pl-9 pr-4 py-3 rounded-2xl bg-white border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all shadow-xs"
                                />
                            </div>
                        </div>

                        {/* Account Preview Box */}
                        {username.trim().length > 0 && !isSearching && (
                            <div className="p-4 rounded-2xl bg-white border-2 border-emerald-500 space-y-2.5 shadow-sm transition-all animate-in fade-in duration-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                                        <Check className="w-4 h-4 stroke-[3]" />
                                        <span>Akun Siap Dihubungkan</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                        Instagram Professional
                                    </span>
                                </div>

                                <div className="flex items-center gap-3.5 pt-1">
                                    {profile.avatar ? (
                                        <img
                                            src={profile.avatar}
                                            alt={profile.name}
                                            referrerPolicy="no-referrer"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                const fallback = e.currentTarget.nextElementSibling;
                                                if (fallback) fallback.style.display = 'flex';
                                            }}
                                            className="w-12 h-12 rounded-full object-cover border border-slate-200 bg-slate-100 shrink-0"
                                        />
                                    ) : null}
                                    <div
                                        style={{ display: profile.avatar ? 'none' : 'flex' }}
                                        className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 items-center justify-center text-white font-extrabold text-base shadow-xs shrink-0"
                                    >
                                        {(profile.name || profile.username || username || 'I').charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-sm font-extrabold text-slate-900 truncate">
                                            {profile.name || `@${username}`}
                                        </div>
                                        <div className="text-xs text-slate-500 font-medium">
                                            @{username}
                                        </div>
                                        <div className="text-[11px] text-slate-400 mt-0.5 font-medium">
                                            {profile.followers || 'Akun Aktif'} • {profile.posts || 'Creator/Business'}
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
                                className="w-full py-4 px-6 rounded-full font-extrabold text-sm bg-[#d2f801] text-black shadow-md flex items-center justify-center gap-2.5 transition-all opacity-95 cursor-wait"
                            >
                                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                <span>Mencari akun Instagram...</span>
                            </button>
                        ) : username.trim().length > 0 ? (
                            <div className="space-y-3">
                                <button
                                    type="button"
                                    disabled={submitting}
                                    onClick={() => setShowConsentModal(true)}
                                    className="w-full py-4 px-6 rounded-full font-extrabold text-sm bg-[#d2f801] hover:bg-[#c3e600] active:scale-98 text-black shadow-md flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-75"
                                >
                                    <PlatformIcon platform="instagram" className="w-4 h-4 text-black" />
                                    <span>Sign In as @{username}</span>
                                </button>

                                <div className="pt-2 text-center space-y-2.5">
                                    <div className="flex items-center gap-2 justify-center text-xs text-slate-400">
                                        <span className="h-px bg-slate-200 flex-1"></span>
                                        <span>atau login langsung di Meta Resmi</span>
                                        <span className="h-px bg-slate-200 flex-1"></span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-1">
                                        <a
                                            href="/integrations/meta/connect?provider=instagram"
                                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0095f6] hover:underline px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                                        >
                                            <PlatformIcon platform="instagram" className="w-3.5 h-3.5 text-[#0095f6]" />
                                            <span>Login via Instagram OAuth</span>
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                        <span className="text-slate-300 hidden sm:inline">•</span>
                                        <a
                                            href="/integrations/meta/connect?provider=facebook"
                                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1877f2] hover:underline px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                                        >
                                            <span>Login via Facebook (Admin App)</span>
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <button
                                    type="button"
                                    disabled
                                    className="w-full py-4 px-6 rounded-full font-bold text-sm bg-slate-100 text-slate-400 border border-slate-200 shadow-none flex items-center justify-center gap-2.5 cursor-not-allowed"
                                >
                                    <span>Ketik username Instagram untuk memulai</span>
                                </button>

                                <div className="pt-2 text-center space-y-2.5">
                                    <div className="flex items-center gap-2 justify-center text-xs text-slate-400">
                                        <span className="h-px bg-slate-200 flex-1"></span>
                                        <span>atau login langsung di Meta Resmi</span>
                                        <span className="h-px bg-slate-200 flex-1"></span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-1">
                                        <a
                                            href="/integrations/meta/connect?provider=instagram"
                                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0095f6] hover:underline px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                                        >
                                            <PlatformIcon platform="instagram" className="w-3.5 h-3.5 text-[#0095f6]" />
                                            <span>Login via Instagram OAuth</span>
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                        <span className="text-slate-300 hidden sm:inline">•</span>
                                        <a
                                            href="/integrations/meta/connect?provider=facebook"
                                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1877f2] hover:underline px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                                        >
                                            <span>Login via Facebook (Admin App)</span>
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Official Instagram Consent Screen Modal */}
            {showConsentModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
                    <div className="bg-[#1c1c1e] text-white rounded-3xl p-6 sm:p-7 max-w-sm sm:max-w-md w-full space-y-5 shadow-2xl relative border border-white/10">
                        {/* Header with Instagram Branding */}
                        <div className="flex items-center justify-between pb-1">
                            <div className="font-serif italic font-bold text-2xl tracking-wide text-white">
                                Instagram
                            </div>
                            <div className="text-slate-400 text-lg cursor-pointer">•••</div>
                        </div>

                        {/* Allow Access To Messages Banner */}
                        <div className="p-4 rounded-2xl bg-[#2c2c2e] space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-white">
                                    Allow access to messages
                                </span>
                                <div className="w-11 h-6 bg-blue-500 rounded-full flex items-center justify-end px-1 cursor-pointer">
                                    <div className="w-4 h-4 rounded-full bg-white shadow-xs"></div>
                                </div>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Give anyone with approved access the ability to view, send and respond to Instagram messages.{' '}
                                <span className="text-blue-400 underline cursor-pointer">Learn more</span>
                            </p>
                        </div>

                        {/* Request Scope Details */}
                        <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                            <p>
                                <span className="font-bold text-white">CreatorFlow</span> is requesting access to:{' '}
                                <span className="font-bold text-white">@{profile.username}</span>. If you select Allow, CreatorFlow will be able to:
                            </p>

                            <div className="space-y-3 pt-1">
                                <div className="flex items-center justify-between py-1 border-b border-white/5">
                                    <span className="text-white font-medium">View profile and access media (required)</span>
                                    <div className="w-9 h-5 bg-blue-500 rounded-full flex items-center justify-end px-1 opacity-80">
                                        <div className="w-3.5 h-3.5 rounded-full bg-white"></div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between py-1 border-b border-white/5">
                                    <span className="text-white font-medium">Access and manage comments</span>
                                    <div className="w-9 h-5 bg-blue-500 rounded-full flex items-center justify-end px-1">
                                        <div className="w-3.5 h-3.5 rounded-full bg-white"></div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between py-1 border-b border-white/5">
                                    <span className="text-white font-medium">Access and manage messages</span>
                                    <div className="w-9 h-5 bg-blue-500 rounded-full flex items-center justify-end px-1">
                                        <div className="w-3.5 h-3.5 rounded-full bg-white"></div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between py-1 border-b border-white/5">
                                    <span className="text-white font-medium">Access and publish content</span>
                                    <div className="w-9 h-5 bg-blue-500 rounded-full flex items-center justify-end px-1">
                                        <div className="w-3.5 h-3.5 rounded-full bg-white"></div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between py-1 border-b border-white/5">
                                    <span className="text-white font-medium">Access and manage insights</span>
                                    <div className="w-9 h-5 bg-blue-500 rounded-full flex items-center justify-end px-1">
                                        <div className="w-3.5 h-3.5 rounded-full bg-white"></div>
                                    </div>
                                </div>
                            </div>

                            <p className="text-[11px] text-slate-400 pt-2 leading-normal">
                                By allowing, CreatorFlow will receive ongoing access to your information and Instagram will record when CreatorFlow accesses it.{' '}
                                <span className="text-blue-400 underline cursor-pointer">Learn More</span> about this sharing and the settings you have.{' '}
                                <span className="text-blue-400 underline cursor-pointer">CreatorFlow Privacy Policy and Terms.</span>
                            </p>
                        </div>

                        {/* Modal Action Buttons */}
                        <div className="space-y-2 pt-2">
                            <button
                                type="button"
                                disabled={submitting}
                                onClick={handleAllowConsent}
                                className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-[#0095f6] hover:bg-[#1877f2] active:scale-98 text-white shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                            >
                                <span>{submitting ? 'Connecting...' : 'Allow'}</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setShowConsentModal(false)}
                                className="w-full py-2.5 px-4 font-semibold text-xs text-slate-400 hover:text-white transition-colors cursor-pointer text-center"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
