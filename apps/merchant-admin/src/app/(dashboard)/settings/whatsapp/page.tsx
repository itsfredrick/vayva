"use client";

import useSWR, { mutate } from "swr";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConnectionCard } from "@/components/whatsapp/settings/ConnectionCard";
import { TemplateManager } from "@/components/whatsapp/settings/TemplateManager";
import { WebhookHealth } from "@/components/whatsapp/settings/WebhookHealth";
import { SafetyFilters } from "@/components/whatsapp/settings/SafetyFilters";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldCheck } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function WhatsAppSettingsPage() {
    const { data, error, isLoading } = useSWR("/api/settings/whatsapp", fetcher);

    const handleChannelUpdate = async (updateData: any) => {
        const res = await fetch("/api/settings/whatsapp", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                type: "CHANNEL",
                data: updateData
            }),
        });
        if (!res.ok) throw new Error("Update failed");
        mutate("/api/settings/whatsapp");
    };
    const handleSafetyUpdate = async (updateData: any) => {
        const res = await fetch("/api/settings/whatsapp", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                type: "SETTINGS",
                data: { safetyFilters: updateData }
            }),
        });
        if (!res.ok) throw new Error("Update failed");
        mutate("/api/settings/whatsapp");
    };

    if (isLoading) return <div className="p-8">Loading settings...</div>;
    if (error) return <div className="p-8 text-red-500">Failed to load settings.</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">WhatsApp Agent</h2>
                    <p className="text-muted-foreground">
                        Configure your AI agent, message templates, and connection settings.
                    </p>
                </div>
            </div>

            <Tabs defaultValue="connection" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="connection">Connection</TabsTrigger>
                    <TabsTrigger value="templates">Templates</TabsTrigger>
                    <TabsTrigger value="advanced">Safety & Permissions</TabsTrigger>
                </TabsList>

                <TabsContent value="connection" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <div className="col-span-4 space-y-4">
                            <ConnectionCard
                                channel={data?.channel}
                                onUpdate={handleChannelUpdate}
                            />
                        </div>
                        <div className="col-span-3">
                            <WebhookHealth />
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="templates">
                    <TemplateManager
                        templates={data?.templates}
                        onRefresh={() => mutate("/api/settings/whatsapp")}
                    />
                </TabsContent>

                <TabsContent value="advanced">
                    <div className="space-y-4">
                        <Alert>
                            <ShieldCheck className="h-4 w-4" />
                            <AlertTitle>RBAC Enforced</AlertTitle>
                            <AlertDescription>
                                Only Users with <strong>Owner</strong> or <strong>Manager</strong> (Support Lead) roles can modify these settings.
                                Audit logs are generated for every change.
                            </AlertDescription>
                        </Alert>

                        <SafetyFilters
                            settings={data?.settings?.safetyFilters}
                            onUpdate={handleSafetyUpdate}
                        />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
