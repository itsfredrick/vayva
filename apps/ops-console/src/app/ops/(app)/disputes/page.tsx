
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
    Activity,
    AlertTriangle,
    CheckCircle2,
    Clock,
    DollarSign,
    Filter,
    RefreshCw,
    Search,
    ShieldAlert,
    XCircle,
    Gavel
} from "lucide-react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

interface Dispute {
    id: string;
    amount: number;
    currency: string;
    status: string;
    reasonCode: string | null;
    store: { name: string; slug: string };
    order: { orderNumber: string } | null;
    createdAt: string;
    evidenceDueAt: string | null;
}

export default function DisputesPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Filters
    const status = searchParams.get("status") || "OPENED";

    const [data, setData] = useState<Dispute[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        fetchDisputes();
    }, [status]);

    const fetchDisputes = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/ops/financials/disputes?status=${status}`);
            const json = await res.json();
            if (res.ok) {
                setData(json.data || []);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id: string, action: string) => {
        if (!confirm(`Are you sure you want to ${action.replace(/_/g, " ")}?`)) return;

        setActionLoading(id);
        try {
            const res = await fetch("/api/ops/financials/disputes", {
                method: "PATCH",
                body: JSON.stringify({ disputeId: id, action })
            });

            if (!res.ok) throw new Error("Action failed");

            toast.success("Dispute Updated");
            fetchDisputes();
        } catch (e) {
            toast.error("Failed to update dispute");
        } finally {
            setActionLoading(null);
        }
    };

    const getStatusBadge = (s: string) => {
        switch (s) {
            case "OPENED": return <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Action Required</span>;
            case "UNDER_REVIEW": return <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1"><Clock className="w-3 h-3" /> Reviewing</span>;
            case "WON": return <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Won</span>;
            case "LOST": return <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1"><XCircle className="w-3 h-3" /> Lost</span>;
            default: return <span className="bg-gray-50 text-gray-500 px-2 py-0.5 rounded text-xs font-bold">{s}</span>;
        }
    };

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Gavel className="w-8 h-8 text-indigo-600" />
                        Disputes & Chargebacks
                    </h1>
                    <p className="text-gray-500 mt-1">Manage financial disputes and evidence submission.</p>
                </div>
                <button onClick={fetchDisputes} className="p-2 hover:bg-gray-100 rounded-full">
                    <RefreshCw className={`w-5 h-5 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 border-b border-gray-200">
                {["OPENED", "UNDER_REVIEW", "WON", "LOST"].map(s => (
                    <button
                        key={s}
                        onClick={() => router.push(`?status=${s}`)}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${status === s ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        {s.replace("_", " ")}
                    </button>
                ))}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 font-medium">
                        <tr>
                            <th className="px-6 py-4">Dispute / Date</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Reason</th>
                            <th className="px-6 py-4">Merchant</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan={6} className="p-12 text-center text-gray-400">Loading disputes...</td></tr>
                        ) : data.length === 0 ? (
                            <tr><td colSpan={6} className="p-12 text-center text-gray-400">No disputes found in this category.</td></tr>
                        ) : (
                            data.map(d => (
                                <tr key={d.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="font-mono text-xs text-gray-500">{d.id.slice(0, 8)}...</div>
                                        <div className="text-xs text-gray-400 mt-1">{new Date(d.createdAt).toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-900">
                                        {d.currency} {d.amount}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {d.reasonCode || "General"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{d.store?.name}</div>
                                        <div className="text-xs text-indigo-600">{d.order?.orderNumber}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(d.status)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {d.status === "OPENED" && (
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleAction(d.id, "ACCEPT_LIABILITY")}
                                                    disabled={!!actionLoading}
                                                    className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded border border-red-200"
                                                >
                                                    Accept Liability
                                                </button>
                                                <button
                                                    onClick={() => handleAction(d.id, "SUBMIT_EVIDENCE_MOCK")}
                                                    disabled={!!actionLoading}
                                                    className="px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded shadow-sm"
                                                >
                                                    Submit Evidence
                                                </button>
                                            </div>
                                        )}
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
