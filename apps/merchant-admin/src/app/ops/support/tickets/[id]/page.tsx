'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Icon, Button, Badge } from '@vayva/ui';

export default function OpsTicketDetail() {
    const params = useParams();
    const [ticket, setTicket] = useState<any>(null);
    const [reply, setReply] = useState('');

    useEffect(() => {
        if (!params.id) return;
        fetch(`/api/ops/support/tickets/${params.id}`)
            .then(res => res.json())
            .then(data => setTicket(data));
    }, [params.id]);

    if (!ticket) return <div className="p-8 text-center">Loading ticket context...</div>;

    const handoff = ticket.handoffEvents?.[0];

    return (
        <div className="h-screen flex flex-col bg-[#F8F9FA]">
            {/* Header */}
            <header className="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
                        <Icon name="ArrowLeft" size={18} />
                    </Button>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500 text-sm">#{ticket.id.slice(0, 8)}</span>
                            <h1 className="text-lg font-bold text-gray-900">{ticket.subject}</h1>
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                            <span>{ticket.store.name}</span>
                            <span>•</span>
                            <span className="capitalize">{ticket.category}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-red-600 font-medium">
                                <Icon name="Clock" size={12} /> Priority: {ticket.priority}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">Freeze Account</Button>
                    <Button variant="primary" size="sm">Resolve Ticket</Button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Left: Chat History */}
                <div className="flex-1 flex flex-col border-r border-gray-200 bg-white">
                    {/* Transcript Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {/* Placeholder for actual messages */}
                        <div className="flex justify-start">
                            <div className="bg-gray-100 p-4 rounded-xl rounded-tl-none max-w-lg text-sm text-gray-700">
                                <p className="font-bold text-xs text-gray-500 mb-1">AI Agent (Pre-Handoff)</p>
                                {handoff?.metadata?.lastBotReply || "I'm escalating this to our support team."}
                            </div>
                        </div>
                    </div>

                    {/* Ops Reply Composer */}
                    <div className="p-4 border-t border-gray-200 bg-white">
                        <textarea
                            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none h-32"
                            placeholder="Write a reply to the merchant..."
                            value={reply}
                            onChange={e => setReply(e.target.value)}
                        />
                        <div className="flex justify-between items-center mt-2">
                            <div className="text-xs text-gray-400">Merchant will be notified via Email & Dashboard</div>
                            <Button disabled={!reply} size="sm">Send Reply</Button>
                        </div>
                    </div>
                </div>

                {/* Right: AI Insight Panel (Prompt 9 Spec) */}
                <div className="w-[400px] bg-gray-50 p-6 overflow-y-auto shrink-0 border-l border-gray-200">
                    <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Icon name="Cpu" size={16} className="text-indigo-600" />
                        AI Handoff Insight
                    </h2>

                    {handoff ? (
                        <div className="space-y-6">
                            {/* Summary Card */}
                            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Escalation Reason</label>
                                <div className="text-sm text-gray-900 font-medium">{handoff.reason}</div>
                                <div className="mt-3 bg-red-50 text-red-700 px-2 py-1 rounded text-xs inline-block font-mono">
                                    Trigger: {handoff.trigger}
                                </div>
                            </div>

                            {/* AI Summary */}
                            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Bot Summary</label>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {handoff.aiSummary}
                                </p>
                            </div>

                            {/* Technical Metadata */}
                            {handoff.metadata && (
                                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Context Snapshot</label>
                                    <pre className="text-[10px] bg-gray-900 text-green-400 p-2 rounded overflow-x-auto">
                                        {JSON.stringify(handoff.metadata, null, 2)}
                                    </pre>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-sm text-gray-400 italic">No handoff metadata available.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
