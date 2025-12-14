'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AdminShell } from '@/components/admin-shell';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { StatusBadge } from '@/components/ui/status-badge';

export default function OrderDetailPage() {
    const params = useParams();
    const id = params.id as string;

    // Mock Data
    const order = {
        id,
        customer: { name: 'Chinedu Okafor', email: 'chinedu@example.com', phone: '+234 801 234 5678' },
        status: { payment: 'paid', fulfillment: 'processing' },
        items: [
            { id: 1, name: 'Nike Air Max 90', variant: 'Size 42, Black', price: '₦ 45,000', qty: 1, image: '' },
            { id: 2, name: 'White Sports Socks', variant: 'Pack of 3', price: '₦ 2,500', qty: 2, image: '' },
        ],
        totals: { subtotal: '₦ 50,000', delivery: '₦ 1,500', total: '₦ 51,500' },
        delivery: { method: 'Delivery', address: '12 Admiralty Way, Lekki Phase 1, Lagos' },
        timeline: [
            { title: 'Payment verified', time: '10:42 AM', type: 'payment', desc: 'Verified by Paystack' },
            { title: 'Order placed', time: '10:40 AM', type: 'order', desc: 'Via Online Store' }
        ]
    };

    return (
        <AdminShell title={`Order ${id}`} breadcrumb={`Orders / ${id}`}>
            <div className="flex flex-col gap-6 max-w-6xl mx-auto">
                {/* Top Header Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-1">Order {id}</h1>
                        <div className="flex items-center gap-2 text-sm text-text-secondary">
                            <span>{order.timeline[1].time}, {order.timeline[1].desc}</span>
                        </div>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Button className="flex-1 sm:flex-none">Update Status</Button>
                        <Link href={`/admin/orders/${id}/delivery`}>
                            <Button variant="secondary" className="flex-1 sm:flex-none bg-white/10 text-white hover:bg-white/20 border-none">
                                Create Delivery Task
                            </Button>
                        </Link>
                        <Button size="icon" variant="ghost" className="text-white">
                            <Icon name="more_vert" />
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        {/* 1. Summary & Items */}
                        <GlassPanel className="p-0 overflow-hidden">
                            {/* Customer Header */}
                            <div className="p-6 border-b border-white/5 flex items-start justify-between bg-white/[0.02]">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                                        {order.customer.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-lg">{order.customer.name}</h3>
                                        <div className="flex flex-col text-sm text-text-secondary">
                                            <a href="#" className="hover:text-primary">{order.customer.email}</a>
                                            <span>{order.customer.phone}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <StatusBadge status={order.status.payment} />
                                    <StatusBadge status={order.status.fulfillment} />
                                </div>
                            </div>

                            {/* Items List */}
                            <div className="p-6 flex flex-col gap-6">
                                {order.items.map(item => (
                                    <div key={item.id} className="flex items-start gap-4">
                                        <div className="w-16 h-16 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary">
                                            <Icon name="image" size={24} className="opacity-20" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-white">{item.name}</p>
                                            <p className="text-sm text-text-secondary">{item.variant}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-white">{item.price}</p>
                                            <p className="text-sm text-text-secondary">x {item.qty}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="p-6 bg-white/[0.02] border-t border-white/5 space-y-2">
                                <div className="flex justify-between text-sm text-text-secondary">
                                    <span>Subtotal</span>
                                    <span>{order.totals.subtotal}</span>
                                </div>
                                <div className="flex justify-between text-sm text-text-secondary">
                                    <span>Delivery</span>
                                    <span>{order.totals.delivery}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-white pt-2 border-t border-white/5 mt-2">
                                    <span>Total</span>
                                    <span>{order.totals.total}</span>
                                </div>
                            </div>
                        </GlassPanel>

                        {/* 2. Delivery Panel */}
                        <GlassPanel className="p-6 flex flex-col gap-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-bold text-white flex items-center gap-2">
                                    <Icon name="local_shipping" size={20} className="text-text-secondary" />
                                    Delivery Details
                                </h3>
                                <Button size="sm" variant="ghost" className="text-primary h-8 text-xs">Edit</Button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-text-secondary block mb-1">Method</span>
                                    <span className="text-white font-medium">{order.delivery.method}</span>
                                </div>
                                <div>
                                    <span className="text-text-secondary block mb-1">Fee included</span>
                                    <span className="text-white font-medium">{order.totals.delivery}</span>
                                </div>
                                <div className="col-span-2">
                                    <span className="text-text-secondary block mb-1">Address</span>
                                    <span className="text-white font-medium">{order.delivery.address}</span>
                                </div>
                            </div>
                        </GlassPanel>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="flex flex-col gap-6">
                        {/* Payment Status Card */}
                        <GlassPanel className="p-6 flex flex-col gap-4 border-l-4 border-l-state-success">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-white">Payment</h3>
                                <StatusBadge status="verified" type="payment" />
                            </div>
                            <div className="text-sm text-text-secondary">
                                <div className="flex justify-between mb-1">
                                    <span>Provider</span>
                                    <span className="text-white">Paystack</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Date</span>
                                    <span className="text-white">Today, 10:42 AM</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="w-full text-xs">Verify</Button>
                                <Link href={`/admin/orders/${id}/refund`} className="w-full">
                                    <Button variant="outline" size="sm" className="w-full text-xs">Refund</Button>
                                </Link>
                            </div>
                        </GlassPanel>

                        {/* Timeline */}
                        <GlassPanel className="p-6">
                            <h3 className="font-bold text-white mb-4">Timeline</h3>
                            <div className="relative pl-2 space-y-6">
                                <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-white/10" />
                                {order.timeline.map((event, idx) => (
                                    <div key={idx} className="relative pl-6">
                                        <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-[#142210] border-2 border-primary z-10" />
                                        <p className="text-sm font-bold text-white">{event.title}</p>
                                        <p className="text-xs text-text-secondary mb-0.5">{event.desc}</p>
                                        <span className="text-[10px] text-white/30">{event.time}</span>
                                    </div>
                                ))}
                            </div>
                            <Button variant="ghost" className="w-full text-xs text-text-secondary mt-4">View full activity</Button>
                        </GlassPanel>

                        {/* Notes */}
                        <GlassPanel className="p-6">
                            <h3 className="font-bold text-white mb-2">Notes</h3>
                            <textarea
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white resize-none focus:outline-none focus:border-primary/50 transition-colors"
                                rows={3}
                                placeholder="Add an internal note..."
                            ></textarea>
                        </GlassPanel>
                    </div>
                </div>
            </div>
        </AdminShell>
    );
}
