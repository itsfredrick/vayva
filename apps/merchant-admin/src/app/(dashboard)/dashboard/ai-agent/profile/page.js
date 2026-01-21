"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Button, Input } from "@vayva/ui";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Save, Send } from "lucide-react";
import { AgentPreview } from "@/components/ai-agent/AgentPreview";
import { TestMessageDialog } from "@/components/ai-agent/TestMessageDialog";
export default function AgentProfilePage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [agent, setAgent] = useState(null);
    const [draft, setDraft] = useState(null);
    const [isTestOpen, setIsTestOpen] = useState(false);
    useEffect(() => {
        loadProfile();
    }, []);
    const loadProfile = async () => {
        try {
            const res = await fetch("/api/ai-agent/profile");
            const data = await res.json();
            setAgent(data);
            // Initialize draft with config or current values
            const initialDraft = data.config && Object.keys(data.config).length > 0
                ? data.config
                : { name: data.name, tone: data.tone, signature: data.signature, avatarUrl: data.avatarUrl };
            setDraft(initialDraft);
        }
        catch (error) {
            toast.error("Failed to load agent profile");
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch("/api/ai-agent/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(draft)
            });
            if (!res.ok)
                throw new Error("Failed to save draft");
            toast.success("Draft saved successfully");
            setAgent({ ...agent, config: draft }); // Update local state
        }
        catch (error) {
            toast.error("Failed to save draft");
        }
        finally {
            setIsSaving(false);
        }
    };
    const handlePublish = async () => {
        if (!confirm("Are you sure you want to publish these changes live?"))
            return;
        setIsSaving(true);
        try {
            const res = await fetch("/api/ai-agent/publish", { method: "POST" });
            if (!res.ok)
                throw new Error("Failed to publish");
            toast.success("Agent profile published!");
            loadProfile(); // Reload to sync
        }
        catch (error) {
            toast.error("Failed to publish changes");
        }
        finally {
            setIsSaving(false);
        }
    };
    if (isLoading)
        return _jsx("div", { className: "flex justify-center p-8", children: _jsx(Loader2, { className: "animate-spin" }) });
    return (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto p-6", children: [_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h1", { className: "text-2xl font-bold", children: "Agent Identity" }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Button, { variant: "outline", onClick: () => setIsTestOpen(true), children: [_jsx(Send, { className: "w-4 h-4 mr-2" }), "Test"] }), _jsxs(Button, { onClick: handleSave, disabled: isSaving, children: [_jsx(Save, { className: "w-4 h-4 mr-2" }), "Save Draft"] })] })] }), _jsxs("div", { className: "space-y-4 bg-white p-6 rounded-lg border shadow-sm", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Name" }), _jsx(Input, { value: draft.name || "", onChange: (e) => setDraft({ ...draft, name: e.target.value }), placeholder: "e.g. Vayva Assistant" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Avatar URL" }), _jsx(Input, { value: draft.avatarUrl || "", onChange: (e) => setDraft({ ...draft, avatarUrl: e.target.value }), placeholder: "https://..." })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Tone" }), _jsxs(Select, { value: draft.tone || "professional", onValueChange: (val) => setDraft({ ...draft, tone: val }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "professional", children: "Professional" }), _jsx(SelectItem, { value: "friendly", children: "Friendly" }), _jsx(SelectItem, { value: "enthusiastic", children: "Enthusiastic" }), _jsx(SelectItem, { value: "empathetic", children: "Empathetic" })] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Signature" }), _jsx(Textarea, { value: draft.signature || "", onChange: (e) => setDraft({ ...draft, signature: e.target.value }), placeholder: "e.g. - Sent by Vayva Agent" })] })] }), _jsxs("div", { className: "bg-gray-50 p-4 rounded-lg flex items-center justify-between border", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-sm", children: "Publish Changes" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Make your draft changes live across all channels." })] }), _jsx(Button, { onClick: handlePublish, disabled: isSaving, variant: "primary", children: "Publish Live" })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsx("h2", { className: "text-xl font-semibold", children: "Live Preview" }), _jsx("div", { className: "bg-gray-100 p-8 rounded-xl min-h-[500px] flex items-center justify-center border", children: _jsx(AgentPreview, { config: draft }) })] }), _jsx(TestMessageDialog, { open: isTestOpen, onOpenChange: setIsTestOpen, draftConfig: draft })] }));
}
