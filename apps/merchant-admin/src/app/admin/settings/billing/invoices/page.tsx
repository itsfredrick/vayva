'use client';

import React from 'react';
import { AppShell } from '@vayva/ui';
import { GlassPanel } from '@vayva/ui';
import { Button } from '@vayva/ui';
import { Icon } from '@vayva/ui';

export default function InvoicesPage() {
    return (
        <AppShell sidebar={<></>} header={<></>}>
            <div className="max-w-5xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-white">Invoices</h1>
                    <p className="text-text-secondary">Billing history and downloads.</p>
                </div>
                <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-2">
                        <div className="relative">
                            <Icon name={"Search" as any} size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                            <input className="bg-white/5 border border-white/5 rounded-full pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary" placeholder="Search invoices..." />
                        </div>
                        <select className="bg-white/5 border border-white/5 rounded-full px-4 py-2 text-sm text-white focus:outline-none">
                            <option>All Status</option>
                            <option>Paid</option>
                            <option>Pending</option>
                        </select>
                    </div>
                    <Button variant="outline" size="sm">Download All CSV</Button>
                </div>

                <GlassPanel className="p-0 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white/5 text-text-secondary uppercase text-xs font-bold border-b border-white/5">
                                <tr>
                                    <th className="p-4">Invoice ID</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Plan</th>
                                    <th className="p-4">Amount</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {[
                                    { id: 'INV-2024-001', date: 'Jan 14, 2026', plan: 'Growth Plan (Monthly)', amount: '₦ 15,000', status: 'Paid' },
                                    { id: 'INV-2023-128', date: 'Dec 14, 2025', plan: 'Growth Plan (Monthly)', amount: '₦ 15,000', status: 'Paid' },
                                    { id: 'INV-2023-115', date: 'Nov 14, 2025', plan: 'Growth Plan (Monthly)', amount: '₦ 15,000', status: 'Paid' },
                                    { id: 'INV-2023-102', date: 'Oct 14, 2025', plan: 'Starter Plan', amount: '₦ 0', status: 'Paid' },
                                ].map((inv) => (
                                    <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-mono text-text-secondary">{inv.id}</td>
                                        <td className="p-4 text-white">{inv.date}</td>
                                        <td className="p-4 text-white">{inv.plan}</td>
                                        <td className="p-4 text-white font-bold">{inv.amount}</td>
                                        <td className="p-4">
                                            <span className="px-2 py-0.5 rounded bg-state-success/10 text-state-success text-[10px] font-bold uppercase tracking-wider">
                                                {inv.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <Button variant="ghost" size="sm" className="h-8">Download PDF</Button>
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
