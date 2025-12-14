'use client';

import React from 'react';
import Link from 'next/link';
import { OpsShell } from '@/components/ops/ops-shell';
import { RiskChip } from '@/components/ops/risk-chip';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

const MOCK_MERCHANTS = [
    { id: '1', name: 'TechDepot', subdomain: 'techdepot', owner: 'john@techdepot.com', status: 'Active', risk: 'Low', marketplace: true, gmv: '₦ 12.5M', lastActive: '2 min ago' },
    { id: '2', name: 'ScamStore99', subdomain: 'cheap-phones', owner: 'anon@gmail.com', status: 'Suspended', risk: 'High', marketplace: false, gmv: '₦ 0', lastActive: '1 day ago' },
    { id: '3', name: 'KicksLagos', subdomain: 'kickslagos', owner: 'sarah@kicks.com', status: 'Active', risk: 'Medium', marketplace: true, gmv: '₦ 4.2M', lastActive: '1 hour ago' },
    { id: '4', name: 'GadgetWorld', subdomain: 'gadget-world', owner: 'mike@gadgets.com', status: 'Onboarding', risk: 'Low', marketplace: false, gmv: '₦ 0', lastActive: '5 hours ago' },
];

export default function OpsMerchantsPage() {
    return (
        <OpsShell
            title="Merchants"
            description="Manage stores, review risk profiles, and handle account actions."
            actions={
                <Button variant="outline" className="text-white border-white/10 hover:bg-white/5 gap-2">
                    <Icon name="file_download" size={18} /> Export CSV
                </Button>
            }
        >

            {/* Filters */}
            <div className="bg-white/5 border border-white/5 rounded-xl p-4 mb-6 flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded border border-white/10 text-sm text-text-secondary min-w-[200px]">
                    <Icon name="filter_list" size={16} />
                    <span>All Statuses</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded border border-white/10 text-sm text-text-secondary min-w-[200px]">
                    <Icon name="warning" size={16} />
                    <span>All Risk Levels</span>
                </div>
                <div className="flex-1" />
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <span>Sort by:</span>
                    <span className="text-white font-medium cursor-pointer">Highest GMV</span>
                </div>
            </div>

            {/* Table */}
            <div className="border border-white/10 rounded-xl overflow-hidden bg-[#0b141a]/50">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-text-secondary border-b border-white/5 font-medium uppercase text-xs tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Merchant</th>
                            <th className="px-6 py-4">Owner</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Risk</th>
                            <th className="px-6 py-4">Marketplace</th>
                            <th className="px-6 py-4 text-right">GMV (MTD)</th>
                            <th className="px-6 py-4">Last Active</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {MOCK_MERCHANTS.map((m) => (
                            <tr key={m.id} className="hover:bg-white/5 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-white">{m.name}</div>
                                    <div className="text-text-secondary text-xs">{m.subdomain}.vayva.store</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-white">{m.owner}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded textxs font-medium border
                                        ${m.status === 'Active' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                            m.status === 'Suspended' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                'bg-blue-500/10 text-blue-400 border-blue-500/20'}
                                    `}>
                                        {m.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <RiskChip level={m.risk as any} />
                                </td>
                                <td className="px-6 py-4">
                                    {m.marketplace ? <Icon name="check" size={16} className="text-green-400" /> : <span className="text-white/20">-</span>}
                                </td>
                                <td className="px-6 py-4 text-right font-mono text-white">
                                    {m.gmv}
                                </td>
                                <td className="px-6 py-4 text-text-secondary text-xs">
                                    {m.lastActive}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Link href={`/ops/merchants/${m.id}`}>
                                        <Button size="sm" variant="ghost" className="text-text-secondary hover:text-white">View</Button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </OpsShell>
    );
}
