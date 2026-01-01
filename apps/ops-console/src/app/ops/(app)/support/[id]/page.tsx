"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useOpsQuery } from "@/hooks/useOpsQuery";
import { ArrowLeft, User, MessageSquare, Send, CheckCircle, Smartphone } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function SupportDetailPage() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const [reply, setReply] = useState("");
    const [sending, setSending] = useState(false);

    const { data: ticket, isLoading, refetch } = useOpsQuery(
        ["support-ticket", id],
        () => fetch(`/api/ops/support/${id}`).then(res => res.json().then(j => j.data))
    );

    const handleStatusUpdate = async (newStatus: string) => {
        try {
            const res = await fetch(`/api/ops/support/${id}`, {
                method: "PATCH",
                body: JSON.stringify({ status: newStatus }),
                headers: { "Content-Type": "application/json" }
            });
            if (res.ok) {
                toast.success(`Ticket marked as ${newStatus}`);
                refetch();
            }
        } catch (e) {
            toast.error("Failed to update status");
        }
    };

    const handleSendReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reply.trim()) return;

        // Currently APIs don't support message threads on SupportCase, assuming single thread or placeholder for now.
        // We will log it as a note for V1.

        setSending(true);
        // Simulate sending for UI feedback
        setTimeout(() => {
            setReply("");
            setSending(false);
            toast.message("Reply sent via Email/Chat (Simulation)", { description: reply });
        }, 800);
    };

    if (isLoading) return <div className="p-12 text-center text-gray-400">Loading ticket details...</div>;
    if (!ticket) return <div className="p-12 text-center text-red-500">Ticket not found</div>;

    const { store } = ticket;

    return (
        <div className="p-8 max-w-6xl mx-auto h-[calc(100vh-64px)] flex flex-col">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <Link href="/ops/support" className="text-gray-500 text-sm hover:text-gray-800 flex items-center gap-1 mb-2">
                        <ArrowLeft size={14} /> Back to Support
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <span className="text-gray-400">#{ticket.id.slice(0, 6)}</span>
                        {ticket.summary}
                    </h1>
                </div>
                <div className="flex gap-2">
                    {ticket.status !== "RESOLVED" ? (
                        <button
                            onClick={() => handleStatusUpdate("RESOLVED")}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 flex items-center gap-2"
                        >
                            <CheckCircle size={16} /> Mark Resolved
                        </button>
                    ) : (
                        <button
                            onClick={() => handleStatusUpdate("OPEN")}
                            className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200"
                        >
                            Re-open Ticket
                        </button>
                    )}
                </div>
            </div>

            <div className="flex gap-6 flex-1 min-h-0">
                {/* Search / Chat Area */}
                <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
                    <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-gray-50/50">
                        {/* Initial Message (Simulated from ticket summary/desc) */}
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                                <User size={14} className="text-gray-500" />
                            </div>
                            <div>
                                <div className="flex items-baseline gap-2">
                                    <span className="font-bold text-gray-900">{store?.name || "Merchant"}</span>
                                    <span className="text-xs text-gray-400">{new Date(ticket.createdAt).toLocaleString()}</span>
                                </div>
                                <div className="mt-1 bg-white border border-gray-200 p-4 rounded-r-xl rounded-bl-xl text-sm text-gray-800 shadow-sm">
                                    <p className="font-medium mb-1">{ticket.summary}</p>
                                    <p className="text-gray-600">{JSON.stringify(ticket.links) || "No additional details."}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reply Box */}
                    <div className="p-4 bg-white border-t border-gray-200">
                        <form onSubmit={handleSendReply} className="relative">
                            <textarea
                                value={reply}
                                onChange={e => setReply(e.target.value)}
                                placeholder="Type your reply..."
                                className="w-full p-4 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-24 text-sm"
                            />
                            <button
                                type="submit"
                                disabled={sending || !reply.trim()}
                                className="absolute bottom-3 right-3 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                            >
                                <Send size={16} />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Sidebar Context */}
                <div className="w-80 space-y-6">
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Merchant Context</h3>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-700 font-bold">
                                {store?.name?.[0]}
                            </div>
                            <div>
                                <div className="font-bold text-gray-900">{store?.name}</div>
                                <div className="text-xs text-gray-500">{store?.slug}</div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Status</span>
                                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-bold">ACTIVE</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Tier</span>
                                <span className="font-medium">Growth</span>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <a
                                href={`/ops/merchants/${ticket.storeId}`}
                                target="_blank"
                                className="block w-full text-center py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                View Merchant Profile
                            </a>
                        </div>
                    </div>

                    {store?.whatsappNumberE164 && (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 shadow-sm flex items-center gap-3">
                            <Smartphone className="text-green-600" size={20} />
                            <div>
                                <div className="text-xs font-bold text-green-800 uppercase">Whatsapp Connected</div>
                                <div className="text-sm text-green-700 font-mono">{store.whatsappNumberE164}</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
