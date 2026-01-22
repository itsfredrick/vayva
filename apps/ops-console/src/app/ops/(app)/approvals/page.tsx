"use client";

import { useOpsQuery } from "@/hooks/useOpsQuery";
import { OpsShell } from "@/components/OpsShell";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@vayva/ui";
import {
    CheckCircle2,
    XCircle,
    Clock,
    AlertCircle,
    FileSignature
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ApprovalsPage() {
    const [tab, setTab] = useState<"PENDING" | "HISTORY">("PENDING");
    const router = useRouter();
    const searchParams = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1");

    const { data: result, isLoading, refetch } = useOpsQuery(
        ["approvals-list", tab, page.toString()],
        () => fetch(`/api/ops/approvals?status=${tab}&page=${page}&limit=20`).then(res => res.json())
    );

    const [processingId, setProcessingId] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [batchProcessing, setBatchProcessing] = useState(false);

    const handleDecision = async (id: string, decision: "APPROVED" | "REJECTED") => {
        if (!confirm(`Are you sure you want to ${decision} this request?`)) return;

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
            } else {
                toast.error("Action failed");
            }
        } catch (e) {
            toast.error("Network error");
        } finally {
            setProcessingId(null);
        }
    };

    const handleBatchDecision = async (decision: "APPROVED" | "REJECTED") => {
        if (selectedIds.length === 0) return;
        if (!confirm(`Are you sure you want to ${decision} ${selectedIds.length} requests?`)) return;

        setBatchProcessing(true);
        try {
            const results = await Promise.allSettled(
                selectedIds.map(id =>
                    fetch(`/api/ops/approvals/${id}/decision`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ decision, reason: "Batch Action via Ops Console" }),
                    })
                )
            );

            const successful = results.filter(r => r.status === "fulfilled").length;
            toast.success(`${successful}/${selectedIds.length} requests ${decision}`);
            setSelectedIds([]);
            refetch();
        } catch (e) {
            toast.error("Batch action failed");
        } finally {
            setBatchProcessing(false);
        }
    };

    const toggleSelection = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === approvals.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(approvals.map((a: unknown) => a.id));
        }
    };

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", newPage.toString());
        router.push(`?${params.toString()}`);
    };

    const approvals = result?.data || [];
    const meta = result?.meta;

    if (isLoading) {
        return (
            <div className="p-8 max-w-6xl mx-auto space-y-6 animate-pulse">
                <div className="h-8 w-48 bg-gray-200 rounded"></div>
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-xl"></div>)}
                </div>
            </div>
        );
    }

    interface ApprovalRequest {
        id: string;
        actionType: string;
        store?: { name: string };
        summary?: string;
        createdAt: string | Date;
        status: string;
    }

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-amber-100 rounded-xl text-amber-700">
                            <FileSignature size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Approval Requests</h1>
                            <p className="text-sm text-gray-500">Review and authorize sensitive actions.</p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 border-b border-gray-200">
                    <Button
                        variant="ghost"
                        onClick={() => { setTab("PENDING"); handlePageChange(1); }}
                        className={`px-4 py-2 text-sm font-medium border-b-2 rounded-none transition-colors h-auto ${tab === "PENDING" ? "border-amber-500 text-amber-700 bg-amber-50" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
                        aria-label="Show pending review requests"
                    >
                        Pending Review
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => { setTab("HISTORY"); handlePageChange(1); }}
                        className={`px-4 py-2 text-sm font-medium border-b-2 rounded-none transition-colors h-auto ${tab === "HISTORY" ? "border-indigo-500 text-indigo-700 bg-indigo-50" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
                        aria-label="Show approval history log"
                    >
                        History Log
                    </Button>
                </div>
            </div>

            {/* Batch Actions Bar */}
            {tab === "PENDING" && selectedIds.length > 0 && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex items-center justify-between">
                    <span className="text-sm font-medium text-indigo-900">
                        {selectedIds.length} request{selectedIds.length > 1 ? 's' : ''} selected
                    </span>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleBatchDecision("REJECTED")}
                            disabled={batchProcessing}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                            <XCircle size={14} className="mr-1" />
                            Reject All
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => handleBatchDecision("APPROVED")}
                            disabled={batchProcessing}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            <CheckCircle2 size={14} className="mr-1" />
                            Approve All
                        </Button>
                    </div>
                </div>
            )}

            {/* List */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 border-b border-gray-100">
                                {tab === "PENDING" && (
                                    <th className="px-4 py-3 w-12">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.length === approvals.length && approvals.length > 0}
                                            onChange={toggleSelectAll}
                                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            title="Select all"
                                        />
                                    </th>
                                )}
                                <th className="px-6 py-3 font-medium">Request Type</th>
                                <th className="px-6 py-3 font-medium">Merchant</th>
                                <th className="px-6 py-3 font-medium">Summary</th>
                                <th className="px-6 py-3 font-medium">Date</th>
                                <th className="px-6 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {approvals.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400 flex flex-col items-center">
                                        <CheckCircle2 className="h-10 w-10 text-gray-200 mb-2" />
                                        <p>No pending approvals.</p>
                                    </td>
                                </tr>
                            )}
                            {approvals.map((req: ApprovalRequest) => (
                                <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                                    {tab === "PENDING" && (
                                        <td className="px-4 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(req.id)}
                                                onChange={() => toggleSelection(req.id)}
                                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                title={`Select ${req.actionType}`}
                                            />
                                        </td>
                                    )}
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {req.actionType || "GENERAL"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {req.store?.name || "Unknown Store"}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate" title={req.summary}>
                                        {req.summary || "No summary provided"}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                                        {new Date(req.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {tab === "PENDING" ? (
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDecision(req.id, "REJECTED")}
                                                    disabled={!!processingId}
                                                    className="text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 h-8 w-8"
                                                    aria-label={`Reject request for ${req.actionType}`}
                                                    title="Reject"
                                                >
                                                    <XCircle size={18} />
                                                </Button>
                                                <Button
                                                    onClick={() => handleDecision(req.id, "APPROVED")}
                                                    disabled={!!processingId}
                                                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1 h-auto"
                                                    aria-label={`Approve request for ${req.actionType}`}
                                                >
                                                    <CheckCircle2 size={14} />
                                                    Approve
                                                </Button>
                                            </div>
                                        ) : (
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${req.status === "APPROVED" ? "bg-green-100 text-green-700" :
                                                req.status === "REJECTED" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"
                                                }`}>
                                                {req.status}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination */}
                {meta && (
                    <div className="bg-gray-50 border-t border-gray-200 px-6 py-3 flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                            Showing <span className="font-medium">{(meta.page - 1) * meta.limit + 1}</span> to <span className="font-medium">{Math.min(meta.page * meta.limit, meta.total)}</span> of <span className="font-medium">{meta.total}</span> results
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => handlePageChange(meta.page - 1)}
                                disabled={meta.page <= 1}
                                className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-600 hover:bg-white disabled:opacity-50 h-auto"
                                aria-label="Go to previous page"
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => handlePageChange(meta.page + 1)}
                                disabled={meta.page >= meta.totalPages}
                                className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-600 hover:bg-white disabled:opacity-50 h-auto"
                                aria-label="Go to next page"
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
