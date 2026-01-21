"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button, Input, Icon, Badge } from "@vayva/ui";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
export const CalendarSyncSettings = ({ productId, initialSyncs = [] }) => {
    const router = useRouter();
    const [syncs, setSyncs] = useState(initialSyncs);
    const [isAdding, setIsAdding] = useState(false);
    const [newName, setNewName] = useState("");
    const [newUrl, setNewUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const handleAdd = async () => {
        if (!newName || !newUrl)
            return;
        setLoading(true);
        try {
            const res = await fetch(`/api/products/${productId}/calendar-sync`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newName, url: newUrl }),
            });
            if (!res.ok)
                throw new Error("Failed to add sync");
            const newSync = await res.json();
            setSyncs([...syncs, newSync]);
            setIsAdding(false);
            setNewName("");
            setNewUrl("");
            router.refresh();
        }
        catch (err) {
            console.error(err);
            // alert("Error adding sync"); // Or toast
        }
        finally {
            setLoading(false);
        }
    };
    const handleDelete = async (id) => {
        if (!confirm("Are you sure? This will stop blocking dates from this calendar."))
            return;
        // Optimistic update
        setSyncs(syncs.filter(s => s.id !== id));
        try {
            const res = await fetch(`/api/calendar-sync/${id}`, {
                method: "DELETE",
            });
            if (!res.ok)
                throw new Error("Failed to delete");
            router.refresh();
        }
        catch (err) {
            console.error(err);
            // Revert if needed, or just refresh
            router.refresh();
        }
    };
    return (_jsxs("div", { className: "flex flex-col gap-4", children: [syncs.length > 0 && (_jsx("div", { className: "flex flex-col gap-2", children: syncs.map(sync => (_jsxs("div", { className: "bg-white/5 border border-white/10 rounded-lg p-3 flex items-center justify-between", children: [_jsxs("div", { className: "flex flex-col gap-1 overflow-hidden", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "font-medium text-white text-sm", children: sync.name }), _jsx(Badge, { variant: sync.syncStatus === 'SUCCESS' ? 'success' : sync.syncStatus === 'FAILED' ? 'error' : 'default', children: sync.syncStatus })] }), _jsx("span", { className: "text-xs text-text-secondary truncate text-ellipsis max-w-[200px]", children: sync.url }), sync.lastSyncedAt && (_jsxs("span", { className: "text-[10px] text-text-secondary", children: ["Last synced: ", format(new Date(sync.lastSyncedAt), "MMM d, h:mm a")] })), sync.error && (_jsxs("span", { className: "text-[10px] text-red-400", children: ["Error: ", sync.error] }))] }), _jsx(Button, { variant: "ghost", size: "icon", onClick: () => handleDelete(sync.id), className: "text-text-secondary hover:text-red-400", children: _jsx(Icon, { name: "Trash2", size: 16 }) })] }, sync.id))) })), isAdding ? (_jsxs("div", { className: "bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col gap-3", children: [_jsx("h4", { className: "text-sm font-bold text-white", children: "Add External Calendar" }), _jsxs("div", { className: "flex flex-col gap-3", children: [_jsx(Input, { placeholder: "Label (e.g. Airbnb)", value: newName, onChange: (e) => setNewName(e.target.value), className: "bg-black/20" }), _jsx(Input, { placeholder: "iCal URL (https://...)", value: newUrl, onChange: (e) => setNewUrl(e.target.value), className: "bg-black/20" }), _jsxs("div", { className: "flex gap-2 justify-end", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: () => setIsAdding(false), children: "Cancel" }), _jsx(Button, { size: "sm", onClick: handleAdd, disabled: loading || !newName || !newUrl, children: loading ? "Adding..." : "Add Calendar" })] })] })] })) : (_jsxs(Button, { variant: "outline", className: "w-full border-dashed border-white/20 hover:border-white/40 text-text-secondary", onClick: () => setIsAdding(true), children: [_jsx(Icon, { name: "Plus", size: 16, className: "mr-2" }), "Connect Calendar"] }))] }));
};
