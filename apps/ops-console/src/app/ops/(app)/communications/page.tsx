"use client";

import React, { useState } from "react";
import { MessageSquare, Mail, Smartphone, CheckCircle, AlertCircle, RefreshCw, Filter } from "lucide-react";
import { useOpsQuery } from "@/hooks/useOpsQuery";

export default function CommunicationsPage() {
    const [filter, setFilter] = useState("ALL");
    const { data: logs, isLoading, refetch } = useOpsQuery(
        ["comm-logs", filter],
        () => fetch(`/api/ops/communications/logs?status=${filter}`).then(res => res.json().then(j => j.data))
    );

    const getChannelIcon = (channel: string) => {
        if (channel === "EMAIL") return <Mail size={14} className="text-blue-500" />;
        if (channel === "SMS") return <Smartphone size={14} className="text-purple-500" />;
        return <MessageSquare size={14} />;
    };

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <MessageSquare className="w-8 h-8 text-indigo-600" />
                        Communications Center
                    </h1>
                    <p className="text-gray-500 mt-1">Audit trail of all outbound notifications.</p>
                </div>
                <button onClick={() => refetch()} className="p-2 hover:bg-gray-100 rounded-full">
                    <RefreshCw className={`w-5 h-5 text-gray-500 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="flex gap-2 border-b border-gray-200 pb-2">
                {["ALL", "SENT", "FAILED", "PENDING"].map(s => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${filter === s ? "bg-indigo-100 text-indigo-700" : "text-gray-600 hover:bg-gray-50"}`}
                    >
                        {s}
                    </button>
                ))}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-3 font-medium">Recipient</th>
                            <th className="px-6 py-3 font-medium">Channel</th>
                            <th className="px-6 py-3 font-medium">Template</th>
                            <th className="px-6 py-3 font-medium">Status</th>
                            <th className="px-6 py-3 font-medium">Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            <tr><td colSpan={5} className="p-12 text-center text-gray-400">Loading logs...</td></tr>
                        ) : !logs?.length ? (
                            <tr><td colSpan={5} className="p-12 text-center text-gray-400">No logs found.</td></tr>
                        ) : (
                            logs.map((log: any) => (
                                <tr key={log.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-mono text-xs text-gray-600">
                                        {(log.metadata as any)?.to || (log.metadata as any)?.email || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 flex items-center gap-2">
                                        {getChannelIcon(log.channel)}
                                        <span className="text-xs font-medium">{log.channel}</span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{log.type}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${log.status === "SENT" ? "bg-green-100 text-green-700" :
                                            log.status === "FAILED" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                                            }`}>
                                            {log.status}
                                        </span>
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
