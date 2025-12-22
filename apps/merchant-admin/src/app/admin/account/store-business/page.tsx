'use client';

import React, { useEffect, useState } from 'react';
import { GlassPanel, Button, Input, Icon } from '@vayva/ui';
import { AccountService } from '@/services/account.service';
import { StoreProfile } from '@/types/account';
import { Spinner } from '@/components/Spinner';
import Link from 'next/link';

export default function StoreBusinessPage() {
    const [store, setStore] = useState<StoreProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const load = async () => {
            const data = await AccountService.getStoreProfile();
            setStore(data);
            setLoading(false);
        };
        load();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!store) return;
        setSaving(true);
        try {
            await AccountService.updateStoreProfile(store);
            // In real app, show toast
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading || !store) return <div className="text-text-secondary"><Spinner size="sm" /> Loading store details...</div>;

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex gap-4">
                <GlassPanel className="p-6 flex-1 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white">Store Information</h2>
                        {/* Quick Links */}
                        <div className="flex gap-2">
                            <Link href="/admin/control-center/branding">
                                <Button variant="ghost" size="sm">Edit Branding</Button>
                            </Link>
                            <Link href="/admin/control-center/templates">
                                <Button variant="ghost" size="sm">Templates</Button>
                            </Link>
                        </div>
                    </div>

                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary">Store Name</label>
                            <Input
                                value={store.name}
                                onChange={e => setStore({ ...store, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-secondary">Category</label>
                                <Input
                                    value={store.category}
                                    onChange={e => setStore({ ...store, category: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-secondary">Store Slug (URL)</label>
                                <div className="flex items-center">
                                    <span className="text-text-secondary text-sm mr-2">vayva.shop/</span>
                                    <Input
                                        value={store.slug}
                                        onChange={e => setStore({ ...store, slug: e.target.value })}
                                        disabled={store.isPublished} // Lock if published
                                    />
                                </div>
                                {store.isPublished && <p className="text-xs text-yellow-500">Cannot change slug while store is live.</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary">Address</label>
                            <Input
                                value={store.address}
                                onChange={e => setStore({ ...store, address: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-secondary">City</label>
                                <Input
                                    value={store.city}
                                    onChange={e => setStore({ ...store, city: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-secondary">State</label>
                                <Input
                                    value={store.state}
                                    onChange={e => setStore({ ...store, state: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <Link href="/admin/control-center/preview" target="_blank">
                                <Button type="button" variant="secondary">
                                    <Icon name={"Eye" as any} size={16} className="mr-2" />
                                    Preview Store
                                </Button>
                            </Link>
                            <Button type="submit" variant="primary" disabled={saving}>
                                {saving ? <Spinner size="sm" className="mr-2" /> : null}
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </GlassPanel>
            </div>
        </div>
    );
}
