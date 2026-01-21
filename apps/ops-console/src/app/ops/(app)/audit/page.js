"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, RefreshCw, Activity, Calendar, Eye, X } from "lucide-react";
import { Button } from "@vayva/ui";
export default function AuditLogsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1");
    const eventType = searchParams.get("eventType") || "";
    const actor = searchParams.get("actor") || "";
    const [searchInput, setSearchInput] = useState(actor);
    const [data, setData] = useState([]);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    useEffect(() => {
        fetchLogs();
    }, [page, eventType, actor]);
    const fetchLogs = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams({
                page: page.toString(),
                limit: "20",
                ...(eventType && { eventType }),
                ...(actor && { actor }),
            });
            const res = await fetch(`/api/ops/audit?${query}`);
            if (res.status === 401) {
                window.location.href = "/ops/login";
                return;
            }
            if (!res.ok)
                throw new Error("Failed to fetch logs");
            const result = await res.json();
            setData(result.data || []);
            setMeta(result.meta || null);
        }
        catch (error) {
            console.error("Failed to fetch logs:", error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams);
        if (searchInput) {
            params.set("actor", searchInput);
        }
        else {
            params.delete("actor");
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
    // Helper to extract target info from metadata
    const getTargetInfo = (metadata) => {
        if (!metadata)
            return "—";
        // Common patterns
        if (metadata.targetType && metadata.storeName) {
            return `${metadata.targetType}: ${metadata.storeName}`;
        }
        if (metadata.targetType && metadata.targetId) {
            return `${metadata.targetType}: ${metadata.targetId.substring(0, 8)}...`;
        }
        if (metadata.fileName)
            return `File: ${metadata.fileName}`;
        if (metadata.reportType)
            return `Report: ${metadata.reportType}`;
        return "—";
    };
    return (_jsxs("div", { className: "p-8 space-y-6 relative", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Audit Log" }), _jsx("p", { className: "text-gray-500 mt-1", children: "System-wide governance trail" })] }), _jsx("div", { className: "text-sm text-gray-500", children: meta && `${meta.total} events logged` })] }), _jsxs("div", { className: "bg-white p-4 rounded-xl border border-gray-200 space-y-4", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("form", { onSubmit: handleSearch, className: "flex-1 relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400", size: 18 }), _jsx("input", { type: "text", placeholder: "Search by actor name or email...", className: "w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500", value: searchInput, onChange: (e) => setSearchInput(e.target.value) })] }), _jsxs(Button, { variant: "outline", onClick: () => setShowFilters(!showFilters), className: `px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors flex items-center gap-2 h-auto ${showFilters || eventType
                                    ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"}`, "aria-label": showFilters ? "Hide filters" : "Show filters", children: [_jsx(Filter, { className: "h-4 w-4" }), "Filters", eventType && (_jsx("span", { className: "bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center", children: "1" }))] }), _jsxs(Button, { variant: "outline", onClick: fetchLogs, className: "px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 h-auto", "aria-label": "Refresh audit trail", children: [_jsx(RefreshCw, { className: "h-4 w-4" }), "Refresh"] })] }), showFilters && (_jsxs("div", { className: "pt-4 border-t border-gray-200", children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-2", children: "Event Type" }), _jsxs("select", { value: eventType, onChange: (e) => handleFilterChange("eventType", e.target.value), className: "w-full max-w-xs px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500", "aria-label": "Filter by event type", children: [_jsx("option", { value: "", children: "All Events" }), _jsx("option", { value: "LOGIN", children: "Login" }), _jsx("option", { value: "DISABLE_PAYOUTS", children: "Disable Payouts" }), _jsx("option", { value: "ENABLE_PAYOUTS", children: "Enable Payouts" }), _jsx("option", { value: "FORCE_KYC_REVIEW", children: "Force KYC Review" }), _jsx("option", { value: "SUSPEND_ACCOUNT", children: "Suspend Account" }), _jsx("option", { value: "WEBHOOK_REPLAY", children: "Webhook Replay" }), _jsx("option", { value: "TICKET_UPDATE", children: "Ticket Update" }), _jsx("option", { value: "DATA_EXPORT", children: "Data Export" })] })] }))] }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden", children: [_jsxs("table", { className: "w-full text-left text-sm", children: [_jsx("thead", { className: "bg-gray-50 border-b border-gray-200 text-gray-600 font-medium", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3", children: "Timestamp" }), _jsx("th", { className: "px-6 py-3", children: "Actor" }), _jsx("th", { className: "px-6 py-3", children: "Action" }), _jsx("th", { className: "px-6 py-3", children: "Target / Context" }), _jsx("th", { className: "px-6 py-3 text-right", children: "Details" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-100", children: loading ? (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: "px-6 py-12 text-center", children: _jsxs("div", { className: "flex items-center justify-center gap-2 text-gray-400", children: [_jsx("div", { className: "h-4 w-4 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin" }), "Loading audit trail..."] }) }) })) : data.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: "px-6 py-12 text-center text-gray-400", children: "No audit events found" }) })) : (data.map((event) => (_jsxs("tr", { className: "hover:bg-gray-50 group transition-colors", children: [_jsx("td", { className: "px-6 py-4 text-gray-500 whitespace-nowrap", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Calendar, { size: 14 }), new Date(event.createdAt).toLocaleString()] }) }), _jsx("td", { className: "px-6 py-4", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold", children: event.actor.name[0] }), _jsxs("div", { children: [_jsx("div", { className: "font-medium text-gray-900", children: event.actor.name }), _jsx("div", { className: "text-xs text-gray-500", children: event.actor.role })] })] }) }), _jsx("td", { className: "px-6 py-4", children: _jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200", children: [_jsx(Activity, { size: 12 }), event.eventType] }) }), _jsx("td", { className: "px-6 py-4 text-gray-600", children: getTargetInfo(event.metadata) }), _jsx("td", { className: "px-6 py-4 text-right", children: _jsx(Button, { variant: "ghost", size: "icon", onClick: () => setSelectedEvent(event), className: "text-gray-400 hover:text-indigo-600 transition-colors h-8 w-8", "aria-label": `View details for event ${event.eventType}`, children: _jsx(Eye, { size: 18 }) }) })] }, event.id)))) })] }), meta && (_jsxs("div", { className: "bg-gray-50 border-t border-gray-200 px-6 py-3 flex items-center justify-between", children: [_jsxs("div", { className: "text-xs text-gray-500", children: ["Page ", meta.page, " of ", meta.totalPages] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: "outline", disabled: meta.page <= 1, onClick: () => handlePageChange(meta.page - 1), className: "px-3 py-1 bg-white border rounded text-xs disabled:opacity-50 h-auto", "aria-label": "Go to previous page", children: "Prev" }), _jsx(Button, { variant: "outline", disabled: meta.page >= meta.totalPages, onClick: () => handlePageChange(meta.page + 1), className: "px-3 py-1 bg-white border rounded text-xs disabled:opacity-50 h-auto", "aria-label": "Go to next page", children: "Next" })] })] }))] }), selectedEvent && (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm", children: _jsxs("div", { className: "bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden", children: [_jsxs("div", { className: "px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50", children: [_jsxs("div", { children: [_jsxs("h3", { className: "text-lg font-bold text-gray-900 flex items-center gap-2", children: ["Event Details", _jsx("span", { className: "text-sm font-normal text-gray-500 font-mono", children: selectedEvent.id })] }), _jsxs("div", { className: "text-xs text-gray-500 mt-1", children: [new Date(selectedEvent.createdAt).toLocaleString(), " \u2022 ", selectedEvent.eventType] })] }), _jsx(Button, { variant: "ghost", size: "icon", onClick: () => setSelectedEvent(null), className: "p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors h-8 w-8", "aria-label": "Close event details modal", children: _jsx(X, { size: 20 }) })] }), _jsx("div", { className: "flex-1 overflow-auto p-0", children: _jsx("div", { className: "bg-gray-900 p-6 min-h-full", children: _jsx("pre", { className: "text-sm font-mono text-green-400 whitespace-pre-wrap", children: JSON.stringify({
                                        ...selectedEvent,
                                        metadata: selectedEvent.metadata // Ensure consistent order if needed
                                    }, null, 2) }) }) }), _jsx("div", { className: "px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end", children: _jsx(Button, { variant: "outline", onClick: () => setSelectedEvent(null), className: "px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 h-auto", "aria-label": "Close event details modal", children: "Close" }) })] }) }))] }));
}
