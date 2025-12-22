'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AppShell , GlassPanel , Button , Icon } from '@vayva/ui';

export default function PayoutDetailPage() {
    const params = useParams();
    const id = params.id as string;

    const payout = {
        id,
        amount: '₦ 450,200',
        status: 'Processing',
        bank: 'GTBank •••• 1234',
        accountName: 'Vayva Store Ltd',
        date: 'Oct 28, 2024',
        period: 'Oct 20 - Oct 27',
        reconciliation: [
            { label: 'Gross Payments', amount: '₦ 465,000', count: 12 },
            { label: 'Less Fees', amount: '- ₦ 6,800', count: 12 },
            { label: 'Less Refunds', amount: '- ₦ 8,000', count: 1 },
        ]
    };

    return (
        <AppShell sidebar={<></>} header={<></>}>
            <div className="flex flex-col gap-6 max-w-6xl mx-auto">
                {/* Header Actions */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary`}>
                            {payout.status}
                        </span>
                        <span className="text-text-secondary text-sm ml-2">to {payout.bank}</span>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                            <Icon name={"Download" as any} size={16} className="mr-2" />
                            Statement
                        </Button>
                        <Button variant="outline" size="sm">
                            Contact Support
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
                                    <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Amount Paid</h3>
                                    <p className="text-2xl font-bold text-white">{payout.amount}</p>
                                </div>
                                <div className="text-right">
                                    <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Date</h3>
                                    <p className="text-white">{payout.date}</p>
                                </div>
                                <div className="col-span-2 pt-4 border-t border-white/5">
                                    <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Destination</h3>
                                    <div className="flex items-center gap-2">
                                        <Icon name={"Landmark" as any} className="text-text-secondary" />
                                        <span className="text-white font-bold">{payout.bank}</span>
                                        <span className="text-text-secondary text-sm">({payout.accountName})</span>
                                    </div>
                                </div>
                            </div>
                        </GlassPanel>

                        {/* 2. Reconciliation */}
                        <GlassPanel className="p-0 overflow-hidden">
                            <div className="p-6 border-b border-white/5">
                                <h3 className="font-bold text-white">Reconciliation</h3>
                            </div>
                            <div className="divide-y divide-white/5">
                                {payout.reconciliation.map((line, i) => (
                                    <div key={i} className="p-4 flex items-center justify-between hover:bg-white/5 cursor-pointer transition-colors group">
                                        <div className="flex items-center gap-2">
                                            <Icon name={"ChevronRight" as any} size={16} className="text-text-secondary group-hover:text-white" />
                                            <span className="text-text-secondary">{line.label}</span>
                                            <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-text-secondary">{line.count} items</span>
                                        </div>
                                        <div className={`font-mono font-bold ${line.amount.startsWith('-') ? 'text-state-danger' : 'text-white'}`}>
                                            {line.amount}
                                        </div>
                                    </div>
                                ))}
                                <div className="p-4 flex items-center justify-between bg-white/5">
                                    <span className="font-bold text-white">Net Payout</span>
                                    <span className="font-bold text-primary text-lg">{payout.amount}</span>
                                </div>
                            </div>
                        </GlassPanel>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="flex flex-col gap-6">
                        <GlassPanel className="p-6">
                            <h3 className="font-bold text-white mb-2">Settlement Window</h3>
                            <p className="text-sm text-text-secondary mb-4">{payout.period}</p>
                            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                                <p className="text-xs text-primary">All payments fully cleared in this cycle.</p>
                            </div>
                        </GlassPanel>

                        <GlassPanel className="p-6">
                            <h3 className="font-bold text-white mb-2">Exceptions</h3>
                            <p className="text-sm text-text-secondary mb-4">Transactions excluded from this payout.</p>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                                <span className="text-sm text-text-secondary">Disputed</span>
                                <span className="text-sm font-bold text-white">0</span>
                            </div>
                        </GlassPanel>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
