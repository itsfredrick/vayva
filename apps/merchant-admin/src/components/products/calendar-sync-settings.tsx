
"use client";

import React, { useState } from "react";
import { Button, Input, Icon, Badge } from "@vayva/ui";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

interface CalendarSync {
    id: string;
    name: string;
    url: string;
    lastSyncedAt: string | null;
    syncStatus: string;
    error: string | null;
}

interface CalendarSyncSettingsProps {
    productId: string;
    initialSyncs?: CalendarSync[];
}

export const CalendarSyncSettings = ({ productId, initialSyncs = [] }: CalendarSyncSettingsProps) => {
    const router = useRouter();
    const [syncs, setSyncs] = useState<CalendarSync[]>(initialSyncs);
    const [isAdding, setIsAdding] = useState(false);
    const [newName, setNewName] = useState("");
    const [newUrl, setNewUrl] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAdd = async () => {
        if (!newName || !newUrl) return;
        setLoading(true);

        try {
            const res = await fetch(`/api/products/${productId}/calendar-sync`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newName, url: newUrl }),
            });

            if (!res.ok) throw new Error("Failed to add sync");

            const newSync = await res.json();
            setSyncs([...syncs, newSync]);
            setIsAdding(false);
            setNewName("");
            setNewUrl("");
            router.refresh();
        } catch (err) {
            console.error(err);
            // alert("Error adding sync"); // Or toast
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure? This will stop blocking dates from this calendar.")) return;

        // Optimistic update
        setSyncs(syncs.filter(s => s.id !== id));

        try {
            const res = await fetch(`/api/calendar-sync/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete");
            router.refresh();
        } catch (err) {
            console.error(err);
            // Revert if needed, or just refresh
            router.refresh();
        }
    };

    return (
        <div className="flex flex-col gap-4">
            {syncs.length > 0 && (
                <div className="flex flex-col gap-2">
                    {syncs.map(sync => (
                        <div key={sync.id} className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-center justify-between">
                            <div className="flex flex-col gap-1 overflow-hidden">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-white text-sm">{sync.name}</span>
                                    <Badge variant={sync.syncStatus === 'SUCCESS' ? 'success' : sync.syncStatus === 'FAILED' ? 'error' : 'default'}>
                                        {sync.syncStatus}
                                    </Badge>
                                </div>
                                <span className="text-xs text-text-secondary truncate text-ellipsis max-w-[200px]">{sync.url}</span>
                                {sync.lastSyncedAt && (
                                    <span className="text-[10px] text-text-secondary">
                                        Last synced: {format(new Date(sync.lastSyncedAt), "MMM d, h:mm a")}
                                    </span>
                                )}
                                {sync.error && (
                                    <span className="text-[10px] text-red-400">
                                        Error: {sync.error}
                                    </span>
                                )}
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(sync.id)} className="text-text-secondary hover:text-red-400">
                                <Icon name="Trash2" size={16} />
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            {isAdding ? (
                <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col gap-3">
                    <h4 className="text-sm font-bold text-white">Add External Calendar</h4>
                    <div className="flex flex-col gap-3">
                        <Input
                            placeholder="Label (e.g. Airbnb)"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="bg-black/20"
                        />
                        <Input
                            placeholder="iCal URL (https://...)"
                            value={newUrl}
                            onChange={(e) => setNewUrl(e.target.value)}
                            className="bg-black/20"
                        />
                        <div className="flex gap-2 justify-end">
                            <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)}>Cancel</Button>
                            <Button size="sm" onClick={handleAdd} disabled={loading || !newName || !newUrl}>
                                {loading ? "Adding..." : "Add Calendar"}
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <Button variant="outline" className="w-full border-dashed border-white/20 hover:border-white/40 text-text-secondary" onClick={() => setIsAdding(true)}>
                    <Icon name="Plus" size={16} className="mr-2" />
                    Connect Calendar
                </Button>
            )}
        </div>
    );
};
