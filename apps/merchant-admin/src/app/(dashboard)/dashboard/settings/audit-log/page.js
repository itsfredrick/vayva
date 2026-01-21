"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Search, Info, Loader2, X } from "lucide-react";
import { Button, Input } from "@vayva/ui";
export default function AuditLogPage() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLog, setSelectedLog] = useState(null);
    const [nextCursor, setNextCursor] = useState(null);
    // Simple filter (client-side concept for now, can extend to API params)
    const [searchTerm, setSearchTerm] = useState("");
    const fetchLogs = async (reset = false) => {
        setLoading(true);
        try {
            const cursorParam = reset
                ? ""
                : nextCursor
                    ? `&limit=50&cursor=${nextCursor}`
                    : "&limit=50";
            const res = await fetch(`/api/merchant/audit?${cursorParam}`);
            if (res.ok) {
                const data = await res.json();
                if (reset) {
                    setLogs(data.items);
                }
                else {
                    setLogs((prev) => [...prev, ...data.items]);
                }
                setNextCursor(data.next_cursor);
            }
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchLogs(true);
    }, []);
    // Filter in memory for V1 simplicity if list is small, otherwise pass to API
    const filteredLogs = logs.filter((log) => log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.actorLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.entityType?.toLowerCase().includes(searchTerm.toLowerCase()));
    return (_jsxs("div", { className: "max-w-6xl mx-auto p-6 space-y-6", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-semibold text-gray-900", children: "Audit Log" }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: "Track system events and user actions." })] }), _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" }), _jsx(Input, { type: "text", placeholder: "Search action or user...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-white/50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none w-64" })] })] }), _jsxs("div", { className: "bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-sm overflow-hidden", children: [_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-left text-sm", children: [_jsx("thead", { className: "bg-gray-50/50 border-b border-gray-100", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 font-medium text-gray-500", children: "Time" }), _jsx("th", { className: "px-6 py-3 font-medium text-gray-500", children: "Actor" }), _jsx("th", { className: "px-6 py-3 font-medium text-gray-500", children: "Action" }), _jsx("th", { className: "px-6 py-3 font-medium text-gray-500", children: "Entity" }), _jsx("th", { className: "px-6 py-3 font-medium text-gray-500 text-right", children: "Details" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-50", children: loading && logs.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: "py-12 text-center", children: _jsx(Loader2, { className: "w-6 h-6 text-indigo-600 animate-spin mx-auto" }) }) })) : filteredLogs.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: "py-12 text-center text-gray-500", children: "No audit logs found." }) })) : (filteredLogs.map((log) => (_jsxs("tr", { className: "hover:bg-gray-50/50 transition-colors", children: [_jsx("td", { className: "px-6 py-3 text-gray-500 whitespace-nowrap", children: format(new Date(log.createdAt), "MMM d, HH:mm:ss") }), _jsx("td", { className: "px-6 py-3 font-medium text-gray-900", children: log.actorLabel }), _jsx("td", { className: "px-6 py-3", children: _jsx("span", { className: "inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-xs font-medium text-gray-700 font-mono", children: log.action }) }), _jsx("td", { className: "px-6 py-3 text-gray-600", children: log.entityType && (_jsx("span", { className: "text-xs uppercase tracking-wider text-gray-400 mr-2", children: log.entityType })) }), _jsx("td", { className: "px-6 py-3 text-right", children: _jsx(Button, { variant: "ghost", size: "icon", onClick: () => setSelectedLog(log), className: "text-gray-400 hover:text-indigo-600 transition-colors h-8 w-8", children: _jsx(Info, { className: "w-4 h-4" }) }) })] }, log.id)))) })] }) }), nextCursor && (_jsx("div", { className: "p-4 border-t border-gray-100 text-center", children: _jsx(Button, { variant: "ghost", onClick: () => fetchLogs(false), disabled: loading, className: "text-sm text-indigo-600 hover:text-indigo-800 font-medium hover:bg-indigo-50", children: loading ? "Loading..." : "Load More" }) }))] }), selectedLog && (_jsx("div", { className: "fixed inset-0 z-50 flex justify-end bg-black/20 backdrop-blur-sm", onClick: () => setSelectedLog(null), children: _jsxs("div", { className: "w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "Log Details" }), _jsx(Button, { variant: "ghost", size: "icon", onClick: () => setSelectedLog(null), className: "text-gray-400 hover:text-gray-900 h-8 w-8", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Correlation ID" }), _jsx("p", { className: "mt-1 font-mono text-xs text-gray-700 bg-gray-50 p-2 rounded select-all", children: selectedLog.correlationId })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Type" }), _jsx("p", { className: "mt-1 text-sm font-medium text-gray-900", children: selectedLog.action })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actor" }), _jsx("p", { className: "mt-1 text-sm font-medium text-gray-900", children: selectedLog.actorLabel })] })] }), selectedLog.beforeState && (_jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block", children: "Before State" }), _jsx("pre", { className: "bg-gray-900 text-gray-100 p-3 rounded-lg text-xs overflow-x-auto font-mono", children: JSON.stringify(selectedLog.beforeState, null, 2) })] })), selectedLog.afterState && (_jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block", children: "After State" }), _jsx("pre", { className: "bg-gray-900 text-gray-100 p-3 rounded-lg text-xs overflow-x-auto font-mono", children: JSON.stringify(selectedLog.afterState, null, 2) })] }))] })] }) }))] }));
}
