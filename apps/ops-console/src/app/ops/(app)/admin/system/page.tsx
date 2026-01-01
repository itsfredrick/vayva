"use client";

import React from "react";
import { Terminal, Server, CheckCircle2, ShieldCheck, RefreshCw } from "lucide-react";
import { useOpsQuery } from "@/hooks/useOpsQuery";

export default function SystemPage() {
    const { data: system, isLoading, refetch } = useOpsQuery(
        ["system-env"],
        () => fetch("/api/ops/admin/system").then(res => res.json().then(j => j.data))
    );

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Terminal className="w-8 h-8 text-indigo-600" />
                        System Environment
                    </h1>
                    <p className="text-gray-500 mt-1">Runtime configuration and health metrics.</p>
                </div>
                <button onClick={() => refetch()} className="p-2 hover:bg-gray-100 rounded-full">
                    <RefreshCw className={`w-5 h-5 text-gray-500 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Server size={20} className="text-gray-500" /> Application Details
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                            <span className="text-gray-600">Node Environment</span>
                            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{system?.env || "loading..."}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                            <span className="text-gray-600">Region</span>
                            <span className="font-mono text-sm text-gray-800">{system?.region || "Unknown"}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                            <span className="text-gray-600">Timezone</span>
                            <span className="font-mono text-sm text-gray-800">{system?.timezone}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                            <span className="text-gray-600">Uptime</span>
                            <span className="text-green-600 font-bold flex items-center gap-1">
                                <CheckCircle2 size={14} /> Operational
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <ShieldCheck size={20} className="text-gray-500" /> Security Features
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                            <span className="text-gray-600">Auth Service</span>
                            <span className="text-green-600 font-bold text-xs uppercase">Active</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                            <span className="text-gray-600">Bootstrap Mode</span>
                            <span className={`font-bold text-xs uppercase px-2 py-0.5 rounded ${system?.bootstrapEnabled ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-500"}`}>
                                {system?.bootstrapEnabled ? "Enabled" : "Disabled"}
                            </span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                            <span className="text-gray-600">Secure Cookies</span>
                            <span className={`font-bold text-xs uppercase px-2 py-0.5 rounded ${system?.cookiesSecure ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                {system?.cookiesSecure ? "Yes" : "No"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-900 rounded-xl p-6 text-gray-300 font-mono text-xs overflow-x-auto shadow-inner">
                <h3 className="text-white font-bold mb-4">Safe Environment Variables</h3>
                <pre>{JSON.stringify(system?.safeEnv, null, 2)}</pre>
            </div>
        </div>
    );
}
