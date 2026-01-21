"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Button } from "@vayva/ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
export default function AgentChannelsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [channels, setChannels] = useState({
        whatsapp: { enabled: false, greeting: "" },
        email: { enabled: false, greeting: "" },
        web: { enabled: false, greeting: "" }
    });
    useEffect(() => {
        loadProfile();
    }, []);
    const loadProfile = async () => {
        try {
            const res = await fetch("/api/ai-agent/profile");
            const data = await res.json();
            // Load from draft config if exists, else live
            const source = data.config?.channels ? data.config : data;
            // Merge with defaults to ensure structure
            setChannels({
                whatsapp: { enabled: false, greeting: "", ...source.channels?.whatsapp },
                email: { enabled: false, greeting: "", ...source.channels?.email },
                web: { enabled: false, greeting: "", ...source.channels?.web }
            });
        }
        catch (error) {
            toast.error("Failed to load channel settings");
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleSave = async () => {
        setIsSaving(true);
        try {
            // We save to 'config' via the profile endpoint, but only updating the 'channels' key
            // This preserves other draft settings like name/avatar
            // First fetch current draft to blend (naive but functional for now)
            const draftRes = await fetch("/api/ai-agent/profile");
            const draftData = await draftRes.json();
            const currentConfig = draftData.config || {};
            const newConfig = {
                ...currentConfig,
                channels: channels
            };
            const res = await fetch("/api/ai-agent/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newConfig)
            });
            if (!res.ok)
                throw new Error("Failed to save");
            toast.success("Channel settings saved to draft");
        }
        catch (error) {
            toast.error("Failed to save settings");
        }
        finally {
            setIsSaving(false);
        }
    };
    const updateChannel = (channel, key, value) => {
        setChannels(prev => ({
            ...prev,
            [channel]: {
                ...prev[channel],
                [key]: value
            }
        }));
    };
    if (isLoading)
        return _jsx("div", { className: "flex justify-center p-8", children: _jsx(Loader2, { className: "animate-spin" }) });
    return (_jsxs("div", { className: "max-w-4xl mx-auto p-6 space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold", children: "Communication Channels" }), _jsx("p", { className: "text-muted-foreground", children: "Configure where and how your agent responds." })] }), _jsxs(Button, { onClick: handleSave, disabled: isSaving, children: [isSaving && _jsx(Loader2, { className: "w-4 h-4 mr-2 animate-spin" }), "Save Draft"] })] }), _jsxs("div", { className: "grid gap-6", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsxs("div", { className: "space-y-1", children: [_jsx(CardTitle, { children: "WhatsApp" }), _jsx(CardDescription, { children: "Respond to customers on WhatsApp." })] }), _jsx(Switch, { checked: channels.whatsapp.enabled, onCheckedChange: (checked) => updateChannel('whatsapp', 'enabled', checked) })] }), channels.whatsapp.enabled && (_jsx(CardContent, { className: "pt-4 border-t mt-4", children: _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Initial Greeting" }), _jsx(Textarea, { value: channels.whatsapp.greeting || "", onChange: (e) => updateChannel('whatsapp', 'greeting', e.target.value), placeholder: "Hi there! How can I help you regarding your order?" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Sent as the first response to a new conversation session." })] }) }))] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsxs("div", { className: "space-y-1", children: [_jsx(CardTitle, { children: "Email Support" }), _jsx(CardDescription, { children: "Auto-draft responses to support emails." })] }), _jsx(Switch, { checked: channels.email.enabled, onCheckedChange: (checked) => updateChannel('email', 'enabled', checked) })] }), channels.email.enabled && (_jsx(CardContent, { className: "pt-4 border-t mt-4", children: _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Signature / Footer" }), _jsx(Textarea, { value: channels.email.greeting || "", onChange: (e) => updateChannel('email', 'greeting', e.target.value), placeholder: "Best regards,\\nThe Vayva Team" })] }) }))] }), _jsx(Card, { className: "opacity-70", children: _jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsxs("div", { className: "space-y-1", children: [_jsx(CardTitle, { children: "Web Chat (Coming Soon)" }), _jsx(CardDescription, { children: "Live chat widget on your storefront." })] }), _jsx(Switch, { disabled: true, checked: false, onCheckedChange: () => { } })] }) })] })] }));
}
