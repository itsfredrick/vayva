"use client";

import { OpsShell } from "@/components/OpsShell";
import { useOpsQuery } from "@/hooks/useOpsQuery";
import { Activity, Database, Server, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";
import { useState } from "react";

export default function HealthPage() {
    const { data, isLoading: loading, error, refetch: refresh } = useOpsQuery(
        ["system-health"],
        () => fetch("/api/ops/tools/health").then(res => res.json())
    );
    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = async () => {
        setRefreshing(true);
        await refresh();
        setTimeout(() => setRefreshing(false), 500);
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const isHealthy = status === "healthy";
        return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${isHealthy
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-700 border-red-200"
                }`}>
                {isHealthy ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                {status?.toUpperCase() || "UNKNOWN"}
            </span>
        );
    };

    return (
        <OpsShell>
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Header Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <Activity className="text-indigo-600" size={20} />
                            Platform Status
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Real-time monitoring of critical infrastructure.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        {data && <StatusBadge status={data.status} />}
                        <button
                            onClick={handleRefresh}
                            className={`p-2 text-gray-400 hover:text-indigo-600 transition-colors rounded-lg hover:bg-gray-50 ${refreshing || loading ? "animate-spin" : ""}`}
                        >
                            <RefreshCw size={18} />
                        </button>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Database Card */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                <Database size={20} />
                            </div>
                            {data && <StatusBadge status={data.checks?.database?.status} />}
                        </div>
                        <h3 className="text-sm font-medium text-gray-900">Primary Database</h3>
                        <p className="text-xs text-gray-500 mt-1">AWS RDS (Postgres)</p>

                        <div className="mt-6 flex items-center justify-between text-sm">
                            <span className="text-gray-500">Latency</span>
                            <span className="font-mono font-medium text-gray-900">
                                {data?.checks?.database?.latency || "--"}
                            </span>
                        </div>
                    </div>

                    {/* API Gateway Card */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                                <Server size={20} />
                            </div>
                            {data && <StatusBadge status={data.checks?.external_apis?.status} />}
                        </div>
                        <h3 className="text-sm font-medium text-gray-900">External Gateways</h3>
                        <p className="text-xs text-gray-500 mt-1">Stripe, Paystack, Resend</p>

                        <div className="mt-6 flex items-center justify-between text-sm">
                            <span className="text-gray-500">Status</span>
                            <span className="font-medium text-gray-900">Operational</span>
                        </div>
                    </div>
                </div>

                {/* System Info */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-500 font-mono">
                    <div className="flex justify-between">
                        <span>Check Timestamp:</span>
                        <span>{data?.timestamp || "Loading..."}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                        <span>System Uptime:</span>
                        <span>{data?.uptime ? `${Math.floor(data.uptime / 60)} minutes` : "--"}</span>
                    </div>
                </div>
            </div>
        </OpsShell>
    );
}
