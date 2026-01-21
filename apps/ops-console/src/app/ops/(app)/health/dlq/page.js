"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { RefreshCw, Play, ShieldAlert } from "lucide-react";
import { useOpsQuery } from "@/hooks/useOpsQuery";
import { toast } from "sonner";
import { cn, Button } from "@vayva/ui";
export default function DLQPage() {
    const [filter, setFilter] = useState("DEAD");
    const { data: entries, isLoading, refetch } = useOpsQuery(["dlq-entries", filter], () => fetch(`/api/ops/health/dlq?status=${filter}`).then(res => res.json().then(j => j.data)));
    const handleReplay = async (id) => {
        try {
            const res = await fetch(`/api/ops/health/dlq/${id}/replay`, { method: "POST" });
            if (res.ok) {
                toast.success("Job replay initiated");
                refetch();
            }
            else {
                toast.error("Failed to initiate replay");
            }
        }
        catch (e) {
            toast.error("An error occurred");
        }
    };
    return (_jsxs("div", { className: "p-8 space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-3xl font-bold text-gray-900 flex items-center gap-3", children: [_jsx(ShieldAlert, { className: "w-8 h-8 text-red-600" }), "Dead Letter Queue"] }), _jsx("p", { className: "text-gray-500 mt-1", children: "Manage and replay failed background jobs." })] }), _jsx(Button, { onClick: () => refetch(), variant: "ghost", size: "icon", className: "w-10 h-10 hover:bg-gray-100 rounded-full", "aria-label": "Refresh Dead Letter Queue", children: _jsx(RefreshCw, { className: cn("w-5 h-5 text-gray-500", isLoading && "animate-spin") }) })] }), _jsx("div", { className: "flex gap-2 border-b border-gray-200 pb-2", children: ["DEAD", "REPLAYING", "REPLAYED", "ALL"].map(s => (_jsx(Button, { onClick: () => setFilter(s), variant: "ghost", className: cn("px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-2 rounded-none hover:bg-transparent h-auto", filter === s ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"), children: s }, s))) }), _jsx("div", { className: "bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden", children: _jsxs("table", { className: "w-full text-left text-sm", children: [_jsx("thead", { className: "bg-gray-50 text-gray-500 border-b border-gray-100", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 font-medium", children: "Job Type" }), _jsx("th", { className: "px-6 py-3 font-medium", children: "Error" }), _jsx("th", { className: "px-6 py-3 font-medium", children: "Time Failed" }), _jsx("th", { className: "px-6 py-3 font-medium", children: "Status" }), _jsx("th", { className: "px-6 py-3 font-medium text-right", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-100", children: isLoading ? (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: "p-12 text-center text-gray-400", children: "Loading DLQ..." }) })) : !entries?.length ? (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: "p-12 text-center text-gray-400", children: "Queue is empty." }) })) : (entries.map((e) => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsxs("td", { className: "px-6 py-4", children: [_jsx("div", { className: "font-medium text-gray-900", children: e.jobType }), _jsxs("div", { className: "text-[10px] text-gray-400 font-mono", children: ["#", e.id.slice(0, 8)] })] }), _jsx("td", { className: "px-6 py-4", children: _jsx("div", { className: "text-red-600 max-w-xs truncate", title: e.lastError, children: e.lastError }) }), _jsx("td", { className: "px-6 py-4 text-gray-500", children: new Date(e.failedAt).toLocaleString() }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: cn("px-2 py-0.5 rounded text-[10px] font-bold", e.status === "DEAD" ? "bg-red-100 text-red-700" :
                                                e.status === "REPLAYING" ? "bg-blue-100 text-blue-700" :
                                                    "bg-green-100 text-green-700"), children: e.status }) }), _jsx("td", { className: "px-6 py-4 text-right", children: e.status === "DEAD" && (_jsx(Button, { onClick: () => handleReplay(e.id), variant: "ghost", size: "icon", className: "h-8 w-8 text-indigo-600 hover:bg-indigo-50 rounded", title: "Replay Job", children: _jsx(Play, { size: 16, fill: "currentColor" }) })) })] }, e.id)))) })] }) })] }));
}
