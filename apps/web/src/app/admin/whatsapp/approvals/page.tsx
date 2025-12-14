'use client';

import React from 'react';
import Link from 'next/link';
import { AdminShell } from '@/components/admin-shell';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { ActionApprovalCard } from '@/components/action-approval-card';

export default function WhatsAppApprovalsPage() {
    return (
        <AdminShell title="Approvals" breadcrumb="WhatsApp / Approvals">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
                {/* Main Queue */}
                <div className="flex-1 flex flex-col gap-6">
                    {/* Counters */}
                    <div className="grid grid-cols-3 gap-4">
                        <GlassPanel className="p-4 flex flex-col items-center justify-center">
                            <div className="text-2xl font-bold text-white">5</div>
                            <div className="text-xs text-text-secondary uppercase font-bold tracking-wider">Pending</div>
                        </GlassPanel>
                        <GlassPanel className="p-4 flex flex-col items-center justify-center border-emerald-500/20 bg-emerald-900/10">
                            <div className="text-2xl font-bold text-emerald-400">12</div>
                            <div className="text-xs text-emerald-200/50 uppercase font-bold tracking-wider">Approved</div>
                        </GlassPanel>
                        <GlassPanel className="p-4 flex flex-col items-center justify-center border-red-500/20 bg-red-900/10">
                            <div className="text-2xl font-bold text-red-400">2</div>
                            <div className="text-xs text-red-200/50 uppercase font-bold tracking-wider">Rejected</div>
                        </GlassPanel>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {['All', 'Delivery', 'Discounts', 'Refunds', 'Status Changes'].map((f, i) => (
                            <button key={f} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap ${i === 0 ? 'bg-white text-black' : 'bg-white/5 text-text-secondary hover:bg-white/10'}`}>
                                {f}
                            </button>
                        ))}
                    </div>

                    {/* List */}
                    <div className="space-y-4">
                        <div className="text-xs font-bold text-text-secondary uppercase tracking-wider pl-2">Today</div>
                        <ActionApprovalCard
                            type="refund"
                            title="Refund Request: Chidinma Okeke"
                            description="Order #ORD-2024-001 • ₦ 12,500 • Customer requested cancellation"
                            risk="med"
                            onApprove={() => { }}
                            onReject={() => { }}
                        />
                        <ActionApprovalCard
                            type="delivery"
                            title="Reschedule Delivery: Emeka Johnson"
                            description="Order #ORD-2024-045 • Move to Saturday 10 AM"
                            risk="low"
                            onApprove={() => { }}
                            onReject={() => { }}
                        />
                        <ActionApprovalCard
                            type="discount"
                            title="10% Discount: Sarah Kalu"
                            description="Cart Value ₦ 150,000 • High value customer retention"
                            risk="med"
                            onApprove={() => { }}
                            onReject={() => { }}
                        />
                    </div>
                </div>

                {/* Right Context Preview (Desktop) */}
                <div className="hidden lg:block w-[350px] space-y-6">
                    <div className="sticky top-6 space-y-6">
                        <GlassPanel className="p-6">
                            <h3 className="font-bold text-white mb-4">Quick Context</h3>
                            <div className="p-4 bg-white/5 rounded-lg text-center text-text-secondary mb-4">
                                <Icon name="touch_app" size={32} className="mx-auto mb-2 opacity-50" />
                                <p className="text-sm">Select an item on the left to view details here.</p>
                            </div>
                            <div className="text-xs text-text-secondary">
                                Approvals expire after 24 hours if no action is taken.
                            </div>
                        </GlassPanel>
                    </div>
                </div>
            </div>
        </AdminShell>
    );
}
