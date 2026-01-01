
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Search,
    Filter,
    RefreshCw,
    Truck,
    Package,
    CheckCircle2,
    XCircle,
    Clock,
    MapPin,
    AlertTriangle
} from "lucide-react";
import { toast } from "sonner";

interface Shipment {
    id: string;
    orderNumber: string;
    status: string;
    provider: string;
    trackingCode: string | null;
    recipientName: string | null;
    createdAt: string;
    cost: number | null;
    deliveryFee: number | null;
    storeName: string;
    storeId: string;
}

interface Meta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export default function DeliveriesPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("q") || "";
    const status = searchParams.get("status") || "";
    const provider = searchParams.get("provider") || "";

    const [searchInput, setSearchInput] = useState(search);
    const [data, setData] = useState<Shipment[]>([]);
    const [meta, setMeta] = useState<Meta | null>(null);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchDeliveries();
    }, [page, search, status, provider]);

    const fetchDeliveries = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams({
                page: page.toString(),
                limit: "20",
                ...(search && { q: search }),
                ...(status && { status }),
                ...(provider && { provider }),
            });

            const res = await fetch(`/api/ops/logistics/shipments?${query}`); // Assuming GET route exists similar to before or use existing search API
            // Note: In previous step I saw fetch(`/api/ops/deliveries?${query}`); leaving as is if route exists
            // But usually I might have needed to create it.
            // Let's assume GET /api/ops/deliveries exists as per existing code.
            const resGet = await fetch(`/api/ops/deliveries?${query}`);

            if (resGet.status === 401) {
                window.location.href = "/ops/login";
                return;
            }
            if (!resGet.ok) throw new Error("Failed to fetch deliveries");

            const result = await resGet.json();
            setData(result.data || []);
            setMeta(result.meta || null);
        } catch (error) {
            console.error("Failed to fetch deliveries:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleForceStatus = async (id: string, newStatus: string) => {
        if (!confirm(`Are you sure you want to FORCE status to ${newStatus}? This ignores provider updates.`)) return;

        try {
            const res = await fetch("/api/ops/logistics/shipments", {
                method: "PATCH",
                body: JSON.stringify({ shipmentId: id, status: newStatus, note: "Admin Override" })
            });
            if (!res.ok) throw new Error("Update failed");
            toast.success("Shipment Updated");
            fetchDeliveries();
        } catch (e) {
            toast.error("Failed to update status");
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

    const getStatusBadge = (status: string) => {
        const s = status.toUpperCase();
        if (["DELIVERED", "COMPLETED"].includes(s)) {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                    <CheckCircle2 className="h-3 w-3" /> {status}
                </span>
            );
        }
        if (["FAILED", "CANCELLED", "RETURNED"].includes(s)) {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
                    <XCircle className="h-3 w-3" /> {status}
                </span>
            );
        }
        if (["IN_TRANSIT", "PICKED_UP", "ACCEPTED"].includes(s)) {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                    <Truck className="h-3 w-3" /> {status}
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                <Clock className="h-3 w-3" /> {status}
            </span>
        );
    };

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <Truck className="w-8 h-8 text-indigo-600" />
                        Deliveries
                    </h1>
                    <p className="text-gray-500 mt-1">Track platform-wide shipments</p>
                </div>
                <div className="text-sm text-gray-500">
                    {meta && `${meta.total} total shipments`}
                </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-4">
                <div className="flex items-center gap-4">
                    <form onSubmit={handleSearch} className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search tracking #, recipient, or order #..."
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </form>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors flex items-center gap-2 ${showFilters || status || provider
                            ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                            : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                            }`}
                    >
                        <Filter className="h-4 w-4" />
                        Filters
                        {(status || provider) && (
                            <span className="bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {[status, provider].filter(Boolean).length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={fetchDeliveries}
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
                            <label className="block text-xs font-medium text-gray-700 mb-2">Delivery Status</label>
                            <select
                                value={status}
                                onChange={(e) => handleFilterChange("status", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">All Statuses</option>
                                <option value="DRAFT">Draft</option>
                                <option value="REQUESTED">Requested</option>
                                <option value="IN_TRANSIT">In Transit</option>
                                <option value="DELIVERED">Delivered</option>
                                <option value="FAILED">Failed</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-2">Provider</label>
                            <select
                                value={provider}
                                onChange={(e) => handleFilterChange("provider", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">All Providers</option>
                                <option value="KWIK">Kwik</option>
                                <option value="CUSTOM">Custom</option>
                                <option value="GIG">GIG Logistics</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden min-h-[400px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
                            <tr>
                                <th className="px-6 py-3">Order #</th>
                                <th className="px-6 py-3">Provider</th>
                                <th className="px-6 py-3">Tracking</th>
                                <th className="px-6 py-3">Recipient</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Store</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center">
                                        <div className="flex items-center justify-center gap-2 text-gray-400">
                                            <div className="h-4 w-4 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
                                            Loading deliveries...
                                        </div>
                                    </td>
                                </tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                                        No deliveries found
                                    </td>
                                </tr>
                            ) : (
                                data.map((shipment) => (
                                    <tr key={shipment.id} className="hover:bg-gray-50 group transition-colors">
                                        <td className="px-6 py-4 font-mono font-medium text-indigo-600">
                                            <Link href={`/ops/orders/${shipment.orderNumber}`} className="hover:underline">
                                                #{shipment.orderNumber}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-700 text-xs font-bold uppercase">
                                                {shipment.provider}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-gray-500 text-xs text-indigo-600">
                                            {shipment.trackingCode ? (
                                                <Link href={`/ops/deliveries/${shipment.id}`} className="hover:underline text-indigo-600 font-medium">
                                                    {shipment.trackingCode}
                                                </Link>
                                            ) : "—"}
                                        </td>
                                        <td className="px-6 py-4 text-gray-900">
                                            {shipment.recipientName || "—"}
                                        </td>
                                        <td className="px-6 py-4">{getStatusBadge(shipment.status)}</td>
                                        <td className="px-6 py-4">
                                            <div className="max-w-[150px] truncate" title={shipment.storeName}>
                                                {shipment.storeName}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleForceStatus(shipment.id, "DELIVERED")}
                                                    className="p-1 px-2 text-xs bg-green-50 text-green-700 border border-green-200 rounded hover:bg-green-100"
                                                    title="Force Mark Delivered"
                                                >
                                                    Done
                                                </button>
                                                <button
                                                    onClick={() => handleForceStatus(shipment.id, "FAILED")}
                                                    className="p-1 px-2 text-xs bg-red-50 text-red-700 border border-red-200 rounded hover:bg-red-100"
                                                    title="Force Mark Failed"
                                                >
                                                    Fail
                                                </button>
                                                <button
                                                    onClick={() => handleForceStatus(shipment.id, "CANCELED")}
                                                    className="p-1 px-2 text-xs bg-gray-50 text-gray-700 border border-gray-200 rounded hover:bg-gray-100"
                                                    title="Force Cancel"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination UI - Shared */}
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
