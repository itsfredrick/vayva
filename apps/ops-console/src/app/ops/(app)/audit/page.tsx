"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Search,
    Filter,
    RefreshCw,
    ShieldAlert,
    User,
    Activity,
    Calendar,
    Eye,
    X,
    Copy,
    Check
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface AuditEvent {
    id: string;
    eventType: string;
    metadata: any;
    createdAt: string;
    actor: {
        name: string;
        email: string;
        role: string;
    };
}

interface Meta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export default function AuditLogsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const page = parseInt(searchParams.get("page") || "1");
    const eventType = searchParams.get("eventType") || "";
    const actor = searchParams.get("actor") || "";

    const [searchInput, setSearchInput] = useState(actor);
    const [data, setData] = useState<AuditEvent[]>([]);
    const [meta, setMeta] = useState<Meta | null>(null);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);

    useEffect(() => {
        fetchLogs();
    }, [page, eventType, actor]);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams({
                page: page.toString(),
                limit: "20",
                ...(eventType && { eventType }),
                ...(actor && { actor }),
            });

            const res = await fetch(`/api/ops/audit?${query}`);
            if (res.status === 401) {
                window.location.href = "/ops/login";
                return;
            }
            if (!res.ok) throw new Error("Failed to fetch logs");

            const result = await res.json();
            setData(result.data || []);
            setMeta(result.meta || null);
        } catch (error) {
            console.error("Failed to fetch logs:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams);
        if (searchInput) {
            params.set("actor", searchInput);
        } else {
            params.delete("actor");
        }
        params.set("page", "1");
        router.push(`?${params.toString()}`);
    };

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.set("page", "1");
        router.push(`?${params.toString()}`);
    };

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", newPage.toString());
        router.push(`?${params.toString()}`);
    };

    // Helper to extract target info from metadata
    const getTargetInfo = (metadata: any) => {
        if (!metadata) return "—";

        // Common patterns
        if (metadata.targetType && metadata.storeName) {
            return `${metadata.targetType}: ${metadata.storeName}`;
        }
        if (metadata.targetType && metadata.targetId) {
            return `${metadata.targetType}: ${metadata.targetId.substring(0, 8)}...`;
        }
        if (metadata.fileName) return `File: ${metadata.fileName}`;
        if (metadata.reportType) return `Report: ${metadata.reportType}`;

        return "—";
    };

    return (
        <div className="p-8 space-y-6 relative">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Audit Log</h1>
                    <p className="text-gray-500 mt-1">System-wide governance trail</p>
                </div>
                <div className="text-sm text-gray-500">
                    {meta && `${meta.total} events logged`}
                </div>
            </div>

            {/* Search & Filter */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-4">
                <div className="flex items-center gap-4">
                    <form onSubmit={handleSearch} className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by actor name or email..."
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </form>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors flex items-center gap-2 ${showFilters || eventType
                                ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                            }`}
                    >
                        <Filter className="h-4 w-4" />
                        Filters
                        {eventType && (
                            <span className="bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                1
                            </span>
                        )}
                    </button>
                    <button
                        onClick={fetchLogs}
                        className="px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Refresh
                    </button>
                </div>

                {showFilters && (
                    <div className="pt-4 border-t border-gray-200">
                        <label className="block text-xs font-medium text-gray-700 mb-2">Event Type</label>
                        <select
                            value={eventType}
                            onChange={(e) => handleFilterChange("eventType", e.target.value)}
                            className="w-full max-w-xs px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">All Events</option>
                            <option value="LOGIN">Login</option>
                            <option value="DISABLE_PAYOUTS">Disable Payouts</option>
                            <option value="ENABLE_PAYOUTS">Enable Payouts</option>
                            <option value="FORCE_KYC_REVIEW">Force KYC Review</option>
                            <option value="SUSPEND_ACCOUNT">Suspend Account</option>
                            <option value="WEBHOOK_REPLAY">Webhook Replay</option>
                            <option value="TICKET_UPDATE">Ticket Update</option>
                            <option value="DATA_EXPORT">Data Export</option>
                        </select>
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
                        <tr>
                            <th className="px-6 py-3">Timestamp</th>
                            <th className="px-6 py-3">Actor</th>
                            <th className="px-6 py-3">Action</th>
                            <th className="px-6 py-3">Target / Context</th>
                            <th className="px-6 py-3 text-right">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center">
                                    <div className="flex items-center justify-center gap-2 text-gray-400">
                                        <div className="h-4 w-4 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
                                        Loading audit trail...
                                    </div>
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                    No audit events found
                                </td>
                            </tr>
                        ) : (
                            data.map((event) => (
                                <tr key={event.id} className="hover:bg-gray-50 group transition-colors">
                                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} />
                                            {new Date(event.createdAt).toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                                                {event.actor.name[0]}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{event.actor.name}</div>
                                                <div className="text-xs text-gray-500">{event.actor.role}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                                            <Activity size={12} />
                                            {event.eventType}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {getTargetInfo(event.metadata)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => setSelectedEvent(event)}
                                            className="text-gray-400 hover:text-indigo-600 transition-colors"
                                        >
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Pagination - Shared */}
                {meta && (
                    <div className="bg-gray-50 border-t border-gray-200 px-6 py-3 flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                            Page {meta.page} of {meta.totalPages}
                        </div>
                        <div className="flex gap-2">
                            <button
                                disabled={meta.page <= 1}
                                onClick={() => handlePageChange(meta.page - 1)}
                                className="px-3 py-1 bg-white border rounded text-xs disabled:opacity-50"
                            >
                                Prev
                            </button>
                            <button
                                disabled={meta.page >= meta.totalPages}
                                onClick={() => handlePageChange(meta.page + 1)}
                                className="px-3 py-1 bg-white border rounded text-xs disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* JSON Inspector Modal */}
            {selectedEvent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    Event Details
                                    <span className="text-sm font-normal text-gray-500 font-mono">
                                        {selectedEvent.id}
                                    </span>
                                </h3>
                                <div className="text-xs text-gray-500 mt-1">
                                    {new Date(selectedEvent.createdAt).toLocaleString()} • {selectedEvent.eventType}
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedEvent(null)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-auto p-0">
                            <div className="bg-gray-900 p-6 min-h-full">
                                <pre className="text-sm font-mono text-green-400 whitespace-pre-wrap">
                                    {JSON.stringify(
                                        {
                                            ...selectedEvent,
                                            metadata: selectedEvent.metadata // Ensure consistent order if needed
                                        },
                                        null,
                                        2
                                    )}
                                </pre>
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
                            <button
                                onClick={() => setSelectedEvent(null)}
                                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
