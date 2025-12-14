'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AdminShell } from '@/components/admin-shell';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icon } from '@/components/ui/icon';
import { StatusBadge } from '@/components/ui/status-badge';

const MOCK_ORDERS = [
    { id: 'VV-1024', customer: 'Chinedu Okafor', items: 3, total: '₦ 12,500', payment: 'paid', fulfillment: 'processing', created: '20 min ago' },
    { id: 'VV-1023', customer: 'Amina Yusuf', items: 1, total: '₦ 4,200', payment: 'pending', fulfillment: 'pending', created: '1 hour ago' },
    { id: 'VV-1022', customer: 'John Doe', items: 5, total: '₦ 28,000', payment: 'paid', fulfillment: 'out_for_delivery', created: '3 hours ago' },
    { id: 'VV-1021', customer: 'Sarah Mike', items: 2, total: '₦ 8,500', payment: 'failed', fulfillment: 'cancelled', created: '5 hours ago' },
    { id: 'VV-1020', customer: 'Tunde B', items: 1, total: '₦ 1,500', payment: 'paid', fulfillment: 'delivered', created: '1 day ago' },
];

const FILTERS = ['All', 'Pending payment', 'Paid', 'Processing', 'Out for delivery', 'Delivered', 'Cancelled'];

export default function OrdersPage() {
    const [activeFilter, setActiveFilter] = useState('All');
    const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

    const toggleSelect = (id: string) => {
        if (selectedOrders.includes(id)) {
            setSelectedOrders(selectedOrders.filter(o => o !== id));
        } else {
            setSelectedOrders([...selectedOrders, id]);
        }
    };

    const toggleAll = () => {
        if (selectedOrders.length === MOCK_ORDERS.length) {
            setSelectedOrders([]);
        } else {
            setSelectedOrders(MOCK_ORDERS.map(o => o.id));
        }
    };

    return (
        <AdminShell title="Orders" breadcrumb="Orders">
            <div className="flex flex-col gap-6">
                {/* Top Controls */}
                <GlassPanel className="p-4 flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                        <div className="flex-1 max-w-sm">
                            <Input icon="search" placeholder="Search order ID, customer, phone..." />
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="text-xs">
                                <Icon name="calendar_today" size={16} className="mr-2" />
                                Last 30 days
                            </Button>
                            <Button variant="outline" className="text-xs">
                                <Icon name="download" size={16} className="mr-2" />
                                Export
                            </Button>
                        </div>
                    </div>

                    {/* Filter Chips */}
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {FILTERS.map(f => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${activeFilter === f
                                        ? 'bg-white text-background-dark'
                                        : 'bg-white/5 text-text-secondary hover:bg-white/10'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </GlassPanel>

                {/* Bulk Actions Bar */}
                {selectedOrders.length > 0 && (
                    <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-primary/10 border border-primary/20 animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded bg-primary flex items-center justify-center text-background-dark font-bold text-xs">
                                {selectedOrders.length}
                            </div>
                            <span className="text-sm font-bold text-white">Selected</span>
                        </div>
                        <div className="flex gap-2">
                            <Button size="sm" variant="secondary" className="h-8 text-xs bg-white/10 hover:bg-white/20 text-white border-none">Mark as Processing</Button>
                            <Button size="sm" variant="secondary" className="h-8 text-xs bg-white/10 hover:bg-white/20 text-white border-none">Create Delivery Task</Button>
                            <Button size="sm" variant="secondary" className="h-8 text-xs bg-white/10 hover:bg-white/20 text-white border-none">Archive</Button>
                        </div>
                    </div>
                )}

                {/* Table */}
                <GlassPanel className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white/5 text-text-secondary uppercase text-xs font-bold border-b border-white/5">
                                <tr>
                                    <th className="p-4 w-10">
                                        <input
                                            type="checkbox"
                                            className="checkbox checkbox-xs rounded-sm border-white/20"
                                            checked={selectedOrders.length === MOCK_ORDERS.length}
                                            onChange={toggleAll}
                                        />
                                    </th>
                                    <th className="p-4">Order</th>
                                    <th className="p-4">Customer</th>
                                    <th className="p-4">Items</th>
                                    <th className="p-4">Total</th>
                                    <th className="p-4">Payment</th>
                                    <th className="p-4">Fulfillment</th>
                                    <th className="p-4">Created</th>
                                    <th className="p-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {MOCK_ORDERS.map((order) => (
                                    <tr key={order.id} className="group hover:bg-white/5 transition-colors cursor-pointer">
                                        <td className="p-4 text-center">
                                            <input
                                                type="checkbox"
                                                className="checkbox checkbox-xs rounded-sm border-white/20"
                                                checked={selectedOrders.includes(order.id)}
                                                onChange={() => toggleSelect(order.id)}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </td>
                                        <td className="p-4 font-bold text-white">
                                            <Link href={`/admin/orders/${order.id}`} className="hover:underline hover:text-primary transition-colors">
                                                {order.id}
                                            </Link>
                                            {/* Unread Dot (Mock logic: odd ids) */}
                                            {parseInt(order.id.split('-')[1]) % 2 !== 0 && (
                                                <div className="inline-block w-2 h-2 rounded-full bg-primary ml-2 mb-0.5" />
                                            )}
                                        </td>
                                        <td className="p-4 text-white/80">{order.customer}</td>
                                        <td className="p-4 text-text-secondary">{order.items} items</td>
                                        <td className="p-4 font-mono text-white">{order.total}</td>
                                        <td className="p-4">
                                            <StatusBadge status={order.payment} />
                                        </td>
                                        <td className="p-4">
                                            <StatusBadge status={order.fulfillment} />
                                        </td>
                                        <td className="p-4 text-text-secondary whitespace-nowrap">{order.created}</td>
                                        <td className="p-4 text-right">
                                            <Link href={`/admin/orders/${order.id}`}>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-text-secondary hover:text-white">
                                                    <Icon name="chevron_right" size={20} />
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </GlassPanel>
            </div>
        </AdminShell>
    );
}
