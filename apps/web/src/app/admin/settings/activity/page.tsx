'use client';

import React from 'react';
import { AdminShell } from '@/components/admin-shell';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ACTIVITY_LOG = [
    { id: 1, type: 'order', title: 'Order #VV-1024 paid', desc: 'Customer: Chinedu Okafor', time: '5m ago', actor: 'System' },
    { id: 2, type: 'ai', title: 'Amina approved delivery window', desc: 'Order #VV-1027 • Tomorrow 2-5pm', time: '1h ago', actor: 'Amina' },
    { id: 3, type: 'product', title: 'Start Light collection added', desc: '12 new products imported', time: '4h ago', actor: 'Amina' },
    { id: 4, type: 'staff', title: 'Invite sent to Sarah', desc: 'Role: Editor', time: '1d ago', actor: 'Amina' },
    { id: 5, type: 'payment', title: 'Payout #PAY-8821 processed', desc: '₦ 120,500 sent to GTBank', time: '1d ago', actor: 'System' },
];

export default function Activity() {
    return (
        <AdminShell title="Activity" breadcrumb="Settings / Activity">
            <div className="flex flex-col gap-6 max-w-4xl mx-auto">
                {/* Top Controls */}
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <Input
                        placeholder="Search by ID, name..."
                        className="w-full md:w-[320px]"
                        icon="search"
                    />
                    <div className="flex gap-2">
                        <select className="bg-white/5 border border-white/10 rounded-full px-4 text-sm text-white outline-none focus:border-primary h-11">
                            <option>All Categories</option>
                            <option>Orders</option>
                            <option>Payments</option>
                            <option>Staff</option>
                        </select>
                        <Button variant="outline">Export CSV</Button>
                    </div>
                </div>

                {/* Feed */}
                <GlassPanel className="p-8">
                    <div className="relative pl-4 space-y-8">
                        {/* Vertical Line */}
                        <div className="absolute left-[19px] top-4 bottom-4 w-[1px] bg-white/10" />

                        {ACTIVITY_LOG.map((item) => (
                            <div key={item.id} className="relative pl-8 flex flex-col gap-1 group">
                                {/* Icon Badge */}
                                <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-[#142210] border border-white/10 flex items-center justify-center z-10 group-hover:border-primary/50 transition-colors">
                                    <Icon name={getIcon(item.type)} size={18} className="text-text-secondary group-hover:text-primary transition-colors" />
                                </div>

                                {/* Content */}
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-white">{item.title}</p>
                                        <p className="text-sm text-text-secondary">{item.desc}</p>
                                    </div>
                                    <span className="text-xs text-white/30 whitespace-nowrap">{item.time}</span>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] uppercase font-bold tracking-wider text-white/20 bg-white/5 px-2 py-0.5 rounded">
                                        {item.actor}
                                    </span>
                                    <span className="text-[10px] text-white/20 uppercase tracking-wider">
                                        {item.type}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassPanel>
            </div>
        </AdminShell>
    );
}

function getIcon(type: string) {
    if (type === 'order') return 'shopping_bag';
    if (type === 'ai') return 'smart_toy';
    if (type === 'product') return 'inventory_2';
    if (type === 'staff') return 'group';
    if (type === 'payment') return 'payments';
    return 'info';
}
