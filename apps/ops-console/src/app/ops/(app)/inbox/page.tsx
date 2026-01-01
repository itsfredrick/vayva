"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Search,
    Filter,
    RefreshCw,
    MessageSquare,
    Clock,
    CheckCircle2,
    AlertCircle,
    MoreHorizontal,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface SupportTicket {
    id: string;
    subject: string;
    status: string;
    priority: string;
    category: string;
    storeName: string;
    storeId: string;
    messageCount: number;
    lastMessageAt: string;
    createdAt: string;
}

interface Meta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export default function SupportInboxPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("q") || "";
    const status = searchParams.get("status") || "open";
    const priority = searchParams.get("priority") || "";

    const [searchInput, setSearchInput] = useState(search);
    const [data, setData] = useState<SupportTicket[]>([]);
    const [meta, setMeta] = useState<Meta | null>(null);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchTickets();
    }, [page, search, status, priority]);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams({
                page: page.toString(),
                limit: "20",
                status: status,
                ...(search && { q: search }),
                ...(priority && { priority }),
            });

            const res = await fetch(`/api/ops/support?${query}`);
            if (res.status === 401) {
                window.location.href = "/ops/login";
                return;
            }
            if (!res.ok) throw new Error("Failed to fetch tickets");

            const result = await res.json();
            setData(result.data || []);
            setMeta(result.meta || null);
        } catch (error) {
            console.error("Failed to fetch tickets:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams);
        if (searchInput) {
            params.set("q", searchInput);
        } else {
            params.delete("q");
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

    const getPriorityBadge = (priority: string) => {
        switch (priority.toLowerCase()) {
            case "high":
            case "urgent":
                return <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded">High</span>;
            case "medium":
                return <span className="text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded">Medium</span>;
            default:
                return <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded">Low</span>;
        }
    };

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Support Inbox</h1>
                    <p className="text-gray-500 mt-1">Manage merchant support requests</p>
                </div>
                <div className="text-sm text-gray-500">
                    {meta && `${meta.total} tickets`}
                </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-4">
                <div className="flex items-center gap-4">
                    <form onSubmit={handleSearch} className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search subject, ticket ID, or merchant..."
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </form>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors flex items-center gap-2 ${showFilters || (status !== "open") || priority
                                ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                            }`}
                    >
                        <Filter className="h-4 w-4" />
                        Filters
                        {((status !== "open") || priority) && (
                            <span className="bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {Number(status !== "open") + Number(!!priority)}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={fetchTickets}
                        className="px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Refresh
                    </button>
                </div>

                {/* Filter Options */}
                {showFilters && (
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-2">Status</label>
                            <select
                                value={status}
                                onChange={(e) => handleFilterChange("status", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="open">Open</option>
                                <option value="closed">Closed</option>
                                <option value="all">All Tickets</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-2">Priority</label>
                            <select
                                value={priority}
                                onChange={(e) => handleFilterChange("priority", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">All Priorities</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* Ticket List */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-400 flex flex-col items-center gap-3">
                        <div className="h-6 w-6 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
                        Loading tickets...
                    </div>
                ) : data.length === 0 ? (
                    <div className="p-16 text-center text-gray-500">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-medium text-gray-900">No tickets found</h3>
                        <p className="mt-1 text-sm">Or great job clearing the inbox! 🎉</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {data.map((ticket) => (
                            <Link
                                href={`/ops/inbox/${ticket.id}`}
                                key={ticket.id}
                                className="block p-4 hover:bg-gray-50 transition-colors group"
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-indigo-600 text-sm">
                                            {ticket.storeName}
                                        </span>
                                        <span className="text-gray-300">•</span>
                                        <span className="text-sm text-gray-500">{ticket.category}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <Clock size={14} />
                                        {formatDistanceToNow(new Date(ticket.lastMessageAt), { addSuffix: true })}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <h3 className={`text-base font-semibold group-hover:text-indigo-600 transition-colors ${ticket.status === 'open' ? 'text-gray-900' : 'text-gray-500'}`}>
                                        {ticket.subject}
                                    </h3>
                                    <div className="flex items-center gap-3">
                                        {getPriorityBadge(ticket.priority)}
                                        {ticket.status === 'open' ? (
                                            <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                                <AlertCircle size={12} /> Open
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                                                <CheckCircle2 size={12} /> Closed
                                            </span>
                                        )}
                                        <span className="text-xs text-gray-400 flex items-center gap-1">
                                            <MessageSquare size={12} /> {ticket.messageCount}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Pagination - Reuse or simplify */}
                {meta && meta.totalPages > 1 && (
                    <div className="bg-gray-50 border-t border-gray-200 px-6 py-3 flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                            Page {meta.page} of {meta.totalPages}
                        </div>
                        <div className="flex gap-2">
                            <button
                                disabled={meta.page <= 1}
                                onClick={() => router.push(`?page=${meta.page - 1}`)}
                                className="px-3 py-1 bg-white border rounded text-xs disabled:opacity-50"
                            >
                                Prev
                            </button>
                            <button
                                disabled={meta.page >= meta.totalPages}
                                onClick={() => router.push(`?page=${meta.page + 1}`)}
                                className="px-3 py-1 bg-white border rounded text-xs disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
