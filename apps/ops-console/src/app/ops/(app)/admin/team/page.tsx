"use client";

import React, { useState } from "react";
import { Users, Shield, Plus, Lock, Copy, Check } from "lucide-react";
import { useOpsQuery } from "@/hooks/useOpsQuery";
import { toast } from "sonner"; // Assuming sonner is used for toasts

export default function TeamPage() {
    const { data: team, isLoading, refetch } = useOpsQuery(
        ["ops-team"],
        () => fetch("/api/ops/admin/team").then(res => res.json().then(j => j.data))
    );

    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", role: "OPS_SUPPORT" });
    const [createdCreds, setCreatedCreds] = useState<{ email: string, tempPassword: string } | null>(null);

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/ops/admin/team", {
                method: "POST",
                body: JSON.stringify(formData)
            });
            const json = await res.json();

            if (res.ok) {
                toast.success("User created successfully");
                setCreatedCreds({ email: formData.email, tempPassword: json.tempPassword });
                setIsInviteOpen(false);
                setFormData({ name: "", email: "", role: "OPS_SUPPORT" });
                refetch();
            } else {
                toast.error(json.error || "Failed to invite");
            }
        } catch (err) {
            toast.error("Network error");
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
    };

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Shield className="w-8 h-8 text-indigo-600" />
                        Team Management
                    </h1>
                    <p className="text-gray-500 mt-1">Manage Ops Console access and roles.</p>
                </div>
                <button
                    onClick={() => setIsInviteOpen(!isInviteOpen)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2 font-medium"
                >
                    <Plus size={16} /> Invite Member
                </button>
            </div>

            {createdCreds && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 relative">
                    <button
                        onClick={() => setCreatedCreds(null)}
                        className="absolute top-4 right-4 text-green-700 hover:text-green-900"
                    >
                        Close
                    </button>
                    <h3 className="font-bold text-green-800 text-lg mb-2 flex items-center gap-2">
                        <Check size={20} /> User Created Successfully
                    </h3>
                    <p className="text-green-700 mb-4">Please copy these temporary credentials immediately. They will not be shown again.</p>
                    <div className="bg-white border border-green-200 rounded-lg p-4 space-y-2 font-mono text-sm max-w-md">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Email:</span>
                            <span className="font-bold select-all">{createdCreds.email}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">Temp Password:</span>
                            <div className="flex items-center gap-2">
                                <span className="font-bold select-all bg-gray-100 px-2 py-0.5 rounded">{createdCreds.tempPassword}</span>
                                <button onClick={() => copyToClipboard(createdCreds.tempPassword)} className="text-gray-400 hover:text-gray-600">
                                    <Copy size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isInviteOpen && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm max-w-lg">
                    <h3 className="font-bold text-lg mb-4">Invite New Team Member</h3>
                    <form onSubmit={handleInvite} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Jane Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                required
                                type="email"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                placeholder="jane@vayva.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                            <select
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={formData.role}
                                onChange={e => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="OPS_SUPPORT">Support Agent (L1)</option>
                                <option value="OPS_ADMIN">Admin (L2)</option>
                                <option value="OPS_OWNER">Owner (Full Access)</option>
                            </select>
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setIsInviteOpen(false)}
                                className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium"
                            >
                                Send Invite
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-3 font-medium">Name</th>
                            <th className="px-6 py-3 font-medium">Role</th>
                            <th className="px-6 py-3 font-medium">Status</th>
                            <th className="px-6 py-3 font-medium">Last Login</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            <tr><td colSpan={4} className="p-12 text-center text-gray-400">Loading team...</td></tr>
                        ) : !team?.length ? (
                            <tr><td colSpan={4} className="p-12 text-center text-gray-400">No team members found.</td></tr>
                        ) : (
                            team.map((u: any) => (
                                <tr key={u.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{u.name}</div>
                                        <div className="text-xs text-gray-500">{u.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${u.role === 'OPS_OWNER' ? 'bg-purple-100 text-purple-700' :
                                                u.role === 'OPS_ADMIN' ? 'bg-indigo-100 text-indigo-700' :
                                                    'bg-blue-100 text-blue-700'
                                            }`}>
                                            {u.role.replace("OPS_", "")}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${u.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                            {u.isActive ? "Active" : "Disabled"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-xs">
                                        {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : "Never"}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
