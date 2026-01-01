"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Search,
    Filter,
    RefreshCw,
    ShoppingBag,
    CreditCard,
    Truck,
    CheckCircle2,
    XCircle,
    Clock,
    AlertCircle,
} from "lucide-react";

interface Order {
    id: string;
    orderNumber: string;
    status: string;
    paymentStatus: string;
    fulfillmentStatus: string;
    total: number;
    currency: string;
    customerEmail: string | null;
    createdAt: string;
    storeName: string;
    storeId: string;
}

interface Meta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export default function OrdersPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("q") || "";
    const status = searchParams.get("status") || "";
    const paymentStatus = searchParams.get("paymentStatus") || "";

    const [searchInput, setSearchInput] = useState(search);
    const [data, setData] = useState<Order[]>([]);
    const [meta, setMeta] = useState<Meta | null>(null);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, [page, search, status, paymentStatus]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams({
                page: page.toString(),
                limit: "20",
                ...(search && { q: search }),
                ...(status && { status }),
                ...(paymentStatus && { paymentStatus }),
            });

            const res = await fetch(`/api/ops/orders?${query}`);
            if (res.status === 401) {
                window.location.href = "/ops/login";
                return;
            }
            if (!res.ok) throw new Error("Failed to fetch orders");

            const result = await res.json();
            setData(result.data || []);
            setMeta(result.meta || null);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
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

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", newPage.toString());
        router.push(`?${params.toString()}`);
    };

    // Status Badge Helper
    const getStatusBadge = (status: string, type: 'status' | 'payment' | 'fulfillment') => {
        const statusLower = status.toLowerCase();

        let colorClass = "bg-gray-100 text-gray-700";
        let Icon = Clock;

        if (["paid", "completed", "fulfilled", "delivered"].includes(statusLower)) {
            colorClass = "bg-green-100 text-green-700";
            Icon = CheckCircle2;
        } else if (["failed", "cancelled", "rejected", "refunded"].includes(statusLower)) {
            colorClass = "bg-red-100 text-red-700";
            Icon = XCircle;
        } else if (["processing", "initiated", "pending"].includes(statusLower)) {
            colorClass = "bg-blue-100 text-blue-700";
            Icon = RefreshCw; // Or Clock
        } else if (["partially_fulfilled", "partially_paid"].includes(statusLower)) {
            colorClass = "bg-yellow-100 text-yellow-700";
            Icon = AlertCircle;
        }

        return (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${colorClass}`}>
                <Icon className="h-3 w-3" /> {status}
            </span>
        );
    };

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
                    <p className="text-gray-500 mt-1">Manage platform-wide orders</p>
                </div>
                <div className="text-sm text-gray-500">
                    {meta && `${meta.total} total orders`}
                </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-4">
                <div className="flex items-center gap-4">
                    <form onSubmit={handleSearch} className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search order #, customer email..."
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </form>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors flex items-center gap-2 ${showFilters || status || paymentStatus
                            ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                            : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                            }`}
                    >
                        <Filter className="h-4 w-4" />
                        Filters
                        {(status || paymentStatus) && (
                            <span className="bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {[status, paymentStatus].filter(Boolean).length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={fetchOrders}
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
                            <label className="block text-xs font-medium text-gray-700 mb-2">Order Status</label>
                            <select
                                value={status}
                                onChange={(e) => handleFilterChange("status", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">All Statuses</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="PROCESSING">Processing</option>
                                <option value="CANCELLED">Cancelled</option>
                                <option value="DRAFT">Draft</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-2">Payment Status</label>
                            <select
                                value={paymentStatus}
                                onChange={(e) => handleFilterChange("paymentStatus", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">All Payments</option>
                                <option value="PAID">Paid</option>
                                <option value="PENDING">Pending</option>
                                <option value="FAILED">Failed</option>
                                <option value="REFUNDED">Refunded</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
                            <tr>
                                <th className="px-6 py-3">Order</th>
                                <th className="px-6 py-3">Customer</th>
                                <th className="px-6 py-3">Store</th>
                                <th className="px-6 py-3">Total</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Payment</th>
                                <th className="px-6 py-3">Fulfillment</th>
                                <th className="px-6 py-3">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center">
                                        <div className="flex items-center justify-center gap-2 text-gray-400">
                                            <div className="h-4 w-4 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
                                            Loading orders...
                                        </div>
                                    </td>
                                </tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                                        No orders found
                                    </td>
                                </tr>
                            ) : (
                                data.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 group transition-colors">
                                        <td className="px-6 py-4 font-mono font-medium text-indigo-600">
                                            <Link href={`/ops/orders/${order.id}`} className="hover:underline">
                                                #{order.orderNumber}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {order.customerEmail || "Guest"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link href={`/ops/merchants/${order.storeId}`} className="hover:text-indigo-600">
                                                {order.storeName}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 font-medium">
                                            {order.currency} {Number(order.total).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">{getStatusBadge(order.status, 'status')}</td>
                                        <td className="px-6 py-4">{getStatusBadge(order.paymentStatus, 'payment')}</td>
                                        <td className="px-6 py-4">{getStatusBadge(order.fulfillmentStatus, 'fulfillment')}</td>
                                        <td className="px-6 py-4 text-gray-500 text-xs">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination UI - Same as Webhooks */}
                {meta && (
                    <div className="bg-gray-50 border-t border-gray-200 px-6 py-3 flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                            Showing <span className="font-medium">{(meta.page - 1) * meta.limit + 1}</span> to{" "}
                            <span className="font-medium">{Math.min(meta.page * meta.limit, meta.total)}</span> of{" "}
                            <span className="font-medium">{meta.total}</span> results
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handlePageChange(meta.page - 1)}
                                disabled={meta.page <= 1}
                                className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-600 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => handlePageChange(meta.page + 1)}
                                disabled={meta.page >= meta.totalPages}
                                className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-600 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
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
