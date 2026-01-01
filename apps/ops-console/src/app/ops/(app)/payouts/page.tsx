"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Landmark, ArrowUpRight, CheckCircle, Clock, AlertTriangle, RefreshCw, XCircle } from "lucide-react";
import { useOpsQuery } from "@/hooks/useOpsQuery";
import { toast } from "sonner";

export default function PayoutsPage() {
    const router = useRouter();
    const [filter, setFilter] = useState("PENDING");

    const { data: withdrawals, isLoading, refetch } = useOpsQuery(
        ["payouts-list", filter],
        () => fetch(`/api/ops/financials/payouts?status=${filter}`).then(res => res.json().then(j => j.data))
    );

    const formatCurrency = (kobo: string) => {
        const amount = parseInt(kobo) / 100;
        return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "PENDING": return <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>;
            case "PROCESSED": return <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Processed</span>;
            case "FAILED": return <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1"><XCircle className="w-3 h-3" /> Failed</span>;
            default: return <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-bold">{status}</span>;
        }
    };

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <ArrowUpRight className="w-8 h-8 text-indigo-600" />
                        Payouts Operation Center
                    </h1>
                    <p className="text-gray-500 mt-1">Audit and process merchant withdrawal requests.</p>
                </div>
                <button onClick={() => refetch()} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                    <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-4 border-b border-gray-200 pb-1">
                {["PENDING", "PROCESSED", "FAILED", "ALL"].map(s => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-1.5 ${filter === s ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                    >
                        {s}
                    </button>
                ))}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-medium">Reference</th>
                            <th className="px-6 py-4 font-medium">Merchant</th>
                            <th className="px-6 py-4 font-medium">Amount (Net)</th>
                            <th className="px-6 py-4 font-medium">Fee</th>
                            <th className="px-6 py-4 font-medium">Bank Details</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            <tr><td colSpan={7} className="p-12 text-center text-gray-400">Loading payouts...</td></tr>
                        ) : !withdrawals?.length ? (
                            <tr><td colSpan={7} className="p-12 text-center text-gray-400">No withdrawal requests found.</td></tr>
                        ) : (
                            withdrawals.map((w: any) => (
                                <tr key={w.id} className="hover:bg-gray-50 group">
                                    <td className="px-6 py-4 font-mono text-xs text-gray-500">{w.referenceCode}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        <div className="flex flex-col">
                                            <span>{w.store?.name || "Unknown"}</span>
                                            <span className="text-[10px] text-gray-400">{w.store?.slug}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-900">{formatCurrency(w.amountNetKobo)}</td>
                                    <td className="px-6 py-4 text-gray-500 text-xs">
                                        {formatCurrency(w.feeKobo)}
                                        <span className="block text-[10px] text-gray-400">({w.feePercent}%)</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Landmark size={14} />
                                            <span className="text-xs">
                                                {w.bankAccountId ? "Saved Bank Acct" : "N/A"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{getStatusBadge(w.status)}</td>
                                    <td className="px-6 py-4 text-gray-500 text-xs">{new Date(w.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
