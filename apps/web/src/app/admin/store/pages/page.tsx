'use client';

import React from 'react';
import Link from 'next/link';
import { AdminShell } from '@/components/admin-shell';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

const MOCK_PAGES = [
    { id: 'p1', title: 'About Us', slug: '/about', status: 'Published', updated: '2 days ago' },
    { id: 'p2', title: 'Contact', slug: '/contact', status: 'Published', updated: '1 week ago' },
    { id: 'p3', title: 'FAQ', slug: '/faq', status: 'Draft', updated: '2 weeks ago' },
];

export default function PagesListPage() {
    return (
        <AdminShell title="Pages" breadcrumb="Storefront / Pages">
            <div className="flex flex-col gap-6">
                {/* Top Controls */}
                <div className="flex items-center justify-between">
                    <div className="flex-1 max-w-sm">
                        <GlassPanel className="p-1 pl-4 flex items-center gap-2">
                            <Icon name="search" className="text-text-secondary" />
                            <input
                                className="bg-transparent border-none outline-none text-white text-sm w-full h-10 placeholder:text-text-secondary"
                                placeholder="Search pages..."
                            />
                        </GlassPanel>
                    </div>
                    <Link href="/admin/store/pages/new">
                        <Button>Create Page</Button>
                    </Link>
                </div>

                {/* Table */}
                <GlassPanel className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white/5 text-text-secondary uppercase text-xs font-bold border-b border-white/5">
                                <tr>
                                    <th className="p-4">Title</th>
                                    <th className="p-4">Slug</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Updated</th>
                                    <th className="p-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {MOCK_PAGES.map((page) => (
                                    <tr key={page.id} className="group hover:bg-white/5 transition-colors cursor-pointer">
                                        <td className="p-4 font-bold text-white">
                                            <Link href={`/admin/store/pages/${page.id}`} className="hover:underline hover:text-primary transition-colors">
                                                {page.title}
                                            </Link>
                                        </td>
                                        <td className="p-4 text-text-secondary font-mono text-xs">{page.slug}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${page.status === 'Published' ? 'bg-state-success/10 text-state-success' : 'bg-white/10 text-text-secondary'
                                                }`}>
                                                {page.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-text-secondary text-xs">{page.updated}</td>
                                        <td className="p-4 text-right">
                                            <Link href={`/admin/store/pages/${page.id}`}>
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
