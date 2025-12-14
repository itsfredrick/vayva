'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AdminShell } from '@/components/admin-shell';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { StatusBadge } from '@/components/ui/status-badge';
import { MoneyBreakdown } from '@/components/money-breakdown';

export default function TransactionDetailPage() {
    const params = useParams();
    const id = params.id as string;

    const tx = {
        id,
        status: 'paid',
        amount: '₦ 51,500',
        customer: { name: 'Chinedu Okafor', email: 'chinedu@example.com' },
        order: 'VV-1024',
        provider: 'Paystack',
        ref: 'T392039201',
        payment_method: 'Card •••• 4242',
        timeline: [
            { id: 1, title: 'Payment Verified', date: 'Oct 24, 10:24 AM', description: 'Transaction successful via Paystack.' },
            { id: 2, title: 'Webhook Received', date: 'Oct 24, 10:23 AM', description: 'Webhook event: charge.success' },
            { id: 3, title: 'Payment Initiated', date: 'Oct 24, 10:20 AM', description: 'Customer started checkout.' },
        ]
    };

    return (
        <AdminShell title={`Transaction ${tx.id}`} breadcrumb={`Finance / Transactions / ${tx.id}`}>
            <div className="flex flex-col gap-6 max-w-6xl mx-auto">
                {/* Header Actions */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <StatusBadge status={tx.status} />
                        <span className="text-text-secondary text-sm ml-2">Processed on Oct 24, 10:24 AM</span>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                            <Icon name="refresh" size={16} className="mr-2" />
                            Re-check Status
                        </Button>
                        <Button variant="outline" size="sm">
                            View Order
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        {/* 1. Summary */}
                        <GlassPanel className="p-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Customer</h3>
                                    <p className="font-bold text-white">{tx.customer.name}</p>
                                    <p className="text-sm text-text-secondary">{tx.customer.email}</p>
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Order</h3>
                                    <Link href={`/admin/orders/${tx.order}`} className="text-primary hover:underline font-bold">
                                        {tx.order}
                                    </Link>
                                </div>
                                <div className="col-span-2 pt-4 border-t border-white/5">
                                    <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Provider Details</h3>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-white font-bold">{tx.provider}</span>
                                        <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-text-secondary font-mono">{tx.ref}</span>
                                        <button className="text-primary hover:text-white transition-colors"><Icon name="content_copy" size={14} /></button>
                                    </div>
                                    <p className="text-sm text-text-secondary">{tx.payment_method}</p>
                                </div>
                            </div>
                        </GlassPanel>

                        {/* 2. Timeline */}
                        <GlassPanel className="p-6">
                            <h3 className="font-bold text-white mb-4">Event Timeline</h3>
                            <div className="space-y-6 relative ml-2">
                                {/* Vertical Line */}
                                <div className="absolute left-1.5 top-2 bottom-2 w-px bg-white/10 z-0" />

                                {tx.timeline.map((event) => (
                                    <div key={event.id} className="relative z-10 pl-6 group">
                                        <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-[#142210] border-2 border-primary group-last:border-text-secondary transition-colors" />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-white">{event.title}</span>
                                            <span className="text-xs text-text-secondary mb-1">{event.description}</span>
                                            <span className="text-[10px] text-text-secondary opacity-60">{event.date}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </GlassPanel>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="flex flex-col gap-6">
                        <MoneyBreakdown
                            subtotal="₦ 50,000"
                            delivery="₦ 1,500"
                            total="₦ 51,500"
                            fees="₦ 772.50"
                            net="₦ 50,727.50"
                            showNet={true}
                        />

                        <GlassPanel className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-bold text-white">Refunds</h3>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                                <p className="text-sm text-text-secondary mb-2">No refunds recorded</p>
                                <Button variant="outline" size="sm" className="w-full">Initiate Refund</Button>
                            </div>
                        </GlassPanel>
                    </div>
                </div>
            </div>
        </AdminShell>
    );
}
