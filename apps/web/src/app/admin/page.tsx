'use client';

import React from 'react';
import Link from 'next/link';
import { AdminShell } from '@/components/admin-shell';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { cn } from '@/components/ui/glass-panel';

export default function DashboardPage() {
    return (
        <AdminShell title="Dashboard">
            <div className="flex flex-col gap-8">
                {/* 1. Readiness Banner (Conditional) */}
                <div className="rounded-xl border-l-[4px] border-state-warning bg-state-warning/10 p-4 flex items-center justify-between backdrop-blur-md">
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-state-warning/20 text-state-warning">
                            <Icon name="handyman" size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-white">Your store is almost ready</h3>
                            <p className="text-sm text-white/70">Connect WhatsApp to start automating your sales.</p>
                        </div>
                    </div>
                    <Link href="/onboarding/whatsapp">
                        <Button size="sm" variant="secondary" className="bg-white/10 hover:bg-white/20 text-white rounded-full">
                            Complete Setup
                        </Button>
                    </Link>
                </div>

                {/* 2. KPI Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <KPICard title="Today's Revenue" value="₦ 45,000" delta="+12%" isPositive={true} />
                    <KPICard title="Orders Today" value="12" delta="+4%" isPositive={true} isPrimary={true} />
                    <KPICard title="Unfulfilled" value="3" delta="Action needed" isPositive={false} />
                    <KPICard title="Conversion Rate" value="2.4%" delta="+0.2%" isPositive={true} />
                </div>

                {/* 3. Quick Actions */}
                <GlassPanel className="p-6">
                    <h3 className="font-bold text-white mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <ActionTile icon="add" label="Add Product" />
                        <ActionTile icon="shopping_bag" label="View Orders" />
                        <ActionTile icon="local_offer" label="Create Discount" />
                        <ActionTile icon="smart_toy" label="WhatsApp AI" />
                        <ActionTile icon="payments" label="Payments" />
                        <ActionTile icon="local_shipping" label="Delivery" />
                    </div>
                </GlassPanel>

                {/* 4. Operational Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Orders Table */}
                    <GlassPanel className="lg:col-span-2 p-6 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-white">Orders Needing Attention</h3>
                            <div className="flex gap-2">
                                <FilterChip label="All" active />
                                <FilterChip label="Pending" />
                                <FilterChip label="Paid" />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-white/5 text-xs text-text-secondary uppercase">
                                        <th className="py-2 pl-2">Order #</th>
                                        <th className="py-2">Customer</th>
                                        <th className="py-2">Total</th>
                                        <th className="py-2">Status</th>
                                        <th className="py-2 text-right pr-2">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    <OrderRow id="VV-1024" customer="Chinedu O." total="₦ 12,500" status="paid" />
                                    <OrderRow id="VV-1025" customer="Amina Y." total="₦ 4,200" status="pending" />
                                    <OrderRow id="VV-1026" customer="John D." total="₦ 8,900" status="delivery" />
                                    <OrderRow id="VV-1027" customer="Sarah M." total="₦ 22,000" status="approval" />
                                    <OrderRow id="VV-1028" customer="Tunde B." total="₦ 1,500" status="paid" />
                                </tbody>
                            </table>
                        </div>
                        <Button variant="ghost" className="w-full text-xs text-text-secondary mt-2">View all orders</Button>
                    </GlassPanel>

                    {/* WhatsApp AI Snapshot */}
                    <GlassPanel className="p-6 flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-white">WhatsApp AI</h3>
                            <span className="text-[10px] font-bold bg-state-success/10 text-state-success px-2 py-0.5 rounded pill">ACTIVE</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                                <div className="text-2xl font-bold text-white">4</div>
                                <div className="text-xs text-text-secondary">Open Chats</div>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                                <div className="text-2xl font-bold text-state-warning">1</div>
                                <div className="text-xs text-text-secondary">Needs Approval</div>
                            </div>
                        </div>

                        <div className="flex-1 bg-white/5 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <Icon name="smart_toy" className="text-primary" />
                            </div>
                            <p className="text-sm font-bold text-white">AI handled 85% of queries today</p>
                            <p className="text-xs text-text-secondary">Your agent is saving you time.</p>
                        </div>

                        <Button className="w-full">Open Inbox</Button>
                    </GlassPanel>
                </div>
            </div>
        </AdminShell>
    );
}

// Sub-components
const KPICard = ({ title, value, delta, isPositive, isPrimary }: any) => (
    <GlassPanel className={cn(
        "p-6 flex flex-col gap-2 relative overflow-hidden",
        isPrimary && "border-primary/30"
    )}>
        {isPrimary && <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 blur-xl rounded-full -mr-4 -mt-4 transition-all" />}
        <span className="text-xs font-bold uppercase tracking-widest text-text-secondary">{title}</span>
        <div className="text-3xl font-bold text-white tracking-tight">{value}</div>
        <div className={cn(
            "text-xs font-bold px-2 py-0.5 rounded-full w-fit flex items-center gap-1",
            isPositive ? "bg-state-success/10 text-state-success" : "bg-white/10 text-text-secondary"
        )}>
            {delta}
        </div>
    </GlassPanel>
);

const ActionTile = ({ icon, label }: any) => (
    <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all hover:scale-[1.02]">
        <Icon name={icon} className="text-primary" size={24} />
        <span className="text-xs font-bold text-white">{label}</span>
    </button>
);

const FilterChip = ({ label, active }: any) => (
    <button className={cn(
        "px-3 py-1 rounded-full text-xs font-bold transition-colors",
        active ? "bg-white text-background-dark" : "bg-white/5 text-text-secondary hover:bg-white/10"
    )}>
        {label}
    </button>
);

const OrderRow = ({ id, customer, total, status }: any) => {
    let statusColor = "bg-white/10 text-white";
    if (status === 'paid') statusColor = "bg-state-success/10 text-state-success";
    if (status === 'pending') statusColor = "bg-state-warning/10 text-state-warning";
    if (status === 'approval') statusColor = "bg-primary/10 text-primary";

    return (
        <tr className="group hover:bg-white/5 transition-colors cursor-pointer">
            <td className="py-3 pl-2 text-white font-medium">{id}</td>
            <td className="py-3 text-text-secondary">{customer}</td>
            <td className="py-3 text-white">{total}</td>
            <td className="py-3">
                <span className={cn("px-2 py-1 rounded-[4px] text-[10px] font-bold uppercase tracking-wide", statusColor)}>
                    {status}
                </span>
            </td>
            <td className="py-3 pr-2 text-right">
                <button className="text-text-secondary hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                    View
                </button>
            </td>
        </tr>
    );
};
