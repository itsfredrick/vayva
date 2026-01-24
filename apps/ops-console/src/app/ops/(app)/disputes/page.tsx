
"use client";

import React, { useState, useEffect } from "react";
import _Link from "next/link";
import { Activity,
    AlertTriangle,
    CheckCircle2,
    Clock, DollarSign, Filter,
    RefreshCw,
    Search, ShieldAlert,
    XCircle,
    Gavel
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@vayva/ui";

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

export default function DisputesPage(): React.JSX.Element {
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
        const q = searchParams.get("q") || "";
        try {
            const res = await fetch(`/api/ops/financials/disputes?status=${status}${q ? `&q=${q}` : ""}`);
            const json = await res.json();
            if (res.ok) {
                setData(json.data || []);
            }
        } catch (e: any) {
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
        } catch {
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
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            placeholder="Search disputes..."
                            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64"
                            defaultValue={searchParams.get("q") || ""}
                            onChange={(e: any) => {
                                const q = (e as any).target.value;
                                const params = new URLSearchParams(window.location.search);
                                if (q) params.set("q", q); else params.delete("q");
                                router.push(`?${params.toString()}`);
                            }}
                        />
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={fetchDisputes}
                        className="rounded-full h-10 w-10 flex items-center justify-center"
                        aria-label="Refresh disputes list"
                    >
                        <RefreshCw className={`w-5 h-5 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 border-b border-gray-200">
                {["OPENED", "UNDER_REVIEW", "WON", "LOST"].map(s => (
                    <Button
                        key={s}
                        variant="ghost"
                        onClick={() => router.push(`?status=${s}`)}
                        className={`px-4 py-2 text-sm font-medium border-b-2 rounded-none transition-colors h-auto ${status === s ? "border-indigo-600 text-indigo-600 bg-transparent hover:bg-transparent" : "border-transparent text-gray-500 hover:text-gray-700 bg-transparent hover:bg-transparent"
                            }`}
                        aria-label={`Filter by ${(s as any).replace("_", " ")} status`}
                    >
                        {(s as any).replace("_", " ")}
                    </Button>
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
                                        {(d.status === "OPENED" || d.status === "UNDER_REVIEW") && (
                                            <div className="flex justify-end gap-2 flex-wrap">
                                                {d.status === "OPENED" && (
                                                    <>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => handleAction(d.id, "ACCEPT_LIABILITY")}
                                                            disabled={!!actionLoading}
                                                            className="h-8 px-3 text-xs font-bold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 shadow-none h-auto"
                                                            aria-label={`Accept liability for dispute ${d.id}`}
                                                        >
                                                            Accept Liability
                                                        </Button>
                                                        <Button
                                                            variant="primary"
                                                            size="sm"
                                                            onClick={() => handleAction(d.id, "SUBMIT_EVIDENCE_MOCK")}
                                                            disabled={!!actionLoading}
                                                            className="h-8 px-3 text-xs font-bold whitespace-nowrap h-auto"
                                                            aria-label={`Submit evidence for dispute ${d.id}`}
                                                        >
                                                            Submit Evidence
                                                        </Button>
                                                    </>
                                                )}
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => handleAction(d.id, "REFUND")}
                                                    disabled={!!actionLoading}
                                                    className="h-8 px-3 text-xs font-bold bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-100 h-auto"
                                                    aria-label={`Refund dispute ${d.id}`}
                                                >
                                                    Refund
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => handleAction(d.id, "MARK_WON")}
                                                    disabled={!!actionLoading}
                                                    className="h-8 px-3 text-xs font-bold bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 h-auto"
                                                    aria-label={`Force win dispute ${d.id}`}
                                                >
                                                    Force Win
                                                </Button>
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
