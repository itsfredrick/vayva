"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Bot, Save, Loader2, Sparkles } from "lucide-react";
import { Button, Card, Label, Textarea } from "@vayva/ui";
import { Switch } from "@/components/ui/switch";
export default function AiAgentSettingsPage() {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    useEffect(() => {
        fetchSettings();
    }, []);
    const fetchSettings = async () => {
        try {
            const res = await fetch("/api/merchant/settings/ai-agent");
            if (!res.ok)
                throw new Error("Failed to load settings");
            const data = await res.json();
            setSettings(data);
        }
        catch (error) {
            console.error(error);
            toast.error("Could not load AI agent settings");
        }
        finally {
            setLoading(false);
        }
    };
    const handleSave = async () => {
        if (!settings)
            return;
        setSaving(true);
        try {
            const res = await fetch("/api/merchant/settings/ai-agent", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings)
            });
            if (!res.ok)
                throw new Error("Failed to save settings");
            const updated = await res.json();
            setSettings(updated);
            toast.success("AI Agent settings updated and synced");
        }
        catch (error) {
            console.error(error);
            toast.error("Failed to save settings");
        }
        finally {
            setSaving(false);
        }
    };
    if (loading) {
        return (_jsx("div", { className: "flex h-96 items-center justify-center", children: _jsx(Loader2, { className: "h-8 w-8 animate-spin text-indigo-600" }) }));
    }
    return (_jsxs("div", { className: "max-w-4xl space-y-8 pb-12", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold tracking-tight text-slate-900", children: "WhatsApp AI Agent" }), _jsx("p", { className: "text-slate-500", children: "Configure how your AI handles customer inquiries on WhatsApp." })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [_jsx("div", { className: "lg:col-span-2 space-y-6", children: _jsxs(Card, { className: "p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 bg-indigo-50 rounded-lg text-indigo-600", children: _jsx(Bot, { className: "h-5 w-5" }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-slate-900", children: "Agent Status" }), _jsx("p", { className: "text-sm text-slate-500", children: "Enable or disable automated responses." })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Label, { htmlFor: "agent-status", className: "sr-only", children: "Enable AI Agent" }), _jsx(Switch, { id: "agent-status", checked: settings?.enabled || false, onCheckedChange: (checked) => setSettings(s => s ? ({ ...s, enabled: checked }) : null) })] })] }), _jsxs("div", { className: "space-y-6 pt-6 border-t border-slate-100", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "tone", children: "Tone of Voice" }), _jsxs("select", { id: "tone", title: "Select Agent Tone", className: "w-full p-2 border border-slate-200 rounded-lg text-sm bg-white", value: settings?.tone, onChange: (e) => setSettings(s => s ? ({ ...s, tone: e.target.value }) : null), children: [_jsx("option", { value: "PROFESSIONAL", children: "Professional / Corporate" }), _jsx("option", { value: "FRIENDLY", children: "Friendly / Warm" }), _jsx("option", { value: "WITTY", children: "Witty / Energetic" }), _jsx("option", { value: "MINIMALIST", children: "Minimalist / Direct" })] }), _jsx("p", { className: "text-xs text-slate-400", children: "Determines how the AI greets and responds to customers." })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "kb", children: "Knowledge Base & Instructions" }), _jsx(Textarea, { id: "kb", placeholder: "e.g. You are an assistant for Vayva Boutique. We specialize in luxury silk dresses. Deliveries take 3-5 days...", className: "h-40", value: settings?.knowledgeBase, onChange: (e) => setSettings(s => s ? ({ ...s, knowledgeBase: e.target.value }) : null) }), _jsx("p", { className: "text-xs text-slate-400", children: "Give your agent specific knowledge about your products, policies, and brand." })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "scope", children: "Automation Scope" }), _jsxs("select", { id: "scope", title: "Select Automation Scope", className: "w-full p-2 border border-slate-200 rounded-lg text-sm bg-white", value: settings?.automationScope, onChange: (e) => setSettings(s => s ? ({ ...s, automationScope: e.target.value }) : null), children: [_jsx("option", { value: "NONE", children: "Manual Only (AI Disabled)" }), _jsx("option", { value: "SUPPORT", children: "General Support Only" }), _jsx("option", { value: "SALES", children: "Sales & Product Inquiries" }), _jsx("option", { value: "ALL", children: "Full Automation (Support & Sales)" })] })] })] }), _jsx("div", { className: "flex justify-end mt-8", children: _jsxs(Button, { onClick: handleSave, isLoading: saving, className: "gap-2", children: [_jsx(Save, { className: "h-4 w-4" }), "Save Configuration"] }) })] }) }), _jsxs("div", { className: "space-y-6", children: [_jsxs(Card, { className: "p-6 bg-slate-50 border-none", children: [_jsxs("h4", { className: "font-semibold text-slate-900 mb-4 flex items-center gap-2", children: [_jsx(Sparkles, { className: "h-4 w-4 text-amber-500" }), "Agent Stats"] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "bg-white p-3 rounded-lg border border-slate-100 flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-slate-500", children: "Last Synced" }), _jsx("span", { className: "text-sm font-medium text-slate-900", children: settings?.lastUpdated ? new Date(settings.lastUpdated).toLocaleDateString() : 'Never' })] }), _jsxs("div", { className: "bg-white p-3 rounded-lg border border-slate-100 flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-slate-500", children: "Automation" }), _jsx("span", { className: `text-xs font-bold px-2 py-0.5 rounded-full ${settings?.enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`, children: settings?.enabled ? 'ACTIVE' : 'INACTIVE' })] })] })] }), _jsxs(Card, { className: "p-6 border-indigo-100 bg-indigo-50/30", children: [_jsx("h4", { className: "font-semibold text-slate-900 mb-2", children: "Pro Tip" }), _jsx("p", { className: "text-sm text-slate-600 leading-relaxed", children: "Be specific in your instructions. Mention your return policy, shipping times, and top-selling products for the best results." })] })] })] })] }));
}
