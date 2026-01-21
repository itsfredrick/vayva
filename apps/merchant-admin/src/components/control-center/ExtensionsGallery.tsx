
"use client";

import React, { useState, useEffect } from "react";
import { Button, Icon, IconName, cn } from "@vayva/ui";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Extension {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: string;
    isEnabled: boolean;
}

export const ExtensionsGallery = () => {
    const [extensions, setExtensions] = useState<Extension[]>([]);
    const [loading, setLoading] = useState(true);
    const [toggling, setToggling] = useState<string | null>(null);

    useEffect(() => {
        fetchExtensions();
    }, []);

    const fetchExtensions = async () => {
        try {
            const res = await fetch("/api/control-center/extensions");
            const data = await res.json();
            setExtensions(data);
        } catch (e) {
            toast.error("Failed to load extensions");
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (ext: Extension) => {
        setToggling(ext.id);
        try {
            const res = await fetch("/api/control-center/extensions", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ extensionId: ext.id, enabled: !ext.isEnabled })
            });

            if (res.ok) {
                toast.success(`${ext.name} ${ext.isEnabled ? 'disabled' : 'enabled'}`);
                setExtensions(prev => prev.map(e => e.id === ext.id ? { ...e, isEnabled: !e.isEnabled } : e));

                // Refresh Sidebar (Simple page reload for now to reflect sidebar changes)
                // In production, we'd use a state manager or router.refresh()
                setTimeout(() => window.location.reload(), 1000);
            }
        } catch (e) {
            toast.error("Failed to update extension");
        } finally {
            setToggling(null);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center p-12">
            <Loader2 className="animate-spin w-8 h-8 text-gray-200" />
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {extensions.map((ext) => (
                    <div
                        key={ext.id}
                        className={cn(
                            "bg-white border rounded-2xl p-6 transition-all relative overflow-hidden group hover:shadow-md",
                            ext.isEnabled ? "border-black/5 ring-1 ring-black/5" : "border-gray-200"
                        )}
                    >
                        {/* Status Label */}
                        <div className="flex justify-between items-start mb-4">
                            <div className={cn(
                                "p-3 rounded-xl",
                                ext.isEnabled ? "bg-black text-white" : "bg-gray-100 text-gray-400"
                            )}>
                                <Icon name={ext.icon as IconName} size={20} />
                            </div>
                            <div className={cn(
                                "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full",
                                ext.isEnabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"
                            )}>
                                {ext.isEnabled ? "Enabled" : "Available"}
                            </div>
                        </div>

                        <h3 className="font-bold text-gray-900 mb-1">{ext.name}</h3>
                        <p className="text-xs text-gray-500 leading-relaxed mb-6">
                            {ext.description}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                            <span className="text-[10px] font-bold text-gray-400 uppercase">{ext.category}</span>
                            <Button
                                variant={ext.isEnabled ? "outline" : "primary"}
                                size="sm"
                                onClick={() => handleToggle(ext)}
                                disabled={toggling === ext.id}
                                className="h-8 py-0"
                            >
                                {toggling === ext.id ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                    ext.isEnabled ? "Manage" : "Install"
                                )}
                            </Button>
                        </div>

                        {/* Decoration */}
                        <div className="absolute -bottom-2 -right-2 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                            <Icon name={ext.icon as IconName} size={80} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {extensions.length === 0 && (
                <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-3xl">
                    <p className="text-gray-400">No extensions found.</p>
                </div>
            )}
        </div>
    );
};
