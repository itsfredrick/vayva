'use client';

import React from 'react';
import Link from 'next/link';
import { OpsShell } from '@/components/ops/ops-shell';
import { RiskChip } from '@/components/ops/risk-chip';
import { Button , Icon } from '@vayva/ui';

const MOCK_MERCHANT = {
    id: '1',
    name: 'TechDepot',
    subdomain: 'techdepot',
    owner: 'John Smith',
    email: 'john@techdepot.com',
    phone: '+234 801 234 5678',
    status: 'Active',
    risk: 'Low',
    joined: 'Oct 12, 2024',
    gmv: '₦ 45.2M'
};

export default function OpsMerchantDetailPage({ params }: { params: { id: string } }) {
    return (
        <OpsShell
            title={`Merchant: ${MOCK_MERCHANT.name}`}
            description={`ID: ${MOCK_MERCHANT.id} • Joined ${MOCK_MERCHANT.joined}`}
            actions={
                <div className="flex gap-2">
                    <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 gap-2">
                        <Icon name="LogIn" size={16} /> Impersonate
                    </Button>
                    <Button className="bg-red-500/10 text-red-400 border border-red-500/50 hover:bg-red-500/20 gap-2">
                        <Icon name="Ban" size={16} /> Suspend Store
                    </Button>
                </div>
            }
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Overview Panel */}
                    <section className="bg-white/5 border border-white/5 rounded-xl p-6">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                            <Icon name="Info" className="text-text-secondary" /> Overview
                        </h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <div className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-1">Owner Identity</div>
                                <div className="text-white font-medium">{MOCK_MERCHANT.owner}</div>
                                <div className="text-sm text-text-secondary">{MOCK_MERCHANT.email}</div>
                                <div className="text-sm text-text-secondary">{MOCK_MERCHANT.phone}</div>
                            </div>
                            <div>
                                <div className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-1">Store Health</div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                    <span className="text-white">Storefront Online</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                    <span className="text-white">Marketplace Enabled</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Payments & Payouts */}
                    <section className="bg-white/5 border border-white/5 rounded-xl p-6">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                            <Icon name="Banknote" className="text-text-secondary" /> Payments & Payouts
                        </h3>
                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider mb-1">Lifetime GMV</div>
                                <div className="text-2xl font-bold text-white">{MOCK_MERCHANT.gmv}</div>
                            </div>
                            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                                <div className="text-xs text-text-secondary font-bold uppercase tracking-wider mb-1">Last Payout</div>
                                <div className="text-2xl font-bold text-white">₦ 1,250,000</div>
                                <div className="text-xs text-text-secondary mt-1">Processed Yesterday</div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-sm font-bold text-white">Recent Transactions</h4>
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-xs text-text-secondary">Tx</div>
                                        <div>
                                            <div className="text-sm text-white">Order #882{i}</div>
                                            <div className="text-xs text-text-secondary">Dec 1{i}, 2024</div>
                                        </div>
                                    </div>
                                    <div className="text-sm font-medium text-white">₦ 45,000</div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right Column */}
                <div className="space-y-6">

                    {/* Risk Profile */}
                    <section className="bg-white/5 border border-white/5 rounded-xl p-6">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-white font-bold flex items-center gap-2">
                                <Icon name="Shield" className="text-text-secondary" /> Risk Profile
                            </h3>
                            <RiskChip level="Low" />
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-text-secondary">Refund Rate</span>
                                <span className="text-white">0.5%</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-text-secondary">Dispute Rate</span>
                                <span className="text-white">0.1%</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-text-secondary">Chargebacks</span>
                                <span className="text-white">0</span>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/10">
                            <Button variant="ghost" size="sm" className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 justify-start gap-2">
                                <Icon name="Flag" size={16} /> Add Internal Flag
                            </Button>
                        </div>
                    </section>

                    {/* Audit Log Snippet */}
                    <section className="bg-white/5 border border-white/5 rounded-xl p-6">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                            <Icon name="History" className="text-text-secondary" /> Recent Activity
                        </h3>
                        <div className="space-y-4 relative pl-2 border-l border-white/10">
                            {[
                                { action: 'Payout Processed', user: 'System', time: '1 day ago' },
                                { action: 'Marketplace Enabled', user: 'Admin (Sarah)', time: '5 days ago' },
                                { action: 'KYC Verified', user: 'System', time: '5 days ago' },
                            ].map((log, i) => (
                                <div key={i} className="relative pl-4">
                                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-white/20" />
                                    <div className="text-sm text-white font-medium">{log.action}</div>
                                    <div className="text-xs text-text-secondary">{log.user} • {log.time}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                </div>

            </div>
        </OpsShell>
    );
}
