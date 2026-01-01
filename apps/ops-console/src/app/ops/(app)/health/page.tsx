"use client";

import React, { useEffect, useState } from "react";
import {
    ShieldCheck,
    Server,
    Database,
    RefreshCw,
    Activity,
    CheckCircle2,
    XCircle,
    AlertTriangle
} from "lucide-react";

interface HealthStatus {
    status: "ok" | "degraded" | "down";
    timestamp: string;
    uptime: number; // Process uptime
    upstream: {
        database: "up" | "down";
        paystack: "up" | "down";
        resend: "up" | "down";
        redis: "up" | "down";
    };
    webhooks: {
        received_24h: number;
        failed_24h: number;
        success_rate: number;
        signature_valid: boolean;
    };
}

export default function SystemHealthPage() {
    const [data, setData] = useState<HealthStatus | null>(null);
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
        } catch (error) {
            console.error("Health check failed", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        if (status === "ok" || status === "up") return <CheckCircle2 className="text-green-500" />;
        if (status === "degraded") return <AlertTriangle className="text-yellow-500" />;
        return <XCircle className="text-red-500" />;
    };

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <ShieldCheck className="text-indigo-600" />
                        System Health
                    </h1>
                    <p className="text-gray-500 mt-1">Real-time infrastructure status</p>
                </div>
                <button
                    onClick={fetchHealth}
                    className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                    <RefreshCw className={loading ? "animate-spin" : ""} size={20} />
                </button>
            </div>

            {data && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Overall Status */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Activity size={20} className="text-indigo-500" />
                            Platform Status
                        </h2>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl font-bold capitalize">{data.status}</span>
                            {getStatusIcon(data.status)}
                        </div>
                        <p className="text-xs text-gray-500">
                            Last check: {new Date(data.timestamp).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">
                            Service Uptime: {Math.floor(data.uptime)}s
                        </p>
                    </div>

                    {/* Upstream Services */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Server size={20} className="text-blue-500" />
                            Upstream Services
                        </h2>
                        <div className="space-y-3">
                            {data.upstream && Object.entries(data.upstream).map(([service, status]) => (
                                <div key={service} className="flex justify-between items-center">
                                    <span className="text-sm font-medium capitalize text-gray-700">{service}</span>
                                    <div className="flex items-center gap-2 text-sm">
                                        {getStatusIcon(status)}
                                        <span className="uppercase font-bold text-xs">{status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Database & Webhooks */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 md:col-span-2">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Database size={20} className="text-purple-500" />
                            Database & Events
                        </h2>
                        <div className="grid grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">{data.webhooks.received_24h}</div>
                                <div className="text-xs text-gray-500">Webhooks (24h)</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-red-500">{data.webhooks.failed_24h}</div>
                                <div className="text-xs text-gray-500">Failures (24h)</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">{data.webhooks.success_rate}%</div>
                                <div className="text-xs text-gray-500">Success Rate</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
