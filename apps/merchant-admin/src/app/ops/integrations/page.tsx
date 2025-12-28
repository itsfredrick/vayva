'use client';

import React, { useState, useEffect } from 'react';
import { OpsShell } from '@/components/ops/ops-shell';
import { Button, Icon, GlassPanel, cn } from '@vayva/ui';

export default function OpsIntegrationsPage() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');

    const fetchEvents = async (provider = '') => {
        setLoading(true);
        try {
            const res = await fetch(`/api/ops/webhooks?provider=${provider === 'ALL' ? '' : provider}`);
            const data = await res.json();
            setEvents(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents(filter);
    }, [filter]);

    return (
        <OpsShell
            title="Integration Monitor"
            description="Live feed of incoming webhooks and connectivity events for all stores."
        >
            {/* Stats Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <GlassPanel className="p-6 border-emerald-500/20 bg-emerald-500/5">
                    <div className="text-emerald-500 font-bold text-2xl">99.2%</div>
                    <div className="text-xs text-emerald-500/60 uppercase font-bold tracking-widest mt-1">Success Rate (24h)</div>
                </GlassPanel>
                <GlassPanel className="p-6 border-red-500/20 bg-red-500/5">
                    <div className="text-red-500 font-bold text-2xl">12</div>
                    <div className="text-xs text-red-500/60 uppercase font-bold tracking-widest mt-1">Provider Failures</div>
                </GlassPanel>
                <GlassPanel className="p-6 border-blue-500/20 bg-blue-500/5">
                    <div className="text-blue-500 font-bold text-2xl">140ms</div>
                    <div className="text-xs text-blue-500/60 uppercase font-bold tracking-widest mt-1">Avg Latency</div>
                </GlassPanel>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-6">
                {['ALL', 'Paystack', 'WhatsApp', 'Logistics'].map(p => (
                    <Button
                        key={p}
                        variant={filter === p ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() => setFilter(p)}
                        className={cn(filter !== p && "text-white/40 hover:text-white")}
                    >
                        {p}
                    </Button>
                ))}
            </div>

            {/* Event Table */}
            <div className="border border-white/10 rounded-2xl overflow-hidden bg-[#0a0f14]">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-text-secondary border-b border-white/5 font-medium uppercase text-[10px] tracking-widest">
                        <tr>
                            <th className="px-6 py-4">Provider</th>
                            <th className="px-6 py-4">Store</th>
                            <th className="px-6 py-4">Event Type</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Payload (Redacted)</th>
                            <th className="px-6 py-4">Received</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr><td colSpan={6} className="px-6 py-12 text-center text-text-secondary">Monitoring live events...</td></tr>
                        ) : events.length === 0 ? (
                            <tr><td colSpan={6} className="px-6 py-12 text-center text-text-secondary">No recent events found.</td></tr>
                        ) : (
                            events.map(ev => (
                                <tr key={ev.id} className="hover:bg-white/5 transition-colors text-xs">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className={cn("w-1.5 h-1.5 rounded-full", ev.provider === 'WhatsApp' ? "bg-green-500" : "bg-blue-500")} />
                                            <span className="font-bold text-white uppercase tracking-tighter">{ev.provider}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-white/80">{ev.storeName}</td>
                                    <td className="px-6 py-4 font-mono text-primary/80">{ev.eventType}</td>
                                    <td className="px-6 py-4">
                                        <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold border",
                                            ev.status === '200' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"
                                        )}>
                                            {ev.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-white/30 font-mono truncate max-w-[200px]">{ev.payload}</td>
                                    <td className="px-6 py-4 text-text-secondary">{new Date(ev.receivedAt).toLocaleTimeString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </OpsShell>
    );
}
