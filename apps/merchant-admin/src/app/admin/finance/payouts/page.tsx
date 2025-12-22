'use client';

import React from 'react';
import Link from 'next/link';
import { AppShell } from '@vayva/ui';
import { GlassPanel } from '@vayva/ui';
import { Button } from '@vayva/ui';
import { Icon } from '@vayva/ui';

const MOCK_PAYOUTS = [
    { id: 'PO-8821', amount: '₦ 450,200', status: 'Processing', bank: 'GTBank •••• 1234', period: 'Oct 20 - Oct 27', date: 'Oct 28' },
    { id: 'PO-8820', amount: '₦ 320,000', status: 'Paid', bank: 'GTBank •••• 1234', period: 'Oct 13 - Oct 20', date: 'Oct 21' },
    { id: 'PO-8819', amount: '₦ 15,500', status: 'Paid', bank: 'GTBank •••• 1234', period: 'Oct 06 - Oct 13', date: 'Oct 14' },
];

export default function PayoutsPage() {
    return (
        <AppShell sidebar={<></>} header={<></>}>
            <div className="flex flex-col gap-6">
                {/* KPI Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { label: 'Next Payout', value: '₦ 450,200', icon: 'Clock', color: 'text-white' },
                        { label: 'Paid this Month', value: '₦ 1,250,000', icon: 'Banknote', color: 'text-state-success' },
                        { label: 'Pending Payouts', value: '1', icon: 'Clock', color: 'text-state-warning' },
                    ].map((stat, i) => (
                        <GlassPanel key={i} className="p-4 flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-text-secondary text-xs font-bold uppercase tracking-wider">
                                <Icon name={stat.icon as any} size={16} />
                                {stat.label}
                            </div>
                            <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                        </GlassPanel>
                    ))}
                </div>

                {/* Filters */}
                <GlassPanel className="p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="w-full md:w-auto relative">
                        <Icon name={"Search" as any} size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                        <input
                            className="bg-white/5 border border-white/5 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary w-full md:w-64"
                            placeholder="Search payout ID..."
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        {['All', 'Pending', 'Processing', 'Paid', 'Failed'].map((status, i) => (
                            <button key={status} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap ${i === 0 ? 'bg-white text-background-dark' : 'bg-white/5 text-text-secondary hover:bg-white/10'}`}>
                                {status}
                            </button>
                        ))}
                    </div>
                </GlassPanel>

                {/* Table */}
                <GlassPanel className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white/5 text-text-secondary uppercase text-xs font-bold border-b border-white/5">
                                <tr>
                                    <th className="p-4">Payout ID</th>
                                    <th className="p-4">Amount</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Bank</th>
                                    <th className="p-4">Settlement Period</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {MOCK_PAYOUTS.map((po) => (
                                    <tr key={po.id} className="group hover:bg-white/5 transition-colors cursor-pointer">
                                        <td className="p-4 font-bold text-white font-mono text-xs">{po.id}</td>
                                        <td className="p-4 font-mono text-white">{po.amount}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${po.status === 'Paid' ? 'bg-state-success/10 text-state-success' :
                                                po.status === 'Processing' ? 'bg-primary/10 text-primary' : 'bg-white/10 text-text-secondary'
                                                }`}>
                                                {po.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-text-secondary text-xs">{po.bank}</td>
                                        <td className="p-4 text-text-secondary text-xs">{po.period}</td>
                                        <td className="p-4 text-text-secondary text-xs">{po.date}</td>
                                        <td className="p-4 text-right">
                                            <Link href={`/admin/finance/payouts/${po.id}`}>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-text-secondary hover:text-white">
                                                    <Icon name={"ChevronRight" as any} size={20} />
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </GlassPanel>
            </div>
        </AppShell>
    );
}
