"use client";

import React, { useState } from "react";
import { Bot, ThumbsUp, ThumbsDown, RefreshCw, MessageSquare } from "lucide-react";
import { useOpsQuery } from "@/hooks/useOpsQuery";

export default function AiQualityPage() {
    const [filter, setFilter] = useState("ALL");
    const { data: feedbacks, isLoading, refetch } = useOpsQuery(
        ["ai-feedback", filter],
        () => fetch(`/api/ops/ai/feedback?rating=${filter}`).then(res => res.json().then(j => j.data))
    );

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Bot className="w-8 h-8 text-indigo-600" />
                        AI Quality Lab
                    </h1>
                    <p className="text-gray-500 mt-1">Review merchant feedback on automated responses.</p>
                </div>
                <button onClick={() => refetch()} className="p-2 hover:bg-gray-100 rounded-full">
                    <RefreshCw className={`w-5 h-5 text-gray-500 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="flex gap-2 border-b border-gray-200 pb-2">
                {["ALL", "SOLVED", "NOT_SOLVED"].map(s => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${filter === s ? "bg-indigo-100 text-indigo-700" : "text-gray-600 hover:bg-gray-50"}`}
                    >
                        {s === "ALL" ? "All Feedback" : s === "SOLVED" ? "👍 Positive" : "👎 Negative"}
                    </button>
                ))}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-3 font-medium">Sentiment</th>
                            <th className="px-6 py-3 font-medium">Merchant</th>
                            <th className="px-6 py-3 font-medium">Reason</th>
                            <th className="px-6 py-3 font-medium">Conversation ID</th>
                            <th className="px-6 py-3 font-medium">Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            <tr><td colSpan={5} className="p-12 text-center text-gray-400">Loading feedback...</td></tr>
                        ) : !feedbacks?.length ? (
                            <tr><td colSpan={5} className="p-12 text-center text-gray-400">No feedback found.</td></tr>
                        ) : (
                            feedbacks.map((item: any) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        {item.rating === "SOLVED" ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-700">
                                                <ThumbsUp size={12} /> Positive
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-700">
                                                <ThumbsDown size={12} /> Negative
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {item.store?.name || "Unknown Store"}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {item.reason || <span className="text-gray-300 italic">No reason provided</span>}
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs text-gray-500 flex items-center gap-1">
                                        <MessageSquare size={12} />
                                        {item.conversationId.substring(0, 8)}...
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-xs">{new Date(item.createdAt).toLocaleString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
