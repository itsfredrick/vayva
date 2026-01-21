"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from "next/link";
import { Icon, cn, Button } from "@vayva/ui";
export const StorefrontSnapshot = ({ store }) => {
    if (!store)
        return null;
    const isPublished = store.status === "published";
    const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN || "vayva.ng";
    const storefrontBase = process.env.NEXT_PUBLIC_STOREFRONT_URL ||
        (process.env.NODE_ENV === "production" ? "https://vayva.store" : "http://localhost:3001");
    const storeUrl = isPublished
        ? `https://${store.slug}.${APP_DOMAIN}`
        : `${storefrontBase}?store=${store.slug}`;
    const handleCopyLink = () => {
        navigator.clipboard.writeText(storeUrl);
        // Toast would go here
    };
    return (_jsxs("div", { className: "bg-[#0A0F0D] border border-white/10 rounded-2xl p-6 flex flex-col h-full relative overflow-hidden group", children: [_jsxs("div", { className: "flex items-start justify-between mb-6", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-16 h-16 rounded-xl border border-white/10 flex items-center justify-center overflow-hidden bg-white/5", style: {
                                    backgroundColor: store.brandColor
                                        ? `${store.brandColor}20`
                                        : undefined,
                                }, children: store.logoUrl ? (_jsx("img", { src: store.logoUrl, alt: store.name, className: "w-full h-full object-cover" })) : (_jsx("span", { className: "text-2xl font-bold text-white uppercase", children: store.name[0] })) }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-bold text-white mb-1", children: store.name }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("span", { className: "text-sm text-text-secondary", children: [APP_DOMAIN, "/", store.slug] }), _jsx(Button, { onClick: handleCopyLink, className: "text-text-secondary hover:text-white transition-colors", variant: "outline", children: _jsx(Icon, { name: "Copy", size: 14 }) })] })] })] }), _jsx("div", { className: cn("px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border", isPublished
                            ? "bg-green-500/10 text-green-500 border-green-500/20"
                            : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"), children: isPublished ? "Live" : store.status.replace("_", " ") })] }), _jsxs("div", { className: "bg-white/5 rounded-xl p-4 mb-6 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs text-text-secondary mb-1", children: "Current Theme" }), _jsx("p", { className: "text-sm font-bold text-white capitalize", children: (store.selectedTemplateId || "default").replace("-", " ") })] }), _jsx(Link, { href: "/dashboard/control-center/templates", children: _jsx(Button, { className: "text-xs text-primary hover:text-primary/80 font-medium transition-colors", variant: "primary", children: "Change Theme" }) })] }), _jsxs("div", { className: "flex items-center gap-3 mt-auto", children: [_jsx("a", { href: storeUrl, target: "_blank", rel: "noreferrer", className: "flex-1", children: _jsx(Button, { className: "w-full h-10 rounded-lg bg-white text-black font-bold text-sm hover:bg-white/90 transition-colors", variant: "ghost", children: "Preview Store" }) }), _jsx(Link, { href: "/dashboard/control-center", className: "flex-1", children: _jsx(Button, { className: "w-full h-10 rounded-lg border border-white/20 text-white font-bold text-sm hover:bg-white/5 transition-colors", variant: "outline", children: "Customize" }) })] })] }));
};
