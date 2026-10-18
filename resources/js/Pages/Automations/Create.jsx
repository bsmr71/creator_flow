import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import {
    HelpCircle,
    Play,
    Check,
    ChevronDown,
    ChevronUp,
    Heart,
    MessageCircle,
    Send,
    Bookmark,
    Home,
    Search,
    Film,
    Smile,
    Plus,
    FileText,
    ExternalLink,
    Lock,
    Sparkles,
    X
} from 'lucide-react';

export default function AutomationCreate({ socialAccounts = [], recentPost, mediaList = [] }) {
    const igAccount = socialAccounts.find((a) => a.platform === 'instagram') || socialAccounts[0];
    const currentUsername = igAccount?.username || 'bsmrlab';
    const currentAvatar = igAccount?.avatar_url || (igAccount?.metadata?.avatar_url) || `https://api.dicebear.com/7.x/identicon/svg?seed=${currentUsername}`;

    const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const queryPostId = urlParams ? urlParams.get('post_id') : null;
    const queryPostTitle = urlParams ? urlParams.get('post_title') : null;

    const defaultPost = recentPost || (mediaList.length > 0 ? mediaList[0] : {
        id: queryPostId || 'post_current',
        username: currentUsername,
        caption: queryPostTitle || `Postingan Instagram @${currentUsername}`,
        image: currentAvatar,
        media_url: currentAvatar,
        likes: '0 likes',
    });

    const allMedia = mediaList.length > 0 ? mediaList : [defaultPost];
    const initialPost = (queryPostId && allMedia.find((p) => p.id === queryPostId)) || (queryPostId ? {
        id: queryPostId,
        username: currentUsername,
        caption: queryPostTitle || `Postingan Instagram (${queryPostId})`,
        image: currentAvatar,
        media_url: currentAvatar,
        likes: '0 likes',
    } : defaultPost);

    // Step 1: Selected post & target post type
    const [selectedPost, setSelectedPost] = useState(initialPost);
    const [showPostModal, setShowPostModal] = useState(false);
    const [targetPostType, setTargetPostType] = useState('specific'); // 'specific' | 'next' | 'any'

    // Step 2: Keywords & Public reply
    const [targetKeywordType, setTargetKeywordType] = useState('specific'); // 'specific' | 'any'
    const [keywordInput, setKeywordInput] = useState('');
    const [keywords, setKeywords] = useState(['link']);
    const suggestedKeywords = ['link', 'shop', 'order', 'buy', 'price', 'discount', 'info', 'details'];
    const [publicReplyEnabled, setPublicReplyEnabled] = useState(true);
    const [publicReplyText, setPublicReplyText] = useState('Sudah aku kirim detailnya lewat DM ya kak! Silakan cek inbox/requests 🙌');

    // Step 3: Optional actions & gates
    const [hasOpeningDm, setHasOpeningDm] = useState(false);
    const [openingDmText, setOpeningDmText] = useState('Halo! Pesan kamu sedang kami proses ya...');
    const [requireFollow, setRequireFollow] = useState(false);
    const [collectEmail, setCollectEmail] = useState(false);

    // Step 4: Main DM content
    const [dmMessage, setDmMessage] = useState("Halo! Terima kasih atas komentarnya. Ini link eksklusif yang kamu tanyakan:\n\nSilakan klik tombol di bawah:");
    const [dmLinks, setDmLinks] = useState([{ title: 'Buka Link Sekarang', url: 'https://creatorflow.so' }]);
    const [advancedOpen, setAdvancedOpen] = useState(false);
    const [delaySeconds, setDelaySeconds] = useState(2);
    const [submitting, setSubmitting] = useState(false);

    const toggleSuggestedKeyword = (kw) => {
        if (keywords.includes(kw)) {
            setKeywords(keywords.filter((k) => k !== kw));
        } else {
            if (keywords.length < 20) {
                setKeywords([...keywords, kw]);
            }
        }
    };

    const handleAddCustomKeyword = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const trimmed = keywordInput.trim().toLowerCase();
            if (trimmed && !keywords.includes(trimmed) && keywords.length < 20) {
                setKeywords([...keywords, trimmed]);
                setKeywordInput('');
            }
        }
    };

    const removeKeyword = (kw) => {
        setKeywords(keywords.filter((k) => k !== kw));
    };

    const addLink = () => {
        setDmLinks([...dmLinks, { title: 'Link Tambahan', url: 'https://' }]);
    };

    const removeLink = (index) => {
        setDmLinks(dmLinks.filter((_, idx) => idx !== index));
    };

    const updateLink = (index, field, value) => {
        const updated = [...dmLinks];
        updated[index][field] = value;
        setDmLinks(updated);
    };

    const handleSave = (status = 'active') => {
        setSubmitting(true);
        router.post('/automations', {
            name: `Auto DM saat komen "${targetKeywordType === 'any' ? 'semua komen' : keywords.slice(0, 3).join(', ')}"`,
            trigger_type: 'comment',
            target_post_type: targetPostType,
            post_url: targetPostType === 'specific' ? selectedPost.id : null,
            keywords: targetKeywordType === 'any' ? ['*'] : (keywords.length > 0 ? keywords : ['link']),
            match_type: targetKeywordType === 'any' ? 'any_word' : 'contains',
            public_reply_enabled: publicReplyEnabled,
            public_reply_text: publicReplyText,
            opening_dm_enabled: hasOpeningDm,
            opening_dm_text: openingDmText,
            require_follow_enabled: requireFollow,
            collect_email_enabled: collectEmail,
            message_body: dmMessage,
            buttons: dmLinks,
            delay_seconds: delaySeconds,
            status: status,
        }, {
            onFinish: () => setSubmitting(false),
        });
    };

    return (
        <AppLayout title="Create Automation">
            <Head title="Preview Automation — CreatorFlow" />

            <div className="space-y-6 max-w-6xl">
                {/* Top Header Bar */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 cursor-pointer">
                        <HelpCircle className="w-4 h-4 text-slate-400" />
                        <span>Need help?</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => handleSave('draft')}
                            disabled={submitting}
                            className="bg-white hover:bg-slate-50 active:scale-95 text-slate-700 font-bold text-xs py-2 px-4 rounded-xl border border-slate-300 transition-all cursor-pointer shadow-xs"
                        >
                            Save Draft
                        </button>
                        <button
                            onClick={() => handleSave('active')}
                            disabled={submitting}
                            className="bg-[#d2fc00] hover:bg-[#bdf000] active:scale-95 text-black font-extrabold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                        >
                            <Play className="w-3.5 h-3.5 fill-black stroke-none" />
                            <span>{submitting ? 'Starting...' : 'Start Automation'}</span>
                        </button>
                    </div>
                </div>

                {/* Main Split Grid: Left Interactive Phone Mockup / Right Step Builder */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Phone Mockup */}
                    <div className="lg:col-span-5 flex flex-col items-center">
                        <div className="w-full max-w-xs space-y-3">
                            <h2 className="text-xs font-bold text-slate-600 uppercase tracking-wider text-left">
                                Preview Automation
                            </h2>

                            {/* iPhone Frame */}
                            <div className="w-full bg-black rounded-[42px] p-3 shadow-2xl border-4 border-slate-800 text-white overflow-hidden relative">
                                {/* Dynamic Island / Notch */}
                                <div className="absolute top-4 inset-x-0 flex justify-center z-20">
                                    <div className="w-24 h-5 bg-black rounded-full flex items-center justify-between px-3">
                                        <div className="w-2.5 h-2.5 rounded-full bg-zinc-900"></div>
                                        <div className="w-2 h-2 rounded-full bg-blue-950"></div>
                                    </div>
                                </div>

                                {/* Clock & Battery Bar */}
                                <div className="flex justify-between items-center text-[10px] font-bold px-4 pt-1 pb-3 text-zinc-300">
                                    <span>9:41</span>
                                    <div className="flex items-center gap-1">
                                        <span className="text-[9px]">5G</span>
                                        <div className="w-4 h-2 rounded-xs border border-zinc-400 p-0.5 flex items-center">
                                            <div className="w-full h-full bg-white rounded-xs"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Instagram App Screen Content */}
                                <div className="bg-black rounded-[32px] overflow-hidden">
                                    {/* IG Header */}
                                    <div className="px-3 py-2 flex items-center justify-between border-b border-zinc-900">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold">‹</span>
                                            <div>
                                                <div className="text-[10px] text-zinc-400 font-medium leading-tight">
                                                    Posts
                                                </div>
                                                <div className="text-[11px] font-bold leading-tight">
                                                    {defaultPost.username}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-xs text-zinc-400">•••</span>
                                    </div>

                                    {/* IG Post Image */}
                                    <div className="relative aspect-square w-full bg-zinc-900 overflow-hidden">
                                        {selectedPost.media_url || selectedPost.thumbnail_url || selectedPost.image ? (
                                            <img
                                                src={selectedPost.thumbnail_url || selectedPost.media_url || selectedPost.image}
                                                alt="Instagram post"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-linear-to-tr from-[#833ab4] via-[#fd1d1d] to-[#fcb045] flex items-center justify-center p-4 text-center text-white text-xs font-semibold">
                                                {selectedPost.caption || 'Instagram Post'}
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Icons */}
                                    <div className="p-3 space-y-2">
                                        <div className="flex items-center justify-between text-white">
                                            <div className="flex items-center gap-3">
                                                <Heart className="w-4 h-4" />
                                                <MessageCircle className="w-4 h-4" />
                                                <Send className="w-4 h-4" />
                                            </div>
                                            <Bookmark className="w-4 h-4" />
                                        </div>

                                        <div className="text-[10px] text-zinc-300 font-semibold">
                                            {selectedPost.likes || 'Be the first to like this'}
                                        </div>

                                        <div className="text-[10px] leading-tight text-zinc-200">
                                            <span className="font-bold mr-1">{selectedPost.username || currentUsername}</span>
                                            <span className="text-zinc-400">
                                                {selectedPost.caption}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Instagram Bottom Nav */}
                                    <div className="border-t border-zinc-900 px-4 py-2.5 flex items-center justify-between text-zinc-400">
                                        <Home className="w-4 h-4 text-white" />
                                        <Search className="w-4 h-4" />
                                        <Film className="w-4 h-4" />
                                        <Heart className="w-4 h-4" />
                                        <div className="w-4 h-4 rounded-full border border-zinc-400 overflow-hidden">
                                            <img
                                                src="/images/user_avatar.jpg"
                                                alt="profile"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Step Builder Panels */}
                    <div className="lg:col-span-7 space-y-5">
                        {/* Step 1: When a user comments on */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900">
                                    When a user comments on
                                </h3>
                            </div>

                            {/* Option 1: A specific post or reel */}
                            <div className="space-y-3 pt-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-slate-900">
                                        A specific post or reel
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setTargetPostType('specific')}
                                        className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                                            targetPostType === 'specific' ? 'bg-slate-900' : 'bg-slate-200'
                                        }`}
                                    >
                                        <span
                                            className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.75 transition-all shadow-xs ${
                                                targetPostType === 'specific' ? 'right-0.75' : 'left-0.75'
                                            }`}
                                        />
                                    </button>
                                </div>

                                {targetPostType === 'specific' && (
                                    <div className="space-y-3 pt-1 pl-1">
                                        <div className="flex items-center gap-3">
                                            {/* Thumbnail with Green Checkmark */}
                                            <div className="relative w-16 h-16 rounded-xl border-2 border-emerald-500 overflow-hidden shadow-xs">
                                                {selectedPost.thumbnail_url || selectedPost.media_url || selectedPost.image ? (
                                                    <img
                                                        src={selectedPost.thumbnail_url || selectedPost.media_url || selectedPost.image}
                                                        alt="Selected post"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-linear-to-tr from-[#833ab4] via-[#fd1d1d] to-[#fcb045] flex items-center justify-center text-white text-[10px] font-bold">
                                                        IG
                                                    </div>
                                                )}
                                                <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                                                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                                                </div>
                                            </div>

                                            <div className="text-xs text-slate-600 line-clamp-2 max-w-xs">
                                                {selectedPost.caption}
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setShowPostModal(true)}
                                            className="w-full bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs py-2 px-3 rounded-xl border border-slate-200 transition-colors cursor-pointer"
                                        >
                                            Show More ({allMedia.length} Posts)
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Divider OR */}
                            <div className="relative flex items-center justify-center">
                                <div className="border-t border-slate-100 w-full"></div>
                                <span className="bg-white px-2 text-[10px] font-bold text-slate-400 uppercase">
                                    OR
                                </span>
                            </div>

                            {/* Option 2: Next post or reel */}
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-900">
                                    Next post or reel
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setTargetPostType(targetPostType === 'next' ? 'specific' : 'next')}
                                    className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                                        targetPostType === 'next' ? 'bg-slate-900' : 'bg-slate-200'
                                    }`}
                                >
                                    <span
                                        className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.75 transition-all shadow-xs ${
                                            targetPostType === 'next' ? 'right-0.75' : 'left-0.75'
                                        }`}
                                    />
                                </button>
                            </div>

                            {/* Divider OR */}
                            <div className="relative flex items-center justify-center">
                                <div className="border-t border-slate-100 w-full"></div>
                                <span className="bg-white px-2 text-[10px] font-bold text-slate-400 uppercase">
                                    OR
                                </span>
                            </div>

                            {/* Option 3: Any post or reel */}
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-900">
                                    Any post or reel
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setTargetPostType(targetPostType === 'any' ? 'specific' : 'any')}
                                    className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                                        targetPostType === 'any' ? 'bg-slate-900' : 'bg-slate-200'
                                    }`}
                                >
                                    <span
                                        className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.75 transition-all shadow-xs ${
                                            targetPostType === 'any' ? 'right-0.75' : 'left-0.75'
                                        }`}
                                    />
                                </button>
                            </div>
                        </div>

                        {/* Step 2: And his/her comment has */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                                    2
                                </div>
                                <h3 className="text-sm font-bold text-slate-900">
                                    And his/her comment has
                                </h3>
                            </div>

                            {/* Option 1: A specific keyword */}
                            <div className="space-y-3 pt-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-slate-900">
                                        A specific keyword
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setTargetKeywordType('specific')}
                                        className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                                            targetKeywordType === 'specific' ? 'bg-slate-900' : 'bg-slate-200'
                                        }`}
                                    >
                                        <span
                                            className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.75 transition-all shadow-xs ${
                                                targetKeywordType === 'specific' ? 'right-0.75' : 'left-0.75'
                                            }`}
                                        />
                                    </button>
                                </div>

                                {targetKeywordType === 'specific' && (
                                    <div className="space-y-3 pt-1">
                                        {/* Input field */}
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={keywordInput}
                                                onChange={(e) => setKeywordInput(e.target.value)}
                                                onKeyDown={handleAddCustomKeyword}
                                                placeholder="Enter one or a few words"
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-slate-900 transition-colors"
                                            />
                                        </div>

                                        {/* Active Selected Keywords tags */}
                                        {keywords.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 pt-1">
                                                {keywords.map((kw) => (
                                                    <span
                                                        key={kw}
                                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[11px] font-semibold"
                                                    >
                                                        <span>{kw}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeKeyword(kw)}
                                                            className="hover:text-rose-300 p-0.5 cursor-pointer"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Suggested Keywords Pills */}
                                        <div className="space-y-1.5 pt-1">
                                            <div className="text-[11px] text-slate-500 font-medium">
                                                Suggested keywords:
                                            </div>
                                            <div className="flex flex-wrap gap-1.5">
                                                {suggestedKeywords.map((kw) => {
                                                    const isSelected = keywords.includes(kw);
                                                    return (
                                                        <button
                                                            key={kw}
                                                            type="button"
                                                            onClick={() => toggleSuggestedKeyword(kw)}
                                                            className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                                                                isSelected
                                                                    ? 'bg-slate-900 text-white border-slate-900'
                                                                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                                                            }`}
                                                        >
                                                            {kw}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Counter */}
                                        <div className="text-[10px] text-slate-400 font-medium text-right">
                                            {keywords.length}/20 keywords
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Divider OR */}
                            <div className="relative flex items-center justify-center">
                                <div className="border-t border-slate-100 w-full"></div>
                                <span className="bg-white px-2 text-[10px] font-bold text-slate-400 uppercase">
                                    OR
                                </span>
                            </div>

                                    {/* Option 2: Any word */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-slate-900">
                                        Any word (semua komentar)
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setTargetKeywordType(targetKeywordType === 'any' ? 'specific' : 'any')}
                                        className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                                            targetKeywordType === 'any' ? 'bg-slate-900' : 'bg-slate-200'
                                        }`}
                                    >
                                        <span
                                            className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.75 transition-all shadow-xs ${
                                                targetKeywordType === 'any' ? 'right-0.75' : 'left-0.75'
                                            }`}
                                        />
                                    </button>
                                </div>
                            </div>

                            {/* Feature: Public Comment Reply */}
                            <div className="border-t border-slate-100 pt-3 space-y-2">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-xs font-semibold text-slate-900">
                                            Balas Komentar Publik Otomatis
                                        </div>
                                        <div className="text-[11px] text-slate-500">
                                            Membalas komentar di postingan publik agar algoritma Instagram melonjak
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setPublicReplyEnabled(!publicReplyEnabled)}
                                        className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                                            publicReplyEnabled ? 'bg-slate-900' : 'bg-slate-200'
                                        }`}
                                    >
                                        <span
                                            className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.75 transition-all shadow-xs ${
                                                publicReplyEnabled ? 'right-0.75' : 'left-0.75'
                                            }`}
                                        />
                                    </button>
                                </div>

                                {publicReplyEnabled && (
                                    <input
                                        type="text"
                                        value={publicReplyText}
                                        onChange={(e) => setPublicReplyText(e.target.value)}
                                        placeholder="Pesan balasan komentar publik..."
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Step 3: They will optionally get */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                                    3
                                </div>
                                <h3 className="text-sm font-bold text-slate-900">
                                    They will optionally get
                                </h3>
                            </div>

                            {/* Toggle 1: an opening DM */}
                            <div className="space-y-2 pt-1">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-xs font-semibold text-slate-900">
                                            an opening DM
                                        </div>
                                        <div className="text-[11px] text-slate-500">
                                            Send an initial message before the main content
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setHasOpeningDm(!hasOpeningDm)}
                                        className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                                            hasOpeningDm ? 'bg-slate-900' : 'bg-slate-200'
                                        }`}
                                    >
                                        <span
                                            className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.75 transition-all shadow-xs ${
                                                hasOpeningDm ? 'right-0.75' : 'left-0.75'
                                            }`}
                                        />
                                    </button>
                                </div>

                                {hasOpeningDm && (
                                    <input
                                        type="text"
                                        value={openingDmText}
                                        onChange={(e) => setOpeningDmText(e.target.value)}
                                        className="w-full mt-2 px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                                        placeholder="Tulis pesan pembuka..."
                                    />
                                )}
                            </div>

                            {/* Divider OR */}
                            <div className="relative flex items-center justify-center">
                                <div className="border-t border-slate-100 w-full"></div>
                                <span className="bg-white px-2 text-[10px] font-bold text-slate-400 uppercase">
                                    OR
                                </span>
                            </div>

                            {/* Feature 2: Require users to follow you */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-xs font-semibold text-slate-900">
                                        Require users to follow you before receiving the DM link
                                    </div>
                                    <div className="text-[11px] text-slate-500">
                                        Wajibkan follow akun terlebih dahulu agar follower Instagram Anda tumbuh
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setRequireFollow(!requireFollow)}
                                    className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                                        requireFollow ? 'bg-slate-900' : 'bg-slate-200'
                                    }`}
                                >
                                    <span
                                        className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.75 transition-all shadow-xs ${
                                            requireFollow ? 'right-0.75' : 'left-0.75'
                                        }`}
                                    />
                                </button>
                            </div>

                            {/* Divider OR */}
                            <div className="relative flex items-center justify-center">
                                <div className="border-t border-slate-100 w-full"></div>
                                <span className="bg-white px-2 text-[10px] font-bold text-slate-400 uppercase">
                                    OR
                                </span>
                            </div>

                            {/* Feature 3: Collect email addresses */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-xs font-semibold text-slate-900">
                                        Collect email addresses from your audience before sending the DM
                                    </div>
                                    <div className="text-[11px] text-slate-500">
                                        Kumpulkan email atau nomor kontak langsung ke CRM sebelum memberikan tautan
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setCollectEmail(!collectEmail)}
                                    className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                                        collectEmail ? 'bg-slate-900' : 'bg-slate-200'
                                    }`}
                                >
                                    <span
                                        className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.75 transition-all shadow-xs ${
                                            collectEmail ? 'right-0.75' : 'left-0.75'
                                        }`}
                                    />
                                </button>
                            </div>
                        </div>

                        {/* Step 4: And they will get a DM with */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                                    4
                                </div>
                                <h3 className="text-sm font-bold text-slate-900">
                                    And they will get a DM with
                                </h3>
                            </div>

                            {/* Use Template button */}
                            <div>
                                <button
                                    type="button"
                                    onClick={() => setDmMessage("Halo! Ini link yang kamu minta di kolom komentar:\n\nKlik tombol di bawah untuk akses langsung:")}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-2xs transition-colors cursor-pointer"
                                >
                                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                                    <span>Use Template</span>
                                </button>
                            </div>

                            {/* Message Textarea */}
                            <div className="relative">
                                <textarea
                                    rows={4}
                                    value={dmMessage}
                                    onChange={(e) => setDmMessage(e.target.value)}
                                    placeholder="Enter your message here..."
                                    maxLength={1000}
                                    className="w-full p-3.5 rounded-xl border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-slate-900 transition-colors resize-none"
                                />
                                <div className="absolute right-3 bottom-3 text-slate-400 hover:text-slate-600 cursor-pointer">
                                    <Smile className="w-4 h-4" />
                                </div>
                            </div>

                            {/* Character Counter & Add Link Button */}
                            <div className="flex items-center justify-between text-xs text-slate-400">
                                <span>{dmMessage.length}/1000 characters</span>

                                <button
                                    type="button"
                                    onClick={addLink}
                                    className="inline-flex items-center gap-1 text-slate-900 font-bold hover:underline cursor-pointer"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Add Link</span>
                                </button>
                            </div>

                            {/* Active Links / Buttons */}
                            {dmLinks.length > 0 && (
                                <div className="space-y-2 pt-2 border-t border-slate-100">
                                    {dmLinks.map((link, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={link.title}
                                                onChange={(e) => updateLink(idx, 'title', e.target.value)}
                                                placeholder="Judul Tombol"
                                                className="w-1/3 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900"
                                            />
                                            <input
                                                type="url"
                                                value={link.url}
                                                onChange={(e) => updateLink(idx, 'url', e.target.value)}
                                                placeholder="https://..."
                                                className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900 font-mono"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeLink(idx)}
                                                className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Collapsible: Advanced Settings */}
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                            <button
                                type="button"
                                onClick={() => setAdvancedOpen(!advancedOpen)}
                                className="w-full p-4 flex items-center justify-between text-xs font-bold text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                                <span>Advanced Settings</span>
                                {advancedOpen ? (
                                    <ChevronUp className="w-4 h-4 text-slate-400" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 text-slate-400" />
                                )}
                            </button>

                            {advancedOpen && (
                                <div className="p-4 pt-0 space-y-3 border-t border-slate-100 text-xs">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-semibold text-slate-900">Jeda Pengiriman (Delay)</div>
                                            <div className="text-[11px] text-slate-500">Mencegah deteksi spam dengan memberi jeda alami</div>
                                        </div>
                                        <select
                                            value={delaySeconds}
                                            onChange={(e) => setDelaySeconds(Number(e.target.value))}
                                            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium"
                                        >
                                            <option value={0}>Instan (0 detik)</option>
                                            <option value={2}>2 detik (Direkomendasikan)</option>
                                            <option value={5}>5 detik</option>
                                            <option value={10}>10 detik</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Modal Picker for Instagram Posts */}
                {showPostModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                                <div>
                                    <h3 className="text-sm font-extrabold text-slate-900">
                                        Pilih Postingan Instagram
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        Pilih postingan atau reel yang ingin diotomasi
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowPostModal(false)}
                                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto p-1">
                                {allMedia.map((post) => {
                                    const isCurrent = selectedPost.id === post.id;
                                    return (
                                        <div
                                            key={post.id}
                                            onClick={() => {
                                                setSelectedPost(post);
                                                setShowPostModal(false);
                                            }}
                                            className={`group relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all hover:scale-[1.02] shadow-xs ${
                                                isCurrent
                                                    ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                                                    : 'border-slate-200 hover:border-slate-400'
                                            }`}
                                        >
                                            <div className="aspect-square bg-slate-900 overflow-hidden">
                                                <img
                                                    src={post.thumbnail_url || post.media_url || post.image}
                                                    alt="Post thumbnail"
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                />
                                            </div>
                                            <div className="p-2.5 bg-white space-y-1">
                                                <div className="text-[11px] font-semibold text-slate-800 line-clamp-2 leading-tight">
                                                    {post.caption || 'Postingan Instagram'}
                                                </div>
                                            </div>
                                            {isCurrent && (
                                                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                                                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
