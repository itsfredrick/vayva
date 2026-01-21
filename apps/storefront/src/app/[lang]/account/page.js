"use client";
import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { use, useEffect, useState } from "react";
import { LOCALES } from "@/data/locales";
import { Gift, Package, Utensils, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StoreShell } from "@/components/StoreShell";
import { Button } from "@vayva/ui";
export default function AccountPage({ params, }) {
    const { lang: rawLang } = use(params);
    const lang = (rawLang === "tr" ? "tr" : "en");
    const t = LOCALES[lang].account.overview;
    const router = useRouter();
    const [user, setUser] = useState(null);
    // Auth Guard (Test)
    useEffect(() => {
        const savedUser = localStorage.getItem("vayva_user");
        if (!savedUser) {
            router.push(`/${lang}/account/login`);
        }
        else {
            setUser(JSON.parse(savedUser));
        }
    }, [lang, router]);
    const handleLogout = () => {
        localStorage.removeItem("vayva_user");
        document.cookie =
            "vayva_storefront_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        router.push(`/${lang}/account/login`);
    };
    if (!user)
        return null; // Or a loading spinner
    return (_jsx(StoreShell, { children: _jsx("div", { className: "min-h-screen bg-gray-50 py-12 md:py-20 bg-noise", children: _jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8", children: [_jsxs("div", { className: "bg-[#0B1220] rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl transition-transform hover:scale-[1.01]", children: [_jsxs("div", { className: "relative z-10 flex justify-between items-start", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-3xl font-bold mb-2", children: [t.welcome, ", ", user.name, "!"] }), _jsx("p", { className: "opacity-60 font-mono text-sm", children: user.email })] }), _jsx(Button, { variant: "ghost", size: "icon", onClick: handleLogout, className: "text-white/50 hover:text-white transition-colors h-auto", "aria-label": "Logout", children: _jsx(LogOut, { size: 20 }) })] }), _jsx("div", { className: "absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "glass-panel p-6 rounded-2xl", children: [_jsx("h2", { className: "text-xs font-bold text-gray-400 uppercase tracking-wider mb-4", children: t.planTitle }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "text-xl font-bold text-gray-900", children: t.planDesc }), _jsx("div", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full bg-green-100 text-green-800 text-xs font-bold", children: "Active" })] })] }), _jsxs("div", { className: "glass-panel p-6 rounded-2xl", children: [_jsx("h2", { className: "text-xs font-bold text-gray-400 uppercase tracking-wider mb-4", children: t.quickLinks }), _jsxs("div", { className: "grid grid-cols-1 gap-3", children: [_jsxs(Link, { href: `/${lang}/menu`, className: "group flex items-center gap-3 p-3 rounded-xl hover:bg-black/5 transition-all", children: [_jsx("div", { className: "w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform", children: _jsx(Utensils, { size: 18 }) }), _jsx("span", { className: "font-bold text-gray-700 group-hover:text-black", children: t.menu })] }), _jsxs(Link, { href: `/${lang}/past-deliveries`, className: "group flex items-center gap-3 p-3 rounded-xl hover:bg-black/5 transition-colors", children: [_jsx("div", { className: "w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform", children: _jsx(Package, { size: 18 }) }), _jsx("span", { className: "font-bold text-gray-700 group-hover:text-black", children: t.history })] }), _jsxs(Link, { href: `/${lang}/favorites`, className: "group flex items-center gap-3 p-3 rounded-xl hover:bg-black/5 transition-colors", children: [_jsx("div", { className: "w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform", children: _jsx(Gift, { size: 18 }) }), _jsx("span", { className: "font-bold text-gray-700 group-hover:text-black", children: t.gift })] })] })] })] })] }) }) }));
}
