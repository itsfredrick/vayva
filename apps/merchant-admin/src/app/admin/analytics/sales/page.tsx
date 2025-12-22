'use client';

import React from 'react';
import { AppShell , GlassPanel } from '@vayva/ui';
import { AnalyticsFilterBar } from '@/components/analytics-filter-bar';
import { TrendChart } from '@/components/trend-chart';
import { formatNGN } from '@/config/pricing';

export default function SalesReportPage() {
    return (
        <AppShell sidebar={<></>} header={<></>}>
            <div className="flex flex-col gap-6">
                <AnalyticsFilterBar />
                <AnalyticsFilterBar />
                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Gross Sales', value: formatNGN(5100000) },
                        { label: 'Discounts', value: `- ${formatNGN(240000)}`, color: 'text-state-warning' },
                        { label: 'Returns', value: `- ${formatNGN(150000)}`, color: 'text-state-danger' },
                        { label: 'Net Sales', value: formatNGN(4710000), color: 'text-primary' },
                    ].map((stat, i) => (
                        <GlassPanel key={i} className="p-4">
                            <div className="text-xs text-text-secondary font-bold uppercase tracking-wider mb-1">{stat.label}</div>
                            <div className={`text-xl font-bold ${stat.color || 'text-white'}`}>{stat.value}</div>
                        </GlassPanel>
                    ))}
                </div>

                {/* Chart */}
                <GlassPanel className="p-6">
                    <h3 className="font-bold text-white mb-6">Sales over time</h3>
                    <TrendChart data={[300, 450, 320, 500, 480, 600, 550, 700]} height={300} />
                </GlassPanel>

                {/* Table */}
                <GlassPanel className="overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/5 text-text-secondary uppercase text-xs font-bold border-b border-white/5">
                            <tr>
                                <th className="p-4">Date</th>
                                <th className="p-4">Orders</th>
                                <th className="p-4 text-right">Gross Sales</th>
                                <th className="p-4 text-right">Returns</th>
                                <th className="p-4 text-right">Net Sales</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {[
                                { date: 'Oct 24', orders: 12, gross: '₦ 450,000', returns: '₦ 0', net: '₦ 450,000' },
                                { date: 'Oct 23', orders: 8, gross: formatNGN(320000), returns: `- ${formatNGN(25000)}`, net: formatNGN(295000) },
                                { date: 'Oct 22', orders: 15, gross: '₦ 600,000', returns: '₦ 0', net: '₦ 600,000' },
                            ].map((row, i) => (
                                <tr key={i} className="group hover:bg-white/5">
                                    <td className="p-4 text-white font-mono">{row.date}</td>
                                    <td className="p-4 text-text-secondary">{row.orders}</td>
                                    <td className="p-4 text-white font-mono text-right">{row.gross}</td>
                                    <td className="p-4 text-state-danger font-mono text-right">{row.returns}</td>
                                    <td className="p-4 text-primary font-bold font-mono text-right">{row.net}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </GlassPanel>
            </div>
        </AppShell>
    );
}
