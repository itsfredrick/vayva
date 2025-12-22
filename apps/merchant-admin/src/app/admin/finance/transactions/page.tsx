'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@vayva/ui';
import { GlassPanel } from '@vayva/ui';
import { Button } from '@vayva/ui';
import { Icon } from '@vayva/ui';
import { StatusChip } from '@vayva/ui';

const MOCK_TRANSACTIONS = [
    { id: 'TX-1001', order: 'VV-1024', customer: 'Chinedu Okafor', amount: '₦ 51,500', status: 'paid', provider: 'Paystack', date: 'Just now' },
    { id: 'TX-1002', order: 'VV-1023', customer: 'Amina Yusuf', amount: '₦ 12,000', status: 'paid', provider: 'Paystack', date: '2 hours ago' },
    { id: 'TX-1003', order: 'VV-1022', customer: 'John Doe', amount: '₦ 4,500', status: 'failed', provider: 'Paystack', date: 'Yesterday' },
];

export default function TransactionsPage() {
    return (
        <AppShell sidebar={<></>} header={<></>}>
            <div className="flex flex-col gap-6">
                {/* KPI Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Received (30d)', value: '₦ 4,250,050', icon: 'Wallet', color: 'text-white' },
                        { label: 'Successful', value: '142', icon: 'CheckCircle', color: 'text-state-success' },
                        { label: 'Failed', value: '5', icon: 'XCircle', color: 'text-state-danger' },
                        { label: 'Pending Refunds', value: '2', icon: 'RotateCcw', color: 'text-state-warning' },
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
                            placeholder="Search by Order ID, Ref..."
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        {['All', 'Successful', 'Pending', 'Failed'].map((status, i) => (
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
                                    <th className="p-4">Transaction ID</th>
                                    <th className="p-4">Customer</th>
                                    <th className="p-4">Order</th>
                                    <th className="p-4">Amount</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Provider</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {MOCK_TRANSACTIONS.map((tx) => (
                                    <tr key={tx.id} className="group hover:bg-white/5 transition-colors cursor-pointer">
                                        <td className="p-4 font-bold text-white font-mono text-xs">{tx.id}</td>
                                        <td className="p-4 text-white">{tx.customer}</td>
                                        <td className="p-4">
                                            <Link href={`/admin/orders/${tx.order}`} className="text-primary hover:underline font-mono text-xs">
                                                {tx.order}
                                            </Link>
                                        </td>
                                        <td className="p-4 font-mono text-white">{tx.amount}</td>
                                        <td className="p-4"><StatusChip status={tx.status} /></td>
                                        <td className="p-4">
                                            <span className="flex items-center gap-1 text-xs text-text-secondary uppercase font-bold tracking-wider">
                                                <Icon name={"CreditCard" as any} size={14} /> {tx.provider}
                                            </span>
                                        </td>
                                        <td className="p-4 text-text-secondary text-xs">{tx.date}</td>
                                        <td className="p-4 text-right">
                                            <Link href={`/admin/finance/transactions/${tx.id}`}>
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
