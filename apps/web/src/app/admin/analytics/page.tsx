'use client';

import React from 'react';
import Link from 'next/link';
import { AdminShell } from '@/components/admin-shell';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Icon } from '@/components/ui/icon';
import { AnalyticsFilterBar } from '@/components/analytics-filter-bar';
import { TrendChart } from '@/components/trend-chart';

export default function AnalyticsOverviewPage() {
    return (
        <AdminShell title="Analytics Overview" breadcrumb="Analytics">
            <div className="flex flex-col gap-6">
                {/* Filters */}
                <AnalyticsFilterBar />

                {/* KPI Row */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                        { label: 'Total Revenue', value: '₦ 4,250,000', delta: '+12%', color: 'text-white' },
                        { label: 'Orders', value: '142', delta: '+5%', color: 'text-white' },
                        { label: 'Avg Order Value', value: '₦ 29,900', delta: '-2%', color: 'text-white' },
                        { label: 'Store Sessions', value: '4,521', delta: '+24%', color: 'text-white' },
                        { label: 'Conversion Rate', value: '3.14%', delta: '+0.5%', color: 'text-state-success' },
                    ].map((stat, i) => (
                        <GlassPanel key={i} className="p-4 flex flex-col gap-1">
                            <div className="text-xs text-text-secondary font-bold uppercase tracking-wider">{stat.label}</div>
                            <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
                            <div className={`text-xs font-bold ${stat.delta.startsWith('+') ? 'text-state-success' : 'text-state-danger'}`}>
                                {stat.delta} <span className="text-text-secondary opacity-60 font-normal">vs last period</span>
                            </div>
                        </GlassPanel>
                    ))}
                </div>

                {/* Main Chart */}
                <GlassPanel className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex bg-white/5 rounded-lg p-1">
                            {['Revenue', 'Orders', 'Sessions'].map((tab, i) => (
                                <button key={tab} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-colors ${i === 0 ? 'bg-white/10 text-white' : 'text-text-secondary hover:text-white'}`}>
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <div className="text-xs text-text-secondary">
                            Highest day: <span className="text-white font-bold">Oct 24 (₦ 450k)</span>
                        </div>
                    </div>
                    <TrendChart data={[120, 200, 150, 300, 250, 400, 350, 450, 400, 300]} height={250} />
                </GlassPanel>

                {/* Details Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Products */}
                    <GlassPanel className="p-0 overflow-hidden h-full">
                        <div className="p-4 border-b border-white/5 flex justify-between items-center">
                            <h3 className="font-bold text-white">Top Products</h3>
                            <Link href="/admin/analytics/products" className="text-xs text-primary hover:underline">View All</Link>
                        </div>
                        <table className="w-full text-left text-sm">
                            <tbody className="divide-y divide-white/5">
                                {[
                                    { name: 'Ultra-Soft T-Shirt', sales: '84 sold', rev: '₦ 840,000' },
                                    { name: 'Classic Leather Watch', sales: '24 sold', rev: '₦ 600,000' },
                                    { name: 'Denim Jacket', sales: '15 sold', rev: '₦ 450,000' },
                                ].map((prod, i) => (
                                    <tr key={i} className="group hover:bg-white/5">
                                        <td className="p-4 text-white font-medium">{prod.name}</td>
                                        <td className="p-4 text-text-secondary">{prod.sales}</td>
                                        <td className="p-4 text-white font-mono text-right">{prod.rev}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </GlassPanel>

                    {/* Top Channels */}
                    <GlassPanel className="p-6 h-full flex flex-col justify-between">
                        <div className="flex justify-between mb-6">
                            <h3 className="font-bold text-white">Sales by Channel</h3>
                            <div className="flex gap-2">
                                <span className="flex items-center gap-1 text-xs text-text-secondary"><span className="w-2 h-2 rounded-full bg-primary" /> Storefront</span>
                                <span className="flex items-center gap-1 text-xs text-text-secondary"><span className="w-2 h-2 rounded-full bg-blue-500" /> WhatsApp</span>
                            </div>
                        </div>

                        <div className="flex h-8 rounded-full overflow-hidden w-full mb-4">
                            <div className="h-full bg-primary" style={{ width: '65%' }} />
                            <div className="h-full bg-blue-500" style={{ width: '25%' }} />
                            <div className="h-full bg-white/20" style={{ width: '10%' }} />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <div className="text-xs text-text-secondary uppercase font-bold">Storefront</div>
                                <div className="text-lg font-bold text-white">65%</div>
                            </div>
                            <div>
                                <div className="text-xs text-text-secondary uppercase font-bold">WhatsApp</div>
                                <div className="text-lg font-bold text-white">25%</div>
                            </div>
                            <div>
                                <div className="text-xs text-text-secondary uppercase font-bold">Marketplace</div>
                                <div className="text-lg font-bold text-white">10%</div>
                            </div>
                        </div>
                    </GlassPanel>
                </div>

                {/* Operational Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <GlassPanel className="p-4 flex items-center justify-between group cursor-pointer hover:border-primary/50 transition-colors">
                        <div>
                            <div className="text-xs text-text-secondary uppercase font-bold">Unfulfilled</div>
                            <div className="text-xl font-bold text-white">12 Orders</div>
                        </div>
                        <Icon name="arrow_forward" className="text-text-secondary group-hover:text-primary" />
                    </GlassPanel>
                    <GlassPanel className="p-4 flex items-center justify-between group cursor-pointer hover:border-primary/50 transition-colors">
                        <div>
                            <div className="text-xs text-text-secondary uppercase font-bold">Disputed</div>
                            <div className="text-xl font-bold text-state-danger">1 Payment</div>
                        </div>
                        <Icon name="arrow_forward" className="text-text-secondary group-hover:text-primary" />
                    </GlassPanel>
                    <GlassPanel className="p-4 flex items-center justify-between group cursor-pointer hover:border-primary/50 transition-colors">
                        <div>
                            <div className="text-xs text-text-secondary uppercase font-bold">Low Stock</div>
                            <div className="text-xl font-bold text-state-warning">3 Products</div>
                        </div>
                        <Icon name="arrow_forward" className="text-text-secondary group-hover:text-primary" />
                    </GlassPanel>
                    <GlassPanel className="p-4 flex items-center justify-between group cursor-pointer hover:border-primary/50 transition-colors">
                        <div>
                            <div className="text-xs text-text-secondary uppercase font-bold">AI Response</div>
                            <div className="text-xl font-bold text-text-secondary">98% Autopilot</div>
                        </div>
                        <Icon name="arrow_forward" className="text-text-secondary group-hover:text-primary" />
                    </GlassPanel>
                </div>
            </div>
        </AdminShell>
    );
}
