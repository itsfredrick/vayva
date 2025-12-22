'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AppShell , GlassPanel , Button , Icon } from '@vayva/ui';

export default function DeliveryTaskDetailPage() {
    const params = useParams();
    const id = params.id as string;

    const task = {
        id,
        status: 'Scheduled',
        order: 'VV-1024',
        customer: { name: 'Chinedu Okafor', phone: '+234 801 234 5678' },
        address: '12 Admiralty Way, Lekki Phase 1, Lagos',
        landmark: 'Near the green gate',
        window: 'Today, 2pm - 4pm',
        assignee: 'Unassigned',
        package: { items: 3, weight: '2.5kg' },
        timeline: [
            { id: 1, title: 'Task Created', date: 'Oct 24, 10:30 AM', description: 'System generated from order.' },
        ]
    };

    return (
        <AppShell sidebar={<></>} header={<></>}>
            <div className="flex flex-col gap-6 max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-1">Delivery Task {task.id}</h1>
                        <div className="flex items-center gap-2 text-sm text-text-secondary">
                            <span>Order {task.order}</span>
                            <span>•</span>
                            <span>{task.customer.name}</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">Message Customer</Button>
                        <Button size="sm">Update Status</Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        {/* 1. Status Panel */}
                        <GlassPanel className="p-6 bg-white/5 border-primary/20">
                            <div className="flex items-center justify-between mb-4">
                                <span className="px-3 py-1 rounded bg-white/10 text-white font-bold uppercase tracking-wider text-sm">{task.status}</span>
                                <span className="text-sm text-text-secondary">{task.window}</span>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="secondary" className="flex-1 bg-white/10 hover:bg-white/20 text-white border-none">Mark In Progress</Button>
                                <Button variant="secondary" className="flex-1 bg-white/10 hover:bg-white/20 text-white border-none">Mark Delivered</Button>
                            </div>
                        </GlassPanel>

                        {/* 2. Address */}
                        <GlassPanel className="p-6">
                            <h3 className="font-bold text-white mb-4">Delivery Address</h3>
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                                    <Icon name={"MapPin" as any} className="text-primary" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-white font-medium mb-1">{task.address}</p>
                                    <p className="text-sm text-text-secondary italic mb-4">"{task.landmark}"</p>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="text-xs">Copy Address</Button>
                                        <Button variant="outline" size="sm" className="text-xs">Open in Maps</Button>
                                        <Button variant="outline" size="sm" className="text-xs">Call Customer</Button>
                                    </div>
                                </div>
                            </div>
                        </GlassPanel>

                        {/* 3. Instructions */}
                        <GlassPanel className="p-6">
                            <h3 className="font-bold text-white mb-2">Instructions</h3>
                            <p className="text-sm text-text-secondary bg-white/5 p-3 rounded-lg border border-white/5">
                                Call upon arrival. Package is fragile.
                            </p>
                            <div className="mt-4">
                                <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Internal Notes</label>
                                <textarea className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-sm text-white resize-none focus:outline-none focus:border-primary min-h-[80px]" placeholder="Add a note for the driver..." />
                            </div>
                        </GlassPanel>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="flex flex-col gap-6">
                        {/* Customer */}
                        <GlassPanel className="p-6">
                            <h3 className="font-bold text-white mb-4">Customer</h3>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                    {task.customer.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-white text-sm">{task.customer.name}</p>
                                    <p className="text-xs text-text-secondary">{task.customer.phone}</p>
                                </div>
                            </div>
                        </GlassPanel>

                        {/* Order */}
                        <GlassPanel className="p-6">
                            <h3 className="font-bold text-white mb-4">Order Details</h3>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-text-secondary">Order ID</span>
                                <Link href={`/admin/orders/${task.order}`} className="text-primary hover:underline font-bold text-sm">{task.order}</Link>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-text-secondary">Items</span>
                                <span className="text-white text-sm">{task.package.items} items (~{task.package.weight})</span>
                            </div>
                        </GlassPanel>

                        {/* Timeline */}
                        <GlassPanel className="p-6">
                            <h3 className="font-bold text-white mb-4">Timeline</h3>
                            <div className="space-y-6 relative ml-2">
                                <div className="absolute left-1.5 top-2 bottom-2 w-px bg-white/10 z-0" />
                                {task.timeline.map((event) => (
                                    <div key={event.id} className="relative z-10 pl-6 group">
                                        <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-[#142210] border-2 border-primary group-last:border-text-secondary transition-colors" />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-white">{event.title}</span>
                                            <span className="text-xs text-text-secondary mb-1">{event.description}</span>
                                            <span className="text-[10px] text-text-secondary opacity-60">{event.date}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </GlassPanel>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
