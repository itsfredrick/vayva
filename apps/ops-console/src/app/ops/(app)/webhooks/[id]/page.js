"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useOpsQuery } from "@/hooks/useOpsQuery";
import { ArrowLeft, RefreshCw, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@vayva/ui";
export default function WebhookDetailPage() {
    const { id } = useParams();
    const [replaying, setReplaying] = useState(false);
    const { data: webhook, isLoading, refetch } = useOpsQuery(["webhook", id], async () => {
        const res = await fetch(`/api/ops/webhooks/${id}`);
        if (res.status === 401) {
            window.location.href = "/ops/login";
            return;
        }
        if (!res.ok)
            throw new Error("Failed to load webhook");
        const json = await res.json();
        return json.data;
    });
    const handleReplay = async () => {
        if (!confirm("Are you sure you want to replay this webhook event? It will be reset to PENDING."))
            return;
        setReplaying(true);
        try {
            const res = await fetch(`/api/ops/webhooks/${id}/replay`, {
                method: "POST",
            });
            const json = await res.json();
            if (res.ok) {
                toast.success("Replay Triggered", { description: "Webhook status reset to received." });
                refetch();
            }
            else {
                toast.error("Replay Failed", { description: json.error || "Unknown error" });
            }
        }
        catch (e) {
            toast.error("Network Error");
        }
        finally {
            setReplaying(false);
        }
    };
    if (isLoading)
        return _jsx("div", { className: "p-12 text-center text-gray-500", children: "Loading webhook..." });
    if (!webhook)
        return _jsx("div", { className: "p-12 text-center text-red-500", children: "Webhook not found" });
    const statusColor = {
        PROCESSED: "text-green-700 bg-green-100",
        FAILED: "text-red-700 bg-red-100",
        RECEIVED: "text-blue-700 bg-blue-100",
    }[webhook.status] || "text-gray-700 bg-gray-100";
    return (_jsxs("div", { className: "p-8 max-w-5xl mx-auto space-y-6", children: [_jsxs(Link, { href: "/ops/webhooks", className: "inline-flex items-center text-sm text-gray-500 hover:text-gray-800 gap-1", children: [_jsx(ArrowLeft, { size: 16 }), " Back to Webhooks"] }), _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-2xl font-bold text-gray-900 flex items-center gap-3", children: [webhook.eventType, _jsx("span", { className: `text-sm px-2.5 py-0.5 rounded-full font-medium ${statusColor}`, children: webhook.status })] }), _jsx("p", { className: "text-gray-500 mt-1 font-mono text-sm", children: webhook.id })] }), _jsxs(Button, { onClick: handleReplay, disabled: replaying, className: "flex items-center gap-2", children: [_jsx(RefreshCw, { size: 16, className: replaying ? "animate-spin" : "" }), "Replay Event"] })] }), _jsxs("div", { className: "grid grid-cols-3 gap-6", children: [_jsxs("div", { className: "col-span-1 space-y-6", children: [_jsxs("div", { className: "bg-white p-6 rounded-xl border border-gray-200", children: [_jsx("h3", { className: "text-sm font-bold text-gray-900 uppercase tracking-wide mb-4", children: "Meta" }), _jsxs("dl", { className: "space-y-4 text-sm", children: [_jsxs("div", { children: [_jsx("dt", { className: "text-gray-500", children: "Provider" }), _jsx("dd", { className: "font-medium text-gray-900 capitalize", children: webhook.provider })] }), _jsxs("div", { children: [_jsx("dt", { className: "text-gray-500", children: "Store" }), _jsx("dd", { className: "font-medium text-indigo-600", children: _jsx(Link, { href: `/ops/merchants/${webhook.storeId}`, children: webhook.storeName }) })] }), _jsxs("div", { children: [_jsx("dt", { className: "text-gray-500", children: "Received At" }), _jsx("dd", { className: "font-medium text-gray-900", children: new Date(webhook.receivedAt).toLocaleString() })] }), _jsxs("div", { children: [_jsx("dt", { className: "text-gray-500", children: "Processed At" }), _jsx("dd", { className: "font-medium text-gray-900", children: webhook.processedAt ? new Date(webhook.processedAt).toLocaleString() : "—" })] })] })] }), webhook.error && (_jsxs("div", { className: "bg-red-50 p-6 rounded-xl border border-red-200", children: [_jsxs("h3", { className: "text-sm font-bold text-red-900 uppercase tracking-wide mb-2 flex items-center gap-2", children: [_jsx(AlertCircle, { size: 16 }), " Error"] }), _jsx("p", { className: "text-sm text-red-700 font-mono break-words", children: webhook.error })] }))] }), _jsx("div", { className: "col-span-2", children: _jsxs("div", { className: "bg-white rounded-xl border border-gray-200 overflow-hidden h-full flex flex-col", children: [_jsx("div", { className: "bg-gray-50 px-4 py-2 border-b border-gray-200 text-xs font-mono text-gray-500 uppercase", children: "Payload Body" }), _jsx("div", { className: "flex-1 p-4 bg-gray-900 overflow-auto", children: _jsx("pre", { className: "text-xs font-mono text-green-400 whitespace-pre-wrap", children: JSON.stringify(webhook.payload, null, 2) }) })] }) })] })] }));
}
