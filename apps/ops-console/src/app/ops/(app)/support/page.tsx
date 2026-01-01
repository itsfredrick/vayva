"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LifeBuoy, Search, Filter, MessageSquare, Clock, CheckCircle } from "lucide-react";
import { useOpsQuery } from "@/hooks/useOpsQuery";
import { toast } from "sonner";

export default function SupportPage() {
    const router = useRouter();
    const [filter, setFilter] = useState("OPEN");

    const { data: tickets, isLoading } = useOpsQuery(
        ["support-tickets", filter],
        () => fetch(`/api/ops/support?status=${filter}`).then(res => res.json().then(j => j.data))
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "OPEN": return <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-700">Open</span>;
            case "RESOLVED": return <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-700">Resolved</span>;
            case "CLOSED": return <span className="px-2 py-0.5 rounded text-xs font-bold bg-gray-100 text-gray-600">Closed</span>;
            default: return <span className="px-2 py-0.5 rounded text-xs font-bold bg-gray-100 text-gray-600">{status}</span>;
        }
    };

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <LifeBuoy className="w-8 h-8 text-indigo-600" />
                        Support Knowledge Hub
                    </h1>
                    <p className="text-gray-500 mt-1">Manage inbound merchant requests and tickets.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                        Create Ticket
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 border-b border-gray-200 pb-1">
                {["OPEN", "RESOLVED", "ALL"].map(s => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-1.5 ${filter === s ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                    >
                        {s} Tickets
                    </button>
                ))}
            </div>

            {/* Ticket List */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-3 font-medium">Ticket ID</th>
                            <th className="px-6 py-3 font-medium">Subject</th>
                            <th className="px-6 py-3 font-medium">Merchant</th>
                            <th className="px-6 py-3 font-medium">Status</th>
                            <th className="px-6 py-3 font-medium">Created</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            <tr><td colSpan={5} className="p-12 text-center text-gray-400">Loading tickets...</td></tr>
                        ) : !tickets?.length ? (
                            <tr><td colSpan={5} className="p-12 text-center text-gray-400">No tickets found.</td></tr>
                        ) : (
                            tickets.map((t: any) => (
                                <tr
                                    key={t.id}
                                    onClick={() => router.push(`/ops/support/${t.id}`)}
                                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                                >
                                    <td className="px-6 py-4 font-mono text-xs text-gray-500">#{t.id.slice(0, 8)}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{t.summary}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {t.store?.logoUrl ? (
                                                <img src={t.store.logoUrl} className="w-5 h-5 rounded-full bg-gray-100" />
                                            ) : (
                                                <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-[10px] flex items-center justify-center font-bold">
                                                    {t.store?.name?.[0] || "?"}
                                                </div>
                                            )}
                                            <span className="text-gray-700">{t.store?.name || "Unknown"}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{getStatusBadge(t.status)}</td>
                                    <td className="px-6 py-4 text-gray-500">{new Date(t.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
