
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@vayva/ui";
import { ThemeCustomizer } from "@/components/control-center/ThemeCustomizer";
import { toast } from "sonner";
import { Loader2, Monitor, Smartphone, Globe, ArrowLeft } from "lucide-react";
import { buildPreviewStorefrontUrl } from "@/lib/storefront/urls";

interface StorefrontDraft {
    store: {
        slug: string;
    } | null;
    template: {
        displayName: string;
    } | null;
    themeConfig: any;
}

export default function StorefrontCustomizePage() {
    const router = useRouter();
    const [draft, setDraft] = useState<StorefrontDraft | null>(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
    const [isSaving, setIsSaving] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        loadDraft();
    }, []);

    const loadDraft = async () => {
        try {
            const res = await fetch("/api/storefront/draft");
            if (!res.ok) throw new Error("Failed to load draft");
            const data = await res.json();
            setDraft(data);
        } catch (error: any) {
            toast.error("Could not load storefront draft");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (newConfig: any) => {
        // 1. Sync local status
        if (draft) {
            setDraft({ ...draft, themeConfig: newConfig });
        }

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
            await fetch("/api/storefront/draft", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ themeConfig: newConfig })
            });
        } catch (e: any) {
            console.error("Auto-save failed", e);
        }
    };

    const handlePublish = async () => {
        setIsSaving(true);
        try {
            const res = await fetch("/api/storefront/publish", { method: "POST" });
            if (!res.ok) throw new Error("Publish failed");
            toast.success("Storefront Published Live!");
        } catch (error: any) {
            toast.error("Failed to publish");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return (
        <div className="h-screen flex items-center justify-center">
            <Loader2 className="animate-spin w-10 h-10 text-gray-400" />
        </div>
    );

    if (!draft) return (
        <div className="h-screen flex flex-col items-center justify-center space-y-4">
            <p className="text-gray-500">Pick a template before customizing.</p>
            <Button onClick={() => router.push("/dashboard/control-center")}>View Gallery</Button>
        </div>
    );

    const storefrontUrl = draft.store?.slug
        ? buildPreviewStorefrontUrl(draft.store.slug)
        : "";

    return (
        <div className="h-screen flex flex-col bg-white overflow-hidden">
            {/* Toolbar */}
            <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-20">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => router.back()} className="h-auto p-2">
                        <ArrowLeft size={18} />
                    </Button>
                    <div>
                        <h1 className="font-bold text-sm leading-none">{draft.template?.displayName}</h1>
                        <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold">Draft Editor</p>
                    </div>
                </div>

                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewMode("desktop")}
                        className={`p-1.5 h-auto rounded ${viewMode === "desktop" ? "bg-white shadow-sm" : "hover:bg-gray-200 text-gray-400"}`}
                        title="Desktop View"
                    >
                        <Monitor size={16} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewMode("mobile")}
                        className={`p-1.5 h-auto rounded ${viewMode === "mobile" ? "bg-white shadow-sm" : "hover:bg-gray-200 text-gray-400"}`}
                        title="Mobile View"
                    >
                        <Smartphone size={16} />
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="hidden sm:flex">
                        <Globe size={14} className="mr-2" /> View Live
                    </Button>
                    <Button onClick={handlePublish} disabled={isSaving} size="sm">
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Publish Live"}
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex min-h-0">
                {/* Customizer Sidebar */}
                <ThemeCustomizer
                    draft={draft}
                    onUpdate={handleUpdate}
                    onReset={() => loadDraft()}
                />

                {/* Preview Area */}
                <div className="flex-1 bg-gray-50 p-8 flex justify-center overflow-auto relative">
                    <div
                        className={`bg-white shadow-2xl transition-all duration-300 overflow-hidden ${viewMode === "desktop" ? "w-full h-full" : "w-[375px] h-[667px] rounded-[32px] border-[8px] border-black"
                            }`}
                    >
                        <iframe
                            ref={iframeRef}
                            src={storefrontUrl}
                            className="w-full h-full border-none"
                            title="Storefront Preview"
                        />
                    </div>

                    {/* Floating Helper */}
                    <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur shadow-sm border border-gray-100 px-3 py-1.5 rounded-full text-[10px] font-bold text-gray-400 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        Live Synchronized
                    </div>
                </div>
            </div>
        </div>
    );
}
