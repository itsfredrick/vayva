"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, RefreshCw, Truck, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Button } from "@vayva/ui";
import { OpsPagination } from "@/components/shared/OpsPagination";
import { toast } from "sonner";
export default function DeliveriesPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("q") || "";
    const status = searchParams.get("status") || "";
    const provider = searchParams.get("provider") || "";
    const [searchInput, setSearchInput] = useState(search);
    const [data, setData] = useState([]);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [stats, setStats] = useState({ total: 0, delivered: 0, pending: 0, failed: 0, slaRate: 0 });
    useEffect(() => {
        fetchDeliveries();
        fetchStats();
    }, [page, search, status, provider]);
    const fetchStats = async () => {
        try {
            const res = await fetch("/api/ops/logistics/stats");
            if (res.ok) {
                const s = await res.json();
                setStats(s);
            }
        }
        catch (e) {
            console.error("Failed to fetch stats", e);
        }
    };
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
            const resGet = await fetch(`/api/ops/deliveries?${query}`);
            if (resGet.status === 401) {
                window.location.href = "/ops/login";
                return;
            }
            if (!resGet.ok)
                throw new Error("Failed to fetch deliveries");
            const result = await resGet.json();
            setData(result.data || []);
            setMeta(result.meta || null);
        }
        catch (error) {
            console.error("Failed to fetch deliveries:", error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleForceStatus = async (id, newStatus) => {
        if (!confirm(`Are you sure you want to FORCE status to ${newStatus}? This ignores provider updates.`))
            return;
        try {
            const res = await fetch("/api/ops/logistics/shipments", {
                method: "PATCH",
                body: JSON.stringify({ shipmentId: id, status: newStatus, note: "Admin Override" })
            });
            if (!res.ok)
                throw new Error("Update failed");
            toast.success("Shipment Updated");
            fetchDeliveries();
        }
        catch (e) {
            toast.error("Failed to update status");
        }
    };
    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams);
        if (searchInput) {
            params.set("q", searchInput);
        }
        else {
            params.delete("q");
        }
        params.set("page", "1");
        router.push(`?${params.toString()}`);
    };
    const handleFilterChange = (key, value) => {
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set(key, value);
        }
        else {
            params.delete(key);
        }
        params.set("page", "1");
        router.push(`?${params.toString()}`);
    };
    const handlePageChange = (newPage) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", newPage.toString());
        router.push(`?${params.toString()}`);
    };
    const getStatusBadge = (status) => {
        const s = status.toUpperCase();
        if (["DELIVERED", "COMPLETED"].includes(s)) {
            return (_jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700", children: [_jsx(CheckCircle2, { className: "h-3 w-3" }), " ", status] }));
        }
        if (["FAILED", "CANCELLED", "RETURNED"].includes(s)) {
            return (_jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700", children: [_jsx(XCircle, { className: "h-3 w-3" }), " ", status] }));
        }
        if (["IN_TRANSIT", "PICKED_UP", "ACCEPTED"].includes(s)) {
            return (_jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700", children: [_jsx(Truck, { className: "h-3 w-3" }), " ", status] }));
        }
        return (_jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700", children: [_jsx(Clock, { className: "h-3 w-3" }), " ", status] }));
    };
    return (_jsxs("div", { className: "p-8 space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-3xl font-bold text-gray-900 flex items-center gap-2", children: [_jsx(Truck, { className: "w-8 h-8 text-indigo-600" }), "Deliveries"] }), _jsxs("div", { className: "flex items-center gap-3 mt-1", children: [_jsx("p", { className: "text-gray-500", children: "Track platform-wide shipments" }), _jsxs("span", { className: "px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full", children: [stats.slaRate, "% On-Time Delivery"] })] })] }), _jsx("div", { className: "text-sm text-gray-500", children: meta && `${meta.total} total shipments` })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs("div", { className: "bg-white p-4 rounded-xl border border-gray-200", children: [_jsx("div", { className: "text-gray-500 text-xs font-medium uppercase mb-1", children: "Total Shipped" }), _jsx("div", { className: "text-2xl font-bold", children: stats.total })] }), _jsxs("div", { className: "bg-white p-4 rounded-xl border border-gray-200", children: [_jsx("div", { className: "text-green-600 text-xs font-medium uppercase mb-1", children: "Delivered" }), _jsx("div", { className: "text-2xl font-bold", children: stats.delivered })] }), _jsxs("div", { className: "bg-white p-4 rounded-xl border border-gray-200", children: [_jsx("div", { className: "text-blue-600 text-xs font-medium uppercase mb-1", children: "Pending" }), _jsx("div", { className: "text-2xl font-bold", children: stats.pending })] }), _jsxs("div", { className: "bg-white p-4 rounded-xl border border-gray-200", children: [_jsx("div", { className: "text-red-600 text-xs font-medium uppercase mb-1", children: "Failed" }), _jsx("div", { className: "text-2xl font-bold", children: stats.failed })] })] }), _jsxs("div", { className: "bg-white p-4 rounded-xl border border-gray-200 space-y-4", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("form", { onSubmit: handleSearch, className: "flex-1 relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400", size: 18 }), _jsx("input", { type: "text", placeholder: "Search tracking #, recipient, or order #...", className: "w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500", value: searchInput, onChange: (e) => setSearchInput(e.target.value) })] }), _jsxs(Button, { variant: "outline", onClick: () => setShowFilters(!showFilters), className: `flex items-center gap-2 h-auto ${showFilters || status || provider
                                    ? "bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100"
                                    : ""}`, "aria-label": showFilters ? "Hide filters" : "Show filters", children: [_jsx(Filter, { className: "h-4 w-4 mr-2" }), "Filters", (status || provider) && (_jsx("span", { className: "ml-2 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center", children: [status, provider].filter(Boolean).length }))] }), _jsxs(Button, { variant: "outline", onClick: fetchDeliveries, className: "flex items-center gap-2 h-auto", "aria-label": "Refresh deliveries list", children: [_jsx(RefreshCw, { className: "h-4 w-4 mr-2" }), "Refresh"] })] }), showFilters && (_jsxs("div", { className: "grid grid-cols-2 gap-4 pt-4 border-t border-gray-200", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-2", children: "Delivery Status" }), _jsxs("select", { title: "Filter by status", "aria-label": "Filter by delivery status", value: status, onChange: (e) => handleFilterChange("status", e.target.value), className: "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500", children: [_jsx("option", { value: "", children: "All Statuses" }), _jsx("option", { value: "DRAFT", children: "Draft" }), _jsx("option", { value: "REQUESTED", children: "Requested" }), _jsx("option", { value: "IN_TRANSIT", children: "In Transit" }), _jsx("option", { value: "DELIVERED", children: "Delivered" }), _jsx("option", { value: "FAILED", children: "Failed" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-2", children: "Provider" }), _jsxs("select", { title: "Filter by provider", "aria-label": "Filter by delivery provider", value: provider, onChange: (e) => handleFilterChange("provider", e.target.value), className: "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500", children: [_jsx("option", { value: "", children: "All Providers" }), _jsx("option", { value: "KWIK", children: "Kwik" }), _jsx("option", { value: "CUSTOM", children: "Custom" }), _jsx("option", { value: "GIG", children: "GIG Logistics" })] })] })] }))] }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden min-h-[400px]", children: [_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-left text-sm", children: [_jsx("thead", { className: "bg-gray-50 border-b border-gray-200 text-gray-600 font-medium", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3", children: "Order #" }), _jsx("th", { className: "px-6 py-3", children: "Provider" }), _jsx("th", { className: "px-6 py-3", children: "Tracking" }), _jsx("th", { className: "px-6 py-3", children: "Recipient" }), _jsx("th", { className: "px-6 py-3", children: "Status" }), _jsx("th", { className: "px-6 py-3", children: "Store" }), _jsx("th", { className: "px-6 py-3", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-100", children: loading ? (_jsx("tr", { children: _jsx("td", { colSpan: 7, className: "px-6 py-12 text-center", children: _jsxs("div", { className: "flex items-center justify-center gap-2 text-gray-400", children: [_jsx("div", { className: "h-4 w-4 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin" }), "Loading deliveries..."] }) }) })) : data.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 7, className: "px-6 py-12 text-center text-gray-400", children: "No deliveries found" }) })) : (data.map((shipment) => (_jsxs("tr", { className: "hover:bg-gray-50 group transition-colors", children: [_jsx("td", { className: "px-6 py-4 font-mono font-medium text-indigo-600", children: _jsxs(Link, { href: `/ops/orders/${shipment.orderNumber}`, className: "hover:underline", children: ["#", shipment.orderNumber] }) }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: "px-2 py-0.5 rounded bg-purple-100 text-purple-700 text-xs font-bold uppercase", children: shipment.provider }) }), _jsx("td", { className: "px-6 py-4 font-mono text-gray-500 text-xs text-indigo-600", children: shipment.trackingCode ? (_jsx(Link, { href: `/ops/deliveries/${shipment.id}`, className: "hover:underline text-indigo-600 font-medium", children: shipment.trackingCode })) : "—" }), _jsx("td", { className: "px-6 py-4 text-gray-900", children: shipment.recipientName || "—" }), _jsx("td", { className: "px-6 py-4", children: getStatusBadge(shipment.status) }), _jsx("td", { className: "px-6 py-4", children: _jsx("div", { className: "max-w-[150px] truncate", title: shipment.storeName, children: shipment.storeName }) }), _jsx("td", { className: "px-6 py-4", children: _jsxs("div", { className: "flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity", children: [_jsx(Button, { variant: "primary", size: "sm", onClick: () => handleForceStatus(shipment.id, "DELIVERED"), className: "h-7 px-2 text-[10px] bg-green-50 text-green-700 border border-green-200 hover:bg-green-100", title: "Force Mark Delivered", "aria-label": `Mark shipment ${shipment.id} as delivered`, children: "Done" }), _jsx(Button, { variant: "destructive", size: "sm", onClick: () => handleForceStatus(shipment.id, "FAILED"), className: "h-7 px-2 text-[10px] bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 shadow-none", title: "Force Mark Failed", "aria-label": `Mark shipment ${shipment.id} as failed`, children: "Fail" }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => handleForceStatus(shipment.id, "CANCELED"), className: "h-7 px-2 text-[10px] bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100", title: "Force Cancel", "aria-label": `Mark shipment ${shipment.id} as canceled`, children: "Cancel" })] }) })] }, shipment.id)))) })] }) }), meta && (_jsx(OpsPagination, { currentPage: meta.page, totalItems: meta.total, limit: meta.limit, onPageChange: handlePageChange }))] })] }));
}
