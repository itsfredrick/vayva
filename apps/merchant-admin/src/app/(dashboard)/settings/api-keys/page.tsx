"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import { toast } from "sonner";
import { format } from "date-fns";
import {
    Key,
    Plus,
    RefreshCw,
    Trash2,
    CheckCircle2,
    Copy
} from "lucide-react";
import { Button, Input } from "@vayva/ui";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ApiKeysPage() {
    const { data: keys, error, isLoading } = useSWR("/api/settings/api-keys", fetcher);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newKeyName, setNewKeyName] = useState("");
    const [ipAllowlist, setIpAllowlist] = useState("");
    const [expiresIn, setExpiresIn] = useState(""); // Days as string, empty = never
    const [createdKey, setCreatedKey] = useState<string | null>(null);

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
            if (!res.ok) throw new Error(data.error);

            setCreatedKey(data.apiKey.key);
            toast.success("API Key created");
            mutate("/api/settings/api-keys");
            // Don't close dialog yet, user needs to copy key
        } catch (err: unknown) {
            toast.error(err.message);
        }
    };

    const revokeKey = async (id: string) => {
        if (!confirm("Are you sure? This will immediately break any integrations using this key.")) return;
        try {
            const res = await fetch(`/api/settings/api-keys/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to revoke");
            toast.success("Key revoked");
            mutate("/api/settings/api-keys");
        } catch (err: unknown) {
            toast.error(err.message);
        }
    };

    const rotateKey = async (id: string) => {
        if (!confirm("Rotate key? The old key will be revoked immediately.")) return;
        try {
            const res = await fetch(`/api/settings/api-keys/${id}`, { method: "POST" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            // Show the new key to user - simplistic alert for now or a custom modal
            // Ideally we reuse the 'createdKey' modal state or a new one.
            // For MVP speed:
            prompt("Key Rotated! Copy your NEW key now. The old one is dead.", data.apiKey.key);

            mutate("/api/settings/api-keys");
        } catch (err: unknown) {
            toast.error(err.message);
        }
    };

    if (isLoading) return <div className="p-8">Loading keys...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">API Keys</h2>
                    <p className="text-muted-foreground">
                        Manage access tokens for backend integrations.
                    </p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={(open) => {
                    if (!open) setCreatedKey(null); // Reset on close
                    setIsCreateOpen(open);
                }}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Create New Key
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create API Key</DialogTitle>
                            <DialogDescription>
                                Generate a new secret key for server-side access.
                            </DialogDescription>
                        </DialogHeader>

                        {!createdKey ? (
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <label>Key Name</label>
                                    <Input
                                        placeholder="e.g. Production Server, Zapier"
                                        value={newKeyName}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewKeyName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label>Expiration</label>
                                    <select
                                        title="Key Expiration"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={expiresIn}
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setExpiresIn(e.target.value)}
                                    >
                                        <option value="">Never</option>
                                        <option value="30">30 Days</option>
                                        <option value="90">90 Days</option>
                                        <option value="365">1 Year</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label>IP Allowlist (Optional)</label>
                                    <Input
                                        placeholder="e.g. 1.2.3.4, 5.6.7.8"
                                        value={ipAllowlist}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIpAllowlist(e.target.value)}
                                    />
                                    <p className="text-xs text-muted-foreground">Comma separated IPv4 addresses. Leave empty to allow all.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4 py-4">
                                <Alert variant="default" className="border-green-500 bg-green-50 dark:bg-green-900/20">
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    <AlertTitle>Key Generated Successfully</AlertTitle>
                                    <AlertDescription>
                                        Copy this key now. You will not be able to see it again.
                                    </AlertDescription>
                                </Alert>
                                <div className="flex items-center space-x-2">
                                    <Input value={createdKey} readOnly className="font-mono text-sm" />
                                    <Button size="icon" variant="outline" onClick={() => {
                                        navigator.clipboard.writeText(createdKey);
                                        toast.success("Copied!");
                                    }}>
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        <DialogFooter>
                            {!createdKey ? (
                                <Button onClick={createKey} disabled={!newKeyName}>Generate Key</Button>
                            ) : (
                                <Button onClick={() => setIsCreateOpen(false)}>Done</Button>
                            )}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Active Keys</CardTitle>
                    <CardDescription>
                        Do not share these keys with anyone.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Last Used</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead>Expires</TableHead>
                                <TableHead>IP Restriction</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {keys?.map((key: unknown) => (
                                <TableRow key={key.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span>{key.name}</span>
                                            <span className="text-xs text-muted-foreground font-mono">
                                                sk_live_••••
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={key.status === "ACTIVE" ? "default" : "destructive"}>
                                            {key.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {key.lastUsedAt ? format(new Date(key.lastUsedAt), "MMM d, yyyy HH:mm") : "Never"}
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(key.createdAt), "MMM d, yyyy")}
                                    </TableCell>
                                    <TableCell>
                                        {key.expiresAt ? format(new Date(key.expiresAt), "MMM d, yyyy") : "Never"}
                                    </TableCell>
                                    <TableCell>
                                        {key.ipAllowlist && key.ipAllowlist.length > 0 ? (
                                            <span className="text-xs font-mono">{key.ipAllowlist.join(", ")}</span>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">Any</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {key.status === "ACTIVE" && (
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => rotateKey(key.id)} title="Rotate Key">
                                                    <RefreshCw className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => revokeKey(key.id)} title="Revoke Key">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {keys?.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        No API keys found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
