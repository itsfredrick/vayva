"use client";

import { useOpsQuery } from "@/hooks/useOpsQuery";
import { OpsShell } from "@/components/OpsShell";
import { useState } from "react";
import { toast } from "sonner";
import {
    CheckCircle2,
    XCircle,
    Clock,
    AlertCircle,
    FileSignature
} from "lucide-react";

export default function ApprovalsPage() {
    const [tab, setTab] = useState<"PENDING" | "HISTORY">("PENDING");

    const { data, isLoading, refetch } = useOpsQuery(
        ["approvals-list", tab],
        () => fetch(`/api/ops/approvals?status=${tab}`).then(res => res.json())
    );

    const [processingId, setProcessingId] = useState<string | null>(null);

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

    const approvals = data?.data || [];

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
                    <button
                        onClick={() => setTab("PENDING")}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === "PENDING" ? "border-amber-500 text-amber-700" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                    >
                        Pending Review
                    </button>
                    <button
                        onClick={() => setTab("HISTORY")}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === "HISTORY" ? "border-indigo-500 text-indigo-700" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                    >
                        History Log
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 border-b border-gray-100">
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
                            {approvals.map((req: any) => (
                                <tr key={req.id} className="hover:bg-gray-50 transition-colors">
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
                                                <button
                                                    onClick={() => handleDecision(req.id, "REJECTED")}
                                                    disabled={!!processingId}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                    title="Reject"
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDecision(req.id, "APPROVED")}
                                                    disabled={!!processingId}
                                                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1"
                                                >
                                                    <CheckCircle2 size={14} />
                                                    Approve
                                                </button>
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
            </div>
        </div>
    );
}
