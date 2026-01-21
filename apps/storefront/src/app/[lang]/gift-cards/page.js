"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, use } from "react";
import { LOCALES } from "@/data/locales";
import { GiftCardBuyForm } from "@/components/gift/GiftCardBuyForm";
import { GiftCardRedeemForm } from "@/components/gift/GiftCardRedeemForm";
import { useUserInteractions } from "@/hooks/useUserInteractions";
import Image from "next/image";
import { Button } from "@vayva/ui";
export default function GiftCardsPage(props) {
    const params = use(props.params);
    const lang = (params.lang === "tr" ? "tr" : "en");
    const t = LOCALES[lang].giftCards;
    const { balance, isLoaded } = useUserInteractions();
    const [activeTab, setActiveTab] = useState("buy");
    if (!isLoaded)
        return null;
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 font-sans pb-20", children: [_jsxs("div", { className: "bg-[#0B1220] text-white pt-12 pb-24 md:pt-20 md:pb-32 px-4 relative overflow-hidden", children: [_jsxs("div", { className: "relative z-10 max-w-7xl mx-auto text-center", children: [_jsx("h1", { className: "text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6", children: t.heroTitle }), _jsx("p", { className: "text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10", children: t.heroSubtitle }), _jsxs("div", { className: "inline-flex bg-white/10 backdrop-blur-md p-1 rounded-full border border-white/5", children: [_jsx(Button, { variant: "ghost", onClick: () => setActiveTab("buy"), className: `px-8 py-3 rounded-full text-sm font-bold transition-all h-auto ${activeTab === "buy"
                                            ? "bg-white text-black shadow-lg hover:bg-white"
                                            : "text-gray-300 hover:text-white"}`, "aria-label": "Buy gift card", children: t.buyTab }), _jsx(Button, { variant: "ghost", onClick: () => setActiveTab("redeem"), className: `px-8 py-3 rounded-full text-sm font-bold transition-all h-auto ${activeTab === "redeem"
                                            ? "bg-white text-black shadow-lg hover:bg-white"
                                            : "text-gray-300 hover:text-white"}`, "aria-label": "Redeem gift card", children: t.redeemTab })] })] }), _jsxs("div", { className: "absolute inset-0 z-0 opacity-20", children: [_jsx("div", { className: "absolute top-0 right-0 w-96 h-96 bg-[#22C55E] rounded-full blur-[128px] -translate-y-1/2 translate-x-1/2" }), _jsx("div", { className: "absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-[128px] translate-y-1/2 -translate-x-1/2" })] })] }), _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-8", children: [_jsx("div", { className: "lg:col-span-8", children: activeTab === "buy" ? (_jsx(GiftCardBuyForm, { lang: lang })) : (_jsx(GiftCardRedeemForm, { lang: lang })) }), _jsxs("div", { className: "lg:col-span-4 space-y-6", children: [_jsxs("div", { className: "bg-white p-6 rounded-2xl border border-gray-100 shadow-sm", children: [_jsx("h3", { className: "text-sm font-bold text-gray-500 uppercase tracking-wider mb-2", children: t.currentBalance }), _jsxs("div", { className: "text-4xl font-bold text-black tracking-tight flex items-baseline gap-1", children: [balance.toLocaleString("tr-TR"), " ", _jsx("span", { className: "text-lg", children: "\u20BA" })] })] }), _jsxs("div", { className: "relative aspect-[1.586/1] rounded-2xl overflow-hidden shadow-2xl shadow-green-900/20 group", children: [_jsx(Image, { src: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800", alt: "Gift Card", fill: true, className: "object-cover group-hover:scale-105 transition-transform duration-700" }), _jsxs("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end", children: [_jsx("div", { className: "text-white font-bold text-xl", children: "Vayva Gift Card" }), _jsx("div", { className: "text-white/60 text-sm font-mono mt-1", children: "**** **** **** ****" })] })] }), _jsx("div", { className: "text-xs text-center text-gray-400", children: _jsxs("p", { children: ["By using this service you agree to our", " ", _jsx("a", { href: `/${lang}/terms`, className: "underline", children: "Terms" }), " ", "and", " ", _jsx("a", { href: `/${lang}/privacy`, className: "underline", children: "Privacy Policy" }), "."] }) })] })] }) })] }));
}
