"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { toast } from "sonner";
import { Shield, Ban, Clock, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button, Input } from "@vayva/ui";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
export function SafetyFilters({ settings, onUpdate }) {
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        rateLimitEnabled: settings?.rateLimitEnabled ?? false,
        rateLimitPerHour: settings?.rateLimitPerHour ?? 100,
        spamDetectionEnabled: settings?.spamDetectionEnabled ?? true,
        blockedNumbers: (settings?.blockedNumbers || []).join("\n"),
        blockedKeywords: (settings?.blockedKeywords || []).join(", "),
        aiSensitivity: settings?.aiSensitivity ?? 70,
        autoEscalationThreshold: settings?.autoEscalationThreshold ?? 3,
    });
    const handleSave = async () => {
        setSaving(true);
        try {
            await onUpdate({
                rateLimitEnabled: formData.rateLimitEnabled,
                rateLimitPerHour: Number(formData.rateLimitPerHour),
                spamDetectionEnabled: formData.spamDetectionEnabled,
                blockedNumbers: formData.blockedNumbers
                    .split("\n")
                    .map((n) => n.trim())
                    .filter(Boolean),
                blockedKeywords: formData.blockedKeywords
                    .split(",")
                    .map((k) => k.trim())
                    .filter(Boolean),
                aiSensitivity: Number(formData.aiSensitivity),
                autoEscalationThreshold: Number(formData.autoEscalationThreshold),
            });
            toast.success("Safety filters updated successfully");
        }
        catch (error) {
            toast.error("Failed to update safety filters");
        }
        finally {
            setSaving(false);
        }
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Clock, { className: "h-5 w-5 text-blue-600" }), _jsx(CardTitle, { children: "Rate Limiting" })] }), _jsx(CardDescription, { children: "Prevent abuse by limiting the number of messages per hour" })] }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "space-y-0.5", children: [_jsx(Label, { children: "Enable Rate Limiting" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Block customers who exceed the hourly limit" })] }), _jsx(Switch, { checked: formData.rateLimitEnabled, onCheckedChange: (checked) => setFormData({ ...formData, rateLimitEnabled: checked }) })] }), formData.rateLimitEnabled && (_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "rateLimit", children: "Messages per hour" }), _jsx(Input, { id: "rateLimit", type: "number", min: "1", max: "1000", value: formData.rateLimitPerHour, onChange: (e) => setFormData({ ...formData, rateLimitPerHour: e.target.value }) }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Recommended: 50-100 messages per hour" })] }))] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Shield, { className: "h-5 w-5 text-green-600" }), _jsx(CardTitle, { children: "Spam Detection" })] }), _jsx(CardDescription, { children: "Automatically detect and filter spam messages" })] }), _jsxs(CardContent, { children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "space-y-0.5", children: [_jsx(Label, { children: "Enable Spam Detection" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Uses AI to identify and block spam patterns" })] }), _jsx(Switch, { checked: formData.spamDetectionEnabled, onCheckedChange: (checked) => setFormData({ ...formData, spamDetectionEnabled: checked }) })] }), formData.spamDetectionEnabled && (_jsxs("div", { className: "pt-4 space-y-4 border-t", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx(Label, { children: "AI Sensitivity" }), _jsxs("span", { className: "text-sm font-medium", children: [formData.aiSensitivity, "%"] })] }), _jsx(Input, { type: "range", min: "0", max: "100", value: formData.aiSensitivity, onChange: (e) => setFormData({ ...formData, aiSensitivity: parseInt(e.target.value) }), className: "h-1.5" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Higher sensitivity means stricter filtering." })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Self-Escalation Threshold" }), _jsxs(Select, { value: formData.autoEscalationThreshold.toString(), onValueChange: (v) => setFormData({ ...formData, autoEscalationThreshold: parseInt(v) }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "1", children: "1 Negative interaction" }), _jsx(SelectItem, { value: "3", children: "3 Negative interactions" }), _jsx(SelectItem, { value: "5", children: "5 Negative interactions" })] })] }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Automatic handoff to human after repeated customer frustration." })] })] }))] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Ban, { className: "h-5 w-5 text-red-600" }), _jsx(CardTitle, { children: "Blocklist" })] }), _jsx(CardDescription, { children: "Block specific phone numbers or keywords" })] }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "blockedNumbers", children: "Blocked Phone Numbers" }), _jsx(Textarea, { id: "blockedNumbers", placeholder: "+2348012345678\n+2347012345678", value: formData.blockedNumbers, onChange: (e) => setFormData({ ...formData, blockedNumbers: e.target.value }), rows: 4 }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Enter one phone number per line (with country code)" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "blockedKeywords", children: "Blocked Keywords" }), _jsx(Textarea, { id: "blockedKeywords", placeholder: "spam, scam, fraud", value: formData.blockedKeywords, onChange: (e) => setFormData({ ...formData, blockedKeywords: e.target.value }), rows: 3 }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Comma-separated list of keywords to block" })] })] })] }), _jsxs("div", { className: "flex items-center gap-2 p-4 bg-amber-50 border border-amber-200 rounded-lg", children: [_jsx(AlertTriangle, { className: "h-5 w-5 text-amber-600 flex-shrink-0" }), _jsxs("p", { className: "text-sm text-amber-800", children: [_jsx("strong", { children: "Important:" }), " Changes to safety filters take effect immediately and apply to all incoming messages."] })] }), _jsx("div", { className: "flex justify-end", children: _jsx(Button, { onClick: handleSave, disabled: saving, children: saving ? "Saving..." : "Save Changes" }) })] }));
}
