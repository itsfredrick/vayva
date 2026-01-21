"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useOpsQuery } from "@/hooks/useOpsQuery";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@vayva/ui";
import { CheckCircle2, XCircle, FileSignature } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
export default function ApprovalsPage() {
    const [tab, setTab] = useState("PENDING");
    const router = useRouter();
    const searchParams = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1");
    const { data: result, isLoading, refetch } = useOpsQuery(["approvals-list", tab, page.toString()], () => fetch(`/api/ops/approvals?status=${tab}&page=${page}&limit=20`).then(res => res.json()));
    const [processingId, setProcessingId] = useState(null);
    const handleDecision = async (id, decision) => {
        if (!confirm(`Are you sure you want to ${decision} this request?`))
            return;
        setProcessingId(id);
        try {
            const res = await fetch(`/api/ops/approvals/${id}/decision`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ decision, reason: "Admin Action via Ops Console" }),
            });
            if (res.ok) {
                toast.success(`Request ${decision}`);
                refetch();
            }
            else {
                toast.error("Action failed");
            }
        }
        catch (e) {
            toast.error("Network error");
        }
        finally {
            setProcessingId(null);
        }
    };
    const handlePageChange = (newPage) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", newPage.toString());
        router.push(`?${params.toString()}`);
    };
    const approvals = result?.data || [];
    const meta = result?.meta;
    if (isLoading) {
        return (_jsxs("div", { className: "p-8 max-w-6xl mx-auto space-y-6 animate-pulse", children: [_jsx("div", { className: "h-8 w-48 bg-gray-200 rounded" }), _jsx("div", { className: "space-y-4", children: [1, 2, 3].map(i => _jsx("div", { className: "h-20 bg-gray-100 rounded-xl" }, i)) })] }));
    }
    return (_jsxs("div", { className: "p-8 max-w-6xl mx-auto space-y-8", children: [_jsxs("div", { className: "flex flex-col gap-6", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-3 bg-amber-100 rounded-xl text-amber-700", children: _jsx(FileSignature, { size: 24 }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Approval Requests" }), _jsx("p", { className: "text-sm text-gray-500", children: "Review and authorize sensitive actions." })] })] }) }), _jsxs("div", { className: "flex gap-2 border-b border-gray-200", children: [_jsx(Button, { variant: "ghost", onClick: () => { setTab("PENDING"); handlePageChange(1); }, className: `px-4 py-2 text-sm font-medium border-b-2 rounded-none transition-colors h-auto ${tab === "PENDING" ? "border-amber-500 text-amber-700 bg-amber-50" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`, "aria-label": "Show pending review requests", children: "Pending Review" }), _jsx(Button, { variant: "ghost", onClick: () => { setTab("HISTORY"); handlePageChange(1); }, className: `px-4 py-2 text-sm font-medium border-b-2 rounded-none transition-colors h-auto ${tab === "HISTORY" ? "border-indigo-500 text-indigo-700 bg-indigo-50" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`, "aria-label": "Show approval history log", children: "History Log" })] })] }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm", children: [_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-left text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-gray-50 text-gray-500 border-b border-gray-100", children: [_jsx("th", { className: "px-6 py-3 font-medium", children: "Request Type" }), _jsx("th", { className: "px-6 py-3 font-medium", children: "Merchant" }), _jsx("th", { className: "px-6 py-3 font-medium", children: "Summary" }), _jsx("th", { className: "px-6 py-3 font-medium", children: "Date" }), _jsx("th", { className: "px-6 py-3 font-medium text-right", children: "Actions" })] }) }), _jsxs("tbody", { className: "divide-y divide-gray-100", children: [approvals.length === 0 && (_jsx("tr", { children: _jsxs("td", { colSpan: 5, className: "px-6 py-12 text-center text-gray-400 flex flex-col items-center", children: [_jsx(CheckCircle2, { className: "h-10 w-10 text-gray-200 mb-2" }), _jsx("p", { children: "No pending approvals." })] }) })), approvals.map((req) => (_jsxs("tr", { className: "hover:bg-gray-50 transition-colors", children: [_jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800", children: req.actionType || "GENERAL" }) }), _jsx("td", { className: "px-6 py-4 font-medium text-gray-900", children: req.store?.name || "Unknown Store" }), _jsx("td", { className: "px-6 py-4 text-gray-600 max-w-xs truncate", title: req.summary, children: req.summary || "No summary provided" }), _jsx("td", { className: "px-6 py-4 text-gray-500 whitespace-nowrap", children: new Date(req.createdAt).toLocaleDateString() }), _jsx("td", { className: "px-6 py-4 text-right", children: tab === "PENDING" ? (_jsxs("div", { className: "flex items-center justify-end gap-2", children: [_jsx(Button, { variant: "ghost", size: "icon", onClick: () => handleDecision(req.id, "REJECTED"), disabled: !!processingId, className: "text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 h-8 w-8", "aria-label": `Reject request for ${req.actionType}`, title: "Reject", children: _jsx(XCircle, { size: 18 }) }), _jsxs(Button, { onClick: () => handleDecision(req.id, "APPROVED"), disabled: !!processingId, className: "px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1 h-auto", "aria-label": `Approve request for ${req.actionType}`, children: [_jsx(CheckCircle2, { size: 14 }), "Approve"] })] })) : (_jsx("span", { className: `px-2 py-1 rounded text-xs font-bold ${req.status === "APPROVED" ? "bg-green-100 text-green-700" :
                                                            req.status === "REJECTED" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`, children: req.status })) })] }, req.id)))] })] }) }), meta && (_jsxs("div", { className: "bg-gray-50 border-t border-gray-200 px-6 py-3 flex items-center justify-between", children: [_jsxs("div", { className: "text-xs text-gray-500", children: ["Showing ", _jsx("span", { className: "font-medium", children: (meta.page - 1) * meta.limit + 1 }), " to ", _jsx("span", { className: "font-medium", children: Math.min(meta.page * meta.limit, meta.total) }), " of ", _jsx("span", { className: "font-medium", children: meta.total }), " results"] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: "outline", onClick: () => handlePageChange(meta.page - 1), disabled: meta.page <= 1, className: "px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-600 hover:bg-white disabled:opacity-50 h-auto", "aria-label": "Go to previous page", children: "Previous" }), _jsx(Button, { variant: "outline", onClick: () => handlePageChange(meta.page + 1), disabled: meta.page >= meta.totalPages, className: "px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-600 hover:bg-white disabled:opacity-50 h-auto", "aria-label": "Go to next page", children: "Next" })] })] }))] })] }));
}
