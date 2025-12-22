'use client';

import React from 'react';
import { AppShell } from '@vayva/ui';
import { GlassPanel } from '@vayva/ui';
import { AnalyticsFilterBar } from '@/components/analytics-filter-bar';
import { Icon } from '@vayva/ui';
import { formatNGN } from '@/config/pricing';

export default function WhatsappAnalyticsPage() {
    return (
        <AppShell sidebar={<></>} header={<></>}>
            <div className="flex flex-col gap-6">
                <AnalyticsFilterBar />

                {/* KPI Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Conversations', value: '1,240', sub: 'Last 30 days', color: 'text-white' },
                        { label: 'Containment Rate', value: '88%', sub: 'Resolved by AI', color: 'text-state-success' },
                        { label: 'Avg Response', value: '2s', sub: 'Instant', color: 'text-primary' },
                        { label: 'Sales Assisted', value: formatNGN(840000), sub: 'Attributed', color: 'text-white' },
                    ].map((stat, i) => (
                        <GlassPanel key={i} className="p-4">
                            <div className="text-xs text-text-secondary font-bold uppercase tracking-wider mb-1">{stat.label}</div>
                            <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                            <div className="text-[10px] text-text-secondary uppercase tracking-wider">{stat.sub}</div>
                        </GlassPanel>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Intents */}
                    <GlassPanel className="p-0 overflow-hidden">
                        <div className="p-4 border-b border-white/5">
                            <h3 className="font-bold text-white">Top Customer Intents</h3>
                        </div>
                        <table className="w-full text-left text-sm">
                            <tbody className="divide-y divide-white/5">
                                {[
                                    { intent: 'Check Order Status', count: 450, rate: '100%' },
                                    { intent: 'Product Inquiry', count: 320, rate: '85%' },
                                    { intent: 'Shipping Policy', count: 120, rate: '100%' },
                                    { intent: 'Human Handoff', count: 50, rate: '-' },
                                ].map((row, i) => (
                                    <tr key={i} className="group hover:bg-white/5">
                                        <td className="p-4 text-white font-medium">{row.intent}</td>
                                        <td className="p-4 text-text-secondary text-right">{row.count}</td>
                                        <td className="p-4 text-state-success text-right font-bold">{row.rate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </GlassPanel>

                    {/* Approvals */}
                    <GlassPanel className="p-6">
                        <h3 className="font-bold text-white mb-6">AI Action Approvals</h3>
                        <div className="flex h-8 rounded-full overflow-hidden w-full mb-6">
                            <div className="h-full bg-state-success" style={{ width: '70%' }} />
                            <div className="h-full bg-state-warning" style={{ width: '20%' }} />
                            <div className="h-full bg-state-danger" style={{ width: '10%' }} />
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="flex items-center gap-2 text-text-secondary"><span className="w-2 h-2 rounded-full bg-state-success" /> Approved</span>
                                <span className="text-white font-bold">140</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="flex items-center gap-2 text-text-secondary"><span className="w-2 h-2 rounded-full bg-state-warning" /> Modified</span>
                                <span className="text-white font-bold">40</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="flex items-center gap-2 text-text-secondary"><span className="w-2 h-2 rounded-full bg-state-danger" /> Rejected</span>
                                <span className="text-white font-bold">20</span>
                            </div>
                        </div>
                    </GlassPanel>
                </div>
            </div>
        </AppShell>
    );
}
