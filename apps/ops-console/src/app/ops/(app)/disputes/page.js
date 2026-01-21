"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle2, Clock, RefreshCw, Search, XCircle, Gavel } from "lucide-react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@vayva/ui";
export default function DisputesPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    // Filters
    const status = searchParams.get("status") || "OPENED";
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    useEffect(() => {
        fetchDisputes();
    }, [status]);
    const fetchDisputes = async () => {
        setLoading(true);
        const q = searchParams.get("q") || "";
        try {
            const res = await fetch(`/api/ops/financials/disputes?status=${status}${q ? `&q=${q}` : ""}`);
            const json = await res.json();
            if (res.ok) {
                setData(json.data || []);
            }
        }
        catch (e) {
            console.error(e);
        }
        finally {
            setLoading(false);
        }
    };
    const handleAction = async (id, action) => {
        if (!confirm(`Are you sure you want to ${action.replace(/_/g, " ")}?`))
            return;
        setActionLoading(id);
        try {
            const res = await fetch("/api/ops/financials/disputes", {
                method: "PATCH",
                body: JSON.stringify({ disputeId: id, action })
            });
            if (!res.ok)
                throw new Error("Action failed");
            toast.success("Dispute Updated");
            fetchDisputes();
        }
        catch (e) {
            toast.error("Failed to update dispute");
        }
        finally {
            setActionLoading(null);
        }
    };
    const getStatusBadge = (s) => {
        switch (s) {
            case "OPENED": return _jsxs("span", { className: "bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1", children: [_jsx(AlertTriangle, { className: "w-3 h-3" }), " Action Required"] });
            case "UNDER_REVIEW": return _jsxs("span", { className: "bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1", children: [_jsx(Clock, { className: "w-3 h-3" }), " Reviewing"] });
            case "WON": return _jsxs("span", { className: "bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1", children: [_jsx(CheckCircle2, { className: "w-3 h-3" }), " Won"] });
            case "LOST": return _jsxs("span", { className: "bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1", children: [_jsx(XCircle, { className: "w-3 h-3" }), " Lost"] });
            default: return _jsx("span", { className: "bg-gray-50 text-gray-500 px-2 py-0.5 rounded text-xs font-bold", children: s });
        }
    };
    return (_jsxs("div", { className: "p-8 space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-3xl font-bold text-gray-900 flex items-center gap-3", children: [_jsx(Gavel, { className: "w-8 h-8 text-indigo-600" }), "Disputes & Chargebacks"] }), _jsx("p", { className: "text-gray-500 mt-1", children: "Manage financial disputes and evidence submission." })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" }), _jsx("input", { placeholder: "Search disputes...", className: "pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64", defaultValue: searchParams.get("q") || "", onChange: (e) => {
                                            const q = e.target.value;
                                            const params = new URLSearchParams(window.location.search);
                                            if (q)
                                                params.set("q", q);
                                            else
                                                params.delete("q");
                                            router.push(`?${params.toString()}`);
                                        } })] }), _jsx(Button, { variant: "ghost", size: "icon", onClick: fetchDisputes, className: "rounded-full h-10 w-10 flex items-center justify-center", "aria-label": "Refresh disputes list", children: _jsx(RefreshCw, { className: `w-5 h-5 text-gray-400 ${loading ? 'animate-spin' : ''}` }) })] })] }), _jsx("div", { className: "flex gap-2 border-b border-gray-200", children: ["OPENED", "UNDER_REVIEW", "WON", "LOST"].map(s => (_jsx(Button, { variant: "ghost", onClick: () => router.push(`?status=${s}`), className: `px-4 py-2 text-sm font-medium border-b-2 rounded-none transition-colors h-auto ${status === s ? "border-indigo-600 text-indigo-600 bg-transparent hover:bg-transparent" : "border-transparent text-gray-500 hover:text-gray-700 bg-transparent hover:bg-transparent"}`, "aria-label": `Filter by ${s.replace("_", " ")} status`, children: s.replace("_", " ") }, s))) }), _jsx("div", { className: "bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden", children: _jsxs("table", { className: "w-full text-left text-sm", children: [_jsx("thead", { className: "bg-gray-50 text-gray-500 font-medium", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-4", children: "Dispute / Date" }), _jsx("th", { className: "px-6 py-4", children: "Amount" }), _jsx("th", { className: "px-6 py-4", children: "Reason" }), _jsx("th", { className: "px-6 py-4", children: "Merchant" }), _jsx("th", { className: "px-6 py-4", children: "Status" }), _jsx("th", { className: "px-6 py-4 text-right", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-100", children: loading ? (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "p-12 text-center text-gray-400", children: "Loading disputes..." }) })) : data.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "p-12 text-center text-gray-400", children: "No disputes found in this category." }) })) : (data.map(d => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsxs("td", { className: "px-6 py-4", children: [_jsxs("div", { className: "font-mono text-xs text-gray-500", children: [d.id.slice(0, 8), "..."] }), _jsx("div", { className: "text-xs text-gray-400 mt-1", children: new Date(d.createdAt).toLocaleDateString() })] }), _jsxs("td", { className: "px-6 py-4 font-bold text-gray-900", children: [d.currency, " ", d.amount] }), _jsx("td", { className: "px-6 py-4 text-gray-600", children: d.reasonCode || "General" }), _jsxs("td", { className: "px-6 py-4", children: [_jsx("div", { className: "font-medium text-gray-900", children: d.store?.name }), _jsx("div", { className: "text-xs text-indigo-600", children: d.order?.orderNumber })] }), _jsx("td", { className: "px-6 py-4", children: getStatusBadge(d.status) }), _jsx("td", { className: "px-6 py-4 text-right", children: (d.status === "OPENED" || d.status === "UNDER_REVIEW") && (_jsxs("div", { className: "flex justify-end gap-2 flex-wrap", children: [d.status === "OPENED" && (_jsxs(_Fragment, { children: [_jsx(Button, { variant: "destructive", size: "sm", onClick: () => handleAction(d.id, "ACCEPT_LIABILITY"), disabled: !!actionLoading, className: "h-8 px-3 text-xs font-bold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 shadow-none h-auto", "aria-label": `Accept liability for dispute ${d.id}`, children: "Accept Liability" }), _jsx(Button, { variant: "primary", size: "sm", onClick: () => handleAction(d.id, "SUBMIT_EVIDENCE_MOCK"), disabled: !!actionLoading, className: "h-8 px-3 text-xs font-bold whitespace-nowrap h-auto", "aria-label": `Submit evidence for dispute ${d.id}`, children: "Submit Evidence" })] })), _jsx(Button, { variant: "secondary", size: "sm", onClick: () => handleAction(d.id, "REFUND"), disabled: !!actionLoading, className: "h-8 px-3 text-xs font-bold bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-100 h-auto", "aria-label": `Refund dispute ${d.id}`, children: "Refund" }), _jsx(Button, { variant: "secondary", size: "sm", onClick: () => handleAction(d.id, "MARK_WON"), disabled: !!actionLoading, className: "h-8 px-3 text-xs font-bold bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 h-auto", "aria-label": `Force win dispute ${d.id}`, children: "Force Win" })] })) })] }, d.id)))) })] }) })] }));
}
