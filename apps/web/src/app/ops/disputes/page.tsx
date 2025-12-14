'use client';

import React from 'react';
import { OpsShell } from '@/components/ops/ops-shell';
import { RiskChip } from '@/components/ops/risk-chip';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

const MOCK_DISPUTES = [
    { id: 'DSP-8821', merchant: 'TechDepot', amount: '₦ 45,000', reason: 'Item not received', due: '48 hours', status: 'Open' },
    { id: 'DSP-9920', merchant: 'KicksLagos', amount: '₦ 12,000', reason: 'Fraudulent transaction', due: '5 days', status: 'Under Review' },
];

export default function OpsDisputesPage() {
    return (
        <OpsShell
            title="Disputes"
            description="Manage and respond to payment disputes from Paystack."
        >
            <div className="border border-white/10 rounded-xl overflow-hidden bg-[#0b141a]/50">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-text-secondary border-b border-white/5 font-medium uppercase text-xs tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Dispute ID</th>
                            <th className="px-6 py-4">Merchant</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Reason</th>
                            <th className="px-6 py-4">Deadline</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {MOCK_DISPUTES.map((d) => (
                            <tr key={d.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 font-mono text-white text-xs">{d.id}</td>
                                <td className="px-6 py-4 text-white font-bold">{d.merchant}</td>
                                <td className="px-6 py-4 text-white">{d.amount}</td>
                                <td className="px-6 py-4 text-text-secondary">{d.reason}</td>
                                <td className={`px-6 py-4 font-bold ${d.due.includes('hour') ? 'text-red-400' : 'text-text-secondary'}`}>{d.due}</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-white/5 border border-white/10 text-white">
                                        {d.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Button size="sm" variant="ghost" className="text-text-secondary hover:text-white">View</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </OpsShell>
    );
}
