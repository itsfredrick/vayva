"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Bot, Save, Loader2, Sparkles, MessageSquare, ShieldCheck, Zap } from "lucide-react";
import { Button, Card, Input, Label, Select, Textarea } from "@vayva/ui";
import { Switch } from "@/components/ui/switch";

interface AiAgentSettings {
    enabled: boolean;
    tone: string;
    knowledgeBase: string;
    automationScope: string;
    lastUpdated?: string;
}

export default function AiAgentSettingsPage() {
    const [settings, setSettings] = useState<AiAgentSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch("/api/merchant/settings/ai-agent");
            if (!res.ok) throw new Error("Failed to load settings");
            const data = await res.json();
            setSettings(data);
        } catch (error) {
            console.error(error);
            toast.error("Could not load AI agent settings");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!settings) return;
        setSaving(true);
        try {
            const res = await fetch("/api/merchant/settings/ai-agent", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings)
            });

            if (!res.ok) throw new Error("Failed to save settings");
            const updated = await res.json();
            setSettings(updated);
            toast.success("AI Agent settings updated and synced");
        } catch (error) {
            console.error(error);
            toast.error("Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl space-y-8 pb-12">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">WhatsApp AI Agent</h1>
                <p className="text-slate-500">Configure how your AI handles customer inquiries on WhatsApp.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                    <Bot className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">Agent Status</h3>
                                    <p className="text-sm text-slate-500">Enable or disable automated responses.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Label htmlFor="agent-status" className="sr-only">Enable AI Agent</Label>
                                <Switch
                                    id="agent-status"
                                    checked={settings?.enabled || false}
                                    onCheckedChange={(checked) => setSettings(s => s ? ({ ...s, enabled: checked }) : null)}
                                />
                            </div>
                        </div>

                        <div className="space-y-6 pt-6 border-t border-slate-100">
                            <div className="space-y-2">
                                <Label htmlFor="tone">Tone of Voice</Label>
                                <select
                                    id="tone"
                                    title="Select Agent Tone"
                                    className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white"
                                    value={settings?.tone}
                                    onChange={(e) => setSettings(s => s ? ({ ...s, tone: e.target.value }) : null)}
                                >
                                    <option value="PROFESSIONAL">Professional / Corporate</option>
                                    <option value="FRIENDLY">Friendly / Warm</option>
                                    <option value="WITTY">Witty / Energetic</option>
                                    <option value="MINIMALIST">Minimalist / Direct</option>
                                </select>
                                <p className="text-xs text-slate-400">Determines how the AI greets and responds to customers.</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="kb">Knowledge Base & Instructions</Label>
                                <Textarea
                                    id="kb"
                                    placeholder="e.g. You are an assistant for Vayva Boutique. We specialize in luxury silk dresses. Deliveries take 3-5 days..."
                                    className="h-40"
                                    value={settings?.knowledgeBase}
                                    onChange={(e) => setSettings(s => s ? ({ ...s, knowledgeBase: e.target.value }) : null)}
                                />
                                <p className="text-xs text-slate-400">Give your agent specific knowledge about your products, policies, and brand.</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="scope">Automation Scope</Label>
                                <select
                                    id="scope"
                                    title="Select Automation Scope"
                                    className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white"
                                    value={settings?.automationScope}
                                    onChange={(e) => setSettings(s => s ? ({ ...s, automationScope: e.target.value }) : null)}
                                >
                                    <option value="NONE">Manual Only (AI Disabled)</option>
                                    <option value="SUPPORT">General Support Only</option>
                                    <option value="SALES">Sales & Product Inquiries</option>
                                    <option value="ALL">Full Automation (Support & Sales)</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end mt-8">
                            <Button onClick={handleSave} isLoading={saving} className="gap-2">
                                <Save className="h-4 w-4" />
                                Save Configuration
                            </Button>
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="p-6 bg-slate-50 border-none">
                        <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-amber-500" />
                            Agent Stats
                        </h4>
                        <div className="space-y-4">
                            <div className="bg-white p-3 rounded-lg border border-slate-100 flex items-center justify-between">
                                <span className="text-sm text-slate-500">Last Synced</span>
                                <span className="text-sm font-medium text-slate-900">
                                    {settings?.lastUpdated ? new Date(settings.lastUpdated).toLocaleDateString() : 'Never'}
                                </span>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-slate-100 flex items-center justify-between">
                                <span className="text-sm text-slate-500">Automation</span>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${settings?.enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                                    {settings?.enabled ? 'ACTIVE' : 'INACTIVE'}
                                </span>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 border-indigo-100 bg-indigo-50/30">
                        <h4 className="font-semibold text-slate-900 mb-2">Pro Tip</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Be specific in your instructions. Mention your return policy, shipping times, and top-selling products for the best results.
                        </p>
                    </Card>
                </div>
            </div >
        </div >
    );
}
