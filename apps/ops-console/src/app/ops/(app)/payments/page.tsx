"use client";

import React, { useState } from "react";
import { useOpsQuery } from "@/hooks/useOpsQuery";
import {
    DollarSign,
    CheckCircle,
    XCircle,
    Clock,
    Search,
    RefreshCw,
    CreditCard,
    ArrowUpRight,
} from 'lucide-react';
import { Button } from "@vayva/ui";
import Link from "next/link";

interface Payment {
    id: string;
    orderId: string;
    orderNumber: string;
    amount: number;
    status: string;
    provider: string;
    reference: string;
    storeName: string;
    storeId: string;
    customerEmail: string;
    createdAt: string;
}

export default function PaymentsPage(): React.JSX.Element {
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");

    const { data, isLoading, refetch } = useOpsQuery<{ payments: Payment[]; stats: any }>(
        ["payments-list", statusFilter],
        () => fetch(`/api/ops/payments?status=${statusFilter}`).then(res => res.json())
    );

    const payments = data?.payments || [];
    const stats = data?.stats || { success: 0, pending: 0, failed: 0, total: 0 };

    const filteredPayments = searchQuery
        ? payments.filter((p: Payment) =>
            p.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.storeName.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : payments;

    const getStatusBadge = (status: string) => {
        const styles: Record<string, { bg: string; icon: React.ReactNode }> = {
            SUCCESS: { bg: "bg-green-100 text-green-700", icon: <CheckCircle size={12} /> },
            PENDING: { bg: "bg-yellow-100 text-yellow-700", icon: <Clock size={12} /> },
            FAILED: { bg: "bg-red-100 text-red-700", icon: <XCircle size={12} /> },
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
                        <CreditCard className="h-7 w-7 text-indigo-600" />
                        Payments
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Monitor all payment transactions</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => refetch()} className="rounded-full">
                    <RefreshCw className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`} />
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                <Button variant="ghost" onClick={() => setStatusFilter("all")} className={`p-4 rounded-xl border-2 text-left ${statusFilter === "all" ? "bg-gray-50 border-gray-300" : "bg-white border-gray-100"}`}>
                    <div className="text-2xl font-black text-gray-900">{stats.total}</div>
                    <div className="text-xs text-gray-500">Total (24h)</div>
                </Button>
                <Button variant="ghost" onClick={() => setStatusFilter("SUCCESS")} className={`p-4 rounded-xl border-2 text-left ${statusFilter === "SUCCESS" ? "bg-green-50 border-green-300" : "bg-white border-gray-100"}`}>
                    <div className="text-2xl font-black text-green-600">{stats.success}</div>
                    <div className="text-xs text-gray-500">Successful</div>
                </Button>
                <Button variant="ghost" onClick={() => setStatusFilter("PENDING")} className={`p-4 rounded-xl border-2 text-left ${statusFilter === "PENDING" ? "bg-yellow-50 border-yellow-300" : "bg-white border-gray-100"}`}>
                    <div className="text-2xl font-black text-yellow-600">{stats.pending}</div>
                    <div className="text-xs text-gray-500">Pending</div>
                </Button>
                <Button variant="ghost" onClick={() => setStatusFilter("FAILED")} className={`p-4 rounded-xl border-2 text-left ${statusFilter === "FAILED" ? "bg-red-50 border-red-300" : "bg-white border-gray-100"}`}>
                    <div className="text-2xl font-black text-red-600">{stats.failed}</div>
                    <div className="text-xs text-gray-500">Failed</div>
                </Button>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-xl border border-gray-200">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by reference, order number, or store..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
                        <tr>
                            <th className="px-6 py-3">Reference</th>
                            <th className="px-6 py-3">Store</th>
                            <th className="px-6 py-3">Amount</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Provider</th>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400">Loading...</td></tr>
                        ) : filteredPayments.length === 0 ? (
                            <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400">No payments found</td></tr>
                        ) : (
                            filteredPayments.map((payment: Payment) => (
                                <tr key={payment.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="font-mono text-xs">{payment.reference}</div>
                                        <div className="text-xs text-gray-500">Order: {payment.orderNumber}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link href={`/ops/merchants/${payment.storeId}`} className="text-indigo-600 hover:underline">
                                            {payment.storeName}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 font-bold">₦{payment.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4">{getStatusBadge(payment.status)}</td>
                                    <td className="px-6 py-4 text-gray-500">{payment.provider}</td>
                                    <td className="px-6 py-4 text-gray-500 text-xs">{new Date(payment.createdAt).toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <Link href={`/ops/orders/${payment.orderId}`} className="text-indigo-600 hover:underline text-xs flex items-center justify-end gap-1">
                                            View Order <ArrowUpRight size={12} />
                                        </Link>
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
