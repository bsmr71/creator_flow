import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import PlatformIcon from '../../Components/PlatformIcon';
import StatusBadge from '../../Components/StatusBadge';
import {
    Search,
    Send,
    Bot,
    User,
    Check,
    CheckCheck,
    Sparkles,
    Tag,
    Mail,
    Phone,
    MoreVertical,
    Clock,
    Flame
} from 'lucide-react';

export default function InboxIndex({ conversations, activeConversation, currentPlatform }) {
    const [replyText, setReplyText] = useState('');
    const [selectedConvId, setSelectedConvId] = useState(activeConversation?.id);

    const currentConv = conversations.find((c) => c.id === selectedConvId) || conversations[0];

    const handleSelectConversation = (conv) => {
        setSelectedConvId(conv.id);
    };

    const handleFilterPlatform = (plat) => {
        router.get('/inbox', { platform: plat }, { preserveState: true });
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!replyText.trim() || !currentConv) return;

        router.post(`/inbox/conversations/${currentConv.id}/messages`, {
            content: replyText,
        }, {
            preserveScroll: true,
            onSuccess: () => setReplyText(''),
        });
    };

    const handleStatusChange = (newStatus) => {
        if (!currentConv) return;
        router.post(`/inbox/conversations/${currentConv.id}/status`, {
            status: newStatus,
        }, { preserveScroll: true });
    };

    const quickReplies = [
        'Terima kasih kak! Ada yang bisa kami bantu lagi?',
        'Link download sudah dikirim ya kak, selamat belajar! ✨',
        'Bisa konsultasi langsung dengan mentor kami di WhatsApp.',
    ];

    return (
        <AppLayout title="Unified Multi-Channel Inbox">
            <Head title="Inbox — CreatorFlow" />

            <div className="h-[calc(100vh-135px)] flex rounded-2xl bg-white border border-[#e4e4e7] overflow-hidden shadow-xs">
                {/* Column 1: Conversations List */}
                <div className="w-80 sm:w-96 border-r border-[#e4e4e7] flex flex-col bg-[#fafaf8] shrink-0">
                    {/* Platform Selector Filter */}
                    <div className="p-3.5 border-b border-[#e4e4e7] space-y-3">
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                            {['all', 'instagram', 'whatsapp', 'tiktok', 'facebook'].map((plat) => (
                                <button
                                    key={plat}
                                    onClick={() => handleFilterPlatform(plat)}
                                    className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                                        currentPlatform === plat
                                            ? 'bg-[#18181b] text-white shadow-xs'
                                            : 'bg-white text-[#71717a] hover:text-[#18181b] border border-[#e4e4e7]'
                                    }`}
                                >
                                    {plat === 'all' ? 'Semua' : plat}
                                </button>
                            ))}
                        </div>

                        {/* Search Input */}
                        <div className="relative">
                            <Search className="w-3.5 h-3.5 text-[#a1a1aa] absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Cari nama atau username..."
                                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white border border-[#e4e4e7] text-xs text-[#18181b] placeholder-[#a1a1aa] focus:outline-hidden focus:border-[#18181b]"
                            />
                        </div>
                    </div>

                    {/* Conversations List Scrollable */}
                    <div className="flex-1 overflow-y-auto divide-y divide-[#f4f4f5]">
                        {conversations.map((conv) => {
                            const isSelected = conv.id === currentConv?.id;
                            const lastMsg = conv.messages?.[conv.messages.length - 1];

                            return (
                                <div
                                    key={conv.id}
                                    onClick={() => handleSelectConversation(conv)}
                                    className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                                        isSelected
                                            ? 'bg-white border-l-4 border-l-[#18181b] shadow-xs'
                                            : 'hover:bg-white/60'
                                    }`}
                                >
                                    <div className="relative shrink-0">
                                        <div className="w-10 h-10 rounded-full bg-[#18181b] flex items-center justify-center font-bold text-xs text-white shadow-xs">
                                            {conv.contact?.name ? conv.contact.name.charAt(0) : 'U'}
                                        </div>
                                        <div className="absolute -bottom-1 -right-1">
                                            <PlatformIcon platform={conv.platform} className="w-3.5 h-3.5" showBg />
                                        </div>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <span className="font-bold text-xs text-[#18181b] truncate">
                                                {conv.contact?.name || conv.contact?.username}
                                            </span>
                                            <span className="text-[10px] text-[#a1a1aa] font-mono">
                                                Baru saja
                                            </span>
                                        </div>
                                        <div className="text-[11px] text-[#71717a] line-clamp-1">
                                            {lastMsg?.content || 'Belum ada pesan'}
                                        </div>
                                    </div>

                                    {conv.unread_count > 0 && (
                                        <span className="w-4 h-4 rounded-full bg-[#18181b] text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                                            {conv.unread_count}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Column 2: Chat Conversation Panel */}
                {currentConv ? (
                    <div className="flex-1 flex flex-col bg-white min-w-0">
                        {/* Chat Header */}
                        <div className="h-16 px-5 border-b border-[#e4e4e7] flex items-center justify-between bg-white">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-[#fafaf8] border border-[#e4e4e7] text-[#18181b] flex items-center justify-center font-bold text-xs">
                                    {currentConv.contact?.name?.charAt(0) || 'U'}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-xs text-[#18181b]">
                                            {currentConv.contact?.name}
                                        </span>
                                        <span className="text-[11px] text-[#71717a] font-mono">
                                            @{currentConv.contact?.username}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] text-emerald-700">
                                        <PlatformIcon platform={currentConv.platform} className="w-3 h-3" />
                                        <span className="capitalize font-medium">{currentConv.platform} Chat</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <select
                                    value={currentConv.status}
                                    onChange={(e) => handleStatusChange(e.target.value)}
                                    className="px-2.5 py-1 rounded-lg bg-[#fafaf8] border border-[#e4e4e7] text-xs text-[#18181b]"
                                >
                                    <option value="open">🟢 Terbuka (Open)</option>
                                    <option value="closed">⚪ Ditutup (Resolved)</option>
                                    <option value="snoozed">🟡 Ditunda (Snoozed)</option>
                                </select>
                            </div>
                        </div>

                        {/* Messages Thread */}
                        <div className="flex-1 p-5 overflow-y-auto space-y-4 flex flex-col justify-end text-xs bg-[#fafaf8]/40">
                            {currentConv.messages?.map((msg) => {
                                const isMe = msg.direction === 'outbound';
                                const isBot = msg.sender_type === 'bot';

                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                                    >
                                        <div
                                            className={`max-w-[75%] p-3.5 rounded-2xl whitespace-pre-line leading-relaxed shadow-xs ${
                                                isMe
                                                    ? isBot
                                                        ? 'bg-white border border-[#e4e4e7] text-[#18181b] rounded-tr-xs'
                                                        : 'bg-[#18181b] text-white rounded-tr-xs'
                                                    : 'bg-[#f4f4f5] text-[#18181b] rounded-tl-xs border border-[#e4e4e7]'
                                            }`}
                                        >
                                            {isBot && (
                                                <div className="flex items-center gap-1 text-[10px] text-[#71717a] font-semibold mb-1 pb-1 border-b border-[#e4e4e7]">
                                                    <Sparkles className="w-3 h-3 text-[#18181b]" />
                                                    <span>Bot Otomatis</span>
                                                </div>
                                            )}
                                            <p>{msg.content}</p>
                                        </div>
                                        <span className="text-[10px] text-[#a1a1aa] mt-1 px-1">
                                            {isMe ? 'Terkirim' : 'Diterima'}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Quick Reply Suggestions */}
                        <div className="px-5 py-2 border-t border-[#e4e4e7] bg-[#fafaf8] flex items-center gap-2 overflow-x-auto text-[11px]">
                            <span className="text-[#71717a] font-medium shrink-0">Balasan Cepat:</span>
                            {quickReplies.map((qr, i) => (
                                <button
                                    key={i}
                                    onClick={() => setReplyText(qr)}
                                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#f4f4f5] text-[#52525b] hover:text-[#18181b] shrink-0 border border-[#e4e4e7] transition-colors shadow-xs"
                                >
                                    {qr}
                                </button>
                            ))}
                        </div>

                        {/* Chat Composer */}
                        <form onSubmit={handleSendMessage} className="p-4 border-t border-[#e4e4e7] bg-white flex items-center gap-3">
                            <input
                                type="text"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Ketik balasan manual ke customer..."
                                className="flex-1 px-4 py-2.5 rounded-xl bg-[#fafaf8] border border-[#e4e4e7] text-xs text-[#18181b] placeholder-[#a1a1aa] focus:outline-hidden focus:border-[#18181b]"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2.5 rounded-xl bg-[#18181b] hover:bg-[#27272a] active:scale-95 text-white font-semibold text-xs shadow-xs flex items-center gap-1.5 transition-all"
                            >
                                <Send className="w-3.5 h-3.5" />
                                <span>Kirim</span>
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-[#a1a1aa] text-xs bg-white">
                        Pilih percakapan untuk mulai chat
                    </div>
                )}

                {/* Column 3: Contact CRM Profile Inspector */}
                {currentConv?.contact && (
                    <div className="hidden xl:flex w-72 border-l border-[#e4e4e7] bg-[#fafaf8] p-5 flex-col space-y-6 shrink-0">
                        <div className="text-center space-y-2">
                            <div className="w-16 h-16 rounded-full bg-[#18181b] text-white mx-auto flex items-center justify-center font-bold text-lg shadow-xs">
                                {currentConv.contact.name?.charAt(0) || 'U'}
                            </div>
                            <h3 className="font-bold text-sm text-[#18181b]">{currentConv.contact.name}</h3>
                            <div className="text-xs text-[#71717a] font-mono">@{currentConv.contact.username}</div>
                            <StatusBadge status={currentConv.contact.status} type="lead_status" />
                        </div>

                        {/* Contact Meta Info */}
                        <div className="space-y-3 pt-3 border-t border-[#e4e4e7] text-xs">
                            <div className="flex items-center gap-2.5 text-[#52525b]">
                                <Mail className="w-4 h-4 text-[#71717a]" />
                                <span className="truncate">{currentConv.contact.email || 'Email belum diisi'}</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-[#52525b]">
                                <Phone className="w-4 h-4 text-[#71717a]" />
                                <span>{currentConv.contact.phone || 'Nomor WA belum diisi'}</span>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="space-y-2 pt-3 border-t border-[#e4e4e7]">
                            <span className="text-[10px] font-bold text-[#a1a1aa] uppercase tracking-wider">
                                Segmentasi / Tags:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                                {currentConv.contact.tags?.map((tag, i) => (
                                    <span
                                        key={i}
                                        className="px-2 py-0.5 rounded-md bg-white text-[#18181b] border border-[#e4e4e7] text-[10px] font-semibold shadow-xs"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
