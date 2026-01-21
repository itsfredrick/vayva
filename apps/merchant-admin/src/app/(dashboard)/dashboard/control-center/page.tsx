"use client";

import { useEffect, useState } from "react";
import { Button, Icon } from "@vayva/ui";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Check, Lock, Globe } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { ExtensionsGallery } from "@/components/control-center/ExtensionsGallery";

export default function TemplatesPage() {
    const router = useRouter();
    const [templates, setTemplates] = useState<any[]>([]);
    const [history, setHistory] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [applyingId, setApplyingId] = useState<string | null>(null);
    const [isPublishing, setIsPublishing] = useState(false);

    useEffect(() => {
        loadTemplates();
        loadHistory();
    }, []);

    const loadTemplates = async () => {
        try {
            const res = await fetch("/api/templates");
            const data = await res.json();
            if (Array.isArray(data)) {
                setTemplates(data);
            }
        } catch (error) {
            toast.error("Failed to load templates");
        } finally {
            setIsLoading(false);
        }
    };

    const loadHistory = async () => {
        try {
            const res = await fetch("/api/control-center/history");
            const data = await res.json();
            if (Array.isArray(data)) setHistory(data);
        } catch (e) { }
    };

    const handleApply = async (templateId: string) => {
        setApplyingId(templateId);
        try {
            const res = await fetch("/api/control-center/apply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ templateId })
            });

            if (!res.ok) throw new Error("Failed to apply");

            toast.success("Template applied to Draft!");
        } catch (error) {
            toast.error("Failed to apply template");
        } finally {
            setApplyingId(null);
        }
    };

    const handleRollback = async (versionId: string) => {
        if (!confirm("Are you sure? This will overwrite your current draft.")) return;
        setApplyingId(versionId);
        try {
            const res = await fetch("/api/control-center/rollback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ versionId })
            });
            if (!res.ok) throw new Error("Rollback failed");
            toast.success("Restored version to Draft!");
        } catch (error) {
            toast.error("Failed to rollback");
        } finally {
            setApplyingId(null);
        }
    }

    const handlePublish = async () => {
        if (!confirm("Are you sure you want to publish the current draft live?")) return;
        setIsPublishing(true);
        try {
            const res = await fetch("/api/control-center/publish", { method: "POST" });
            if (!res.ok) throw new Error("Publish failed");
            toast.success("Storefront Published Live!");
            loadHistory(); // Refresh history
        } catch (error) {
            toast.error("Failed to publish");
        } finally {
            setIsPublishing(false);
        }
    };

    const handleUpgrade = async (targetPlan: string) => {
        if (!confirm(`Upgrade to ${targetPlan} Plan for access? This will charge your account.`)) return;
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
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            toast.dismiss(loadingToast);
        }
    };

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border">
                <div>
                    <h3 className="font-medium">Storefront Status</h3>
                    <p className="text-sm text-gray-500">Manage your active storefront version.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => window.open(`${process.env.NEXT_PUBLIC_STOREFRONT_URL || "http://localhost:3001"}/?preview=true`, "_blank")}>
                        <Globe className="w-4 h-4 mr-2" /> Preview Draft
                    </Button>
                    <Button variant="outline" onClick={() => router.push("/dashboard/control-center/customize")}>
                        <Icon name="Palette" size={16} className="mr-2" /> Customize Designer
                    </Button>
                    <Button onClick={handlePublish} disabled={isPublishing}>
                        {isPublishing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Publish Live
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="gallery" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="gallery">Theme Gallery</TabsTrigger>
                    <TabsTrigger value="extensions">Extensions</TabsTrigger>
                    <TabsTrigger value="history">Version History</TabsTrigger>
                </TabsList>

                <TabsContent value="gallery">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {templates.map((tpl) => (
                            <Card key={tpl.id} className="overflow-hidden flex flex-col">
                                <div className="relative">
                                    <AspectRatio ratio={16 / 9}>
                                        {tpl.previewImageUrl ? (
                                            <Image
                                                src={tpl.previewImageUrl}
                                                alt={tpl.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                                                No Preview
                                            </div>
                                        )}
                                        {tpl.isLocked && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white backdrop-blur-sm">
                                                <div className="text-center">
                                                    <Lock className="w-8 h-8 mx-auto mb-2" />
                                                    <p className="font-medium">Pro Plan Required</p>
                                                </div>
                                            </div>
                                        )}
                                    </AspectRatio>
                                </div>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-lg">{tpl.name}</CardTitle>
                                            <CardDescription className="line-clamp-2">{tpl.description}</CardDescription>
                                        </div>
                                        {tpl.version && <Badge variant="secondary">v{tpl.version}</Badge>}
                                    </div>
                                </CardHeader>
                                <CardFooter className="mt-auto pt-4 flex gap-2">
                                    {tpl.isLocked ? (
                                        <Button
                                            className="w-full"
                                            variant="secondary"
                                            onClick={() => handleUpgrade("PRO")}
                                        >
                                            Upgrade to Unlock
                                        </Button>
                                    ) : (
                                        <Button
                                            className="w-full"
                                            onClick={() => handleApply(tpl.id)}
                                            disabled={!!applyingId}
                                        >
                                            {applyingId === tpl.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Use Template"}
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>
                        ))}
                        {templates.length === 0 && (
                            <div className="col-span-3 text-center py-12 text-gray-500">
                                No templates available.
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="extensions">
                    <div className="bg-gray-50/50 rounded-3xl p-8 border border-gray-100">
                        <div className="max-w-2xl mb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Platform Extensions</h2>
                            <p className="text-sm text-gray-500">
                                Expand your store's capability by enabling specialized modules.
                                These extensions integrate directly into your workflow and API.
                            </p>
                        </div>
                        <ExtensionsGallery />
                    </div>
                </TabsContent>

                <TabsContent value="history">
                    <Card>
                        <CardHeader>
                            <CardTitle>Deployment History</CardTitle>
                            <CardDescription>Rollback to previous versions of your storefront.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Version</TableHead>
                                        <TableHead>Template</TableHead>
                                        <TableHead>Published At</TableHead>
                                        <TableHead>User</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {history.map((ver) => (
                                        <TableRow key={ver.id}>
                                            <TableCell className="font-mono text-xs">{ver.id.slice(0, 8)}</TableCell>
                                            <TableCell>{ver.template?.name || "Unknown"}</TableCell>
                                            <TableCell>{new Date(ver.publishedAt).toLocaleString()}</TableCell>
                                            <TableCell>
                                                {ver.publishedBy ? "User" : "System"}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" onClick={() => handleRollback(ver.id)} disabled={!!applyingId}>
                                                    {applyingId === ver.id ? <Loader2 className="w-3 h-3 animate-spin" /> : "Restore"}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                    {history.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                                No history found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
