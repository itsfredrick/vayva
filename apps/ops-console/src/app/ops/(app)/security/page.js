"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { ShieldCheck, AlertTriangle, Lock, RefreshCw, Terminal } from "lucide-react";
import { Button } from "@vayva/ui";
export default function SecurityPage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState("");
    useEffect(() => {
        fetchLogs();
    }, [filterType]);
    const fetchLogs = async () => {
        setLoading(true);
        try {
            const query = filterType ? `?type=${filterType}` : "";
            const res = await fetch(`/api/ops/security/logs${query}`);
            const json = await res.json();
            if (res.ok) {
                setEvents(json.data || []);
            }
        }
        catch (e) {
            console.error(e);
        }
        finally {
            setLoading(false);
        }
    };
    const getIcon = (type) => {
        if (type.includes("LOGIN"))
            return _jsx(Lock, { className: "w-4 h-4 text-blue-500" });
        if (type.includes("FAIL"))
            return _jsx(AlertTriangle, { className: "w-4 h-4 text-red-500" });
        if (type.includes("BATCH"))
            return _jsx(Terminal, { className: "w-4 h-4 text-purple-500" });
        return _jsx(ShieldCheck, { className: "w-4 h-4 text-gray-500" });
    };
    return (_jsxs("div", { className: "p-8 space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-3xl font-bold text-gray-900 flex items-center gap-3", children: [_jsx(ShieldCheck, { className: "w-8 h-8 text-emerald-600" }), "Security Operations"] }), _jsx("p", { className: "text-gray-500 mt-1", children: "Monitor platform access and sensitive actions." })] }), _jsx(Button, { variant: "ghost", size: "icon", onClick: fetchLogs, className: "rounded-full h-8 w-8", "aria-label": "Refresh security logs", children: _jsx(RefreshCw, { className: `w-5 h-5 text-gray-400 ${loading ? 'animate-spin' : ''}` }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "bg-white p-4 rounded-xl border border-gray-200 shadow-sm", children: [_jsx("div", { className: "text-sm text-gray-500 mb-1", children: "Failed Logins (24h)" }), _jsx("div", { className: "text-2xl font-bold text-gray-900", children: "0" })] }), _jsxs("div", { className: "bg-white p-4 rounded-xl border border-gray-200 shadow-sm", children: [_jsx("div", { className: "text-sm text-gray-500 mb-1", children: "Active Sessions" }), _jsx("div", { className: "text-2xl font-bold text-gray-900", children: "1" })] }), _jsxs("div", { className: "bg-white p-4 rounded-xl border border-gray-200 shadow-sm", children: [_jsx("div", { className: "text-sm text-gray-500 mb-1", children: "Admin Actions (24h)" }), _jsx("div", { className: "text-2xl font-bold text-gray-900", children: events.length })] })] }), _jsx("div", { className: "flex gap-2", children: ["", "OPS_LOGIN_SUCCESS", "OPS_LOGIN_FAILED", "OPS_BATCH_ACTION"].map(type => (_jsx(Button, { variant: filterType === type ? "primary" : "outline", onClick: () => setFilterType(type), className: `px-3 py-1.5 rounded-full text-xs font-medium transition-colors h-auto ${filterType === type
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`, "aria-label": `Filter by ${type || "all"} events`, children: type || "All Events" }, type))) }), _jsx("div", { className: "bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden", children: _jsxs("table", { className: "w-full text-left text-sm", children: [_jsx("thead", { className: "bg-gray-50 text-gray-500 font-medium border-b border-gray-100", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3", children: "Event" }), _jsx("th", { className: "px-6 py-3", children: "User" }), _jsx("th", { className: "px-6 py-3", children: "Details" }), _jsx("th", { className: "px-6 py-3 text-right", children: "Time" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-100", children: loading ? (_jsx("tr", { children: _jsx("td", { colSpan: 4, className: "p-12 text-center text-gray-400", children: "Loading logs..." }) })) : events.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 4, className: "p-12 text-center text-gray-400", children: "No security events found." }) })) : (events.map(e => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-6 py-4", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 bg-gray-50 rounded-lg", children: getIcon(e.eventType) }), _jsx("span", { className: "font-mono text-xs font-bold text-gray-700", children: e.eventType })] }) }), _jsx("td", { className: "px-6 py-4", children: e.opsUser ? (_jsxs("div", { children: [_jsx("div", { className: "font-medium text-gray-900", children: e.opsUser.name }), _jsx("div", { className: "text-xs text-gray-500", children: e.opsUser.role })] })) : (_jsx("div", { className: "text-gray-400 italic", children: "System / Unknown" })) }), _jsx("td", { className: "px-6 py-4", children: _jsxs("code", { className: "text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded", children: [JSON.stringify(e.metadata).slice(0, 60), JSON.stringify(e.metadata).length > 60 && "..."] }) }), _jsx("td", { className: "px-6 py-4 text-right text-gray-500 text-xs", children: formatDistanceToNow(new Date(e.createdAt), { addSuffix: true }) })] }, e.id)))) })] }) })] }));
}
