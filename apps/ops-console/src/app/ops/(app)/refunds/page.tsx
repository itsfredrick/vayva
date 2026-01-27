"use client";

import React, { useState } from "react";
import { useOpsQuery } from "@/hooks/useOpsQuery";
import { DollarSign, CheckCircle, XCircle, Clock, Search, RefreshCw, ArrowUpRight } from 'lucide-react';
import { Button } from "@vayva/ui";
import { toast } from 'sonner';
import Link from "next/link";

interface RefundRequest {
    id: string;
    orderId: string;
    orderNumber: string;
    amount: number;
    status: string;
    reason: string;
    storeName: string;
    storeId: string;
    customerEmail: string;
    createdAt: string;
}

export default function RefundsPage(): React.JSX.Element {
    const [statusFilter, setStatusFilter] = useState<string>("PENDING");

    const { data, isLoading, refetch } = useOpsQuery<{ refunds: RefundRequest[]; stats: any }>(
        ["refunds-list", statusFilter],
        () => fetch(`/api/ops/refunds?status=${statusFilter}`).then(res => res.json())
    );

    const refunds = data?.refunds || [];
    const stats = data?.stats || { pending: 0, approved: 0, rejected: 0 };

    const handleAction = async (id: string, action: "approve" | "reject") => {
        try {
            const res = await fetch(`/api/ops/refunds/${id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action }),
            });
            if (!res.ok) throw new Error("Action failed");
            toast.success(`Refund ${action}d successfully`);
            refetch();
        } catch {
            toast.error("Failed to process refund");
        }
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, { bg: string; icon: React.ReactNode }> = {
            PENDING: { bg: "bg-yellow-100 text-yellow-700", icon: <Clock size={12} /> },
            APPROVED: { bg: "bg-green-100 text-green-700", icon: <CheckCircle size={12} /> },
            REJECTED: { bg: "bg-red-100 text-red-700", icon: <XCircle size={12} /> },
        };
        const style = styles[status] || styles.PENDING;
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${style.bg}`}>
                {style.icon} {status}
            </span>
        );
    };

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <DollarSign className="h-7 w-7 text-indigo-600" />
                        Refund Requests
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Review and process refund requests</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => refetch()} className="rounded-full">
                    <RefreshCw className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`} />
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <Button variant="ghost" onClick={() => setStatusFilter("PENDING")} className={`p-4 rounded-xl border-2 text-left ${statusFilter === "PENDING" ? "bg-yellow-50 border-yellow-300" : "bg-white border-gray-100"}`}>
                    <div className="text-2xl font-black text-yellow-600">{stats.pending}</div>
                    <div className="text-xs text-gray-500">Pending Review</div>
                </Button>
                <Button variant="ghost" onClick={() => setStatusFilter("APPROVED")} className={`p-4 rounded-xl border-2 text-left ${statusFilter === "APPROVED" ? "bg-green-50 border-green-300" : "bg-white border-gray-100"}`}>
                    <div className="text-2xl font-black text-green-600">{stats.approved}</div>
                    <div className="text-xs text-gray-500">Approved</div>
                </Button>
                <Button variant="ghost" onClick={() => setStatusFilter("REJECTED")} className={`p-4 rounded-xl border-2 text-left ${statusFilter === "REJECTED" ? "bg-red-50 border-red-300" : "bg-white border-gray-100"}`}>
                    <div className="text-2xl font-black text-red-600">{stats.rejected}</div>
                    <div className="text-xs text-gray-500">Rejected</div>
                </Button>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
                        <tr>
                            <th className="px-6 py-3">Order</th>
                            <th className="px-6 py-3">Store</th>
                            <th className="px-6 py-3">Amount</th>
                            <th className="px-6 py-3">Reason</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400">Loading...</td></tr>
                        ) : refunds.length === 0 ? (
                            <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400">No refund requests found</td></tr>
                        ) : (
                            refunds.map((refund: RefundRequest) => (
                                <tr key={refund.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="font-medium">{refund.orderNumber}</div>
                                        <div className="text-xs text-gray-500">{refund.customerEmail}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link href={`/ops/merchants/${refund.storeId}`} className="text-indigo-600 hover:underline">
                                            {refund.storeName}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-red-600">₦{refund.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{refund.reason}</td>
                                    <td className="px-6 py-4">{getStatusBadge(refund.status)}</td>
                                    <td className="px-6 py-4 text-gray-500 text-xs">{new Date(refund.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        {refund.status === "PENDING" && (
                                            <div className="flex items-center justify-end gap-2">
                                                <Button size="sm" onClick={() => handleAction(refund.id, "approve")} className="bg-green-600 hover:bg-green-700 text-white text-xs h-8">
                                                    Approve
                                                </Button>
                                                <Button size="sm" variant="destructive" onClick={() => handleAction(refund.id, "reject")} className="text-xs h-8">
                                                    Reject
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
