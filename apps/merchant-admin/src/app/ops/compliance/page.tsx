'use client';

import React from 'react';
import { OpsShell } from '@/components/ops/ops-shell';
import { RiskChip } from '@/components/ops/risk-chip';
import { Button , Icon } from '@vayva/ui';

const MOCK_FLAGS = [
    { id: '1', merchant: 'ScamStore99', trigger: 'Refund me now or I report', severity: 'High', time: '10 min ago' },
    { id: '2', merchant: 'TechDepot', trigger: 'Password reset', severity: 'Low', time: '1 hour ago' },
];

export default function OpsCompliancePage() {
    return (
        <OpsShell
            title="Compliance & AI Safety"
            description="Monitor WhatsApp AI interactions and flagged conversations."
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                    { label: 'Flagged Conversations', value: '12', color: 'text-white' },
                    { label: 'High Severity', value: '3', color: 'text-red-400' },
                    { label: 'Escalated to Agent', value: '5', color: 'text-orange-400' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white/5 border border-white/5 rounded-xl p-6">
                        <div className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-1">{stat.label}</div>
                        <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                    </div>
                ))}
            </div>

            <div className="border border-white/10 rounded-xl overflow-hidden bg-[#0b141a]/50">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-text-secondary border-b border-white/5 font-medium uppercase text-xs tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Merchant</th>
                            <th className="px-6 py-4">Trigger / Context</th>
                            <th className="px-6 py-4">Severity</th>
                            <th className="px-6 py-4">Time</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {MOCK_FLAGS.map((f) => (
                            <tr key={f.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 font-bold text-white">{f.merchant}</td>
                                <td className="px-6 py-4 text-text-secondary max-w-sm truncate whitespace-nowrap">
                                    "{f.trigger}"
                                </td>
                                <td className="px-6 py-4"><RiskChip level={f.severity as any} /></td>
                                <td className="px-6 py-4 text-text-secondary">{f.time}</td>
                                <td className="px-6 py-4 text-right">
                                    <Button size="sm" variant="ghost" className="text-text-secondary hover:text-white gap-2">
                                        <Icon name="MessageSquare" size={16} /> Review Transcript
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </OpsShell>
    );
}
