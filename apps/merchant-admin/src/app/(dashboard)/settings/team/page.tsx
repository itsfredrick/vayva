"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import { toast } from "sonner";
import { format } from "date-fns";
import { Button, Input } from "@vayva/ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Trash2, Mail, Shield, UserPlus, XCircle, Clock } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TeamPage() {
    const { data, isLoading } = useSWR("/api/settings/team", fetcher);

    // Invite State
    const [isInviting, setIsInviting] = useState(false);
    const [inviteForm, setInviteForm] = useState({ email: "", role: "STAFF" });
    const [sending, setSending] = useState(false);

    const handleInvite = async () => {
        if (!inviteForm.email) return;
        setSending(true);
        try {
            const res = await fetch("/api/settings/team/invite", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(inviteForm),
            });
            const json = await res.json();

            if (!res.ok) throw new Error(json.error || "Failed to invite");

            toast.success(json.status === "added" ? "User added to team" : "Invitation sent");
            setIsInviting(false);
            setInviteForm({ email: "", role: "STAFF" });
            mutate("/api/settings/team");
        } catch (err: any) {
            toast.error((err as any).message || "Failed to invite");
        } finally {
            setSending(false);
        }
    };

    const removeMember = async (id: string) => {
        if (!confirm("Remove this member? They will lose access immediately.")) return;
        try {
            await fetch(`/api/settings/team?id=${id}`, { method: "DELETE" });
            toast.success("Member removed");
            mutate("/api/settings/team");
        } catch (e: any) {
            toast.error("Failed to remove member");
        }
    };

    const cancelInvite = async (email: string) => {
        if (!confirm("Cancel this invitation?")) return;
        try {
            await fetch(`/api/settings/team/invite?email=${encodeURIComponent(email)}`, { method: "DELETE" });
            toast.success("Invitation cancelled");
            mutate("/api/settings/team");
        } catch (e: any) {
            toast.error("Failed to cancel invite");
        }
    };

    if (isLoading) return <div className="p-8">Loading team...</div>;

    const members = data?.members || [];
    const invites = data?.invites || [];

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Team & Permissions</h2>
                    <p className="text-muted-foreground">Manage who has access to your store.</p>
                </div>
                <Dialog open={isInviting} onOpenChange={setIsInviting}>
                    <DialogTrigger asChild>
                        <Button>
                            <UserPlus className="mr-2 h-4 w-4" /> Invite Member
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Invite Team Member</DialogTitle>
                            <DialogDescription>
                                Send an email invitation to join your store.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label>Email Address</Label>
                                <Input
                                    placeholder="colleague@example.com"
                                    type="email"
                                    value={(inviteForm.email as any)}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInviteForm({ ...inviteForm, email: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Role</Label>
                                <Select
                                    value={(inviteForm.role as any)}
                                    onValueChange={(val) => setInviteForm({ ...inviteForm, role: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ADMIN">Admin (Full Access)</SelectItem>
                                        <SelectItem value="STAFF">Staff (Standard Access)</SelectItem>
                                        <SelectItem value="SUPPORT">Support (Orders & Customers)</SelectItem>
                                        <SelectItem value="FINANCE">Finance (Analytics & Payouts)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleInvite} disabled={sending}>
                                {sending ? "Sending..." : "Send Invitation"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Active Members */}
            <Card>
                <CardHeader>
                    <CardTitle>Active Members ({members.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {members.map((m: any) => (
                                <TableRow key={m.id}>
                                    <TableCell className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={m.avatarUrl} />
                                            <AvatarFallback className="bg-gray-100">{m.name ? m.name[0].toUpperCase() : '?'}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{m.name}</span>
                                            <span className="text-xs text-muted-foreground">{m.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="flex w-fit items-center gap-1">
                                            <Shield className="h-3 w-3" />
                                            {m.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {format(new Date(m.joinedAt), "MMM d, yyyy")}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => removeMember(m.id)}>
                                            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Pending Invites */}
            {invites.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Pending Invites ({invites.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invites.map((inv: any) => (
                                    <TableRow key={inv.email}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-muted-foreground" />
                                                <span>{inv.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{inv.role}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1 text-sm text-yellow-600">
                                                <Clock className="h-3 w-3" />
                                                Expires {format(new Date(inv.expiresAt), "MMM d")}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => cancelInvite(inv.email)}>
                                                <XCircle className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
