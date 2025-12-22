'use client';

import React from 'react';
import Link from 'next/link';
import { AppShell , GlassPanel , Button , Icon } from '@vayva/ui';
import { MarketplaceStatusBadge } from '@/components/marketplace-status-badge';
import { formatNGN } from '@/config/pricing';

const MOCK_LISTINGS = [
    { id: '1', name: 'Ultra-Soft T-Shirt', price: formatNGN(10000), status: 'Listed', stock: 120, views: 450, orders: 12 },
    { id: '2', name: 'Classic Leather Watch', price: formatNGN(25000), status: 'Pending', stock: 24, views: 10, orders: 0 },
    { id: '3', name: 'Denim Jacket', price: formatNGN(30000), status: 'Unlisted', stock: 15, views: 0, orders: 0 },
    { id: '4', name: 'Slim Fit Jeans', price: formatNGN(12000), status: 'Rejected', stock: 45, views: 5, orders: 0 },
];

export default function MarketplaceListingsPage() {
    return (
        <AppShell sidebar={<></>} header={<></>}>
            <div className="flex flex-col gap-6">
                {/* Top Info Bar */}
                <div className="flex items-center justify-between bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-2 py-1 bg-indigo-500/20 rounded text-indigo-400 text-xs font-bold uppercase tracking-wider">
                            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                            Enabled
                        </div>
                        <span className="text-sm text-white">Your store is live on Vayva Market.</span>
                    </div>
                    <Link href="/admin/marketplace/opt-in">
                        <Button size="sm" variant="ghost" className="text-indigo-300 hover:text-indigo-200">Settings</Button>
                    </Link>
                </div>

                {/* Filters */}
                <GlassPanel className="p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="w-full md:w-auto relative">
                        <Icon name={"Search" as any} size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                        <input
                            className="bg-white/5 border border-white/5 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary w-full md:w-64"
                            placeholder="Search listings..."
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        {['All', 'Listed', 'Pending', 'Unlisted'].map((status, i) => (
                            <button key={status} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap ${i === 0 ? 'bg-white text-background-dark' : 'bg-white/5 text-text-secondary hover:bg-white/10'}`}>
                                {status}
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
                                    <th className="p-4 w-10">
                                        <input type="checkbox" className="checkbox checkbox-xs" />
                                    </th>
                                    <th className="p-4">Product</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Price</th>
                                    <th className="p-4">Stock</th>
                                    <th className="p-4">Stats</th>
                                    <th className="p-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {MOCK_LISTINGS.map((item) => (
                                    <tr key={item.id} className="group hover:bg-white/5 transition-colors cursor-pointer">
                                        <td className="p-4">
                                            <input type="checkbox" className="checkbox checkbox-xs border-white/20" />
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center text-xs font-bold text-white">IMG</div>
                                                <span className="font-bold text-white">{item.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4"><MarketplaceStatusBadge status={item.status} /></td>
                                        <td className="p-4 text-white font-mono">{item.price}</td>
                                        <td className="p-4 text-text-secondary">{item.stock} in stock</td>
                                        <td className="p-4 text-xs text-text-secondary">
                                            {item.views > 0 ? (
                                                <span className="flex items-center gap-1">
                                                    <Icon name={"Eye" as any} size={14} /> {item.views} views
                                                </span>
                                            ) : '-'}
                                        </td>
                                        <td className="p-4 text-right">
                                            <Link href={`/admin/marketplace/listings/${item.id}`}>
                                                <Button size="sm" variant="outline" className="h-8">Manage</Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </GlassPanel>
            </div>
        </AppShell>
    );
}
