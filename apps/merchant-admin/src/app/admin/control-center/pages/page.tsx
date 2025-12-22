'use client';

import React, { useEffect, useState } from 'react';
import { GlassPanel, Button, Icon } from '@vayva/ui';
import { Spinner } from '@/components/Spinner';
import { ControlCenterService } from '@/services/control-center.service';
import { StorePage } from '@/types/control-center';
import Link from 'next/link';

export default function PagesListPage() {
    const [pages, setPages] = useState<StorePage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const p = await ControlCenterService.getPages();
            setPages(p);
            setLoading(false);
        };
        load();
    }, []);

    if (loading) return <div className="p-12 text-center"><Spinner /></div>;

    return (
        <div className="mx-auto max-w-4xl p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <Link href="/admin/control-center" className="mb-2 flex items-center text-sm text-text-secondary hover:text-white">
                        <Icon name={"ArrowLeft" as any} size={16} className="mr-2" />
                        Back to Control Center
                    </Link>
                    <h1 className="text-2xl font-bold text-white">Pages</h1>
                    <p className="text-text-secondary">Manage content pages for your store.</p>
                </div>
                <Link href="/admin/control-center/pages/new">
                    <Button variant="primary" className="gap-2">
                        <Icon name={"Plus" as any} size={16} />
                        New Page
                    </Button>
                </Link>
            </div>

            <GlassPanel className="p-0 overflow-hidden">
                {pages.length === 0 ? (
                    <div className="p-12 text-center text-text-secondary">
                        <Icon name={"FileText" as any} size={48} className="mx-auto mb-4 opacity-30" />
                        <p>No pages created yet.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/10">
                        {pages.map(page => (
                            <div key={page.id} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                                <div>
                                    <h3 className="font-medium text-white">{page.title}</h3>
                                    <div className="flex gap-3 text-xs text-text-secondary mt-1">
                                        <span>/{page.slug}</span>
                                        <span>•</span>
                                        <span>{page.isPublished ? 'Published' : 'Draft'}</span>
                                        <span>•</span>
                                        <span>Last updated {new Date(page.updatedAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 flex items-center justify-center">
                                        <Icon name={"Edit2" as any} size={14} />
                                    </Button>
                                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 flex items-center justify-center text-red-500 hover:text-red-400 hover:border-red-500/50">
                                        <Icon name={"Trash" as any} size={14} />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </GlassPanel>
        </div>
    );
}
