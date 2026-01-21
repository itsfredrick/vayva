"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import useSWR, { mutate } from "swr";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConnectionCard } from "@/components/whatsapp/settings/ConnectionCard";
import { TemplateManager } from "@/components/whatsapp/settings/TemplateManager";
import { WebhookHealth } from "@/components/whatsapp/settings/WebhookHealth";
import { SafetyFilters } from "@/components/whatsapp/settings/SafetyFilters";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldCheck } from "lucide-react";
const fetcher = (url) => fetch(url).then((res) => res.json());
export default function WhatsAppSettingsPage() {
    const { data, error, isLoading } = useSWR("/api/settings/whatsapp", fetcher);
    const handleChannelUpdate = async (updateData) => {
        const res = await fetch("/api/settings/whatsapp", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                type: "CHANNEL",
                data: updateData
            }),
        });
        if (!res.ok)
            throw new Error("Update failed");
        mutate("/api/settings/whatsapp");
    };
    const handleSafetyUpdate = async (updateData) => {
        const res = await fetch("/api/settings/whatsapp", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                type: "SETTINGS",
                data: { safetyFilters: updateData }
            }),
        });
        if (!res.ok)
            throw new Error("Update failed");
        mutate("/api/settings/whatsapp");
    };
    if (isLoading)
        return _jsx("div", { className: "p-8", children: "Loading settings..." });
    if (error)
        return _jsx("div", { className: "p-8 text-red-500", children: "Failed to load settings." });
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "flex justify-between items-center", children: _jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold tracking-tight", children: "WhatsApp Agent" }), _jsx("p", { className: "text-muted-foreground", children: "Configure your AI agent, message templates, and connection settings." })] }) }), _jsxs(Tabs, { defaultValue: "connection", className: "space-y-4", children: [_jsxs(TabsList, { children: [_jsx(TabsTrigger, { value: "connection", children: "Connection" }), _jsx(TabsTrigger, { value: "templates", children: "Templates" }), _jsx(TabsTrigger, { value: "advanced", children: "Safety & Permissions" })] }), _jsx(TabsContent, { value: "connection", className: "space-y-4", children: _jsxs("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-7", children: [_jsx("div", { className: "col-span-4 space-y-4", children: _jsx(ConnectionCard, { channel: data?.channel, onUpdate: handleChannelUpdate }) }), _jsx("div", { className: "col-span-3", children: _jsx(WebhookHealth, {}) })] }) }), _jsx(TabsContent, { value: "templates", children: _jsx(TemplateManager, { templates: data?.templates, onRefresh: () => mutate("/api/settings/whatsapp") }) }), _jsx(TabsContent, { value: "advanced", children: _jsxs("div", { className: "space-y-4", children: [_jsxs(Alert, { children: [_jsx(ShieldCheck, { className: "h-4 w-4" }), _jsx(AlertTitle, { children: "RBAC Enforced" }), _jsxs(AlertDescription, { children: ["Only Users with ", _jsx("strong", { children: "Owner" }), " or ", _jsx("strong", { children: "Manager" }), " (Support Lead) roles can modify these settings. Audit logs are generated for every change."] })] }), _jsx(SafetyFilters, { settings: data?.settings?.safetyFilters, onUpdate: handleSafetyUpdate })] }) })] })] }));
}
