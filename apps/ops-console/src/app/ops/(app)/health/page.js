"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { ShieldCheck, Server, Database, RefreshCw, Activity, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { Button } from "@vayva/ui";
export default function SystemHealthPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchHealth();
    }, []);
    const fetchHealth = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/ops/health");
            if (res.ok) {
                setData(await res.json());
            }
        }
        catch (error) {
            console.error("Health check failed", error);
        }
        finally {
            setLoading(false);
        }
    };
    const getStatusIcon = (status) => {
        if (status === "ok" || status === "up")
            return _jsx(CheckCircle2, { className: "text-green-500" });
        if (status === "degraded")
            return _jsx(AlertTriangle, { className: "text-yellow-500" });
        return _jsx(XCircle, { className: "text-red-500" });
    };
    return (_jsxs("div", { className: "p-8 max-w-4xl mx-auto space-y-8", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-3xl font-bold text-gray-900 flex items-center gap-2", children: [_jsx(ShieldCheck, { className: "text-indigo-600" }), "System Health"] }), _jsx("p", { className: "text-gray-500 mt-1", children: "Real-time infrastructure status" })] }), _jsx(Button, { variant: "outline", size: "icon", onClick: fetchHealth, className: "p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 h-10 w-10 flex items-center justify-center", "aria-label": "Refresh system health status", children: _jsx(RefreshCw, { className: loading ? "animate-spin" : "", size: 20 }) })] }), data && (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white border border-gray-200 rounded-xl p-6", children: [_jsxs("h2", { className: "text-lg font-bold mb-4 flex items-center gap-2", children: [_jsx(Activity, { size: 20, className: "text-indigo-500" }), "Platform Status"] }), _jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("span", { className: "text-2xl font-bold capitalize", children: data.status }), getStatusIcon(data.status)] }), _jsxs("p", { className: "text-xs text-gray-500", children: ["Last check: ", new Date(data.timestamp).toLocaleString()] }), _jsxs("p", { className: "text-xs text-gray-500", children: ["Service Uptime: ", Math.floor(data.uptime), "s"] })] }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-xl p-6", children: [_jsxs("h2", { className: "text-lg font-bold mb-4 flex items-center gap-2", children: [_jsx(Server, { size: 20, className: "text-blue-500" }), "Upstream Services"] }), _jsx("div", { className: "space-y-3", children: data.upstream && Object.entries(data.upstream).map(([service, status]) => (_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm font-medium capitalize text-gray-700", children: service }), _jsxs("div", { className: "flex items-center gap-2 text-sm", children: [getStatusIcon(status), _jsx("span", { className: "uppercase font-bold text-xs", children: status })] })] }, service))) })] }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-xl p-6 md:col-span-2", children: [_jsxs("h2", { className: "text-lg font-bold mb-4 flex items-center gap-2", children: [_jsx(Database, { size: 20, className: "text-purple-500" }), "Database & Events"] }), _jsxs("div", { className: "grid grid-cols-3 gap-6", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-gray-900", children: data.webhooks.received_24h }), _jsx("div", { className: "text-xs text-gray-500", children: "Webhooks (24h)" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-red-500", children: data.webhooks.failed_24h }), _jsx("div", { className: "text-xs text-gray-500", children: "Failures (24h)" })] }), _jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "text-2xl font-bold text-green-600", children: [data.webhooks.success_rate, "%"] }), _jsx("div", { className: "text-xs text-gray-500", children: "Success Rate" })] })] })] })] }))] }));
}
