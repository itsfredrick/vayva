'use client';

import React from 'react';
import { OpsShell } from '@/components/ops/ops-shell';
import { RiskChip } from '@/components/ops/risk-chip';
import { Button } from '@vayva/ui';
import { Icon } from '@vayva/ui';

const MOCK_ISSUES = [
    { id: '1', merchant: 'GadgetWorld', amount: '₦ 150,000', bank: 'Access Bank', error: 'Invalid Account Number', date: 'Dec 14' },
];

export default function OpsPayoutsPage() {
    return (
        <OpsShell
            title="Payout Issues"
            description="Reconciliation and failed payout monitoring."
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white/5 border border-white/5 rounded-xl p-6">
                    <h3 className="font-bold text-white mb-4">Reconciliation Status</h3>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-emerald-400 font-medium">All Systems Operational</span>
                    </div>
                    <p className="text-sm text-text-secondary">Last sync: 10 mins ago. No mismatches found.</p>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-xl p-6">
                    <h3 className="font-bold text-white mb-4">Payout Health</h3>
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="text-2xl font-bold text-white">99.8%</div>
                            <div className="text-xs text-text-secondary">Success Rate (24h)</div>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-red-400">1</div>
                            <div className="text-xs text-text-secondary">Failed Payouts</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border border-white/10 rounded-xl overflow-hidden bg-[#0b141a]/50">
                <div className="p-4 bg-white/5 border-b border-white/5 font-bold text-white flex items-center gap-2">
                    <Icon name={"AlertCircle" as any} className="w-12 h-12 text-red-500 mb-2" size={18} /> Failed Payouts Queue
                </div>
                <table className="w-full text-left text-sm">
                    <thead className="bg-[#0b141a] text-text-secondary border-b border-white/5 font-medium uppercase text-xs tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Merchant</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Bank</th>
                            <th className="px-6 py-4">Error</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {MOCK_ISSUES.map((i) => (
                            <tr key={i.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 text-white font-bold">{i.merchant}</td>
                                <td className="px-6 py-4 text-white font-mono">{i.amount}</td>
                                <td className="px-6 py-4 text-text-secondary">{i.bank}</td>
                                <td className="px-6 py-4 text-red-400">{i.error}</td>
                                <td className="px-6 py-4 text-text-secondary">{i.date}</td>
                                <td className="px-6 py-4 text-right">
                                    <Button size="sm" variant="outline" className="border-white/10 text-white hover:bg-white/5">Retry</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </OpsShell>
    );
}
