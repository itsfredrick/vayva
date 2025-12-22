'use client';

import React from 'react';
import { OpsShell } from '@/components/ops/ops-shell';
import { RiskChip } from '@/components/ops/risk-chip';
import { Button , Icon } from '@vayva/ui';

const MOCK_LISTINGS = [
    { id: '1', name: 'Cheap iPhone 15 Pro', merchant: 'ScamStore99', category: 'Phones', status: 'Pending', risk: 'High', reason: 'Price too low' },
    { id: '2', name: 'Herbal Supplement', merchant: 'OrganicLife', category: 'Health', status: 'Flagged', risk: 'Medium', reason: 'Prohibited Item?' },
    { id: '3', name: 'Nike Air Force', merchant: 'KicksLagos', category: 'Fashion', status: 'Pending', risk: 'Low', reason: '-' },
];

export default function OpsModerationPage() {
    return (
        <OpsShell
            title="Moderation Queue"
            description="Review flagged listings and enforce marketplace policies."
        >
            {/* Tabs */}
            <div className="flex gap-1 border-b border-white/10 mb-6">
                {['Pending', 'Flagged', 'Approved', 'Rejected'].map(tab => (
                    <button key={tab} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === 'Pending' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-white'}`}>{tab}</button>
                ))}
            </div>

            {/* Content */}
            <div className="border border-white/10 rounded-xl overflow-hidden bg-[#0b141a]/50">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-text-secondary border-b border-white/5 font-medium uppercase text-xs tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Listing</th>
                            <th className="px-6 py-4">Merchant</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Risk Level</th>
                            <th className="px-6 py-4">Flag Reason</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {MOCK_LISTINGS.map((l) => (
                            <tr key={l.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 font-bold text-white shrink-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white/5 rounded border border-white/5 flex items-center justify-center">
                                            <Icon name="Image" size={16} />
                                        </div>
                                        {l.name}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-white underline decoration-white/30 hover:decoration-white cursor-pointer">{l.merchant}</td>
                                <td className="px-6 py-4 text-text-secondary">{l.category}</td>
                                <td className="px-6 py-4"><RiskChip level={l.risk as any} showIcon={false} /></td>
                                <td className="px-6 py-4 text-text-secondary">{l.reason}</td>
                                <td className="px-6 py-4 text-right flex gap-2 justify-end">
                                    <Button size="sm" className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border-none font-bold">Approve</Button>
                                    <Button size="sm" className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border-none font-bold">Reject</Button>
                                    <Button size="sm" variant="ghost" className="text-text-secondary hover:text-white"><Icon name="Eye" /></Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </OpsShell>
    );
}
