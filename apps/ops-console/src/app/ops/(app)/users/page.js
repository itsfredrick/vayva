"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Users, UserPlus, Trash2, Shield, Mail, CheckCircle, X, Loader2, AlertTriangle, Search } from "lucide-react";
import { toast } from "sonner";
import { useOpsQuery } from "@/hooks/useOpsQuery";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@vayva/ui";
export default function UsersPage() {
    const queryClient = useQueryClient();
    const router = useRouter();
    const searchParams = useSearchParams();
    const q = searchParams.get("q") || "";
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [newUserCreds, setNewUserCreds] = useState(null);
    // User List Query
    const { data: users, isLoading } = useOpsQuery(["ops-users", q], async () => {
        const res = await fetch(`/api/ops/users${q ? `?q=${q}` : ""}`);
        if (res.status === 401) {
            window.location.href = "/ops/login";
            return [];
        }
        if (!res.ok)
            throw new Error("Failed to fetch users");
        return res.json();
    });
    return (_jsxs("div", { className: "p-8 max-w-6xl mx-auto space-y-8", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-3xl font-bold text-gray-900 flex items-center gap-3", children: [_jsx(Users, { className: "h-8 w-8 text-indigo-600" }), "Team Management"] }), _jsx("p", { className: "text-gray-500 mt-1", children: "Manage access to the Ops Console." })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" }), _jsx("input", { placeholder: "Search team...", className: "pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64", defaultValue: q, onChange: (e) => {
                                            const val = e.target.value;
                                            const params = new URLSearchParams(window.location.search);
                                            if (val)
                                                params.set("q", val);
                                            else
                                                params.delete("q");
                                            router.push(`?${params.toString()}`);
                                        } })] }), _jsxs(Button, { onClick: () => setIsInviteModalOpen(true), className: "flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-sm h-auto", "aria-label": "Invite new team member", children: [_jsx(UserPlus, { className: "h-4 w-4" }), "Invite Member"] })] })] }), _jsx("div", { className: "bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden", children: _jsxs("table", { className: "w-full text-left", children: [_jsx("thead", { className: "bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-4", children: "User" }), _jsx("th", { className: "px-6 py-4", children: "Role" }), _jsx("th", { className: "px-6 py-4", children: "Status" }), _jsx("th", { className: "px-6 py-4", children: "Last Login" }), _jsx("th", { className: "px-6 py-4 text-right", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-100", children: isLoading ? (_jsx("tr", { children: _jsxs("td", { colSpan: 5, className: "px-6 py-12 text-center text-gray-400", children: [_jsx(Loader2, { className: "h-6 w-6 animate-spin mx-auto mb-2" }), "Loading team..."] }) })) : users?.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: "px-6 py-12 text-center text-gray-400", children: "No users found." }) })) : (users?.map((user) => (_jsx(UserRow, { user: user, refresh: () => queryClient.invalidateQueries({ queryKey: ["ops-users"] }) }, user.id)))) })] }) }), _jsx(InviteUserModal, { isOpen: isInviteModalOpen, onClose: () => setIsInviteModalOpen(false), onSuccess: (creds) => {
                    setNewUserCreds(creds);
                    queryClient.invalidateQueries({ queryKey: ["ops-users"] });
                } }), _jsx(CredentialsDialog, { creds: newUserCreds, onClose: () => setNewUserCreds(null) })] }));
}
function UserRow({ user, refresh }) {
    const [deleting, setDeleting] = useState(false);
    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to remove ${user.name}? This cannot be undone.`))
            return;
        setDeleting(true);
        try {
            const res = await fetch(`/api/ops/users?id=${user.id}`, { method: "DELETE" });
            if (!res.ok) {
                const json = await res.json();
                throw new Error(json.error || "Failed to delete");
            }
            toast.success("User removed");
            refresh();
        }
        catch (e) {
            toast.error(e.message);
        }
        finally {
            setDeleting(false);
        }
    };
    const handleUpdate = async (action) => {
        const msg = action === "TOGGLE_STATUS"
            ? `Are you sure you want to ${user.isActive ? "suspend" : "activate"} ${user.name}?`
            : `Reset 2FA for ${user.name}? They will need to set it up again on next login.`;
        if (!confirm(msg))
            return;
        setDeleting(true);
        try {
            const res = await fetch("/api/ops/users", {
                method: "PATCH",
                body: JSON.stringify({ userId: user.id, action })
            });
            if (!res.ok) {
                const json = await res.json();
                throw new Error(json.error || "Action failed");
            }
            toast.success("User updated");
            refresh();
        }
        catch (e) {
            toast.error(e.message);
        }
        finally {
            setDeleting(false);
        }
    };
    return (_jsxs("tr", { className: "hover:bg-gray-50 transition-colors", children: [_jsx("td", { className: "px-6 py-4", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "h-8 w-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs ring-2 ring-white", children: user.name[0] }), _jsxs("div", { children: [_jsx("div", { className: "font-medium text-gray-900 group-hover:text-indigo-600 transition-colors", children: _jsx("a", { href: `/ops/users/${user.id}/activity`, className: "hover:underline focus:outline-none", children: user.name }) }), _jsxs("div", { className: "text-xs text-gray-500 flex items-center gap-1", children: [_jsx(Mail, { className: "h-3 w-3" }), " ", user.email] })] })] }) }), _jsx("td", { className: "px-6 py-4", children: _jsxs("span", { className: `inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${user.role === "OPS_OWNER" ? "bg-purple-100 text-purple-700" :
                        user.role === "OPS_ADMIN" ? "bg-blue-100 text-blue-700" :
                            "bg-gray-100 text-gray-700"}`, children: [_jsx(Shield, { className: "h-3 w-3" }), user.role.replace("OPS_", "")] }) }), _jsx("td", { className: "px-6 py-4", children: user.isActive ? (_jsxs("span", { className: "inline-flex items-center gap-1 text-xs font-medium text-green-600", children: [_jsx(CheckCircle, { className: "h-3 w-3" }), " Active"] })) : (_jsxs("span", { className: "inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded", children: [_jsx(AlertTriangle, { className: "h-3 w-3" }), " Suspended"] })) }), _jsx("td", { className: "px-6 py-4 text-xs text-gray-500", children: user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : "Never" }), _jsx("td", { className: "px-6 py-4 text-right", children: _jsx("div", { className: "flex justify-end gap-2 items-center", children: user.role !== "OPS_OWNER" && (_jsxs(_Fragment, { children: [_jsx(Button, { variant: "outline", onClick: () => handleUpdate("TOGGLE_STATUS"), disabled: deleting, className: `px-3 py-1 text-xs font-bold rounded border transition-colors h-auto ${user.isActive
                                    ? "text-red-600 bg-red-50 border-red-100 hover:bg-red-100"
                                    : "text-green-600 bg-green-50 border-green-100 hover:bg-green-100"}`, "aria-label": user.isActive ? `Suspend ${user.name}` : `Activate ${user.name}`, children: user.isActive ? "Suspend" : "Activate" }), _jsx(Button, { variant: "outline", onClick: () => handleUpdate("RESET_2FA"), disabled: deleting, className: "px-3 py-1 text-xs font-bold text-gray-600 bg-gray-50 border border-gray-100 hover:bg-gray-100 rounded h-auto", "aria-label": `Reset 2FA for ${user.name}`, children: "Reset 2FA" }), _jsx(Button, { variant: "ghost", size: "icon", onClick: handleDelete, disabled: deleting, className: "p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors h-8 w-8", "aria-label": `Remove user ${user.name}`, children: deleting ? _jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : _jsx(Trash2, { className: "h-4 w-4" }) })] })) }) })] }));
}
function InviteUserModal({ isOpen, onClose, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState("OPS_SUPPORT");
    if (!isOpen)
        return null;
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name"),
            email: formData.get("email"),
            role: formData.get("role"),
        };
        try {
            const res = await fetch("/api/ops/users", {
                method: "POST",
                body: JSON.stringify(data),
            });
            const json = await res.json();
            if (!res.ok)
                throw new Error(json.error);
            toast.success("Invitation sent");
            onSuccess({ email: json.user.email, tempPass: json.tempPassword });
            onClose();
        }
        catch (e) {
            toast.error(e.message);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4", children: _jsxs("div", { className: "bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden", children: [_jsxs("div", { className: "p-6 border-b border-gray-100 flex justify-between items-center", children: [_jsx("h3", { className: "text-lg font-bold text-gray-900", children: "Invite New Member" }), _jsx(Button, { variant: "ghost", size: "icon", onClick: onClose, className: "text-gray-400 hover:text-gray-600 h-8 w-8", "aria-label": "Close modal", children: _jsx(X, { className: "h-5 w-5" }) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Full Name" }), _jsx("input", { name: "name", required: true, className: "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none", placeholder: "e.g. Alice Smith" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Email Address" }), _jsx("input", { name: "email", type: "email", required: true, className: "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none", placeholder: "alice@company.com" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Role" }), _jsx("div", { className: "grid grid-cols-3 gap-2", children: ["OPS_ADMIN", "OPS_SUPPORT", "OPERATOR"].map((r) => (_jsx(Button, { type: "button", variant: "ghost", onClick: () => setRole(r), className: `px-2 py-2 text-xs font-bold rounded-lg border transition-all h-auto hover:bg-transparent ${role === r ? "bg-indigo-50 border-indigo-600 text-indigo-700" : "border-gray-200 text-gray-600 hover:border-gray-300"}`, "aria-label": `Select role: ${r.replace("OPS_", "")}`, children: r.replace("OPS_", "") }, r))) }), _jsx("input", { type: "hidden", name: "role", value: role })] }), _jsx("div", { className: "pt-2", children: _jsxs(Button, { type: "submit", variant: "primary", disabled: loading, className: "w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold flex items-center justify-center gap-2 disabled:opacity-70 h-auto", "aria-label": "Send invitation email", children: [loading ? _jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : _jsx(UserPlus, { className: "h-4 w-4" }), "Send Invitation"] }) })] })] }) }));
}
function CredentialsDialog({ creds, onClose }) {
    if (!creds)
        return null;
    return (_jsx("div", { className: "fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4", children: _jsxs("div", { className: "bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center", children: [_jsx("div", { className: "mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4", children: _jsx(CheckCircle, { className: "h-6 w-6 text-green-600" }) }), _jsx("h3", { className: "text-lg font-bold text-gray-900 mb-2", children: "User Created" }), _jsx("p", { className: "text-sm text-gray-500 mb-6", children: "Share these temporary credentials with the user securely. They will not be shown again." }), _jsxs("div", { className: "bg-gray-50 p-4 rounded-xl border border-gray-200 text-left mb-6 relative group", children: [_jsx("div", { className: "text-xs text-gray-500 uppercase font-bold mb-1", children: "Email" }), _jsx("div", { className: "font-mono text-gray-900 mb-3 select-all", children: creds.email }), _jsx("div", { className: "text-xs text-gray-500 uppercase font-bold mb-1", children: "Temporary Password" }), _jsx("div", { className: "font-mono text-indigo-600 font-bold text-lg select-all", children: creds.tempPass })] }), _jsx(Button, { variant: "primary", onClick: onClose, className: "w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-bold h-auto", "aria-label": "Close credentials dialog", children: "Done" })] }) }));
}
