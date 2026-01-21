"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Button, Icon } from "@vayva/ui";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Lock, Globe } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { ExtensionsGallery } from "@/components/control-center/ExtensionsGallery";
export default function TemplatesPage() {
    const router = useRouter();
    const [templates, setTemplates] = useState([]);
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [applyingId, setApplyingId] = useState(null);
    const [isPublishing, setIsPublishing] = useState(false);
    useEffect(() => {
        loadTemplates();
        loadHistory();
    }, []);
    const loadTemplates = async () => {
        try {
            const res = await fetch("/api/control-center/templates");
            const data = await res.json();
            if (Array.isArray(data)) {
                setTemplates(data);
            }
        }
        catch (error) {
            toast.error("Failed to load templates");
        }
        finally {
            setIsLoading(false);
        }
    };
    const loadHistory = async () => {
        try {
            const res = await fetch("/api/control-center/history");
            const data = await res.json();
            if (Array.isArray(data))
                setHistory(data);
        }
        catch (e) { }
    };
    const handleApply = async (templateId) => {
        setApplyingId(templateId);
        try {
            const res = await fetch("/api/control-center/apply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ templateId })
            });
            if (!res.ok)
                throw new Error("Failed to apply");
            toast.success("Template applied to Draft!");
        }
        catch (error) {
            toast.error("Failed to apply template");
        }
        finally {
            setApplyingId(null);
        }
    };
    const handleRollback = async (versionId) => {
        if (!confirm("Are you sure? This will overwrite your current draft."))
            return;
        setApplyingId(versionId);
        try {
            const res = await fetch("/api/control-center/rollback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ versionId })
            });
            if (!res.ok)
                throw new Error("Rollback failed");
            toast.success("Restored version to Draft!");
        }
        catch (error) {
            toast.error("Failed to rollback");
        }
        finally {
            setApplyingId(null);
        }
    };
    const handlePublish = async () => {
        if (!confirm("Are you sure you want to publish the current draft live?"))
            return;
        setIsPublishing(true);
        try {
            const res = await fetch("/api/control-center/publish", { method: "POST" });
            if (!res.ok)
                throw new Error("Publish failed");
            toast.success("Storefront Published Live!");
            loadHistory(); // Refresh history
        }
        catch (error) {
            toast.error("Failed to publish");
        }
        finally {
            setIsPublishing(false);
        }
    };
    const handleUpgrade = async (targetPlan) => {
        if (!confirm(`Upgrade to ${targetPlan} Plan for access? This will charge your account.`))
            return;
        const loadingToast = toast.loading("Processing upgrade...");
        try {
            const res = await fetch("/api/billing/upgrade", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan: targetPlan })
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Upgrade failed");
            }
            toast.success("Upgrade Successful! Template Unlocked.");
            loadTemplates();
        }
        catch (error) {
            toast.error(error.message);
        }
        finally {
            toast.dismiss(loadingToast);
        }
    };
    if (isLoading)
        return _jsx("div", { className: "flex justify-center p-8", children: _jsx(Loader2, { className: "animate-spin" }) });
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center bg-gray-50 p-4 rounded-lg border", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-medium", children: "Storefront Status" }), _jsx("p", { className: "text-sm text-gray-500", children: "Manage your active storefront version." })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Button, { variant: "outline", onClick: () => window.open(`${process.env.NEXT_PUBLIC_STOREFRONT_URL || "http://localhost:3001"}/?preview=true`, "_blank"), children: [_jsx(Globe, { className: "w-4 h-4 mr-2" }), " Preview Draft"] }), _jsxs(Button, { variant: "outline", onClick: () => router.push("/dashboard/control-center/customize"), children: [_jsx(Icon, { name: "Palette", size: 16, className: "mr-2" }), " Customize Designer"] }), _jsxs(Button, { onClick: handlePublish, disabled: isPublishing, children: [isPublishing && _jsx(Loader2, { className: "w-4 h-4 mr-2 animate-spin" }), "Publish Live"] })] })] }), _jsxs(Tabs, { defaultValue: "gallery", className: "w-full", children: [_jsxs(TabsList, { className: "mb-4", children: [_jsx(TabsTrigger, { value: "gallery", children: "Theme Gallery" }), _jsx(TabsTrigger, { value: "extensions", children: "Extensions" }), _jsx(TabsTrigger, { value: "history", children: "Version History" })] }), _jsx(TabsContent, { value: "gallery", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [templates.map((tpl) => (_jsxs(Card, { className: "overflow-hidden flex flex-col", children: [_jsx("div", { className: "relative", children: _jsxs(AspectRatio, { ratio: 16 / 9, children: [tpl.previewImageUrl ? (_jsx(Image, { src: tpl.previewImageUrl, alt: tpl.name, fill: true, className: "object-cover" })) : (_jsx("div", { className: "w-full h-full bg-gray-200 flex items-center justify-center text-gray-400", children: "No Preview" })), tpl.isLocked && (_jsx("div", { className: "absolute inset-0 bg-black/50 flex items-center justify-center text-white backdrop-blur-sm", children: _jsxs("div", { className: "text-center", children: [_jsx(Lock, { className: "w-8 h-8 mx-auto mb-2" }), _jsx("p", { className: "font-medium", children: "Pro Plan Required" })] }) }))] }) }), _jsx(CardHeader, { children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsx(CardTitle, { className: "text-lg", children: tpl.name }), _jsx(CardDescription, { className: "line-clamp-2", children: tpl.description })] }), tpl.version && _jsxs(Badge, { variant: "secondary", children: ["v", tpl.version] })] }) }), _jsx(CardFooter, { className: "mt-auto pt-4 flex gap-2", children: tpl.isLocked ? (_jsx(Button, { className: "w-full", variant: "secondary", onClick: () => handleUpgrade("PRO"), children: "Upgrade to Unlock" })) : (_jsx(Button, { className: "w-full", onClick: () => handleApply(tpl.id), disabled: !!applyingId, children: applyingId === tpl.id ? _jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : "Use Template" })) })] }, tpl.id))), templates.length === 0 && (_jsx("div", { className: "col-span-3 text-center py-12 text-gray-500", children: "No templates available." }))] }) }), _jsx(TabsContent, { value: "extensions", children: _jsxs("div", { className: "bg-gray-50/50 rounded-3xl p-8 border border-gray-100", children: [_jsxs("div", { className: "max-w-2xl mb-8", children: [_jsx("h2", { className: "text-xl font-bold text-gray-900 mb-2", children: "Platform Extensions" }), _jsx("p", { className: "text-sm text-gray-500", children: "Expand your store's capability by enabling specialized modules. These extensions integrate directly into your workflow and API." })] }), _jsx(ExtensionsGallery, {})] }) }), _jsx(TabsContent, { value: "history", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Deployment History" }), _jsx(CardDescription, { children: "Rollback to previous versions of your storefront." })] }), _jsx(CardContent, { children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Version" }), _jsx(TableHead, { children: "Template" }), _jsx(TableHead, { children: "Published At" }), _jsx(TableHead, { children: "User" }), _jsx(TableHead, { className: "text-right", children: "Action" })] }) }), _jsxs(TableBody, { children: [history.map((ver) => (_jsxs(TableRow, { children: [_jsx(TableCell, { className: "font-mono text-xs", children: ver.id.slice(0, 8) }), _jsx(TableCell, { children: ver.template?.name || "Unknown" }), _jsx(TableCell, { children: new Date(ver.publishedAt).toLocaleString() }), _jsx(TableCell, { children: ver.publishedBy ? "User" : "System" }), _jsx(TableCell, { className: "text-right", children: _jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleRollback(ver.id), disabled: !!applyingId, children: applyingId === ver.id ? _jsx(Loader2, { className: "w-3 h-3 animate-spin" }) : "Restore" }) })] }, ver.id))), history.length === 0 && (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 5, className: "text-center py-8 text-gray-500", children: "No history found." }) }))] })] }) })] }) })] })] }));
}
