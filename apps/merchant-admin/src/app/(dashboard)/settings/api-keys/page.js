"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import { toast } from "sonner";
import { format } from "date-fns";
import { Plus, RefreshCw, Trash2, CheckCircle2, Copy } from "lucide-react";
import { Button, Input } from "@vayva/ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
const fetcher = (url) => fetch(url).then((res) => res.json());
export default function ApiKeysPage() {
    const { data: keys, error, isLoading } = useSWR("/api/settings/api-keys", fetcher);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newKeyName, setNewKeyName] = useState("");
    const [ipAllowlist, setIpAllowlist] = useState("");
    const [expiresIn, setExpiresIn] = useState(""); // Days as string, empty = never
    const [createdKey, setCreatedKey] = useState(null);
    const createKey = async () => {
        try {
            let expiresAt = null;
            if (expiresIn) {
                const date = new Date();
                date.setDate(date.getDate() + parseInt(expiresIn));
                expiresAt = date.toISOString();
            }
            const res = await fetch("/api/settings/api-keys", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newKeyName, ipAllowlist, expiresAt }),
            });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.error);
            setCreatedKey(data.apiKey.key);
            toast.success("API Key created");
            mutate("/api/settings/api-keys");
            // Don't close dialog yet, user needs to copy key
        }
        catch (err) {
            toast.error(err.message);
        }
    };
    const revokeKey = async (id) => {
        if (!confirm("Are you sure? This will immediately break any integrations using this key."))
            return;
        try {
            const res = await fetch(`/api/settings/api-keys/${id}`, { method: "DELETE" });
            if (!res.ok)
                throw new Error("Failed to revoke");
            toast.success("Key revoked");
            mutate("/api/settings/api-keys");
        }
        catch (err) {
            toast.error(err.message);
        }
    };
    const rotateKey = async (id) => {
        if (!confirm("Rotate key? The old key will be revoked immediately."))
            return;
        try {
            const res = await fetch(`/api/settings/api-keys/${id}`, { method: "POST" });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.error);
            // Show the new key to user - simplistic alert for now or a custom modal
            // Ideally we reuse the 'createdKey' modal state or a new one.
            // For MVP speed:
            prompt("Key Rotated! Copy your NEW key now. The old one is dead.", data.apiKey.key);
            mutate("/api/settings/api-keys");
        }
        catch (err) {
            toast.error(err.message);
        }
    };
    if (isLoading)
        return _jsx("div", { className: "p-8", children: "Loading keys..." });
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold tracking-tight", children: "API Keys" }), _jsx("p", { className: "text-muted-foreground", children: "Manage access tokens for backend integrations." })] }), _jsxs(Dialog, { open: isCreateOpen, onOpenChange: (open) => {
                            if (!open)
                                setCreatedKey(null); // Reset on close
                            setIsCreateOpen(open);
                        }, children: [_jsx(DialogTrigger, { asChild: true, children: _jsxs(Button, { children: [_jsx(Plus, { className: "mr-2 h-4 w-4" }), " Create New Key"] }) }), _jsxs(DialogContent, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Create API Key" }), _jsx(DialogDescription, { children: "Generate a new secret key for server-side access." })] }), !createdKey ? (_jsxs("div", { className: "space-y-4 py-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { children: "Key Name" }), _jsx(Input, { placeholder: "e.g. Production Server, Zapier", value: newKeyName, onChange: (e) => setNewKeyName(e.target.value) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { children: "Expiration" }), _jsxs("select", { title: "Key Expiration", className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", value: expiresIn, onChange: (e) => setExpiresIn(e.target.value), children: [_jsx("option", { value: "", children: "Never" }), _jsx("option", { value: "30", children: "30 Days" }), _jsx("option", { value: "90", children: "90 Days" }), _jsx("option", { value: "365", children: "1 Year" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { children: "IP Allowlist (Optional)" }), _jsx(Input, { placeholder: "e.g. 1.2.3.4, 5.6.7.8", value: ipAllowlist, onChange: (e) => setIpAllowlist(e.target.value) }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Comma separated IPv4 addresses. Leave empty to allow all." })] })] })) : (_jsxs("div", { className: "space-y-4 py-4", children: [_jsxs(Alert, { variant: "default", className: "border-green-500 bg-green-50 dark:bg-green-900/20", children: [_jsx(CheckCircle2, { className: "h-4 w-4 text-green-600" }), _jsx(AlertTitle, { children: "Key Generated Successfully" }), _jsx(AlertDescription, { children: "Copy this key now. You will not be able to see it again." })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Input, { value: createdKey, readOnly: true, className: "font-mono text-sm" }), _jsx(Button, { size: "icon", variant: "outline", onClick: () => {
                                                            navigator.clipboard.writeText(createdKey);
                                                            toast.success("Copied!");
                                                        }, children: _jsx(Copy, { className: "h-4 w-4" }) })] })] })), _jsx(DialogFooter, { children: !createdKey ? (_jsx(Button, { onClick: createKey, disabled: !newKeyName, children: "Generate Key" })) : (_jsx(Button, { onClick: () => setIsCreateOpen(false), children: "Done" })) })] })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Active Keys" }), _jsx(CardDescription, { children: "Do not share these keys with anyone." })] }), _jsx(CardContent, { children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Name" }), _jsx(TableHead, { children: "Status" }), _jsx(TableHead, { children: "Last Used" }), _jsx(TableHead, { children: "Created" }), _jsx(TableHead, { children: "Expires" }), _jsx(TableHead, { children: "IP Restriction" }), _jsx(TableHead, { className: "text-right", children: "Actions" })] }) }), _jsxs(TableBody, { children: [keys?.map((key) => (_jsxs(TableRow, { children: [_jsx(TableCell, { className: "font-medium", children: _jsxs("div", { className: "flex flex-col", children: [_jsx("span", { children: key.name }), _jsx("span", { className: "text-xs text-muted-foreground font-mono", children: "sk_live_\u2022\u2022\u2022\u2022" })] }) }), _jsx(TableCell, { children: _jsx(Badge, { variant: key.status === "ACTIVE" ? "default" : "destructive", children: key.status }) }), _jsx(TableCell, { children: key.lastUsedAt ? format(new Date(key.lastUsedAt), "MMM d, yyyy HH:mm") : "Never" }), _jsx(TableCell, { children: format(new Date(key.createdAt), "MMM d, yyyy") }), _jsx(TableCell, { children: key.expiresAt ? format(new Date(key.expiresAt), "MMM d, yyyy") : "Never" }), _jsx(TableCell, { children: key.ipAllowlist && key.ipAllowlist.length > 0 ? (_jsx("span", { className: "text-xs font-mono", children: key.ipAllowlist.join(", ") })) : (_jsx("span", { className: "text-xs text-muted-foreground", children: "Any" })) }), _jsx(TableCell, { className: "text-right", children: key.status === "ACTIVE" && (_jsxs("div", { className: "flex justify-end gap-2", children: [_jsx(Button, { variant: "ghost", size: "icon", onClick: () => rotateKey(key.id), title: "Rotate Key", children: _jsx(RefreshCw, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "ghost", size: "icon", className: "text-red-500 hover:text-red-600", onClick: () => revokeKey(key.id), title: "Revoke Key", children: _jsx(Trash2, { className: "h-4 w-4" }) })] })) })] }, key.id))), keys?.length === 0 && (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 6, className: "text-center py-8 text-muted-foreground", children: "No API keys found." }) }))] })] }) })] })] }));
}
