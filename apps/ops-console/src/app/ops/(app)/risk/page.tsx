"use client";

import React, { useState } from "react";
import { useOpsQuery } from "@/hooks/useOpsQuery";
import { AlertTriangle, Shield, Store, RefreshCw, CheckCircle, XCircle, Flag } from 'lucide-react';
import { Button } from "@vayva/ui";
import { toast } from 'sonner';
import Link from "next/link";

interface RiskFlag {
    id: string;
    storeId: string;
    storeName: string;
    storeSlug: string;
    flagType: string;
    severity: "low" | "medium" | "high" | "critical";
    description: string;
    status: string;
    createdAt: string;
}

export default function RiskFlagsPage(): React.JSX.Element {
    const [severityFilter, setSeverityFilter] = useState<string>("all");

    const { data, isLoading, refetch } = useOpsQuery<{ flags: RiskFlag[]; stats: any }>(
        ["risk-flags", severityFilter],
        () => fetch(`/api/ops/risk?severity=${severityFilter}`).then(res => res.json())
    );

    const flags = data?.flags || [];
    const stats = data?.stats || { critical: 0, high: 0, medium: 0, low: 0 };

    const handleResolve = async (id: string) => {
        try {
            const res = await fetch(`/api/ops/risk/${id}/resolve`, { method: "POST" });
            if (!res.ok) throw new Error("Failed");
            toast.success("Flag resolved");
            refetch();
        } catch {
            toast.error("Failed to resolve flag");
        }
    };

    const getSeverityBadge = (severity: string) => {
        const styles: Record<string, string> = {
            critical: "bg-red-100 text-red-700 border-red-200",
            high: "bg-orange-100 text-orange-700 border-orange-200",
            medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
            low: "bg-blue-100 text-blue-700 border-blue-200",
        };
        return (
            <span className={`px-2 py-1 rounded border text-xs font-bold uppercase ${styles[severity] || styles.low}`}>
                {severity}
            </span>
        );
    };

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <AlertTriangle className="h-7 w-7 text-red-600" />
                        Risk Flags
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Monitor and resolve merchant risk flags</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => refetch()} className="rounded-full">
                    <RefreshCw className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`} />
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                <Button variant="ghost" onClick={() => setSeverityFilter("critical")} className={`p-4 rounded-xl border-2 text-left ${severityFilter === "critical" ? "bg-red-50 border-red-300" : "bg-white border-gray-100"}`}>
                    <div className="text-2xl font-black text-red-600">{stats.critical}</div>
                    <div className="text-xs text-gray-500">Critical</div>
                </Button>
                <Button variant="ghost" onClick={() => setSeverityFilter("high")} className={`p-4 rounded-xl border-2 text-left ${severityFilter === "high" ? "bg-orange-50 border-orange-300" : "bg-white border-gray-100"}`}>
                    <div className="text-2xl font-black text-orange-600">{stats.high}</div>
                    <div className="text-xs text-gray-500">High</div>
                </Button>
                <Button variant="ghost" onClick={() => setSeverityFilter("medium")} className={`p-4 rounded-xl border-2 text-left ${severityFilter === "medium" ? "bg-yellow-50 border-yellow-300" : "bg-white border-gray-100"}`}>
                    <div className="text-2xl font-black text-yellow-600">{stats.medium}</div>
                    <div className="text-xs text-gray-500">Medium</div>
                </Button>
                <Button variant="ghost" onClick={() => setSeverityFilter("all")} className={`p-4 rounded-xl border-2 text-left ${severityFilter === "all" ? "bg-gray-50 border-gray-300" : "bg-white border-gray-100"}`}>
                    <div className="text-2xl font-black text-gray-600">{stats.critical + stats.high + stats.medium + stats.low}</div>
                    <div className="text-xs text-gray-500">All Flags</div>
                </Button>
            </div>

            {/* Flags List */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="text-center py-12 text-gray-400">Loading...</div>
                ) : flags.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                        <Shield className="h-12 w-12 text-green-300 mx-auto mb-4" />
                        <p className="text-gray-500">No risk flags found</p>
                    </div>
                ) : (
                    flags.map((flag: RiskFlag) => (
                        <div key={flag.id} className="bg-white rounded-xl border border-gray-200 p-5">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                    <div className={`p-2 rounded-lg ${flag.severity === "critical" ? "bg-red-100" : flag.severity === "high" ? "bg-orange-100" : "bg-yellow-100"}`}>
                                        <Flag className={`h-5 w-5 ${flag.severity === "critical" ? "text-red-600" : flag.severity === "high" ? "text-orange-600" : "text-yellow-600"}`} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            {getSeverityBadge(flag.severity)}
                                            <span className="text-xs text-gray-500">{flag.flagType}</span>
                                        </div>
                                        <Link href={`/ops/merchants/${flag.storeId}`} className="font-bold text-gray-900 hover:text-indigo-600">
                                            {flag.storeName}
                                        </Link>
                                        <p className="text-sm text-gray-600 mt-1">{flag.description}</p>
                                        <p className="text-xs text-gray-400 mt-2">{new Date(flag.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>
                                {flag.status === "ACTIVE" && (
                                    <Button size="sm" variant="outline" onClick={() => handleResolve(flag.id)} className="text-xs h-8">
                                        <CheckCircle size={14} className="mr-1" /> Resolve
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
