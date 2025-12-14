'use client';

import React from 'react';
import Link from 'next/link';
import { AdminShell } from '@/components/admin-shell';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

function UsageCard({ title, used, limit, resetDate, link }: { title: string, used: number, limit: number, resetDate: string, link: string }) {
    const percentage = Math.min((used / limit) * 100, 100);
    const isWarning = percentage > 80;
    const isCritical = percentage >= 100;

    return (
        <GlassPanel className="p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-white text-sm">{title}</h3>
                <Link href={link} className="text-xs text-primary hover:underline">Manage</Link>
            </div>
            <div>
                <div className="flex justify-between items-end mb-2">
                    <div className="text-2xl font-bold text-white">
                        {used.toLocaleString()} <span className="text-sm text-text-secondary font-normal">/ {limit.toLocaleString()}</span>
                    </div>
                    {isCritical && <span className="text-[10px] bg-state-danger/20 text-state-danger px-1.5 py-0.5 rounded font-bold uppercase">Limit Reached</span>}
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ${isCritical ? 'bg-state-danger' : isWarning ? 'bg-state-warning' : 'bg-primary'}`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <div className="text-[10px] text-text-secondary">Resets on {resetDate}</div>
            </div>
            {isWarning && (
                <Link href="/admin/settings/billing/plans">
                    <Button size="sm" variant="outline" className="w-full mt-4 text-xs">Upgrade Plan</Button>
                </Link>
            )}
        </GlassPanel>
    );
}

export default function BillingDashboardPage() {
    return (
        <AdminShell title="Billing & Subscription" breadcrumb="Settings / Billing">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Top Row: Current Plan & Payment */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <GlassPanel className="p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-50"><Icon name="local_activity" size={64} className="text-white/5" /></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-lg font-bold text-white">Current Plan</h2>
                                <span className="px-2 py-0.5 rounded bg-state-success/10 text-state-success text-[10px] font-bold uppercase tracking-wider border border-state-success/20">Active</span>
                            </div>
                            <div className="text-3xl font-bold text-white mb-1">Growth Tier</div>
                            <div className="text-sm text-text-secondary mb-6">₦ 15,000 / month • Renews Feb 14, 2026</div>
                            <div className="flex gap-3">
                                <Link href="/admin/settings/billing/plans">
                                    <Button className="bg-white text-black hover:bg-white/90 border-none">Change Plan</Button>
                                </Link>
                                <Button variant="ghost" className="text-state-warning hover:bg-state-warning/10 hover:text-state-warning">Cancel</Button>
                            </div>
                        </div>
                    </GlassPanel>

                    <GlassPanel className="p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-50"><Icon name="credit_card" size={64} className="text-white/5" /></div>
                        <div className="relative z-10">
                            <h2 className="text-lg font-bold text-white mb-4">Payment Method</h2>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-8 rounded bg-white/10 flex items-center justify-center">
                                    <Icon name="credit_card" />
                                </div>
                                <div>
                                    <div className="font-bold text-white">Mastercard •••• 4242</div>
                                    <div className="text-xs text-text-secondary">Expires 12/28</div>
                                </div>
                            </div>
                            <Button variant="outline" size="sm">Update Payment Method</Button>
                        </div>
                    </GlassPanel>
                </div>

                {/* Usage & Limits */}
                <div>
                    <h2 className="text-lg font-bold text-white mb-4">Usage & Limits</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <UsageCard title="Products" used={124} limit={500} resetDate="N/A" link="/admin/products" />
                        <UsageCard title="Staff Members" used={3} limit={5} resetDate="N/A" link="/admin/settings/staff" />
                        <UsageCard title="WhatsApp Conversations" used={1420} limit={1500} resetDate="Feb 1, 2026" link="/admin/whatsapp" />
                    </div>
                </div>

                {/* Recent Invoices Snippet */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-white">Recent Invoices</h2>
                        <Link href="/admin/settings/billing/invoices" className="text-sm text-primary hover:underline font-bold">View All</Link>
                    </div>
                    <GlassPanel className="p-0 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-white/5 text-text-secondary uppercase text-xs font-bold border-b border-white/5">
                                    <tr>
                                        <th className="p-4">Invoice ID</th>
                                        <th className="p-4">Date</th>
                                        <th className="p-4">Amount</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {[
                                        { id: 'INV-2024-001', date: 'Jan 14, 2026', amount: '₦ 15,000', status: 'Paid' },
                                        { id: 'INV-2023-128', date: 'Dec 14, 2025', amount: '₦ 15,000', status: 'Paid' },
                                        { id: 'INV-2023-115', date: 'Nov 14, 2025', amount: '₦ 15,000', status: 'Paid' },
                                    ].map((inv) => (
                                        <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                                            <td className="p-4 font-mono text-text-secondary">{inv.id}</td>
                                            <td className="p-4 text-white">{inv.date}</td>
                                            <td className="p-4 text-white font-bold">{inv.amount}</td>
                                            <td className="p-4">
                                                <span className="px-2 py-0.5 rounded bg-state-success/10 text-state-success text-[10px] font-bold uppercase tracking-wider">
                                                    {inv.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <Button variant="ghost" size="sm" className="h-8"><Icon name="download" size={16} /></Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </GlassPanel>
                </div>

            </div>
        </AdminShell>
    );
}
