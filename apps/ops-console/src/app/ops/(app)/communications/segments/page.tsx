"use client";

import React, { useState } from "react";
import { Users, Filter, Calculator, Search, Mail, Send } from 'lucide-react';
import { useOpsQuery } from "@/hooks/useOpsQuery";
import { cn, Button } from "@vayva/ui";

export default function SegmentsPage(): React.JSX.Element {
    const [minSpend, setMinSpend] = useState(0);
    const [minOrders, setMinOrders] = useState(0);

    const { data: customers, isLoading, refetch } = useOpsQuery(
        ["audience-segments", String(minSpend), String(minOrders)],
        () => fetch(`/api/ops/communications/segments?minSpend=${minSpend}&minOrders=${minOrders}`).then(res => res.json().then(j => j.data))
    );

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Users className="w-8 h-8 text-indigo-600" />
                        Audience Segment Builder
                    </h1>
                    <p className="text-gray-500 mt-1">Filter platform-wide customers for targeted campaigns.</p>
                </div>
            </div>

            {/* Builder Configuration */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Calculator size={16} /> Minimum Spend (NGN)
                    </label>
                    <input
                        type="number"
                        value={(minSpend as any)}
                        onChange={(e: any) => setMinSpend(Number((e as any).target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all"
                        placeholder="e.g. 5000"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Filter size={16} /> Minimum Orders
                    </label>
                    <input
                        type="number"
                        value={(minOrders as any)}
                        onChange={(e: any) => setMinOrders(Number((e as any).target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all"
                        placeholder="e.g. 5"
                    />
                </div>
                <div className="flex items-end">
                    <Button
                        onClick={() => refetch()}
                        className="w-full bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-md active:scale-95 h-auto text-base"
                    >
                        Preview Audience
                    </Button>
                </div>
            </div>

            {/* Results Table */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-gray-900">Audience Preview ({customers?.length || 0} matches)</h3>
                    {customers?.length > 0 && (
                        <Button variant="ghost" className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 p-0 h-auto hover:bg-transparent">
                            <Send size={14} /> Create Campaign for this Segment
                        </Button>
                    )}
                </div>
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-3 font-medium">Customer</th>
                            <th className="px-6 py-3 font-medium">Email/Phone</th>
                            <th className="px-6 py-3 font-medium">Order Count</th>
                            <th className="px-6 py-3 font-medium">Total Spent</th>
                            <th className="px-6 py-3 font-medium">Joined</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            <tr><td colSpan={5} className="p-12 text-center text-gray-400 font-medium">Analyzing segments...</td></tr>
                        ) : !customers?.length ? (
                            <tr><td colSpan={5} className="p-12 text-center text-gray-400 font-medium">No customers match these criteria.</td></tr>
                        ) : (
                            customers.map((c: any) => (
                                <tr key={(c as any).id} className="hover:bg-indigo-50/30 transition-colors">
                                    <td className="px-6 py-4 font-bold text-gray-900">{(c as any).firstName} {(c as any).lastName}</td>
                                    <td className="px-6 py-4 text-gray-500">{(c as any).email || (c as any).phone}</td>
                                    <td className="px-6 py-4 font-black">{(c as any).orderCount}</td>
                                    <td className="px-6 py-4 font-black text-indigo-700">₦{Number((c as any).totalSpend).toLocaleString()}</td>
                                    <td className="px-6 py-4 text-gray-500">{new Date((c as any).createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
