"use client";

import React, { useState } from "react";
import { Megaphone, Plus, Search, Calendar, MoreVertical, Send, Eye } from "lucide-react";
import { useOpsQuery } from "@/hooks/useOpsQuery";
import { cn, Button } from "@vayva/ui";

export default function CampaignManagerPage() {
    const [filter, setFilter] = useState("ALL");

    const { data: campaigns, isLoading } = useOpsQuery(
        ["ops-campaigns", filter],
        () => fetch(`/api/ops/growth/campaigns?status=${filter}`).then(res => res.json().then(j => j.data))
    );

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Megaphone className="w-8 h-8 text-indigo-600" />
                        Campaign Manager
                    </h1>
                    <p className="text-gray-500 mt-1">Design and schedule cross-platform customer lifecycle messaging.</p>
                </div>
                <Button className="font-bold rounded-lg transition-all flex items-center gap-2 shadow-lg active:scale-95 h-auto">
                    <Plus size={20} /> New Campaign
                </Button>
            </div>

            <div className="flex gap-2 border-b border-gray-200 pb-2">
                {["DRAFT", "SCHEDULED", "SENT", "ALL"].map(s => (
                    <Button
                        key={s}
                        onClick={() => setFilter(s)}
                        variant="ghost"
                        className={cn(
                            "px-4 py-2 text-sm font-bold border-b-2 transition-colors -mb-2 rounded-none hover:bg-transparent h-auto",
                            filter === s ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"
                        )}
                    >
                        {s}
                    </Button>
                ))}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 border-b border-gray-100 font-bold">
                        <tr>
                            <th className="px-6 py-3">Campaign Name</th>
                            <th className="px-6 py-3">Channel</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Scheduled</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            <tr><td colSpan={5} className="p-12 text-center text-gray-400">Loading campaigns...</td></tr>
                        ) : !campaigns?.length ? (
                            <tr><td colSpan={5} className="p-12 text-center text-gray-400 font-medium">No campaigns found.</td></tr>
                        ) : (
                            campaigns.map((c: unknown) => (
                                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900">{c.name}</div>
                                        <div className="text-[10px] text-gray-400 font-mono">#{c.id.slice(0, 8)}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-600 uppercase">
                                            {c.channel}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "px-2 py-0.5 rounded text-[10px] font-black uppercase",
                                            c.status === "SENT" ? "bg-green-100 text-green-700" :
                                                c.status === "SCHEDULED" ? "bg-blue-100 text-blue-700" :
                                                    "bg-amber-100 text-amber-700"
                                        )}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-xs font-medium">
                                        {c.scheduledAt ? new Date(c.scheduledAt).toLocaleString() : "Manual only"}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50" title="View Preview">
                                                <Eye size={16} />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50" title="Send Now">
                                                <Send size={16} />
                                            </Button>
                                        </div>
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
