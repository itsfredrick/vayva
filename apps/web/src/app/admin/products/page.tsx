'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AdminShell } from '@/components/admin-shell';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icon } from '@/components/ui/icon';
import { StatusBadge } from '@/components/ui/status-badge';

const MOCK_PRODUCTS = [
    { id: 'PROD-001', name: 'Nike Air Max 90', sku: 'NK-AM90-BLK', price: '₦ 45,000', status: 'active', inventory: 12, category: 'Sneakers', updated: '2 hours ago' },
    { id: 'PROD-002', name: 'Vintage Denim Jacket', sku: 'VINT-DNM-002', price: '₦ 18,500', status: 'draft', inventory: 0, category: 'Jackets', updated: '1 day ago' },
    { id: 'PROD-003', name: 'Basic White Tee', sku: 'TEE-WHT-001', price: '₦ 5,000', status: 'active', inventory: 156, category: 'T-Shirts', updated: '3 days ago' },
    { id: 'PROD-004', name: 'Leather Crossbody Bag', sku: 'BAG-LTH-Br', price: '₦ 22,000', status: 'archived', inventory: 5, category: 'Accessories', updated: '1 week ago' },
];

const FILTERS = ['All', 'Active', 'Draft', 'Archived'];

export default function ProductsPage() {
    const [activeFilter, setActiveFilter] = useState('All');

    return (
        <AdminShell title="Products" breadcrumb="Catalog">
            <div className="flex flex-col gap-6">
                {/* Top Controls */}
                <div className="flex items-center justify-between">
                    <div className="flex-1 max-w-lg">
                        <GlassPanel className="p-1 pl-4 flex items-center gap-2">
                            <Icon name="search" className="text-text-secondary" />
                            <input
                                className="bg-transparent border-none outline-none text-white text-sm w-full h-10 placeholder:text-text-secondary"
                                placeholder="Search products, SKU..."
                            />
                        </GlassPanel>
                    </div>
                    <Link href="/admin/products/new">
                        <Button>
                            <Icon name="add" className="mr-2" size={20} />
                            Add Product
                        </Button>
                    </Link>
                </div>

                <GlassPanel className="p-4 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        {/* Filter Chips */}
                        <div className="flex gap-2">
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

                        <div className="flex gap-2">
                            <Button variant="outline" className="text-xs">
                                <Icon name="sort" size={16} className="mr-2" />
                                Sort
                            </Button>
                            <Button variant="outline" className="text-xs">
                                <Icon name="upload" size={16} className="mr-2" />
                                Import
                            </Button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white/5 text-text-secondary uppercase text-xs font-bold border-b border-white/5">
                                <tr>
                                    <th className="p-4 w-10">
                                        <input type="checkbox" className="checkbox checkbox-xs rounded-sm border-white/20" />
                                    </th>
                                    <th className="p-4">Product</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Inventory</th>
                                    <th className="p-4">Category</th>
                                    <th className="p-4">Price</th>
                                    <th className="p-4">Updated</th>
                                    <th className="p-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {MOCK_PRODUCTS.map((prod) => (
                                    <tr key={prod.id} className="group hover:bg-white/5 transition-colors cursor-pointer">
                                        <td className="p-4 text-center">
                                            <input type="checkbox" className="checkbox checkbox-xs rounded-sm border-white/20" />
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded bg-white/5 border border-white/10 flex items-center justify-center">
                                                    <Icon name="image" size={16} className="text-text-secondary opacity-50" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white text-sm">{prod.name}</p>
                                                    <p className="text-xs text-text-secondary">{prod.sku}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <StatusChip status={prod.status} />
                                        </td>
                                        <td className="p-4">
                                            <div className={prod.inventory === 0 ? 'text-state-danger' : 'text-text-secondary'}>
                                                {prod.inventory} in stock
                                            </div>
                                        </td>
                                        <td className="p-4 text-text-secondary">
                                            <span className="bg-white/5 px-2 py-1 rounded-full text-xs">
                                                {prod.category}
                                            </span>
                                        </td>
                                        <td className="p-4 font-mono text-white font-medium">{prod.price}</td>
                                        <td className="p-4 text-text-secondary text-xs">{prod.updated}</td>
                                        <td className="p-4 text-right">
                                            <Link href={`/admin/products/${prod.id}`}>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-text-secondary hover:text-white">
                                                    <Icon name="edit" size={16} />
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

const StatusChip = ({ status }: { status: string }) => {
    let styles = "bg-white/10 text-white";
    if (status === 'active') styles = "bg-state-success/10 text-state-success";
    if (status === 'draft') styles = "bg-white/10 text-text-secondary";
    if (status === 'archived') styles = "bg-state-danger/10 text-state-danger";

    return (
        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${styles}`}>
            {status}
        </span>
    );
};
