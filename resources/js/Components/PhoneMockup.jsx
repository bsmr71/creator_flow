import React, { useState } from 'react';
import { ExternalLink, Check, Phone, Video, ChevronLeft, Camera, Mic } from 'lucide-react';
import PlatformIcon from './PlatformIcon';

export default function PhoneMockup({
    platform: initialPlatform = 'instagram',
    accountName = 'lumina.store',
    triggerKeyword = 'MAU',
    userComment = 'Mau link diskon 50% nya dong kak!',
    messageBody = 'Halo kak! Makasih udah tertarik dengan koleksi kami 🙌\n\nKlik link di bawah ini untuk klaim voucher diskon 50% Anda:',
    buttons = [
        { title: '🛍️ Beli via Shopee / Web', url: '#' },
        { title: '💬 Konsultasi via WhatsApp', url: '#' }
    ],
    showPlatformToggle = true
}) {
    const [activePlatform, setActivePlatform] = useState(initialPlatform);
    const [clickedBtn, setClickedBtn] = useState(null);

    const isWhatsApp = activePlatform === 'whatsapp';

    const handleButtonClick = (idx) => {
        setClickedBtn(idx);
        setTimeout(() => setClickedBtn(null), 1200);
    };

    return (
        <div className="relative mx-auto w-[310px] sm:w-[335px] select-none transition-all duration-500 hover:rotate-0 transform [transform:perspective(1200px)_rotateY(-3deg)_rotateX(2deg)]">
            {/* Platform Toggle Pills (Clean natural style) */}
            {showPlatformToggle && (
                <div className="flex items-center justify-center mb-3">
                    <div className="inline-flex items-center p-1 rounded-full bg-slate-200/70 border border-slate-300/60 shadow-xs">
                        <button
                            type="button"
                            onClick={() => setActivePlatform('instagram')}
                            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                                !isWhatsApp
                                    ? 'bg-white text-slate-900 shadow-sm font-bold'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            <PlatformIcon platform="instagram" className="w-3.5 h-3.5" />
                            <span>Instagram DM</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setActivePlatform('whatsapp')}
                            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                                isWhatsApp
                                    ? 'bg-[#075e54] text-white shadow-sm font-bold'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            <PlatformIcon platform="whatsapp" className="w-3.5 h-3.5" />
                            <span>WhatsApp API</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Outer iPhone Bezel (Authentic Midnight Matte Finish) */}
            <div className="relative rounded-[50px] p-2.5 bg-[#0f1115] border-2 border-slate-700/60 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.28),0_12px_28px_-6px_rgba(0,0,0,0.15)] ring-1 ring-black/10">
                {/* Dynamic Island Notch */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-30 flex items-center justify-between px-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#181818]"></div>
                    <div className="w-2 h-2 rounded-full bg-[#0e1724]"></div>
                </div>

                {/* iPhone Inner Screen */}
                <div className={`relative rounded-[40px] overflow-hidden flex flex-col h-[580px] transition-colors duration-200 ${
                    isWhatsApp ? 'bg-[#efeae2]' : 'bg-white'
                }`}>
                    {/* Status Bar */}
                    <div className={`pt-3.5 px-7 pb-1.5 flex justify-between items-center text-[12px] font-semibold z-20 ${
                        isWhatsApp ? 'bg-[#075e54] text-white' : 'bg-white text-slate-900'
                    }`}>
                        <span className="font-semibold tracking-tight">09:41</span>
                        <div className="flex items-center gap-1.5">
                            <div className="flex items-end gap-0.5 h-2.5">
                                <span className="w-0.5 h-1 bg-current rounded-full"></span>
                                <span className="w-0.5 h-1.5 bg-current rounded-full"></span>
                                <span className="w-0.5 h-2 bg-current rounded-full"></span>
                                <span className="w-0.5 h-2.5 bg-current rounded-full"></span>
                            </div>
                            <div className="w-5 h-2.5 border border-current rounded-[3px] p-[1px] flex items-center">
                                <div className="h-full w-3/4 bg-current rounded-[1px]"></div>
                            </div>
                        </div>
                    </div>

                    {/* Chat Header */}
                    {isWhatsApp ? (
                        /* WhatsApp Header */
                        <div className="px-3.5 py-2.5 bg-[#075e54] text-white flex items-center justify-between z-10 shadow-sm">
                            <div className="flex items-center gap-1.5 min-w-0">
                                <ChevronLeft className="w-5 h-5 cursor-pointer opacity-90" />
                                <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-white text-xs font-bold border border-emerald-400/40">
                                    WA
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-1">
                                        <span className="font-bold text-xs truncate">CreatorFlow Official</span>
                                        <span className="text-[10px] bg-emerald-400 text-[#075e54] px-1 rounded font-black">✓</span>
                                    </div>
                                    <span className="text-[10.5px] text-emerald-200 block leading-tight">Bisnis Terverifikasi</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 opacity-90">
                                <Phone className="w-4 h-4 cursor-pointer" />
                                <Video className="w-4 h-4 cursor-pointer" />
                            </div>
                        </div>
                    ) : (
                        /* Instagram Header */
                        <div className="px-3.5 py-2.5 bg-white border-b border-slate-100 flex items-center justify-between z-10">
                            <div className="flex items-center gap-2 min-w-0">
                                <ChevronLeft className="w-5 h-5 text-slate-800 cursor-pointer" />
                                <div className="relative flex-shrink-0">
                                    <div className="p-[2px] rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600">
                                        <div className="w-7 h-7 rounded-full bg-white p-[1.5px]">
                                            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white text-[10px] font-bold">
                                                CF
                                            </div>
                                        </div>
                                    </div>
                                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-1">
                                        <span className="font-bold text-[13px] text-slate-900 truncate tracking-tight">
                                            {accountName}
                                        </span>
                                        <span className="w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center text-[9px] text-white font-bold">
                                            ✓
                                        </span>
                                    </div>
                                    <span className="text-[10px] text-slate-500 block leading-tight">Aktif sekarang</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2.5 text-slate-700">
                                <Phone className="w-4 h-4" />
                                <Video className="w-4 h-4" />
                            </div>
                        </div>
                    )}

                    {/* Chat Messages Body */}
                    <div className="flex-1 p-3.5 overflow-y-auto space-y-3 flex flex-col justify-end text-[12.5px]">
                        <div className="text-center text-[10px] text-slate-400 font-medium my-0.5">
                            Hari ini 09:41
                        </div>

                        {/* Inbound Comment / Trigger */}
                        <div className="flex items-end gap-1.5 self-start max-w-[85%]">
                            {!isWhatsApp && (
                                <div className="w-6 h-6 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-slate-600">
                                    👤
                                </div>
                            )}
                            <div className={`px-3 py-2 rounded-2xl ${
                                isWhatsApp
                                    ? 'bg-white text-slate-900 rounded-bl-xs shadow-xs border border-slate-200/60'
                                    : 'bg-[#efefef] text-[#262626] rounded-bl-xs'
                            }`}>
                                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                                    {isWhatsApp ? 'Pesan Masuk:' : 'Komentar di Reel:'}
                                </div>
                                <p className="leading-snug">{userComment || `${triggerKeyword} info dong kak`}</p>
                            </div>
                        </div>

                        {/* Outbound Auto-Reply from Bot */}
                        <div className="self-end max-w-[90%] space-y-1.5">
                            <div className={`p-3 rounded-2xl shadow-xs space-y-2 ${
                                isWhatsApp
                                    ? 'bg-[#dcf8c6] text-slate-900 rounded-br-xs border border-emerald-200/60'
                                    : 'bg-[#0095f6] text-white rounded-br-xs'
                            }`}>
                                <p className="leading-relaxed text-[12px] whitespace-pre-line">
                                    {messageBody}
                                </p>

                                {/* Action Buttons Inside Chat */}
                                {buttons && buttons.length > 0 && (
                                    <div className="space-y-1.5 pt-1">
                                        {buttons.map((btn, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => handleButtonClick(idx)}
                                                className={`w-full py-2 px-3 rounded-xl text-left transition-all flex items-center justify-between text-[11px] font-semibold ${
                                                    isWhatsApp
                                                        ? 'bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300/80 shadow-xs'
                                                        : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border-l-4 border-[#d1fe17]'
                                                }`}
                                            >
                                                <span>{btn.title}</span>
                                                <ExternalLink className="w-3 h-3 opacity-90" />
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {clickedBtn !== null && (
                                    <div className="text-[10px] text-center font-bold text-emerald-700 bg-white/80 rounded-md py-0.5">
                                        ✓ Tautan berhasil dibuka oleh calon pembeli!
                                    </div>
                                )}
                            </div>

                            {/* Response Confirmation Badge */}
                            <div className="flex items-center justify-end gap-1 text-[10px] text-emerald-600 font-semibold pr-1">
                                <Check className="w-3 h-3 text-emerald-500 stroke-[3]" />
                                <span>Terkirim otomatis dalam 0.08 detik</span>
                            </div>
                        </div>

                        {/* Follower Thank-you Response */}
                        <div className="flex items-end gap-1.5 self-start max-w-[85%]">
                            {!isWhatsApp && (
                                <div className="w-6 h-6 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-slate-600">
                                    👤
                                </div>
                            )}
                            <div className={`px-3 py-2 rounded-2xl ${
                                isWhatsApp
                                    ? 'bg-white text-slate-900 rounded-bl-xs shadow-xs border border-slate-200/60'
                                    : 'bg-[#efefef] text-[#262626] rounded-bl-xs'
                            }`}>
                                Wah langsung dibalas, makasih kak! Mau langsung checkout 🙌
                            </div>
                        </div>
                    </div>

                    {/* Bottom Input Field */}
                    <div className={`p-2.5 border-t flex items-center gap-2 ${
                        isWhatsApp ? 'bg-[#f0f2f5] border-slate-200' : 'bg-white border-slate-100'
                    }`}>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white flex-shrink-0 ${
                            isWhatsApp ? 'bg-[#075e54]' : 'bg-[#0095f6]'
                        }`}>
                            <Camera className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 bg-white border border-slate-200 rounded-full px-3 py-1.5 text-[11px] text-slate-400 flex items-center justify-between shadow-xs">
                            <span>Ketik pesan...</span>
                            <Mic className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                    </div>

                    {/* Bottom Home Indicator */}
                    <div className={`pb-1 flex justify-center ${isWhatsApp ? 'bg-[#f0f2f5]' : 'bg-white'}`}>
                        <div className="w-24 h-1 bg-slate-300 rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
