"use client";

import React from "react";
import { History, User, Search, RefreshCw } from "lucide-react";
import { useOpsQuery } from "@/hooks/useOpsQuery";

export default function AuditPage() {
    const { data: logs, isLoading, refetch } = useOpsQuery(
        ["system-audit"],
        () => fetch("/api/ops/admin/audit").then(res => res.json().then(j => j.data))
    );

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <History className="w-8 h-8 text-indigo-600" />
                        System Audit Log
                    </h1>
                    <p className="text-gray-500 mt-1">Unified timestamped log of internal administrative actions.</p>
                </div>
                <button onClick={() => refetch()} className="p-2 hover:bg-gray-100 rounded-full">
                    <RefreshCw className={`w-5 h-5 text-gray-500 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-3 font-medium">Event</th>
                            <th className="px-6 py-3 font-medium">Actor</th>
                            <th className="px-6 py-3 font-medium">Details</th>
                            <th className="px-6 py-3 font-medium">Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            <tr><td colSpan={4} className="p-12 text-center text-gray-400">Loading audit log...</td></tr>
                        ) : !logs?.length ? (
                            <tr><td colSpan={4} className="p-12 text-center text-gray-400">No activity recorded.</td></tr>
                        ) : (
                            logs.map((log: any) => (
                                <tr key={log.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-mono text-xs text-indigo-700 font-bold">{log.eventType}</td>
                                    <td className="px-6 py-4 flex items-center gap-2">
                                        <span className="bg-gray-100 p-1 rounded-full text-gray-500"><User size={12} /></span>
                                        <span className="font-medium text-gray-900">{log.OpsUser?.name || "System"}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <pre className="text-[10px] text-gray-500 bg-gray-50 rounded p-1 max-w-xs overflow-x-auto">
                                            {JSON.stringify(log.metadata, null, 0)}
                                        </pre>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-xs">{new Date(log.createdAt).toLocaleString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
