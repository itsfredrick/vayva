"use client";

import React from "react";
import { CreditCard, Calendar, CheckCircle2, RefreshCw } from "lucide-react";
import { useOpsQuery } from "@/hooks/useOpsQuery";

export default function BillingPage() {
    const { data: subs, isLoading, refetch } = useOpsQuery(
        ["billing-subs"],
        () => fetch("/api/ops/financials/subscriptions").then(res => res.json().then(j => j.data))
    );

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <CreditCard className="w-8 h-8 text-indigo-600" />
                        Billing Monitor
                    </h1>
                    <p className="text-gray-500 mt-1">Track active SaaS subscriptions and revenue.</p>
                </div>
                <button onClick={() => refetch()} className="p-2 hover:bg-gray-100 rounded-full">
                    <RefreshCw className={`w-5 h-5 text-gray-500 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-3 font-medium">Store</th>
                            <th className="px-6 py-3 font-medium">Plan</th>
                            <th className="px-6 py-3 font-medium">Status</th>
                            <th className="px-6 py-3 font-medium">Provider</th>
                            <th className="px-6 py-3 font-medium">Renews</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            <tr><td colSpan={5} className="p-12 text-center text-gray-400">Loading subscriptions...</td></tr>
                        ) : !subs?.length ? (
                            <tr><td colSpan={5} className="p-12 text-center text-gray-400">No active subscriptions.</td></tr>
                        ) : (
                            subs.map((s: any) => (
                                <tr key={s.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{s.store?.name || "Unknown Store"}</td>
                                    <td className="px-6 py-4 font-mono text-xs text-purple-600 font-bold">{s.planKey}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${s.status === "ACTIVE" ? "bg-green-100 text-green-700" :
                                                s.status === "TRIALING" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"
                                            }`}>
                                            {s.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-xs">{s.provider}</td>
                                    <td className="px-6 py-4 flex items-center gap-1 text-gray-600">
                                        <Calendar size={14} className="text-gray-400" />
                                        {new Date(s.currentPeriodEnd).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
