"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getDemoStore } from "@/lib/preview/demo-data";
import { DemoHome } from "@/components/preview/demo/DemoHome";
import { DemoCollection } from "@/components/preview/demo/DemoCollection";
import { DemoProductView } from "@/components/preview/demo/DemoProduct";
import Link from "next/link";
import { Button, cn } from "@vayva/ui";
class PreviewErrorBoundary extends React.Component {
    constructor() {
        super(...arguments);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() {
        return { hasError: true };
    }
    render() {
        return this.state.hasError ? this.props.fallback : this.props.children;
    }
}
function clamp(v, allowed, fallback) {
    return allowed.includes(v ?? "") ? v : fallback;
}
export function LivePreviewClient({ templateName, slug, LayoutComponent, fallbackDesktopImage, fallbackMobileImage, storeData, }) {
    const router = useRouter();
    const params = useSearchParams();
    const supportsLive = Boolean(LayoutComponent);
    // SAFETY: Only use demo data if no real store data is provided
    // This supports both Template Gallery (Demo) and Store Builder (Live)
    const demoStore = React.useMemo(() => getDemoStore(slug), [slug]);
    const demo = storeData || demoStore; // Minimal change to support real data injection
    const initialMode = clamp(params.get("mode"), ["live", "images"], supportsLive ? "live" : "images");
    const initialDevice = clamp(params.get("device"), ["desktop", "mobile"], "desktop");
    const initialView = clamp(params.get("view"), ["home", "collection", "product"], "home");
    const initialCategoryParam = params.get("category");
    const initialCategory = demo.categories.includes(initialCategoryParam ?? "")
        ? initialCategoryParam
        : demo.categories[0];
    const [mode, setMode] = React.useState(supportsLive ? initialMode : "images");
    const [device, setDevice] = React.useState(initialDevice);
    const [view, setView] = React.useState(initialView);
    const [activeCategory, setActiveCategory] = React.useState(initialCategory);
    // If a link forces mode=live but the component isn't mapped, force images.
    React.useEffect(() => {
        if (!supportsLive && mode === "live")
            setMode("images");
    }, [supportsLive, mode]);
    // Keep activeCategory valid if slug changes / demo categories change.
    React.useEffect(() => {
        if (!demo.categories.includes(activeCategory)) {
            setActiveCategory(demo.categories[0] ?? "New In");
        }
    }, [slug]);
    // Sync UI state to URL query params (shareable links)
    React.useEffect(() => {
        const qs = new URLSearchParams(params?.toString() ?? "");
        qs.set("mode", supportsLive ? mode : "images");
        qs.set("device", device);
        qs.set("view", view);
        if (view === "collection")
            qs.set("category", activeCategory);
        else
            qs.delete("category");
        router.replace(`?${qs.toString()}`, { scroll: false });
    }, [mode, device, view, activeCategory, supportsLive]);
    const imageSrc = device === "desktop" ? fallbackDesktopImage : fallbackMobileImage;
    const imageFallback = (_jsx("div", { className: "mx-auto max-w-6xl px-4 py-10", children: _jsx("div", { className: device === "mobile" ? "mx-auto max-w-sm" : "", children: _jsx("img", { src: imageSrc, alt: `${templateName} ${device} preview`, className: "w-full rounded-xl border" }) }) }));
    const product = demo.products[0];
    const children = view === "home" ? (_jsx(DemoHome, { demo: demo })) : view === "collection" ? (_jsxs("div", { children: [_jsx("div", { className: "mx-auto max-w-6xl px-4 pt-6", children: _jsx("div", { className: "flex flex-wrap gap-2", children: demo.categories.map((c) => (_jsx(Button, { variant: "ghost", onClick: () => setActiveCategory(c), className: cn("rounded-full border px-3 py-1 text-sm h-auto", c === activeCategory
                            ? "bg-black text-white hover:bg-black/90 hover:text-white"
                            : "hover:bg-gray-100"), children: c }, c))) }) }), _jsx(DemoCollection, { demo: demo, activeCategory: activeCategory })] })) : (_jsx(DemoProductView, { product: product }));
    return (_jsxs("div", { children: [_jsx("div", { className: "sticky top-0 z-50 border-b bg-white/80 backdrop-blur", children: _jsxs("div", { className: "mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3", children: [_jsxs("div", { className: "min-w-0", children: [_jsxs("div", { className: "truncate text-sm font-medium", children: ["Preview - ", templateName] }), _jsxs("div", { className: "truncate text-xs text-muted-foreground", children: ["/preview/", slug] })] }), _jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [_jsxs("div", { className: "flex overflow-hidden rounded-lg border bg-white", children: [_jsx(Button, { variant: "ghost", onClick: () => setMode("live"), disabled: !supportsLive, className: cn("px-3 py-2 text-sm h-auto rounded-none", mode === "live"
                                                ? "bg-black text-white hover:bg-black/90 hover:text-white"
                                                : "hover:bg-gray-100", !supportsLive && "opacity-50"), children: "Live" }), _jsx(Button, { variant: "ghost", onClick: () => setMode("images"), className: cn("px-3 py-2 text-sm h-auto rounded-none", mode === "images"
                                                ? "bg-black text-white hover:bg-black/90 hover:text-white"
                                                : "hover:bg-gray-100"), children: "Images" })] }), _jsxs("div", { className: "flex overflow-hidden rounded-lg border bg-white", children: [_jsx(Button, { variant: "ghost", onClick: () => setDevice("desktop"), className: cn("px-3 py-2 text-sm h-auto rounded-none", device === "desktop"
                                                ? "bg-black text-white hover:bg-black/90 hover:text-white"
                                                : "hover:bg-gray-100"), children: "Desktop" }), _jsx(Button, { variant: "ghost", onClick: () => setDevice("mobile"), className: cn("px-3 py-2 text-sm h-auto rounded-none", device === "mobile"
                                                ? "bg-black text-white hover:bg-black/90 hover:text-white"
                                                : "hover:bg-gray-100"), children: "Mobile" })] }), mode === "live" && supportsLive && (_jsxs("div", { className: "flex overflow-hidden rounded-lg border bg-white", children: [_jsx(Button, { variant: "ghost", onClick: () => setView("home"), className: cn("px-3 py-2 text-sm h-auto rounded-none", view === "home"
                                                ? "bg-black text-white hover:bg-black/90 hover:text-white"
                                                : "hover:bg-gray-100"), children: "Home" }), _jsx(Button, { variant: "ghost", onClick: () => setView("collection"), className: cn("px-3 py-2 text-sm h-auto rounded-none", view === "collection"
                                                ? "bg-black text-white hover:bg-black/90 hover:text-white"
                                                : "hover:bg-gray-100"), children: "Collection" }), _jsx(Button, { variant: "ghost", onClick: () => setView("product"), className: cn("px-3 py-2 text-sm h-auto rounded-none", view === "product"
                                                ? "bg-black text-white hover:bg-black/90 hover:text-white"
                                                : "hover:bg-gray-100"), children: "Product" })] })), _jsx(Link, { href: `/dashboard/control-center/templates?intent=${slug}`, className: "flex-1 bg-gray-900 text-white text-center py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors", children: "Customize in Builder" })] })] }) }), mode === "live" && supportsLive && LayoutComponent ? (_jsx(PreviewErrorBoundary, { fallback: imageFallback, children: _jsx("div", { className: device === "mobile" ? "mx-auto max-w-sm" : "", children: _jsx(LayoutComponent, { storeName: demo.storeName, slug: demo.slug, plan: demo.plan, children: children }) }) })) : (imageFallback)] }));
}
