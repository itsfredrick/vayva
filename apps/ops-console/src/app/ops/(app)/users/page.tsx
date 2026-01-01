
"use client";

import React, { useState, useEffect } from "react";
import {
    Users,
    UserPlus,
    Trash2,
    Shield,
    Mail,
    CheckCircle,
    X,
    Loader2,
    Copy,
    AlertTriangle
} from "lucide-react";
import { toast } from "sonner";
import { useOpsQuery } from "@/hooks/useOpsQuery";
import { useQueryClient } from "@tanstack/react-query";

interface OpsUser {
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    lastLoginAt: string;
    createdAt: string;
}

export default function UsersPage() {
    const queryClient = useQueryClient();
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    // User List Query
    const { data: users, isLoading } = useOpsQuery(["ops-users"], async () => {
        const res = await fetch("/api/ops/users");
        if (res.status === 401) {
            window.location.href = "/ops/login";
            return [];
        }
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
    });

    const [newUserCreds, setNewUserCreds] = useState<{ email: string; tempPass: string } | null>(null);

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Users className="h-8 w-8 text-indigo-600" />
                        Team Management
                    </h1>
                    <p className="text-gray-500 mt-1">Manage access to the Ops Console.</p>
                </div>
                <button
                    onClick={() => setIsInviteModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                >
                    <UserPlus className="h-4 w-4" />
                    Invite Member
                </button>
            </div>

            {/* Users Table */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Last Login</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                                    Loading team...
                                </td>
                            </tr>
                        ) : users?.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                    No users found.
                                </td>
                            </tr>
                        ) : (
                            users?.map((user: OpsUser) => (
                                <UserRow key={user.id} user={user} refresh={() => queryClient.invalidateQueries({ queryKey: ["ops-users"] })} />
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <InviteUserModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                onSuccess={(creds: { email: string; tempPass: string }) => {
                    setNewUserCreds(creds);
                    queryClient.invalidateQueries({ queryKey: ["ops-users"] });
                }}
            />

            <CredentialsDialog
                creds={newUserCreds}
                onClose={() => setNewUserCreds(null)}
            />
        </div>
    );
}

function UserRow({ user, refresh }: { user: OpsUser; refresh: () => void }) {
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to remove ${user.name}? This cannot be undone.`)) return;

        setDeleting(true);
        try {
            const res = await fetch(`/api/ops/users?id=${user.id}`, { method: "DELETE" });
            if (!res.ok) {
                const json = await res.json();
                throw new Error(json.error || "Failed to delete");
            }
            toast.success("User removed");
            refresh();
        } catch (e: any) {
            toast.error(e.message);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs ring-2 ring-white">
                        {user.name[0]}
                    </div>
                    <div>
                        <div className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                            <a href={`/ops/users/${user.id}/activity`} className="hover:underline focus:outline-none">
                                {user.name}
                            </a>
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {user.email}
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${user.role === "OPS_OWNER" ? "bg-purple-100 text-purple-700" :
                    user.role === "OPS_ADMIN" ? "bg-blue-100 text-blue-700" :
                        "bg-gray-100 text-gray-700"
                    }`}>
                    <Shield className="h-3 w-3" />
                    {user.role.replace("OPS_", "")}
                </span>
            </td>
            <td className="px-6 py-4">
                {user.isActive ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
                        <CheckCircle className="h-3 w-3" /> Active
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400">
                        Inactive
                    </span>
                )}
            </td>
            <td className="px-6 py-4 text-xs text-gray-500">
                {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : "Never"}
            </td>
            <td className="px-6 py-4 text-right">
                {user.role !== "OPS_OWNER" && (
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove User"
                    >
                        {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </button>
                )}
            </td>
        </tr>
    );
}

function InviteUserModal({ isOpen, onClose, onSuccess }: any) {
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState("OPS_SUPPORT");

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

            if (!res.ok) throw new Error(json.error);

            toast.success("Invitation sent");
            onSuccess({ email: json.user.email, tempPass: json.tempPassword });
            onClose();
        } catch (e: any) {
            toast.error(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900">Invite New Member</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input name="name" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Alice Smith" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input name="email" type="email" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="alice@company.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <div className="grid grid-cols-3 gap-2">
                            {["OPS_ADMIN", "OPS_SUPPORT", "OPERATOR"].map((r) => (
                                <button
                                    key={r}
                                    type="button"
                                    onClick={() => setRole(r)}
                                    className={`px-2 py-2 text-xs font-bold rounded-lg border transition-all ${role === r ? "bg-indigo-50 border-indigo-600 text-indigo-700" : "border-gray-200 text-gray-600 hover:border-gray-300"
                                        }`}
                                >
                                    {r.replace("OPS_", "")}
                                </button>
                            ))}
                        </div>
                        <input type="hidden" name="role" value={role} />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                            Send Invitation
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function CredentialsDialog({ creds, onClose }: { creds: { email: string; tempPass: string } | null; onClose: () => void }) {
    if (!creds) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">User Created</h3>
                <p className="text-sm text-gray-500 mb-6">
                    Share these temporary credentials with the user securely. They will not be shown again.
                </p>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-left mb-6 relative group">
                    <div className="text-xs text-gray-500 uppercase font-bold mb-1">Email</div>
                    <div className="font-mono text-gray-900 mb-3 select-all">{creds.email}</div>

                    <div className="text-xs text-gray-500 uppercase font-bold mb-1">Temporary Password</div>
                    <div className="font-mono text-indigo-600 font-bold text-lg select-all">{creds.tempPass}</div>
                </div>

                <button
                    onClick={onClose}
                    className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-bold"
                >
                    Done
                </button>
            </div>
        </div>
    );
}
