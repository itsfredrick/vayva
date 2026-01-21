"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@vayva/ui";
import { Share2 } from "lucide-react";
import { useStorefrontStore } from "@/hooks/storefront/useStorefront";
export default function GiveFlowHome({ storeName: initialStoreName, storeSlug, }) {
    const { store } = useStorefrontStore(storeSlug);
    const displayName = store?.name || initialStoreName || "GiveFlow Charity";
    const campaigns = [
        {
            id: 1,
            name: "Clean Water Initiative",
            raised: 450000,
            goal: 1000000,
            image: "https://images.unsplash.com/photo-1541252260730-0412e8e2108e?auto=format&fit=crop&q=80&w=800",
        },
        {
            id: 2,
            name: "Education for All",
            raised: 125000,
            goal: 500000,
            image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800",
        },
        {
            id: 3,
            name: "Community Health Clinic",
            raised: 890000,
            goal: 900000,
            image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800",
        },
    ];
    return (_jsxs("div", { className: "min-h-screen bg-emerald-50 font-sans text-gray-900", children: [_jsx("nav", { className: "bg-white shadow-sm sticky top-0 z-40", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 h-20 flex items-center justify-between", children: [_jsx("div", { className: "text-2xl font-bold tracking-tight text-emerald-800", children: displayName }), _jsx(Button, { className: "bg-emerald-600 text-white px-6 py-2 rounded-full font-bold hover:bg-emerald-700", children: "Donate Now" })] }) }), _jsxs("div", { className: "relative h-[60vh] bg-emerald-900 overflow-hidden flex items-center justify-center text-center text-white px-4", children: [_jsx("div", { className: "absolute inset-0 opacity-40", children: _jsx("img", { src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=2000", className: "w-full h-full object-cover" }) }), _jsxs("div", { className: "relative z-10 max-w-3xl", children: [_jsx("h1", { className: "text-5xl font-bold mb-6", children: "Make a Difference Today" }), _jsx("p", { className: "text-xl mb-8 opacity-90", children: "Join our mission to create sustainable change in communities worldwide." }), _jsx("div", { className: "flex justify-center gap-4", children: _jsx(Button, { className: "bg-white text-emerald-900 px-8 py-3 rounded-full font-bold hover:bg-gray-100", children: "Our Campaigns" }) })] })] }), _jsxs("div", { className: "max-w-7xl mx-auto px-4 py-20", children: [_jsx("h2", { className: "text-3xl font-bold text-center mb-12 text-emerald-900", children: "Active Campaigns" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: campaigns.map((c) => (_jsxs("div", { className: "bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow", children: [_jsxs("div", { className: "h-48 relative", children: [_jsx("img", { src: c.image, alt: c.name, className: "w-full h-full object-cover" }), _jsx(Button, { className: "absolute top-4 right-4 bg-white/80 p-2 rounded-full hover:bg-white text-emerald-600", children: _jsx(Share2, { className: "w-4 h-4" }) })] }), _jsxs("div", { className: "p-6", children: [_jsx("h3", { className: "font-bold text-xl mb-2", children: c.name }), _jsx("div", { className: "w-full bg-gray-100 h-3 rounded-full mb-4 overflow-hidden", children: _jsx("div", { className: "bg-emerald-500 h-full rounded-full", style: { width: `${Math.min((c.raised / c.goal) * 100, 100)}%` } }) }), _jsxs("div", { className: "flex justify-between text-sm font-medium mb-6", children: [_jsxs("span", { className: "text-emerald-700", children: ["\u20A6", c.raised.toLocaleString(), " raised"] }), _jsxs("span", { className: "text-gray-400", children: ["Goal: \u20A6", c.goal.toLocaleString()] })] }), _jsx(Button, { className: "w-full border-2 border-emerald-600 text-emerald-600 py-2 rounded-xl font-bold hover:bg-emerald-50", children: "Donate" })] })] }, c.id))) })] })] }));
}
