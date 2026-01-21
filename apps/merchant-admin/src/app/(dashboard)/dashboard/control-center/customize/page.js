"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@vayva/ui";
import { useAuth } from "@/context/AuthContext";
import { ThemeCustomizer } from "@/components/control-center/ThemeCustomizer";
import { toast } from "sonner";
import { Loader2, Monitor, Smartphone, Globe, ArrowLeft } from "lucide-react";
export default function StorefrontCustomizePage() {
    const { merchant } = useAuth();
    const router = useRouter();
    const [draft, setDraft] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState("desktop");
    const [isSaving, setIsSaving] = useState(false);
    const iframeRef = useRef(null);
    useEffect(() => {
        loadDraft();
    }, []);
    const loadDraft = async () => {
        try {
            const res = await fetch("/api/control-center/draft");
            if (!res.ok)
                throw new Error("Failed to load draft");
            const data = await res.json();
            setDraft(data);
        }
        catch (error) {
            toast.error("Could not load storefront draft");
        }
        finally {
            setLoading(false);
        }
    };
    const handleUpdate = async (newConfig) => {
        // 1. Sync local status
        setDraft({ ...draft, themeConfig: newConfig });
        // 2. Send message to iframe for instant preview
        if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage({
                type: "VAYVA_PREVIEW_UPDATE",
                config: newConfig
            }, "*");
        }
        // 3. Persist to DB (Debounced or on Blur? For now simple patch)
        // Note: Real Shopify debounces this to avoid spamming the DB
        try {
            await fetch("/api/control-center/draft", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ themeConfig: newConfig })
            });
        }
        catch (e) {
            console.error("Auto-save failed", e);
        }
    };
    const handlePublish = async () => {
        setIsSaving(true);
        try {
            const res = await fetch("/api/control-center/publish", { method: "POST" });
            if (!res.ok)
                throw new Error("Publish failed");
            toast.success("Storefront Published Live!");
        }
        catch (error) {
            toast.error("Failed to publish");
        }
        finally {
            setIsSaving(false);
        }
    };
    if (loading)
        return (_jsx("div", { className: "h-screen flex items-center justify-center", children: _jsx(Loader2, { className: "animate-spin w-10 h-10 text-gray-200" }) }));
    if (!draft)
        return (_jsxs("div", { className: "h-screen flex flex-col items-center justify-center space-y-4", children: [_jsx("p", { className: "text-gray-500", children: "Pick a template before customizing." }), _jsx(Button, { onClick: () => router.push("/dashboard/control-center"), children: "View Gallery" })] }));
    const storefrontUrl = `${process.env.NEXT_PUBLIC_STOREFRONT_URL || "http://localhost:3001"}/?store=${draft.store?.slug}&preview=true`;
    return (_jsxs("div", { className: "h-screen flex flex-col bg-gray-50 overflow-hidden", children: [_jsxs("div", { className: "h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-20", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx(Button, { variant: "ghost", onClick: () => router.back(), className: "h-auto p-2", children: _jsx(ArrowLeft, { size: 18 }) }), _jsxs("div", { children: [_jsx("h1", { className: "font-bold text-sm leading-none", children: draft.template?.displayName }), _jsx("p", { className: "text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold", children: "Draft Editor" })] })] }), _jsxs("div", { className: "flex bg-gray-100 p-1 rounded-lg", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: () => setViewMode("desktop"), className: `p-1.5 h-auto rounded ${viewMode === "desktop" ? "bg-white shadow-sm" : "hover:bg-gray-200 text-gray-400"}`, title: "Desktop View", children: _jsx(Monitor, { size: 16 }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => setViewMode("mobile"), className: `p-1.5 h-auto rounded ${viewMode === "mobile" ? "bg-white shadow-sm" : "hover:bg-gray-200 text-gray-400"}`, title: "Mobile View", children: _jsx(Smartphone, { size: 16 }) })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(Button, { variant: "outline", size: "sm", className: "hidden sm:flex", children: [_jsx(Globe, { size: 14, className: "mr-2" }), " View Live"] }), _jsx(Button, { onClick: handlePublish, disabled: isSaving, size: "sm", children: isSaving ? _jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : "Publish Live" })] })] }), _jsxs("div", { className: "flex-1 flex min-h-0", children: [_jsx(ThemeCustomizer, { draft: draft, onUpdate: handleUpdate, onReset: () => loadDraft() }), _jsxs("div", { className: "flex-1 bg-gray-100 p-8 flex justify-center overflow-auto relative", children: [_jsx("div", { className: `bg-white shadow-2xl transition-all duration-300 overflow-hidden ${viewMode === "desktop" ? "w-full h-full" : "w-[375px] h-[667px] rounded-[32px] border-[8px] border-black"}`, children: _jsx("iframe", { ref: iframeRef, src: storefrontUrl, className: "w-full h-full border-none", title: "Storefront Preview" }) }), _jsxs("div", { className: "absolute bottom-4 right-4 bg-white/80 backdrop-blur shadow-sm border border-gray-100 px-3 py-1.5 rounded-full text-[10px] font-bold text-gray-400 flex items-center gap-2", children: [_jsx("div", { className: "w-2 h-2 rounded-full bg-green-500 animate-pulse" }), "Live Synchronized"] })] })] })] }));
}
