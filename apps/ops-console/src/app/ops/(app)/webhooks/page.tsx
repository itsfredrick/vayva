"use client";

import React, { useState, useEffect } from "react";
import { Activity, RefreshCw, Filter, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { useOpsQuery } from "@/hooks/useOpsQuery";

export default function WebhookInspectorPage() {
    const [statusFilter, setStatusFilter] = useState("ALL");

    // Auto-refresh every 10 seconds for live monitoring
    const { data: logs, isLoading, refetch } = useOpsQuery(
        ["webhook-logs", statusFilter],
        () => fetch(`/api/ops/webhooks/logs?status=${statusFilter}`).then(res => res.json().then(j => j.data)),
        { refetchInterval: 10000 }
    );

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "SUCCESS": return <CheckCircle size={14} className="text-green-500" />;
            case "FAILED": return <AlertCircle size={14} className="text-red-500" />;
            case "PENDING": return <Clock size={14} className="text-yellow-500" />;
            default: return <Activity size={14} className="text-gray-400" />;
        }
    };

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Activity className="w-8 h-8 text-indigo-600" />
                        Global Webhook Inspector
                    </h1>
                    <p className="text-gray-500 mt-1">Real-time log of all system webhook delivery attempts.</p>
                </div>
                <div className="flex gap-2 items-center">
                    <span className="text-xs text-gray-400 font-mono animate-pulse">LIVE MONITORING</span>
                    <button onClick={() => refetch()} className="p-2 hover:bg-gray-100 rounded-full">
                        <RefreshCw className={`w-5 h-5 text-gray-500 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            <div className="flex gap-2">
                {["ALL", "FAILED", "SUCCESS", "PENDING"].map(s => (
                    <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${statusFilter === s ? "bg-indigo-100 text-indigo-700" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                    >
                        {s}
                    </button>
                ))}
            </div>

            <div className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-800 text-gray-300 font-mono text-xs">
                <div className="flex bg-gray-800 p-3 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-700">
                    <div className="w-24">Status</div>
                    <div className="w-40">Event</div>
                    <div className="w-32">Response</div>
                    <div className="flex-1">Endpoint / Store</div>
                    <div className="w-40 text-right">Time</div>
                </div>

                <div className="divide-y divide-gray-800 max-h-[600px] overflow-y-auto">
                    {isLoading && !logs ? (
                        <div className="p-12 text-center text-gray-600">Connecting to event stream...</div>
                    ) : logs?.length === 0 ? (
                        <div className="p-12 text-center text-gray-600">No events found in this window.</div>
                    ) : (
                        logs?.map((log: any) => (
                            <div key={log.id} className="flex p-3 hover:bg-gray-800/50 transition-colors items-center group">
                                <div className="w-24 flex items-center gap-2">
                                    {getStatusIcon(log.status)}
                                    <span className={log.status === "FAILED" ? "text-red-400" : log.status === "SUCCESS" ? "text-green-400" : "text-gray-400"}>
                                        {log.status}
                                    </span>
                                </div>
                                <div className="w-40 text-indigo-400 truncate" title={log.eventType}>{log.eventType}</div>
                                <div className="w-32 flex items-center gap-2">
                                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${log.responseCode >= 200 && log.responseCode < 300 ? "bg-green-900/30 text-green-400 border border-green-900" : "bg-red-900/30 text-red-400 border border-red-900"}`}>
                                        HTTP {log.responseCode || "---"}
                                    </span>
                                </div>
                                <div className="flex-1 truncate text-gray-500 group-hover:text-gray-300 transition-colors">
                                    {log.storeId}
                                </div>
                                <div className="w-40 text-right text-gray-600">
                                    {new Date(log.createdAt).toLocaleTimeString()}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
