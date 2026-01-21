"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ShieldAlert, Monitor, Smartphone, Trash2, RefreshCw } from "lucide-react";
import { useOpsQuery } from "@/hooks/useOpsQuery";
import { toast } from "sonner";
import { Button } from "@vayva/ui";
export default function SessionManagerPage() {
    const { data: sessions, isLoading, refetch } = useOpsQuery(["active-sessions"], () => fetch("/api/ops/security/sessions").then(res => res.json().then(j => j.data)));
    const handleRevoke = async (id, email) => {
        if (!confirm(`Revoke session for ${email}? User will be logged out.`))
            return;
        try {
            const res = await fetch(`/api/ops/security/sessions/${id}/revoke`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Session revoked");
                refetch();
            }
            else {
                toast.error("Failed to revoke");
            }
        }
        catch (e) {
            toast.error("Error revoking session");
        }
    };
    return (_jsxs("div", { className: "p-8 space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-3xl font-bold text-gray-900 flex items-center gap-3", children: [_jsx(ShieldAlert, { className: "w-8 h-8 text-indigo-600" }), "Identity & Session Manager"] }), _jsx("p", { className: "text-gray-500 mt-1", children: "Review and revoke active merchant sessions." })] }), _jsx(Button, { variant: "ghost", size: "icon", onClick: () => refetch(), className: "rounded-full", children: _jsx(RefreshCw, { className: `w-5 h-5 text-gray-500 ${isLoading ? 'animate-spin' : ''}` }) })] }), _jsx("div", { className: "bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden", children: _jsxs("table", { className: "w-full text-left text-sm", children: [_jsx("thead", { className: "bg-gray-50 text-gray-500 border-b border-gray-100", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 font-medium", children: "User" }), _jsx("th", { className: "px-6 py-3 font-medium", children: "Device / IP" }), _jsx("th", { className: "px-6 py-3 font-medium", children: "Created" }), _jsx("th", { className: "px-6 py-3 font-medium", children: "Expires" }), _jsx("th", { className: "px-6 py-3 font-medium", children: "Action" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-100", children: isLoading ? (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: "p-12 text-center text-gray-400", children: "Loading sessions..." }) })) : !sessions?.length ? (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: "p-12 text-center text-gray-400", children: "No active sessions found." }) })) : (sessions.map((s) => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsxs("td", { className: "px-6 py-4", children: [_jsx("div", { className: "font-medium text-gray-900", children: s.User?.email }), _jsxs("div", { className: "text-xs text-gray-500", children: [s.User?.firstName, " ", s.User?.lastName] })] }), _jsxs("td", { className: "px-6 py-4", children: [_jsxs("div", { className: "flex items-center gap-2 text-gray-700", children: [s.device?.toLowerCase().includes("mobile") ? _jsx(Smartphone, { size: 14 }) : _jsx(Monitor, { size: 14 }), _jsx("span", { className: "truncate max-w-[150px]", title: s.device, children: s.device || "Unknown Device" })] }), _jsx("div", { className: "text-xs text-gray-400 font-mono mt-0.5", children: s.ipAddress || "0.0.0.0" })] }), _jsx("td", { className: "px-6 py-4 text-gray-500 text-xs", children: new Date(s.createdAt).toLocaleString() }), _jsx("td", { className: "px-6 py-4 text-gray-500 text-xs", children: new Date(s.expiresAt).toLocaleString() }), _jsx("td", { className: "px-6 py-4", children: _jsx(Button, { variant: "ghost", size: "icon", onClick: () => handleRevoke(s.id, s.User?.email), className: "text-red-600 hover:text-red-800 hover:bg-red-50", title: "Revoke Session", children: _jsx(Trash2, { size: 16 }) }) })] }, s.id)))) })] }) })] }));
}
