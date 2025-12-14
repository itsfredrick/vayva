'use client';

import React from 'react';
import Link from 'next/link';
import { AdminShell } from '@/components/admin-shell';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

const MOCK_COLLECTIONS = [
    { id: '1', name: 'Summer Essentials', count: 12, visibility: 'Storefront', updated: '2 days ago' },
    { id: '2', name: 'New Arrivals', count: 45, visibility: 'Hidden', updated: '5 hours ago' },
    { id: '3', name: 'Accessories', count: 8, visibility: 'Storefront', updated: '1 week ago' },
];

export default function CollectionsPage() {
    return (
        <AdminShell title="Collections" breadcrumb="Catalog / Collections">
            <div className="flex flex-col gap-6">
                {/* Top Controls */}
                <div className="flex items-center justify-between">
                    <div className="flex-1 max-w-sm">
                        <GlassPanel className="p-1 pl-4 flex items-center gap-2">
                            <Icon name="search" className="text-text-secondary" />
                            <input
                                className="bg-transparent border-none outline-none text-white text-sm w-full h-10 placeholder:text-text-secondary"
                                placeholder="Search collections..."
                            />
                        </GlassPanel>
                    </div>
                    <Link href="/admin/collections/new">
                        <Button>Create Collection</Button>
                    </Link>
                </div>

                <GlassPanel className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white/5 text-text-secondary uppercase text-xs font-bold border-b border-white/5">
                                <tr>
                                    <th className="p-4 w-10">
                                        <input type="checkbox" className="checkbox checkbox-xs rounded-sm border-white/20" />
                                    </th>
                                    <th className="p-4">Title</th>
                                    <th className="p-4">Products</th>
                                    <th className="p-4">Visibility</th>
                                    <th className="p-4">Updated</th>
                                    <th className="p-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {MOCK_COLLECTIONS.map((col) => (
                                    <tr key={col.id} className="group hover:bg-white/5 transition-colors cursor-pointer">
                                        <td className="p-4 text-center">
                                            <input type="checkbox" className="checkbox checkbox-xs rounded-sm border-white/20" />
                                        </td>
                                        <td className="p-4 font-bold text-white">
                                            <Link href={`/admin/collections/${col.id}`} className="hover:underline hover:text-primary transition-colors">
                                                {col.name}
                                            </Link>
                                        </td>
                                        <td className="p-4 text-text-secondary">{col.count} products</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${col.visibility === 'Hidden' ? 'bg-white/10 text-text-secondary' : 'bg-state-success/10 text-state-success'
                                                }`}>
                                                {col.visibility}
                                            </span>
                                        </td>
                                        <td className="p-4 text-text-secondary text-xs">{col.updated}</td>
                                        <td className="p-4 text-right">
                                            <Link href={`/admin/collections/${col.id}`}>
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
