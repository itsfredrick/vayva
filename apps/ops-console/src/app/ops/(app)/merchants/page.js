"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Filter, AlertTriangle, CheckCircle2, XCircle, TrendingUp, MoreHorizontal, Loader2 } from "lucide-react";
import { Button } from "@vayva/ui";
import { OpsPagination } from "@/components/shared/OpsPagination";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
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
    const [data, setData] = useState([]);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    // Bulk Selection State
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [processingAction, setProcessingAction] = useState(null);
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
            if (!res.ok)
                throw new Error("Failed to fetch merchants");
            const result = await res.json();
            setData(result.data || []);
            setMeta(result.meta || null);
        }
        catch (error) {
            console.error("Failed to fetch merchants:", error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams);
        if (searchInput)
            params.set("q", searchInput);
        else
            params.delete("q");
        params.set("page", "1");
        router.push(`?${params.toString()}`);
    };
    const handleFilterChange = (key, value) => {
        const params = new URLSearchParams(searchParams);
        if (value)
            params.set(key, value);
        else
            params.delete(key);
        params.set("page", "1");
        router.push(`?${params.toString()}`);
    };
    const handlePageChange = (newPage) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", newPage.toString());
        router.push(`?${params.toString()}`);
    };
    // Bulk Selection Handlers
    const toggleSelectAll = () => {
        if (selectedIds.size === data.length) {
            setSelectedIds(new Set());
        }
        else {
            setSelectedIds(new Set(data.map(m => m.id)));
        }
    };
    const toggleSelectOne = (id) => {
        const next = new Set(selectedIds);
        if (next.has(id))
            next.delete(id);
        else
            next.add(id);
        setSelectedIds(next);
    };
    const executeBatchAction = async (action) => {
        if (!confirm(`Are you sure you want to ${action} for ${selectedIds.size} merchants?`))
            return;
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
            if (!res.ok)
                throw new Error(json.error);
            toast.success(`Action Complete: ${json.count} updated`);
            setSelectedIds(new Set());
            fetchMerchants(); // Refresh data
        }
        catch (e) {
            toast.error(e.message);
        }
        finally {
            setProcessingAction(null);
        }
    };
    const getKYCBadge = (status) => {
        switch (status) {
            case "APPROVED":
                return _jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700", children: [_jsx(CheckCircle2, { className: "h-3 w-3" }), " Approved"] });
            case "PENDING":
                return _jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-700", children: [_jsx(AlertTriangle, { className: "h-3 w-3" }), " Pending"] });
            case "REJECTED":
                return _jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700", children: [_jsx(XCircle, { className: "h-3 w-3" }), " Rejected"] });
            default:
                return _jsx("span", { className: "text-xs text-gray-400", children: "Not Submitted" });
        }
    };
    return (_jsxs("div", { className: "p-8 space-y-6 relative min-h-screen", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Merchants" }), _jsx("p", { className: "text-gray-500 mt-1", children: "Manage all registered stores" })] }), _jsx("div", { className: "text-sm text-gray-500", children: meta && `${meta.total} total merchants` })] }), _jsxs("div", { className: "bg-white p-4 rounded-xl border border-gray-200 space-y-4", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("form", { onSubmit: handleSearch, className: "flex-1 relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400", size: 18 }), _jsx("input", { type: "text", placeholder: "Search by store name, slug, owner email...", className: "w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500", value: searchInput, onChange: (e) => setSearchInput(e.target.value) })] }), _jsxs(Button, { variant: "outline", onClick: () => setShowFilters(!showFilters), className: `flex items-center gap-2 h-auto ${showFilters || plan || kyc || risk ? "bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100" : ""}`, "aria-label": showFilters ? "Hide filters" : "Show filters", children: [_jsx(Filter, { className: "h-4 w-4 mr-2" }), "Filters", (plan || kyc || risk) && (_jsx("span", { className: "ml-2 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center", children: [plan, kyc, risk].filter(Boolean).length }))] })] }), showFilters && (_jsxs("div", { className: "grid grid-cols-3 gap-4 pt-4 border-t border-gray-200", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-2", children: "Plan" }), _jsxs("select", { "aria-label": "Filter by Plan", title: "Filter by Plan", value: plan, onChange: (e) => handleFilterChange("plan", e.target.value), className: "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500", children: [_jsx("option", { value: "", children: "All Plans" }), _jsx("option", { value: "FREE", children: "Free" }), _jsx("option", { value: "STARTER", children: "Starter" }), _jsx("option", { value: "GROWTH", children: "Growth" }), _jsx("option", { value: "ENTERPRISE", children: "Enterprise" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-2", children: "KYC Status" }), _jsxs("select", { "aria-label": "Filter by KYC", title: "Filter by KYC Status", value: kyc, onChange: (e) => handleFilterChange("kyc", e.target.value), className: "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500", children: [_jsx("option", { value: "", children: "All Statuses" }), _jsx("option", { value: "APPROVED", children: "Approved" }), _jsx("option", { value: "PENDING", children: "Pending" }), _jsx("option", { value: "REJECTED", children: "Rejected" }), _jsx("option", { value: "NOT_SUBMITTED", children: "Not Submitted" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-2", children: "Risk" }), _jsxs("select", { "aria-label": "Filter by Risk", title: "Filter by Risk", value: risk, onChange: (e) => handleFilterChange("risk", e.target.value), className: "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500", children: [_jsx("option", { value: "", children: "All Merchants" }), _jsx("option", { value: "flagged", children: "Flagged Only" }), _jsx("option", { value: "clean", children: "Clean Only" })] })] })] }))] }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden", children: [_jsxs("table", { className: "w-full text-left text-sm", children: [_jsx("thead", { className: "bg-gray-50 border-b border-gray-200 text-gray-600 font-medium", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 w-10", children: _jsx("input", { type: "checkbox", title: "Select All", checked: data.length > 0 && selectedIds.size === data.length, onChange: toggleSelectAll, className: "rounded border-gray-300 text-indigo-600 focus:ring-indigo-500", "aria-label": "Select All" }) }), _jsx("th", { className: "px-6 py-3", children: "Merchant" }), _jsx("th", { className: "px-6 py-3", children: "Plan" }), _jsx("th", { className: "px-6 py-3", children: "KYC" }), _jsx("th", { className: "px-6 py-3", children: "GMV (30d)" }), _jsx("th", { className: "px-6 py-3", children: "Trial Status" }), _jsx("th", { className: "px-6 py-3", children: "Risk" }), _jsx("th", { className: "px-6 py-3", children: "Last Active" }), _jsx("th", { className: "px-6 py-3 text-right", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-100", children: loading ? (_jsx("tr", { children: _jsx("td", { colSpan: 8, className: "px-6 py-12 text-center text-gray-400", children: _jsxs("div", { className: "flex items-center justify-center gap-2", children: [_jsx(Loader2, { className: "h-4 w-4 animate-spin" }), " Loading..."] }) }) })) : data.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 8, className: "px-6 py-12 text-center text-gray-400", children: "No merchants found" }) })) : (data.map((merchant) => (_jsxs("tr", { className: selectedIds.has(merchant.id) ? "bg-indigo-50" : "hover:bg-gray-50 transition-colors", children: [_jsx("td", { className: "px-6 py-4", children: _jsx("input", { type: "checkbox", title: `Select ${merchant.name}`, checked: selectedIds.has(merchant.id), onChange: () => toggleSelectOne(merchant.id), className: "rounded border-gray-300 text-indigo-600 focus:ring-indigo-500", "aria-label": `Select ${merchant.name}` }) }), _jsx("td", { className: "px-6 py-4", children: _jsxs(Link, { href: `/ops/merchants/${merchant.id}`, className: "block", children: [_jsx("div", { className: "font-semibold text-gray-900 hover:text-indigo-600 transition-colors", children: merchant.name }), _jsx("div", { className: "text-xs text-gray-500", children: merchant.slug })] }) }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: "px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700", children: merchant.plan }) }), _jsx("td", { className: "px-6 py-4", children: getKYCBadge(merchant.kycStatus) }), _jsx("td", { className: "px-6 py-4", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(TrendingUp, { className: "h-4 w-4 text-green-500" }), _jsxs("span", { className: "font-medium text-gray-900", children: ["\u20A6", merchant.gmv30d.toLocaleString()] })] }) }), _jsx("td", { className: "px-6 py-4", children: merchant.plan === "FREE" && merchant.trialEndsAt ? (() => {
                                                const remaining = new Date(merchant.trialEndsAt).getTime() - Date.now();
                                                const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
                                                const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                                                const isUrgent = remaining < (48 * 60 * 60 * 1000) && remaining > 0;
                                                const isExpired = remaining <= 0;
                                                if (isExpired)
                                                    return _jsx("span", { className: "text-red-600 font-bold border border-red-200 bg-red-50 px-2 py-0.5 rounded text-xs", children: "Expired" });
                                                return (_jsxs("div", { className: `text-xs font-medium px-2 py-0.5 rounded border ${isUrgent ? "bg-orange-50 text-orange-700 border-orange-200 animate-pulse" : "bg-blue-50 text-blue-700 border-blue-200"}`, children: [days, "d ", hours, "h left"] }));
                                            })() : _jsx("span", { className: "text-gray-400 text-xs", children: "\u2014" }) }), _jsx("td", { className: "px-6 py-4", children: merchant.riskFlags.length > 0 ? (_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(AlertTriangle, { className: "h-4 w-4 text-red-500" }), _jsxs("span", { className: "text-xs text-red-600 font-medium", children: [merchant.riskFlags.length, " flag", merchant.riskFlags.length > 1 ? "s" : ""] })] })) : _jsx("span", { className: "text-xs text-gray-400", children: "Clean" }) }), _jsx("td", { className: "px-6 py-4 text-gray-500 text-xs", children: new Date(merchant.lastActive).toLocaleDateString() }), _jsx("td", { className: "px-6 py-4 text-right", children: _jsx(Link, { href: `/ops/merchants/${merchant.id}`, className: "p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 inline-block", children: _jsx(MoreHorizontal, { size: 16 }) }) })] }, merchant.id)))) })] }), meta && (_jsx(OpsPagination, { currentPage: meta.page, totalItems: meta.total, limit: meta.limit, onPageChange: handlePageChange }))] }), selectedIds.size > 0 && (_jsxs("div", { className: "fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#0F172A] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-6 z-50 animate-in slide-in-from-bottom-5", children: [_jsxs("div", { className: "flex items-center gap-3 pr-6 border-r border-gray-700", children: [_jsx("div", { className: "bg-white text-black font-bold h-6 w-6 rounded-md flex items-center justify-center text-xs", children: selectedIds.size }), _jsx("span", { className: "text-sm font-medium", children: "Selected" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Button, { variant: "destructive", size: "sm", onClick: () => executeBatchAction("SUSPEND"), disabled: !!processingAction, className: "bg-red-500 hover:bg-red-600 text-white border-none h-auto", "aria-label": `Suspend ${selectedIds.size} selected merchant accounts`, children: "Suspend Accounts" }), _jsx(Button, { variant: "primary", size: "sm", onClick: () => executeBatchAction("force_kyc"), disabled: !!processingAction, className: "bg-yellow-500 hover:bg-yellow-600 text-black border-none h-auto", "aria-label": `Force KYC for ${selectedIds.size} selected merchants`, children: "Force KYC" }), _jsx(Button, { variant: "primary", size: "sm", onClick: () => executeBatchAction("enable_payouts"), disabled: !!processingAction, className: "bg-green-600 hover:bg-green-700 text-white border-none h-auto", "aria-label": `Enable payouts for ${selectedIds.size} selected merchants`, children: "Enable Payouts" }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => setSelectedIds(new Set()), className: "text-gray-400 hover:text-white hover:bg-white/10 h-auto", "aria-label": "Cancel bulk selection", children: "Cancel" })] })] }))] }));
}
