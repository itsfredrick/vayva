"use client";

import React, { useState, useEffect } from "react";
import { Button, Card, Icon, Input } from "@vayva/ui";
import { toast } from "sonner";

export default function DeveloperHubPage() {
    const [apps, setApps] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRegistering, setIsRegistering] = useState(false);
    const [manifestUrl, setManifestUrl] = useState("");

    const fetchApps = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/developer/apps");
            const data = await res.json();
            setApps(data);
        } catch (err: any) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchApps();
    }, []);

    const handleRegister = async () => {
        if (!manifestUrl) return;
        try {
            const res = await fetch("/api/developer/apps", {
                method: "POST",
                body: JSON.stringify({ manifestUrl })
            });
            const data = await res.json();
            if (res.ok) {
                toast.success("Extension registered!");
                setIsRegistering(false);
                setManifestUrl("");
                fetchApps();
            } else {
                toast.error(data.error);
            }
        } catch (err: any) {
            toast.error("Failed to register");
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-4xl font-black tracking-tight text-black">
                        Developer Hub
                    </h1>
                    <p className="text-gray-500">
                        Register and manage your Vayva extensions. Manifests must be publicly accessible JSON.
                    </p>
                </div>
                <Button onClick={() => setIsRegistering(true)}>
                    <Icon name="Plus" size={18} className="mr-2" />
                    Register Extension
                </Button>
            </div>

            {isRegistering && (
                <Card className="p-6 space-y-4">
                    <h3 className="font-bold">Register New Manifest</h3>
                    <div className="flex gap-2">
                        <Input
                            placeholder="https://your-server.com/va-extension.json"
                            value={(manifestUrl as any)}
                            onChange={(e: any) => setManifestUrl(e.target.value)}
                        />
                        <Button onClick={handleRegister}>Fetch & Register</Button>
                        <Button variant="outline" onClick={() => setIsRegistering(false)}>Cancel</Button>
                    </div>
                    <p className="text-xs text-gray-400">
                        Vayva will fetch your manifest and attempt to validate its structure.
                    </p>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <div className="col-span-full py-12 text-center text-gray-400">Loading your apps...</div>
                ) : apps.length === 0 ? (
                    <div className="col-span-full py-12 text-center border-2 border-dashed rounded-3xl text-gray-400">
                        No extensions registered yet. Click "Register Extension" to start.
                    </div>
                ) : (
                    apps.map(app => (
                        <Card key={app.id} className="p-6 flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-gray-100 rounded-lg">
                                        <Icon name="Code" size={20} />
                                    </div>
                                    <h3 className="font-bold">{app.cachedManifest?.name || app.extensionId}</h3>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${app.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                    app.status === 'PENDING' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                    {app.status}
                                </span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-gray-500 truncate">{app.manifestUrl}</p>
                                <p className="text-sm font-bold mt-2">API Key:</p>
                                <div className="p-2 bg-gray-50 rounded font-mono text-[10px] break-all border group relative">
                                    {app.secretKey}
                                    <Button
                                        variant="ghost"
                                        className="absolute right-2 top-1 h-6 w-6 p-0 text-gray-400 hover:text-black"
                                        title="Copy API Key"
                                        onClick={() => {
                                            navigator.clipboard.writeText(app.secretKey);
                                            toast.success("API Key copied");
                                        }}
                                    >
                                        <Icon name="Copy" size={12} />
                                    </Button>
                                </div>
                            </div>
                            <div className="mt-auto pt-4 border-t flex justify-between items-center">
                                <span className="text-[10px] text-gray-400">v{app.cachedManifest?.version}</span>
                                <Button variant="ghost" size="sm" className="text-xs h-auto py-1">View Manifest</Button>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
