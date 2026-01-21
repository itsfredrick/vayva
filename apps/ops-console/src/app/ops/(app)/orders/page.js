"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, RefreshCw, CheckCircle2, XCircle, Clock, AlertCircle, } from "lucide-react";
import { Button } from "@vayva/ui";
import { OpsPagination } from "@/components/shared/OpsPagination";
export default function OrdersPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("q") || "";
    const status = searchParams.get("status") || "";
    const paymentStatus = searchParams.get("paymentStatus") || "";
    const [searchInput, setSearchInput] = useState(search);
    const [data, setData] = useState([]);
    const [meta, setMeta] = useState(null);
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
            if (!res.ok)
                throw new Error("Failed to fetch orders");
            const result = await res.json();
            setData(result.data || []);
            setMeta(result.meta || null);
        }
        catch (error) {
            console.error("Failed to fetch orders:", error);
        }
        finally {
            setLoading(false);
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
    // Status Badge Helper
    const getStatusBadge = (status, type) => {
        const statusLower = status.toLowerCase();
        let colorClass = "bg-gray-100 text-gray-700";
        let Icon = Clock;
        if (["paid", "completed", "fulfilled", "delivered"].includes(statusLower)) {
            colorClass = "bg-green-100 text-green-700";
            Icon = CheckCircle2;
        }
        else if (["failed", "cancelled", "rejected", "refunded"].includes(statusLower)) {
            colorClass = "bg-red-100 text-red-700";
            Icon = XCircle;
        }
        else if (["processing", "initiated", "pending"].includes(statusLower)) {
            colorClass = "bg-blue-100 text-blue-700";
            Icon = RefreshCw; // Or Clock
        }
        else if (["partially_fulfilled", "partially_paid"].includes(statusLower)) {
            colorClass = "bg-yellow-100 text-yellow-700";
            Icon = AlertCircle;
        }
        return (_jsxs("span", { className: `inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${colorClass}`, children: [_jsx(Icon, { className: "h-3 w-3" }), " ", status] }));
    };
    return (_jsxs("div", { className: "p-8 space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Orders" }), _jsx("p", { className: "text-gray-500 mt-1", children: "Manage platform-wide orders" })] }), _jsx("div", { className: "text-sm text-gray-500", children: meta && `${meta.total} total orders` })] }), _jsxs("div", { className: "bg-white p-4 rounded-xl border border-gray-200 space-y-4", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("form", { onSubmit: handleSearch, className: "flex-1 relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400", size: 18 }), _jsx("input", { type: "text", placeholder: "Search order #, customer email...", className: "w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500", value: searchInput, onChange: (e) => setSearchInput(e.target.value) })] }), _jsxs(Button, { variant: "outline", onClick: () => setShowFilters(!showFilters), className: `flex items-center gap-2 h-auto ${showFilters || status || paymentStatus
                                    ? "bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100"
                                    : ""}`, "aria-label": showFilters ? "Hide filters" : "Show filters", children: [_jsx(Filter, { className: "h-4 w-4 mr-2" }), "Filters", (status || paymentStatus) && (_jsx("span", { className: "ml-2 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center", children: [status, paymentStatus].filter(Boolean).length }))] }), _jsxs(Button, { variant: "outline", onClick: fetchOrders, className: "flex items-center gap-2 h-auto", "aria-label": "Refresh orders list", children: [_jsx(RefreshCw, { className: "h-4 w-4 mr-2" }), "Refresh"] })] }), showFilters && (_jsxs("div", { className: "grid grid-cols-2 gap-4 pt-4 border-t border-gray-200", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-2", children: "Order Status" }), _jsxs("select", { value: status, onChange: (e) => handleFilterChange("status", e.target.value), className: "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500", "aria-label": "Filter by order status", children: [_jsx("option", { value: "", children: "All Statuses" }), _jsx("option", { value: "COMPLETED", children: "Completed" }), _jsx("option", { value: "PROCESSING", children: "Processing" }), _jsx("option", { value: "CANCELLED", children: "Cancelled" }), _jsx("option", { value: "DRAFT", children: "Draft" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-2", children: "Payment Status" }), _jsxs("select", { value: paymentStatus, onChange: (e) => handleFilterChange("paymentStatus", e.target.value), className: "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500", "aria-label": "Filter by payment status", children: [_jsx("option", { value: "", children: "All Payments" }), _jsx("option", { value: "PAID", children: "Paid" }), _jsx("option", { value: "PENDING", children: "Pending" }), _jsx("option", { value: "FAILED", children: "Failed" }), _jsx("option", { value: "REFUNDED", children: "Refunded" })] })] })] }))] }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden", children: [_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-left text-sm", children: [_jsx("thead", { className: "bg-gray-50 border-b border-gray-200 text-gray-600 font-medium", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3", children: "Order" }), _jsx("th", { className: "px-6 py-3", children: "Customer" }), _jsx("th", { className: "px-6 py-3", children: "Store" }), _jsx("th", { className: "px-6 py-3", children: "Total" }), _jsx("th", { className: "px-6 py-3", children: "Status" }), _jsx("th", { className: "px-6 py-3", children: "Payment" }), _jsx("th", { className: "px-6 py-3", children: "Fulfillment" }), _jsx("th", { className: "px-6 py-3", children: "Date" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-100", children: loading ? (_jsx("tr", { children: _jsx("td", { colSpan: 8, className: "px-6 py-12 text-center", children: _jsxs("div", { className: "flex items-center justify-center gap-2 text-gray-400", children: [_jsx("div", { className: "h-4 w-4 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin" }), "Loading orders..."] }) }) })) : data.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 8, className: "px-6 py-12 text-center text-gray-400", children: "No orders found" }) })) : (data.map((order) => (_jsxs("tr", { className: "hover:bg-gray-50 group transition-colors", children: [_jsx("td", { className: "px-6 py-4 font-mono font-medium text-indigo-600", children: _jsxs(Link, { href: `/ops/orders/${order.id}`, className: "hover:underline", children: ["#", order.orderNumber] }) }), _jsx("td", { className: "px-6 py-4 text-gray-600", children: order.customerEmail || "Guest" }), _jsx("td", { className: "px-6 py-4", children: _jsx(Link, { href: `/ops/merchants/${order.storeId}`, className: "hover:text-indigo-600", children: order.storeName }) }), _jsxs("td", { className: "px-6 py-4 font-medium", children: [order.currency, " ", Number(order.total).toLocaleString()] }), _jsx("td", { className: "px-6 py-4", children: getStatusBadge(order.status, 'status') }), _jsx("td", { className: "px-6 py-4", children: getStatusBadge(order.paymentStatus, 'payment') }), _jsx("td", { className: "px-6 py-4", children: getStatusBadge(order.fulfillmentStatus, 'fulfillment') }), _jsx("td", { className: "px-6 py-4 text-gray-500 text-xs", children: new Date(order.createdAt).toLocaleDateString() })] }, order.id)))) })] }) }), meta && (_jsx(OpsPagination, { currentPage: meta.page, totalItems: meta.total, limit: meta.limit, onPageChange: handlePageChange }))] })] }));
}
