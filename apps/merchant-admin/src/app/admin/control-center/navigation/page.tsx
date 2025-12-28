'use client';

import React, { useEffect, useState } from 'react';
import { GlassPanel, Button, Icon } from '@vayva/ui';
import { Spinner } from '@/components/Spinner';
import { ControlCenterService } from '@/services/control-center.service';
import { StoreConfig, NavigationItem } from '@/types/control-center';
import Link from 'next/link';

export default function NavigationPage() {
    const [config, setConfig] = useState<StoreConfig | null>(null);
    const [headerLinks, setHeaderLinks] = useState<NavigationItem[]>([]);
    const [footerLinks, setFooterLinks] = useState<NavigationItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const c = await ControlCenterService.getStoreConfig();
            setConfig(c);
            if (c) {
                // Assuming c.navigation might be null or undefined, provide a default empty object
                const navigation = c.navigation || { header: [], footer: [] };
                setHeaderLinks(navigation.header);
                setFooterLinks(navigation.footer);
            }
            setLoading(false);
        };
        load();
    }, []);

    const moveItem = (index: number, direction: 'up' | 'down', list: NavigationItem[], setList: (l: NavigationItem[]) => void) => {
        const newList = [...list];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newList.length) return;

        [newList[index], newList[targetIndex]] = [newList[targetIndex], newList[index]];
        setList(newList);
    };

    // Need a mock save function as we didn't add updateNavigation to service, but can just log for now or add it later.
    // For now, UI interaction is key.

    if (loading) return <div className="p-12 text-center"><Spinner /></div>;

    const renderList = (items: NavigationItem[], setItems: (l: NavigationItem[]) => void) => (
        <div className="space-y-2">
            {items.map((item, i) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5 group hover:border-white/10 transition-colors">
                    <Icon name="Menu" size={16} className="text-white/30 cursor-move" />
                    <div className="flex-1">
                        <div className="font-medium text-white text-sm">{item.label}</div>
                        <div className="text-xs text-text-secondary">{item.path}</div>
                    </div>
                    <div className="flex gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => moveItem(i, 'up', items, setItems)}
                            disabled={i === 0}
                            className="p-1 hover:text-white disabled:opacity-30"
                        >
                            <Icon name="ChevronUp" size={14} />
                        </button>
                        <button
                            onClick={() => moveItem(i, 'down', items, setItems)}
                            disabled={i === items.length - 1}
                            className="p-1 hover:text-white disabled:opacity-30"
                        >
                            <Icon name="ChevronDown" size={14} />
                        </button>
                    </div>
                    <button className="p-1 text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Icon name="X" size={14} />
                    </button>
                </div>
            ))}
            <Button variant="outline" size="sm" className="w-full border-dashed border-white/20 text-text-secondary hover:text-white hover:border-white/40">
                <Icon name="Plus" size={14} className="mr-2" /> Add Link
            </Button>
        </div>
    );

    return (
        <div className="mx-auto max-w-4xl p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <Link href="/admin/control-center" className="mb-2 flex items-center text-sm text-text-secondary hover:text-white">
                        <Icon name="ArrowLeft" size={16} className="mr-2" />
                        Back to Control Center
                    </Link>
                    <h1 className="text-2xl font-bold text-white">Navigation</h1>
                    <p className="text-text-secondary">Organize your store's menus.</p>
                </div>
                <Button variant="primary">Save Order</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-lg font-medium text-white mb-4">Header Menu</h2>
                    <GlassPanel className="p-4">
                        {renderList(headerLinks, setHeaderLinks)}
                    </GlassPanel>
                </div>
                <div>
                    <h2 className="text-lg font-medium text-white mb-4">Footer Menu</h2>
                    <GlassPanel className="p-4">
                        {renderList(footerLinks, setFooterLinks)}
                    </GlassPanel>
                </div>
            </div>
        </div>
    );
}
