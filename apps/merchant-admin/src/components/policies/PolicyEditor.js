"use client";
import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Button } from "@vayva/ui"; // Assuming these exist
import { getLegalDocument } from "@vayva/content";
import { Loader2, Save, Globe, RefreshCcw, } from "lucide-react";
import { useRouter } from "next/navigation";
export const PolicyEditor = ({ type, initialContent, onSave, storeSlug, }) => {
    const [content, setContent] = useState(initialContent || "");
    const [isSaving, setIsSaving] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const router = useRouter();
    useEffect(() => {
        if (initialContent)
            setContent(initialContent);
    }, [initialContent]);
    const handleChange = (e) => {
        setContent(e.target.value);
        setIsDirty(true);
    };
    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave(content);
            setIsDirty(false);
        }
        catch (error) {
            console.error("Failed to save", error);
        }
        finally {
            setIsSaving(false);
        }
    };
    const handleReset = () => {
        // Get default content from registry
        const defaultDoc = getLegalDocument(type === "returns"
            ? "store-return-policy"
            : type === "shipping"
                ? "store-shipping-policy"
                : type === "privacy"
                    ? "store-privacy-policy"
                    : "store-terms-of-service");
        if (defaultDoc) {
            // Extract plain text or simple markdown from sections
            // This is a simplification; ideally we'd have a 'raw' export or similar
            // For now, let's just use a placeholder or try to reconstruct
            const text = defaultDoc.sections
                .map((s) => `## ${s.heading}\n\n${s.content.join("\n\n")}`)
                .join("\n\n");
            setContent(text);
            setIsDirty(true);
        }
    };
    const handleViewOnStorefront = () => {
        // SAFETY: Use configured URL or generic fallback. In production, this must be set.
        const fallback = process.env.NODE_ENV === "production" ? "https://vayva.ng" : "http://localhost:3001";
        const storefrontBase = process.env.NEXT_PUBLIC_STOREFRONT_URL || fallback;
        window.open(`${storefrontBase}/policies/${type}?store=${storeSlug}`, "_blank");
    };
    return (_jsxs("div", { className: "flex flex-col h-[calc(100vh-100px)] relative", children: [_jsxs("div", { className: "flex items-center justify-between mb-4 pb-4 border-b border-gray-100", children: [_jsx("div", { className: "flex items-center gap-4", children: _jsxs("div", { children: [_jsxs("h2", { className: "text-xl font-bold capitalize", children: [type, " Policy"] }), _jsxs("p", { className: "text-sm text-gray-500", children: ["Edit the ", type, " policy for your store."] })] }) }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Button, { variant: "outline", size: "sm", onClick: handleReset, title: "Reset to Template", children: [_jsx(RefreshCcw, { size: 14, className: "mr-2" }), "Reset"] }), _jsxs(Button, { variant: "outline", size: "sm", onClick: handleViewOnStorefront, children: [_jsx(Globe, { size: 14, className: "mr-2" }), "Storefront"] })] })] }), _jsxs("div", { className: "flex-1 w-full flex gap-6 overflow-hidden", children: [_jsxs("div", { className: "flex-1 flex flex-col", children: [_jsxs("div", { className: "mb-2 flex items-center justify-between", children: [_jsx("label", { className: "text-xs font-bold text-gray-400 uppercase", children: "Markdown Editor" }), _jsx("span", { className: "text-xs text-gray-400", children: "Supports Basic Markdown (**bold**, - list, # heading)" })] }), _jsx("textarea", { className: "flex-1 w-full p-6 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-black/5 font-mono text-sm leading-relaxed", value: content, onChange: handleChange, placeholder: `Enter your ${type} policy here...` })] }), _jsxs("div", { className: "hidden lg:flex flex-1 flex-col bg-gray-50 rounded-xl border border-gray-100 p-6 overflow-y-auto", children: [_jsx("div", { className: "mb-4 flex items-center justify-between", children: _jsx("label", { className: "text-xs font-bold text-gray-400 uppercase", children: "Preview" }) }), _jsx("div", { className: "prose prose-sm max-w-none", children: content.split("\n").map((line, i) => (_jsx("p", { className: line.startsWith("#")
                                        ? "font-bold text-lg mb-2"
                                        : "mb-2 text-gray-600", children: line.replace(/^#+\s/, "") }, i))) })] })] }), _jsxs("div", { className: "absolute bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur border-t border-gray-100 flex items-center justify-end gap-3 rounded-b-xl", children: [isDirty && (_jsx("span", { className: "text-xs text-amber-600 font-medium mr-auto", children: "Unsaved changes" })), _jsx(Button, { variant: "ghost", onClick: () => setContent(initialContent || ""), disabled: !isDirty, children: "Discard" }), _jsxs(Button, { onClick: handleSave, disabled: isSaving || !isDirty, className: "bg-black text-white hover:bg-gray-800", children: [isSaving ? (_jsx(Loader2, { className: "animate-spin mr-2", size: 16 })) : (_jsx(Save, { className: "mr-2", size: 16 })), "Save Changes"] })] })] }));
};
