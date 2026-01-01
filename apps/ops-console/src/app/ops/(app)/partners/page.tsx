"use client";

import React from "react";
import { Users, CreditCard, RefreshCw, Link2 } from "lucide-react";
import { useOpsQuery } from "@/hooks/useOpsQuery";

export default function PartnersPage() {
    const { data: partners, isLoading, refetch } = useOpsQuery(
        ["partners-list"],
        () => fetch("/api/ops/partners").then(res => res.json().then(j => j.data))
    );

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Users className="w-8 h-8 text-indigo-600" />
                        Partner Directory
                    </h1>
                    <p className="text-gray-500 mt-1">Manage affiliate partners and referrals.</p>
                </div>
                <button onClick={() => refetch()} className="p-2 hover:bg-gray-100 rounded-full">
                    <RefreshCw className={`w-5 h-5 text-gray-500 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-3 font-medium">Partner Name</th>
                            <th className="px-6 py-3 font-medium">Type</th>
                            <th className="px-6 py-3 font-medium">Status</th>
                            <th className="px-6 py-3 font-medium">Referrals</th>
                            <th className="px-6 py-3 font-medium">Joined</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            <tr><td colSpan={5} className="p-12 text-center text-gray-400">Loading partners...</td></tr>
                        ) : !partners?.length ? (
                            <tr><td colSpan={5} className="p-12 text-center text-gray-400">No partners found.</td></tr>
                        ) : (
                            partners.map((p: any) => (
                                <tr key={p.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{p.name}</td>
                                    <td className="px-6 py-4 text-gray-600 uppercase text-xs font-bold">{p.type}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${p.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex items-center gap-1 font-mono">
                                        <Link2 size={12} className="text-gray-400" />
                                        {p._count?.referralAttributions || 0}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-xs">{new Date(p.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
