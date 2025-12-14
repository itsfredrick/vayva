'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { AdminShell } from '@/components/admin-shell';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icon } from '@/components/ui/icon';

export default function VariantsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    return (
        <AdminShell title="Edit Variants" breadcrumb={`Catalog / ${id} / Variants`}>
            <div className="flex flex-col gap-6 max-w-5xl mx-auto">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Variants</h1>
                        <p className="text-text-secondary">Manage options for Nike Air Max 90</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" onClick={() => router.back()}>Back</Button>
                        <Button>Save All Changes</Button>
                    </div>
                </div>

                {/* Options Builder */}
                <GlassPanel className="p-6">
                    <h3 className="font-bold text-white mb-4">Options</h3>
                    <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                            <div>
                                <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Option Name</label>
                                <Input defaultValue="Size" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Values</label>
                                <div className="flex flex-wrap gap-2">
                                    {['40', '41', '42', '43'].map(v => (
                                        <div key={v} className="px-3 py-2 rounded-lg bg-white/10 text-white text-sm flex items-center gap-2">
                                            {v}
                                            <Icon name="close" size={14} className="cursor-pointer hover:text-state-danger" />
                                        </div>
                                    ))}
                                    <input
                                        className="bg-transparent border-none outline-none text-white text-sm h-9 placeholder:text-text-secondary min-w-[100px]"
                                        placeholder="Add value..."
                                    />
                                </div>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-fit text-xs">
                            <Icon name="add" size={16} className="mr-2" />
                            Add another option
                        </Button>
                    </div>
                </GlassPanel>

                {/* Matrix Table */}
                <GlassPanel className="overflow-hidden">
                    <div className="p-4 border-b border-white/5 flex items-center justify-between">
                        <h3 className="font-bold text-white">Preview</h3>
                        <span className="text-xs text-text-secondary">4 variants generated</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white/5 text-text-secondary uppercase text-xs font-bold border-b border-white/5">
                                <tr>
                                    <th className="p-4">Variant</th>
                                    <th className="p-4">Price</th>
                                    <th className="p-4">SKU</th>
                                    <th className="p-4">Stock</th>
                                    <th className="p-4 w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {['Size 40', 'Size 41', 'Size 42', 'Size 43'].map((variant) => (
                                    <tr key={variant}>
                                        <td className="p-4 font-bold text-white">{variant}</td>
                                        <td className="p-4">
                                            <Input defaultValue="45000" className="h-8 text-sm" />
                                        </td>
                                        <td className="p-4">
                                            <Input defaultValue={`NK-AM90-${variant.split(' ')[1]}`} className="h-8 text-sm" />
                                        </td>
                                        <td className="p-4">
                                            <Input defaultValue="0" className="h-8 text-sm w-20" />
                                        </td>
                                        <td className="p-4">
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-text-secondary hover:text-state-danger">
                                                <Icon name="delete" size={18} />
                                            </Button>
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
