'use client';

import React from 'react';
import Link from 'next/link';
import { AppShell , GlassPanel , Button , Icon } from '@vayva/ui';
import { AnalyticsFilterBar } from '@/components/analytics-filter-bar';
import { formatNGN } from '@/config/pricing';

export default function ProductPerformancePage() {
    return (
        <AppShell sidebar={<></>} header={<></>}>
            <div className="flex flex-col gap-6">
                <AnalyticsFilterBar />

                {/* Top Insights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <GlassPanel className="p-4 bg-primary/10 border-primary/20">
                        <div className="flex items-center gap-2 mb-2">
                            <Icon name={"Trophy" as any} className="text-primary" size={18} />
                            <span className="text-xs font-bold uppercase tracking-wider text-primary">Best Seller</span>
                        </div>
                        <div className="text-lg font-bold text-white">Ultra-Soft T-Shirt</div>
                        <div className="text-sm text-text-secondary">₦ 850,000 revenue</div>
                    </GlassPanel>
                    <GlassPanel className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Icon name={"RotateCcw" as any} className="text-state-warning" size={18} />
                            <span className="text-xs font-bold uppercase tracking-wider text-state-warning">High Returns</span>
                        </div>
                        <div className="text-lg font-bold text-white">Slim Fit Jeans</div>
                        <div className="text-sm text-text-secondary">15% return rate</div>
                    </GlassPanel>
                    <GlassPanel className="p-4 bg-state-danger/10 border-state-danger/20">
                        <div className="flex items-center gap-2 mb-2">
                            <Icon name={"Package" as any} className="text-state-danger" size={18} />
                            <span className="text-xs font-bold uppercase tracking-wider text-state-danger">Low Stock</span>
                        </div>
                        <div className="text-lg font-bold text-white">3 Products</div>
                        <Link href="/admin/products?filter=low_stock" className="text-sm text-white underline decoration-dashed">View Inventory</Link>
                    </GlassPanel>
                </div>

                {/* Table */}
                <GlassPanel className="overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/5 text-text-secondary uppercase text-xs font-bold border-b border-white/5">
                            <tr>
                                <th className="p-4">Product</th>
                                <th className="p-4 text-right">Units Sold</th>
                                <th className="p-4 text-right">Revenue</th>
                                <th className="p-4 text-right">Refunds</th>
                                <th className="p-4">Stock Status</th>
                                <th className="p-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {[
                                { name: 'Ultra-Soft T-Shirt', sku: 'TS-001', sold: 84, rev: '₦ 850,000', refunds: '₦ 0', stock: 'In Stock' },
                                { name: 'Classic Leather Watch', sku: 'WA-005', sold: 24, rev: formatNGN(600000), refunds: formatNGN(25000), stock: 'Low Stock' },
                                { name: 'Denim Jacket', sku: 'JA-002', sold: 15, rev: '₦ 450,000', refunds: '₦ 0', stock: 'In Stock' },
                            ].map((prod, i) => (
                                <tr key={i} className="group hover:bg-white/5">
                                    <td className="p-4">
                                        <div className="font-bold text-white">{prod.name}</div>
                                        <div className="text-xs text-text-secondary">{prod.sku}</div>
                                    </td>
                                    <td className="p-4 text-right text-text-secondary">{prod.sold}</td>
                                    <td className="p-4 text-right text-white font-mono">{prod.rev}</td>
                                    <td className="p-4 text-right text-text-secondary font-mono">{prod.refunds}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${prod.stock === 'Low Stock' ? 'bg-state-warning/10 text-state-warning' : 'bg-state-success/10 text-state-success'
                                            }`}>
                                            {prod.stock}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <Button size="sm" variant="ghost">View</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </GlassPanel>
            </div>
        </AppShell>
    );
}
