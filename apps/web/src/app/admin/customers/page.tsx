'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AdminShell } from '@/components/admin-shell';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

const MOCK_CUSTOMERS = [
    { id: 'CUST-001', name: 'Chinedu Okafor', email: 'chinedu@example.com', phone: '+234 801 234 5678', orders: 12, spend: '₦ 320,500', lastOrder: '2 days ago', status: 'High Value' },
    { id: 'CUST-002', name: 'Amina Yusuf', email: 'amina@example.com', phone: '+234 809 987 6543', orders: 2, spend: '₦ 15,200', lastOrder: '1 month ago', status: 'Returning' },
    { id: 'CUST-003', name: 'John Doe', email: 'john@example.com', phone: '+234 701 111 2222', orders: 1, spend: '₦ 4,500', lastOrder: '3 hours ago', status: 'New' },
    { id: 'CUST-004', name: 'Sarah Mike', email: 'sarah@example.com', phone: '+234 812 333 4444', orders: 5, spend: '₦ 125,000', lastOrder: '1 week ago', status: 'Returning' },
];

const SEGMENTS = ['All', 'Returning', 'First-time', 'High value'];

export default function CustomersPage() {
    const [activeSegment, setActiveSegment] = useState('All');

    return (
        <AdminShell title="Customers" breadcrumb="Customers">
            <div className="flex flex-col gap-6">
                {/* Top Controls */}
                <GlassPanel className="p-4 flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                        <div className="flex-1 max-w-sm">
                            <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-full border border-white/5 focus-within:border-primary/50 transition-colors">
                                <Icon name="search" size={18} className="text-text-secondary" />
                                <input
                                    className="bg-transparent border-none outline-none text-white text-sm w-full placeholder:text-text-secondary"
                                    placeholder="Search name, phone, email..."
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="text-xs">
                                <Icon name="sort" size={16} className="mr-2" />
                                Sort
                            </Button>
                        </div>
                    </div>

                    {/* Filter Chips */}
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {SEGMENTS.map(s => (
                            <button
                                key={s}
                                onClick={() => setActiveSegment(s)}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${activeSegment === s
                                        ? 'bg-white text-background-dark'
                                        : 'bg-white/5 text-text-secondary hover:bg-white/10'
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </GlassPanel>

                {/* Table */}
                <GlassPanel className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white/5 text-text-secondary uppercase text-xs font-bold border-b border-white/5">
                                <tr>
                                    <th className="p-4">Customer</th>
                                    <th className="p-4">Contact</th>
                                    <th className="p-4">Orders</th>
                                    <th className="p-4">Total Spend</th>
                                    <th className="p-4">Last Order</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {MOCK_CUSTOMERS.map((cust) => (
                                    <tr key={cust.id} className="group hover:bg-white/5 transition-colors cursor-pointer">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                                                    {cust.name.charAt(0)}
                                                </div>
                                                <span className="font-bold text-white text-sm">{cust.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="text-white text-sm">{cust.phone}</span>
                                                <span className="text-xs text-text-secondary">{cust.email}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-text-secondary">{cust.orders} orders</td>
                                        <td className="p-4 font-mono text-white">{cust.spend}</td>
                                        <td className="p-4 text-text-secondary text-xs">{cust.lastOrder}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${cust.status === 'High Value' ? 'bg-primary/10 text-primary' :
                                                    cust.status === 'New' ? 'bg-state-success/10 text-state-success' : 'bg-white/10 text-text-secondary'
                                                }`}>
                                                {cust.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <Link href={`/admin/customers/${cust.id}`}>
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
