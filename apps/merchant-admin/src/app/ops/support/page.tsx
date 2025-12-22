'use client';

import React from 'react';
import { OpsShell } from '@/components/ops/ops-shell';
import { RiskChip } from '@/components/ops/risk-chip';
import { Button , Icon } from '@vayva/ui';

const MOCK_TICKETS = [
    { id: '1', merchant: 'TechDepot', subject: 'Payout not received', status: 'Open', priority: 'High', time: '10 min ago' },
    { id: '2', merchant: 'KicksLagos', subject: 'How to add variants?', status: 'Pending', priority: 'Low', time: '2 hours ago' },
];

export default function OpsSupportPage() {
    return (
        <OpsShell
            title="Support Tickets"
            description="Manage inbound requests from merchants."
        >
            <div className="border border-white/10 rounded-xl overflow-hidden bg-[#0b141a]/50">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-text-secondary border-b border-white/5 font-medium uppercase text-xs tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Merchant</th>
                            <th className="px-6 py-4">Subject</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Priority</th>
                            <th className="px-6 py-4">Time</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {MOCK_TICKETS.map((t) => (
                            <tr key={t.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 text-white font-bold">{t.merchant}</td>
                                <td className="px-6 py-4 text-white">{t.subject}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium 
                                        ${t.status === 'Open' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'}
                                    `}>
                                        {t.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-text-secondary">{t.priority}</td>
                                <td className="px-6 py-4 text-text-secondary">{t.time}</td>
                                <td className="px-6 py-4 text-right">
                                    <Button size="sm" variant="ghost" className="text-text-secondary hover:text-white">Open</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </OpsShell>
    );
}
