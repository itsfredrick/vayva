
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
    Search,
    Filter,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    TrendingUp,
    MoreHorizontal,
    Loader2
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

interface Merchant {
    id: string;
    name: string;
    slug: string;
    ownerName: string;
    ownerEmail: string;
    status: string;
    plan: string;
    kycStatus: "PENDING" | "APPROVED" | "REJECTED" | "NOT_SUBMITTED";
    riskFlags: string[];
    gmv30d: number;
    lastActive: string;
    createdAt: string;
    location: string;
}

interface Meta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export default function MerchantsListPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // URL State
    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("q") || "";
    const plan = searchParams.get("plan") || "";
    const kyc = searchParams.get("kyc") || "";
    const risk = searchParams.get("risk") || "";

    const [searchInput, setSearchInput] = useState(search);
    const [data, setData] = useState<Merchant[]>([]);
    const [meta, setMeta] = useState<Meta | null>(null);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    // Bulk Selection State
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [processingAction, setProcessingAction] = useState<string | null>(null);

    useEffect(() => {
        fetchMerchants();
        setSelectedIds(new Set()); // Reset selection on fetch/filter change
    }, [page, search, plan, kyc, risk]);

    const fetchMerchants = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams({
                page: page.toString(),
                limit: "20",
                ...(search && { q: search }),
                ...(plan && { plan }),
                ...(kyc && { kyc }),
                ...(risk && { risk }),
            });

            const res = await fetch(`/api/ops/merchants?${query}`);
            if (res.status === 401) {
                window.location.href = "/ops/login";
                return;
            }
            if (!res.ok) throw new Error("Failed to fetch merchants");

            const result = await res.json();
            setData(result.data || []);
            setMeta(result.meta || null);
        } catch (error) {
            console.error("Failed to fetch merchants:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams);
        if (searchInput) params.set("q", searchInput);
        else params.delete("q");
        params.set("page", "1");
        router.push(`?${params.toString()}`);
    };

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value) params.set(key, value);
        else params.delete(key);
        params.set("page", "1");
        router.push(`?${params.toString()}`);
    };

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", newPage.toString());
        router.push(`?${params.toString()}`);
    };

    // Bulk Selection Handlers
    const toggleSelectAll = () => {
        if (selectedIds.size === data.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(data.map(m => m.id)));
        }
    };

    const toggleSelectOne = (id: string) => {
        const next = new Set(selectedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedIds(next);
    };

    const executeBatchAction = async (action: string) => {
        if (!confirm(`Are you sure you want to ${action} for ${selectedIds.size} merchants?`)) return;

        setProcessingAction(action);
        try {
            const res = await fetch("/api/ops/merchants/batch", {
                method: "POST",
                body: JSON.stringify({
                    merchantIds: Array.from(selectedIds),
                    action
                })
            });

            const json = await res.json();
            if (!res.ok) throw new Error(json.error);

            toast.success(`Action Complete: ${json.count} updated`);
            setSelectedIds(new Set());
            fetchMerchants(); // Refresh data
        } catch (e: any) {
            toast.error(e.message);
        } finally {
            setProcessingAction(null);
        }
    };

    const getKYCBadge = (status: string) => {
        switch (status) {
            case "APPROVED":
                return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700"><CheckCircle2 className="h-3 w-3" /> Approved</span>;
            case "PENDING":
                return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-700"><AlertTriangle className="h-3 w-3" /> Pending</span>;
            case "REJECTED":
                return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700"><XCircle className="h-3 w-3" /> Rejected</span>;
            default:
                return <span className="text-xs text-gray-400">Not Submitted</span>;
        }
    };

    return (
        <div className="p-8 space-y-6 relative min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Merchants</h1>
                    <p className="text-gray-500 mt-1">Manage all registered stores</p>
                </div>
                <div className="text-sm text-gray-500">
                    {meta && `${meta.total} total merchants`}
                </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-4">
                <div className="flex items-center gap-4">
                    <form onSubmit={handleSearch} className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by store name, slug, owner email..."
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </form>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors flex items-center gap-2 ${showFilters || plan || kyc || risk ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"}`}
                    >
                        <Filter className="h-4 w-4" />
                        Filters
                        {(plan || kyc || risk) && (
                            <span className="bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {[plan, kyc, risk].filter(Boolean).length}
                            </span>
                        )}
                    </button>
                </div>

                {/* Filter Options */}
                {showFilters && (
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-2">Plan</label>
                            <select value={plan} onChange={(e) => handleFilterChange("plan", e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <option value="">All Plans</option>
                                <option value="FREE">Free</option>
                                <option value="STARTER">Starter</option>
                                <option value="GROWTH">Growth</option>
                                <option value="ENTERPRISE">Enterprise</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-2">KYC Status</label>
                            <select value={kyc} onChange={(e) => handleFilterChange("kyc", e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <option value="">All Statuses</option>
                                <option value="APPROVED">Approved</option>
                                <option value="PENDING">Pending</option>
                                <option value="REJECTED">Rejected</option>
                                <option value="NOT_SUBMITTED">Not Submitted</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-2">Risk</label>
                            <select value={risk} onChange={(e) => handleFilterChange("risk", e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <option value="">All Merchants</option>
                                <option value="flagged">Flagged Only</option>
                                <option value="clean">Clean Only</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
                        <tr>
                            <th className="px-6 py-3 w-10">
                                <input
                                    type="checkbox"
                                    checked={data.length > 0 && selectedIds.size === data.length}
                                    onChange={toggleSelectAll}
                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                            </th>
                            <th className="px-6 py-3">Merchant</th>
                            <th className="px-6 py-3">Plan</th>
                            <th className="px-6 py-3">KYC</th>
                            <th className="px-6 py-3">GMV (30d)</th>
                            <th className="px-6 py-3">Risk</th>
                            <th className="px-6 py-3">Last Active</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                                    <div className="flex items-center justify-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" /> Loading...
                                    </div>
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-6 py-12 text-center text-gray-400">No merchants found</td>
                            </tr>
                        ) : (
                            data.map((merchant) => (
                                <tr key={merchant.id} className={selectedIds.has(merchant.id) ? "bg-indigo-50" : "hover:bg-gray-50 transition-colors"}>
                                    <td className="px-6 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.has(merchant.id)}
                                            onChange={() => toggleSelectOne(merchant.id)}
                                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link href={`/ops/merchants/${merchant.id}`} className="block">
                                            <div className="font-semibold text-gray-900 hover:text-indigo-600 transition-colors">{merchant.name}</div>
                                            <div className="text-xs text-gray-500">{merchant.slug}</div>
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">{merchant.plan}</span>
                                    </td>
                                    <td className="px-6 py-4">{getKYCBadge(merchant.kycStatus)}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="h-4 w-4 text-green-500" />
                                            <span className="font-medium text-gray-900">₦{merchant.gmv30d.toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {merchant.riskFlags.length > 0 ? (
                                            <div className="flex items-center gap-1">
                                                <AlertTriangle className="h-4 w-4 text-red-500" />
                                                <span className="text-xs text-red-600 font-medium">{merchant.riskFlags.length} flag{merchant.riskFlags.length > 1 ? "s" : ""}</span>
                                            </div>
                                        ) : <span className="text-xs text-gray-400">Clean</span>}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-xs">{new Date(merchant.lastActive).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <Link href={`/ops/merchants/${merchant.id}`} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 inline-block">
                                            <MoreHorizontal size={16} />
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                {meta && (
                    <div className="bg-gray-50 border-t border-gray-200 px-6 py-3 flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                            Showing <span className="font-medium">{(meta.page - 1) * meta.limit + 1}</span> to <span className="font-medium">{Math.min(meta.page * meta.limit, meta.total)}</span> of <span className="font-medium">{meta.total}</span> results
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => handlePageChange(meta.page - 1)} disabled={meta.page <= 1} className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-600 hover:bg-white disabled:opacity-50">Previous</button>
                            <button onClick={() => handlePageChange(meta.page + 1)} disabled={meta.page >= meta.totalPages} className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-600 hover:bg-white disabled:opacity-50">Next</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Bulk Action Bar */}
            {selectedIds.size > 0 && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#0F172A] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-6 z-50 animate-in slide-in-from-bottom-5">
                    <div className="flex items-center gap-3 pr-6 border-r border-gray-700">
                        <div className="bg-white text-black font-bold h-6 w-6 rounded-md flex items-center justify-center text-xs">
                            {selectedIds.size}
                        </div>
                        <span className="text-sm font-medium">Selected</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => executeBatchAction("SUSPEND")}
                            disabled={!!processingAction}
                            className="px-4 py-2 hover:bg-white/10 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
                        >
                            Suspend Accounts
                        </button>
                        <button
                            onClick={() => executeBatchAction("force_kyc")}
                            disabled={!!processingAction}
                            className="px-4 py-2 hover:bg-white/10 rounded-lg text-sm font-medium text-yellow-400 hover:text-yellow-300 transition-colors"
                        >
                            Force KYC
                        </button>
                        <button
                            onClick={() => executeBatchAction("enable_payouts")}
                            disabled={!!processingAction}
                            className="px-4 py-2 hover:bg-white/10 rounded-lg text-sm font-medium text-green-400 hover:text-green-300 transition-colors"
                        >
                            Enable Payouts
                        </button>
                        <button
                            onClick={() => setSelectedIds(new Set())}
                            className="ml-2 p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

