'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminShell } from '@/components/admin-shell';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icon } from '@/components/ui/icon';

export default function CreateCollectionPage() {
    const router = useRouter();

    return (
        <AdminShell title="Create Collection" breadcrumb="Catalog / Collections / New">
            <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-20">
                {/* Sticky Action Bar */}
                <div className="flex items-center justify-between sticky top-[80px] z-30 py-4 bg-[#142210]/95 backdrop-blur-xl border-b border-white/5 -mx-6 px-6 sm:mx-0 sm:px-0 sm:bg-transparent sm:border-none sm:backdrop-blur-none sm:static">
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-bold text-white">Create Collection</h1>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" onClick={() => router.back()}>Discard</Button>
                        <Button onClick={() => router.push('/admin/collections')}>Save Collection</Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* LEFT */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <GlassPanel className="p-6">
                            <h3 className="font-bold text-white mb-4">Basic Info</h3>
                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Title</label>
                                    <Input placeholder="e.g. Summer Essentials" />
                                </div>
                                <div>
                                    <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Description</label>
                                    <textarea
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white resize-none focus:outline-none focus:border-primary transition-colors min-h-[100px]"
                                        placeholder="Add a description..."
                                    ></textarea>
                                </div>
                            </div>
                        </GlassPanel>

                        <GlassPanel className="p-6">
                            <h3 className="font-bold text-white mb-4">Collection Type</h3>
                            <div className="flex flex-col gap-4">
                                <label className="flex items-start gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20 cursor-pointer">
                                    <input type="radio" name="type" className="radio radio-primary mt-0.5" defaultChecked />
                                    <div>
                                        <p className="font-bold text-white text-sm">Manual</p>
                                        <p className="text-xs text-text-secondary">Add products to this collection one by one.</p>
                                    </div>
                                </label>
                                <label className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5 opacity-50 cursor-not-allowed">
                                    <input type="radio" name="type" className="radio radio-primary mt-0.5" disabled />
                                    <div>
                                        <p className="font-bold text-white text-sm">Automated <span className="text-[10px] bg-white/10 px-1 rounded ml-2">SOON</span></p>
                                        <p className="text-xs text-text-secondary">Existing and future products that match conditions.</p>
                                    </div>
                                </label>
                            </div>
                        </GlassPanel>
                    </div>

                    {/* RIGHT */}
                    <div className="flex flex-col gap-6">
                        <GlassPanel className="p-6">
                            <h3 className="font-bold text-white mb-4">Visibility</h3>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-white">Online Store</span>
                                    <input type="checkbox" className="toggle toggle-sm toggle-primary" defaultChecked />
                                </div>
                                <div className="flex items-center justify-between opacity-50">
                                    <span className="text-sm text-white">Vayva Marketplace</span>
                                    <input type="checkbox" className="toggle toggle-sm toggle-primary" disabled />
                                </div>
                            </div>
                        </GlassPanel>

                        <GlassPanel className="p-6">
                            <h3 className="font-bold text-white mb-4">Collection Image</h3>
                            <div className="border border-dashed border-white/20 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors cursor-pointer h-40">
                                <Icon name="add_photo_alternate" size={24} className="text-text-secondary mb-2" />
                                <p className="text-xs font-bold text-white">Upload image</p>
                            </div>
                        </GlassPanel>
                    </div>
                </div>
            </div>
        </AdminShell>
    );
}
