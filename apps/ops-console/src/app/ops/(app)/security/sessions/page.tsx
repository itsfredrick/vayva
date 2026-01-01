"use client";

import React from "react";
import { ShieldAlert, Monitor, Smartphone, Trash2, RefreshCw } from "lucide-react";
import { useOpsQuery } from "@/hooks/useOpsQuery";
import { toast } from "sonner";

export default function SessionManagerPage() {
    const { data: sessions, isLoading, refetch } = useOpsQuery(
        ["active-sessions"],
        () => fetch("/api/ops/security/sessions").then(res => res.json().then(j => j.data))
    );

    const handleRevoke = async (id: string, email: string) => {
        if (!confirm(`Revoke session for ${email}? User will be logged out.`)) return;

        try {
            const res = await fetch(`/api/ops/security/sessions/${id}/revoke`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Session revoked");
                refetch();
            } else {
                toast.error("Failed to revoke");
            }
        } catch (e) {
            toast.error("Error revoking session");
        }
    };

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <ShieldAlert className="w-8 h-8 text-indigo-600" />
                        Identity & Session Manager
                    </h1>
                    <p className="text-gray-500 mt-1">Review and revoke active merchant sessions.</p>
                </div>
                <button onClick={() => refetch()} className="p-2 hover:bg-gray-100 rounded-full">
                    <RefreshCw className={`w-5 h-5 text-gray-500 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-3 font-medium">User</th>
                            <th className="px-6 py-3 font-medium">Device / IP</th>
                            <th className="px-6 py-3 font-medium">Created</th>
                            <th className="px-6 py-3 font-medium">Expires</th>
                            <th className="px-6 py-3 font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            <tr><td colSpan={5} className="p-12 text-center text-gray-400">Loading sessions...</td></tr>
                        ) : !sessions?.length ? (
                            <tr><td colSpan={5} className="p-12 text-center text-gray-400">No active sessions found.</td></tr>
                        ) : (
                            sessions.map((s: any) => (
                                <tr key={s.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{s.User?.email}</div>
                                        <div className="text-xs text-gray-500">{s.User?.firstName} {s.User?.lastName}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-gray-700">
                                            {s.device?.toLowerCase().includes("mobile") ? <Smartphone size={14} /> : <Monitor size={14} />}
                                            <span className="truncate max-w-[150px]" title={s.device}>{s.device || "Unknown Device"}</span>
                                        </div>
                                        <div className="text-xs text-gray-400 font-mono mt-0.5">{s.ipAddress || "0.0.0.0"}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-xs">{new Date(s.createdAt).toLocaleString()}</td>
                                    <td className="px-6 py-4 text-gray-500 text-xs">{new Date(s.expiresAt).toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleRevoke(s.id, s.User?.email)}
                                            className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Revoke Session"
                                        >
                                            <Trash2 size={16} />
                                        </button>
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
