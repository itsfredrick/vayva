
"use client";

import { useEffect, useState } from "react";
import { Button } from "@vayva/ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

interface ChannelConfig {
    enabled: boolean;
    greeting?: string;
}

interface AgentChannels {
    whatsapp: ChannelConfig;
    email: ChannelConfig;
    web: ChannelConfig;
}

export default function AgentChannelsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [channels, setChannels] = useState<AgentChannels>({
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
        } catch (error) {
            toast.error("Failed to load channel settings");
        } finally {
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

            if (!res.ok) throw new Error("Failed to save");
            toast.success("Channel settings saved to draft");
        } catch (error) {
            toast.error("Failed to save settings");
        } finally {
            setIsSaving(false);
        }
    };

    const updateChannel = (channel: keyof AgentChannels, key: keyof ChannelConfig, value: any) => {
        setChannels(prev => ({
            ...prev,
            [channel]: {
                ...prev[channel],
                [key]: value
            }
        }));
    };

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Communication Channels</h1>
                    <p className="text-muted-foreground">Configure where and how your agent responds.</p>
                </div>
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Save Draft
                </Button>
            </div>

            <div className="grid gap-6">
                {/* WhatsApp */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="space-y-1">
                            <CardTitle>WhatsApp</CardTitle>
                            <CardDescription>Respond to customers on WhatsApp.</CardDescription>
                        </div>
                        <Switch
                            checked={channels.whatsapp.enabled}
                            onCheckedChange={(checked) => updateChannel('whatsapp', 'enabled', checked)}
                        />
                    </CardHeader>
                    {channels.whatsapp.enabled && (
                        <CardContent className="pt-4 border-t mt-4">
                            <div className="space-y-2">
                                <Label>Initial Greeting</Label>
                                <Textarea
                                    value={channels.whatsapp.greeting || ""}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateChannel('whatsapp', 'greeting', e.target.value)}
                                    placeholder="Hi there! How can I help you regarding your order?"
                                />
                                <p className="text-xs text-muted-foreground">Sent as the first response to a new conversation session.</p>
                            </div>
                        </CardContent>
                    )}
                </Card>

                {/* Email */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="space-y-1">
                            <CardTitle>Email Support</CardTitle>
                            <CardDescription>Auto-draft responses to support emails.</CardDescription>
                        </div>
                        <Switch
                            checked={channels.email.enabled}
                            onCheckedChange={(checked) => updateChannel('email', 'enabled', checked)}
                        />
                    </CardHeader>
                    {channels.email.enabled && (
                        <CardContent className="pt-4 border-t mt-4">
                            <div className="space-y-2">
                                <Label>Signature / Footer</Label>
                                <Textarea
                                    value={channels.email.greeting || ""}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateChannel('email', 'greeting', e.target.value)}
                                    placeholder="Best regards,\nThe Vayva Team"
                                />
                            </div>
                        </CardContent>
                    )}
                </Card>

                {/* Web Chat */}
                <Card className="opacity-70">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="space-y-1">
                            <CardTitle>Web Chat (Coming Soon)</CardTitle>
                            <CardDescription>Live chat widget on your storefront.</CardDescription>
                        </div>
                        <Switch disabled checked={false} onCheckedChange={() => { }} />
                    </CardHeader>
                </Card>
            </div>
        </div>
    );
}
