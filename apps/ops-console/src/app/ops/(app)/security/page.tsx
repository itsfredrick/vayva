
"use client";

import React, { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import {
    ShieldCheck,
    Search,
    AlertTriangle,
    User,
    Lock,
    RefreshCw,
    Terminal,
    Eye
} from "lucide-react";

interface AuditEvent {
    id: string;
    eventType: string;
    metadata: any;
    createdAt: string;
    OpsUser: {
        name: string;
        email: string;
        role: string;
    } | null;
}

export default function SecurityPage() {
    const [events, setEvents] = useState<AuditEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState("");

    useEffect(() => {
        fetchLogs();
    }, [filterType]);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const query = filterType ? `?type=${filterType}` : "";
            const res = await fetch(`/api/ops/security/logs${query}`);
            const json = await res.json();
            if (res.ok) {
                setEvents(json.data || []);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (type: string) => {
        if (type.includes("LOGIN")) return <Lock className="w-4 h-4 text-blue-500" />;
        if (type.includes("FAIL")) return <AlertTriangle className="w-4 h-4 text-red-500" />;
        if (type.includes("BATCH")) return <Terminal className="w-4 h-4 text-purple-500" />;
        return <ShieldCheck className="w-4 h-4 text-gray-500" />;
    };

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <ShieldCheck className="w-8 h-8 text-emerald-600" />
                        Security Operations
                    </h1>
                    <p className="text-gray-500 mt-1">Monitor platform access and sensitive actions.</p>
                </div>
                <button onClick={fetchLogs} className="p-2 hover:bg-gray-100 rounded-full">
                    <RefreshCw className={`w-5 h-5 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Stats Cards (Mocked for visual impact) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="text-sm text-gray-500 mb-1">Failed Logins (24h)</div>
                    <div className="text-2xl font-bold text-gray-900">0</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="text-sm text-gray-500 mb-1">Active Sessions</div>
                    <div className="text-2xl font-bold text-gray-900">1</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="text-sm text-gray-500 mb-1">Admin Actions (24h)</div>
                    <div className="text-2xl font-bold text-gray-900">{events.length}</div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex gap-2">
                {["", "OPS_LOGIN_SUCCESS", "OPS_LOGIN_FAILED", "OPS_BATCH_ACTION"].map(type => (
                    <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${filterType === type
                                ? "bg-gray-900 text-white border-gray-900"
                                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                            }`}
                    >
                        {type || "All Events"}
                    </button>
                ))}
            </div>

            {/* Logs Table */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-3">Event</th>
                            <th className="px-6 py-3">User</th>
                            <th className="px-6 py-3">Details</th>
                            <th className="px-6 py-3 text-right">Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan={4} className="p-12 text-center text-gray-400">Loading logs...</td></tr>
                        ) : events.length === 0 ? (
                            <tr><td colSpan={4} className="p-12 text-center text-gray-400">No security events found.</td></tr>
                        ) : (
                            events.map(e => (
                                <tr key={e.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gray-50 rounded-lg">
                                                {getIcon(e.eventType)}
                                            </div>
                                            <span className="font-mono text-xs font-bold text-gray-700">{e.eventType}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {e.OpsUser ? (
                                            <div>
                                                <div className="font-medium text-gray-900">{e.OpsUser.name}</div>
                                                <div className="text-xs text-gray-500">{e.OpsUser.role}</div>
                                            </div>
                                        ) : (
                                            <div className="text-gray-400 italic">System / Unknown</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <code className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                                            {JSON.stringify(e.metadata).slice(0, 60)}
                                            {JSON.stringify(e.metadata).length > 60 && "..."}
                                        </code>
                                    </td>
                                    <td className="px-6 py-4 text-right text-gray-500 text-xs">
                                        {formatDistanceToNow(new Date(e.createdAt), { addSuffix: true })}
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
