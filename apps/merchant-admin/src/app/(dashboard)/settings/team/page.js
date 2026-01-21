"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import { toast } from "sonner";
import { format } from "date-fns";
import { Button, Input } from "@vayva/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Mail, Shield, UserPlus, XCircle, Clock } from "lucide-react";
const fetcher = (url) => fetch(url).then((res) => res.json());
export default function TeamPage() {
    const { data, isLoading } = useSWR("/api/settings/team", fetcher);
    // Invite State
    const [isInviting, setIsInviting] = useState(false);
    const [inviteForm, setInviteForm] = useState({ email: "", role: "STAFF" });
    const [sending, setSending] = useState(false);
    const handleInvite = async () => {
        if (!inviteForm.email)
            return;
        setSending(true);
        try {
            const res = await fetch("/api/settings/team/invite", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(inviteForm),
            });
            const json = await res.json();
            if (!res.ok)
                throw new Error(json.error || "Failed to invite");
            toast.success(json.status === "added" ? "User added to team" : "Invitation sent");
            setIsInviting(false);
            setInviteForm({ email: "", role: "STAFF" });
            mutate("/api/settings/team");
        }
        catch (err) {
            toast.error(err.message);
        }
        finally {
            setSending(false);
        }
    };
    const removeMember = async (id) => {
        if (!confirm("Remove this member? They will lose access immediately."))
            return;
        try {
            await fetch(`/api/settings/team?id=${id}`, { method: "DELETE" });
            toast.success("Member removed");
            mutate("/api/settings/team");
        }
        catch (e) {
            toast.error("Failed to remove member");
        }
    };
    const cancelInvite = async (email) => {
        if (!confirm("Cancel this invitation?"))
            return;
        try {
            await fetch(`/api/settings/team/invite?email=${encodeURIComponent(email)}`, { method: "DELETE" });
            toast.success("Invitation cancelled");
            mutate("/api/settings/team");
        }
        catch (e) {
            toast.error("Failed to cancel invite");
        }
    };
    if (isLoading)
        return _jsx("div", { className: "p-8", children: "Loading team..." });
    const members = data?.members || [];
    const invites = data?.invites || [];
    return (_jsxs("div", { className: "space-y-6 max-w-5xl mx-auto", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold tracking-tight", children: "Team & Permissions" }), _jsx("p", { className: "text-muted-foreground", children: "Manage who has access to your store." })] }), _jsxs(Dialog, { open: isInviting, onOpenChange: setIsInviting, children: [_jsx(DialogTrigger, { asChild: true, children: _jsxs(Button, { children: [_jsx(UserPlus, { className: "mr-2 h-4 w-4" }), " Invite Member"] }) }), _jsxs(DialogContent, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Invite Team Member" }), _jsx(DialogDescription, { children: "Send an email invitation to join your store." })] }), _jsxs("div", { className: "grid gap-4 py-4", children: [_jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { children: "Email Address" }), _jsx(Input, { placeholder: "colleague@example.com", type: "email", value: inviteForm.email, onChange: (e) => setInviteForm({ ...inviteForm, email: e.target.value }) })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { children: "Role" }), _jsxs(Select, { value: inviteForm.role, onValueChange: (val) => setInviteForm({ ...inviteForm, role: val }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "ADMIN", children: "Admin (Full Access)" }), _jsx(SelectItem, { value: "STAFF", children: "Staff (Standard Access)" }), _jsx(SelectItem, { value: "SUPPORT", children: "Support (Orders & Customers)" }), _jsx(SelectItem, { value: "FINANCE", children: "Finance (Analytics & Payouts)" })] })] })] })] }), _jsx(DialogFooter, { children: _jsx(Button, { onClick: handleInvite, disabled: sending, children: sending ? "Sending..." : "Send Invitation" }) })] })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { children: ["Active Members (", members.length, ")"] }) }), _jsx(CardContent, { children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "User" }), _jsx(TableHead, { children: "Role" }), _jsx(TableHead, { children: "Joined" }), _jsx(TableHead, { className: "text-right", children: "Actions" })] }) }), _jsx(TableBody, { children: members.map((m) => (_jsxs(TableRow, { children: [_jsxs(TableCell, { className: "flex items-center gap-3", children: [_jsxs(Avatar, { className: "h-9 w-9", children: [_jsx(AvatarImage, { src: m.avatarUrl }), _jsx(AvatarFallback, { className: "bg-gray-100", children: m.name ? m.name[0].toUpperCase() : '?' })] }), _jsxs("div", { className: "flex flex-col", children: [_jsx("span", { className: "font-medium", children: m.name }), _jsx("span", { className: "text-xs text-muted-foreground", children: m.email })] })] }), _jsx(TableCell, { children: _jsxs(Badge, { variant: "outline", className: "flex w-fit items-center gap-1", children: [_jsx(Shield, { className: "h-3 w-3" }), m.role] }) }), _jsx(TableCell, { className: "text-muted-foreground text-sm", children: format(new Date(m.joinedAt), "MMM d, yyyy") }), _jsx(TableCell, { className: "text-right", children: _jsx(Button, { variant: "ghost", size: "icon", onClick: () => removeMember(m.id), children: _jsx(Trash2, { className: "h-4 w-4 text-muted-foreground hover:text-red-500" }) }) })] }, m.id))) })] }) })] }), invites.length > 0 && (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { children: ["Pending Invites (", invites.length, ")"] }) }), _jsx(CardContent, { children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Email" }), _jsx(TableHead, { children: "Role" }), _jsx(TableHead, { children: "Status" }), _jsx(TableHead, { className: "text-right", children: "Actions" })] }) }), _jsx(TableBody, { children: invites.map((inv) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Mail, { className: "h-4 w-4 text-muted-foreground" }), _jsx("span", { children: inv.email })] }) }), _jsx(TableCell, { children: _jsx(Badge, { variant: "secondary", children: inv.role }) }), _jsx(TableCell, { children: _jsxs("div", { className: "flex items-center gap-1 text-sm text-yellow-600", children: [_jsx(Clock, { className: "h-3 w-3" }), "Expires ", format(new Date(inv.expiresAt), "MMM d")] }) }), _jsx(TableCell, { className: "text-right", children: _jsx(Button, { variant: "ghost", size: "icon", onClick: () => cancelInvite(inv.email), children: _jsx(XCircle, { className: "h-4 w-4 text-muted-foreground hover:text-red-500" }) }) })] }, inv.email))) })] }) })] }))] }));
}
