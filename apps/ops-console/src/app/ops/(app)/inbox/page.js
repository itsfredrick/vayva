"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, RefreshCw, MessageSquare, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { MerchantHappinessWidget } from "@/components/analytics/csat-widget";
import { Button } from "@vayva/ui";
export default function SupportInboxPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("q") || "";
    const status = searchParams.get("status") || "open";
    const priority = searchParams.get("priority") || "";
    const [searchInput, setSearchInput] = useState(search);
    const [data, setData] = useState([]);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    useEffect(() => {
        fetchTickets();
    }, [page, search, status, priority]);
    const fetchTickets = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams({
                page: page.toString(),
                limit: "20",
                status: status,
                ...(search && { q: search }),
                ...(priority && { priority }),
            });
            const res = await fetch(`/api/ops/support?${query}`);
            if (res.status === 401) {
                window.location.href = "/ops/login";
                return;
            }
            if (!res.ok)
                throw new Error("Failed to fetch tickets");
            const result = await res.json();
            setData(result.data || []);
            setMeta(result.meta || null);
        }
        catch (error) {
            console.error("Failed to fetch tickets:", error);
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
    const getPriorityBadge = (priority) => {
        switch (priority.toLowerCase()) {
            case "high":
            case "urgent":
                return _jsx("span", { className: "text-xs font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded", children: "High" });
            case "medium":
                return _jsx("span", { className: "text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded", children: "Medium" });
            default:
                return _jsx("span", { className: "text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded", children: "Low" });
        }
    };
    return (_jsxs("div", { className: "p-8 space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8 items-start", children: [_jsxs("div", { className: "lg:col-span-2", children: [_jsx("h1", { className: "text-4xl font-black text-gray-900 tracking-tight", children: "Support Inbox" }), _jsx("p", { className: "text-gray-500 mt-1 text-lg", children: "Manage and resolve merchant support requests." }), _jsxs("div", { className: "flex items-center gap-6 mt-6", children: [_jsxs("div", { className: "flex flex-col", children: [_jsx("span", { className: "text-2xl font-bold text-gray-900", children: meta?.total || 0 }), _jsx("span", { className: "text-xs font-bold text-gray-400 uppercase tracking-widest", children: "Total Tickets" })] }), _jsx("div", { className: "h-8 w-px bg-gray-200" }), _jsxs("div", { className: "flex flex-col", children: [_jsx("span", { className: "text-2xl font-bold text-green-600", children: data.filter(t => t.status === 'open').length }), _jsx("span", { className: "text-xs font-bold text-gray-400 uppercase tracking-widest", children: "Active Now" })] })] })] }), _jsx("div", { className: "lg:col-start-3", children: _jsx(MerchantHappinessWidget, {}) })] }), _jsxs("div", { className: "bg-white p-4 rounded-xl border border-gray-200 space-y-4", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("form", { onSubmit: handleSearch, className: "flex-1 relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400", size: 18 }), _jsx("input", { type: "text", placeholder: "Search subject, ticket ID, or merchant...", className: "w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500", value: searchInput, onChange: (e) => setSearchInput(e.target.value) })] }), _jsxs(Button, { variant: "outline", onClick: () => setShowFilters(!showFilters), className: `px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors flex items-center gap-2 h-auto ${showFilters || (status !== "open") || priority
                                    ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"}`, "aria-label": showFilters ? "Hide filters" : "Show filters", children: [_jsx(Filter, { className: "h-4 w-4" }), "Filters", ((status !== "open") || priority) && (_jsx("span", { className: "bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center", children: Number(status !== "open") + Number(!!priority) }))] }), _jsxs(Button, { variant: "outline", onClick: fetchTickets, className: "px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 h-auto", "aria-label": "Refresh support tickets", children: [_jsx(RefreshCw, { className: "h-4 w-4" }), "Refresh"] })] }), showFilters && (_jsxs("div", { className: "grid grid-cols-2 gap-4 pt-4 border-t border-gray-200", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-2", children: "Status" }), _jsxs("select", { value: status, onChange: (e) => handleFilterChange("status", e.target.value), className: "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500", "aria-label": "Filter by ticket status", children: [_jsx("option", { value: "open", children: "Open" }), _jsx("option", { value: "closed", children: "Closed" }), _jsx("option", { value: "all", children: "All Tickets" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-2", children: "Priority" }), _jsxs("select", { value: priority, onChange: (e) => handleFilterChange("priority", e.target.value), className: "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500", "aria-label": "Filter by ticket priority", children: [_jsx("option", { value: "", children: "All Priorities" }), _jsx("option", { value: "high", children: "High" }), _jsx("option", { value: "medium", children: "Medium" }), _jsx("option", { value: "low", children: "Low" })] })] })] }))] }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden", children: [loading ? (_jsxs("div", { className: "p-12 text-center text-gray-400 flex flex-col items-center gap-3", children: [_jsx("div", { className: "h-6 w-6 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin" }), "Loading tickets..."] })) : data.length === 0 ? (_jsxs("div", { className: "p-16 text-center text-gray-500", children: [_jsx(MessageSquare, { className: "h-12 w-12 mx-auto mb-4 text-gray-300" }), _jsx("h3", { className: "text-lg font-medium text-gray-900", children: "No tickets found" }), _jsx("p", { className: "mt-1 text-sm", children: "Or great job clearing the inbox! \uD83C\uDF89" })] })) : (_jsx("div", { className: "divide-y divide-gray-100", children: data.map((ticket) => (_jsxs(Link, { href: `/ops/inbox/${ticket.id}`, className: "block p-4 hover:bg-gray-50 transition-colors group", children: [_jsxs("div", { className: "flex justify-between items-start mb-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "font-medium text-indigo-600 text-sm", children: ticket.storeName }), _jsx("span", { className: "text-gray-300", children: "\u2022" }), _jsx("span", { className: "text-sm text-gray-500", children: ticket.category })] }), _jsxs("div", { className: "flex items-center gap-2 text-xs text-gray-500", children: [_jsx(Clock, { size: 14 }), formatDistanceToNow(new Date(ticket.lastMessageAt), { addSuffix: true })] })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h3", { className: `text-base font-semibold group-hover:text-indigo-600 transition-colors ${ticket.status === 'open' ? 'text-gray-900' : 'text-gray-500'}`, children: ticket.subject }), _jsxs("div", { className: "flex items-center gap-3", children: [getPriorityBadge(ticket.priority), ticket.status === 'open' ? (_jsxs("span", { className: "flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full", children: [_jsx(AlertCircle, { size: 12 }), " Open"] })) : (_jsxs("span", { className: "flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full", children: [_jsx(CheckCircle2, { size: 12 }), " Closed"] })), _jsxs("span", { className: "text-xs text-gray-400 flex items-center gap-1", children: [_jsx(MessageSquare, { size: 12 }), " ", ticket.messageCount] })] })] })] }, ticket.id))) })), meta && meta.totalPages > 1 && (_jsxs("div", { className: "bg-gray-50 border-t border-gray-200 px-6 py-3 flex items-center justify-between", children: [_jsxs("div", { className: "text-xs text-gray-500", children: ["Page ", meta.page, " of ", meta.totalPages] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: "outline", disabled: meta.page <= 1, onClick: () => router.push(`?page=${meta.page - 1}`), className: "px-3 py-1 bg-white border rounded text-xs disabled:opacity-50 h-auto", "aria-label": "Go to previous page", children: "Prev" }), _jsx(Button, { variant: "outline", disabled: meta.page >= meta.totalPages, onClick: () => router.push(`?page=${meta.page + 1}`), className: "px-3 py-1 bg-white border rounded text-xs disabled:opacity-50 h-auto", "aria-label": "Go to next page", children: "Next" })] })] }))] })] }));
}
