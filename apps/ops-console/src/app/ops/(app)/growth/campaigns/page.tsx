"use client";

import React from "react";
import { Zap, Clock, TicketPercent, RefreshCw, ShoppingCart } from "lucide-react";
import { useOpsQuery } from "@/hooks/useOpsQuery";

export default function CampaignsPage() {
    const { data: campaigns, isLoading, refetch } = useOpsQuery(
        ["active-campaigns"],
        () => fetch("/api/ops/growth/campaigns/active").then(res => res.json().then(j => j.data))
    );

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Zap className="w-8 h-8 text-amber-500" />
                        Live Campaigns
                    </h1>
                    <p className="text-gray-500 mt-1">Real-time monitor of active merchant flash sales.</p>
                </div>
                <button onClick={() => refetch()} className="p-2 hover:bg-gray-100 rounded-full">
                    <RefreshCw className={`w-5 h-5 text-gray-500 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-3 font-medium">Campaign Name</th>
                            <th className="px-6 py-3 font-medium">Merchant</th>
                            <th className="px-6 py-3 font-medium">Discount</th>
                            <th className="px-6 py-3 font-medium">Target</th>
                            <th className="px-6 py-3 font-medium">Ends In</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            <tr><td colSpan={5} className="p-12 text-center text-gray-400">Loading campaigns...</td></tr>
                        ) : !campaigns?.length ? (
                            <tr><td colSpan={5} className="p-12 text-center text-gray-400">No active campaigns.</td></tr>
                        ) : (
                            campaigns.map((c: any) => {
                                const end = new Date(c.endTime);
                                const now = new Date();
                                const diff = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60))); // Hours

                                return (
                                    <tr key={c.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{c.name}</td>
                                        <td className="px-6 py-4 text-gray-600">{c.store?.name}</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold">
                                                -{c.discount}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-mono text-gray-500">{c.targetType}</td>
                                        <td className="px-6 py-4 flex items-center gap-1 text-amber-600 font-medium">
                                            <Clock size={14} />
                                            {diff} hours
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
