"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { OpsShell } from "@/components/OpsShell";
import { useOpsQuery } from "@/hooks/useOpsQuery";
import { Activity, Database, Server, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Button } from "@vayva/ui";
export default function HealthPage() {
    const { data, isLoading: loading, error, refetch: refresh } = useOpsQuery(["system-health"], () => fetch("/api/ops/tools/health").then(res => res.json()));
    const [refreshing, setRefreshing] = useState(false);
    const handleRefresh = async () => {
        setRefreshing(true);
        await refresh();
        setTimeout(() => setRefreshing(false), 500);
    };
    const StatusBadge = ({ status }) => {
        const isHealthy = status === "healthy";
        return (_jsxs("span", { className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${isHealthy
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-700 border-red-200"}`, children: [isHealthy ? _jsx(CheckCircle2, { size: 12 }) : _jsx(AlertTriangle, { size: 12 }), status?.toUpperCase() || "UNKNOWN"] }));
    };
    return (_jsx(OpsShell, { children: _jsxs("div", { className: "max-w-4xl mx-auto space-y-6", children: [_jsxs("div", { className: "bg-white border border-gray-200 rounded-xl p-6 flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs("h2", { className: "text-lg font-semibold text-gray-900 flex items-center gap-2", children: [_jsx(Activity, { className: "text-indigo-600", size: 20 }), "Platform Status"] }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: "Real-time monitoring of critical infrastructure." })] }), _jsxs("div", { className: "flex items-center gap-4", children: [data && _jsx(StatusBadge, { status: data.status }), _jsx(Button, { variant: "ghost", size: "icon", onClick: handleRefresh, className: "text-gray-400 hover:text-indigo-600 hover:bg-gray-50", children: _jsx(RefreshCw, { size: 18, className: refreshing || loading ? "animate-spin" : "" }) })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "bg-white border border-gray-200 rounded-xl p-6", children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsx("div", { className: "p-2 bg-blue-50 rounded-lg text-blue-600", children: _jsx(Database, { size: 20 }) }), data && _jsx(StatusBadge, { status: data.checks?.database?.status })] }), _jsx("h3", { className: "text-sm font-medium text-gray-900", children: "Primary Database" }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "AWS RDS (Postgres)" }), _jsxs("div", { className: "mt-6 flex items-center justify-between text-sm", children: [_jsx("span", { className: "text-gray-500", children: "Latency" }), _jsx("span", { className: "font-mono font-medium text-gray-900", children: data?.checks?.database?.latency || "--" })] })] }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-xl p-6", children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsx("div", { className: "p-2 bg-purple-50 rounded-lg text-purple-600", children: _jsx(Server, { size: 20 }) }), data && _jsx(StatusBadge, { status: data.checks?.external_apis?.status })] }), _jsx("h3", { className: "text-sm font-medium text-gray-900", children: "External Gateways" }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Paystack, Resend" }), _jsxs("div", { className: "mt-6 flex items-center justify-between text-sm", children: [_jsx("span", { className: "text-gray-500", children: "Status" }), _jsx("span", { className: "font-medium text-gray-900", children: "Operational" })] })] })] }), _jsxs("div", { className: "bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-500 font-mono", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Check Timestamp:" }), _jsx("span", { children: data?.timestamp || "Loading..." })] }), _jsxs("div", { className: "flex justify-between mt-1", children: [_jsx("span", { children: "System Uptime:" }), _jsx("span", { children: data?.uptime ? `${Math.floor(data.uptime / 60)} minutes` : "--" })] })] })] }) }));
}
