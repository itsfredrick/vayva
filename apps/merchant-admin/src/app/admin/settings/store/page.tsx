'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@vayva/ui';
import { GlassPanel } from '@vayva/ui';
import { Button } from '@vayva/ui';
import { Icon } from '@vayva/ui';

export default function StoreSettingsPage() {
    const [isDirty, setIsDirty] = useState(false);

    const handleChange = () => setIsDirty(true);
    const handleSave = () => {
        setIsDirty(false);
        // Simulate save
    };

    return (
        <AppShell sidebar={<></>} header={<></>}>
            <div className="max-w-4xl mx-auto mb-6">
                <h1 className="text-2xl font-bold text-white">Store Settings</h1>
            </div>
            <div className="max-w-4xl mx-auto space-y-6 pb-24">

                {/* 1. Store Identity */}
                <GlassPanel className="p-6">
                    <h2 className="font-bold text-white text-lg mb-6">Store Identity</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="col-span-1">
                            <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Store Logo</label>
                            <div className="aspect-square rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-colors group relative overflow-hidden">
                                <Icon name="ImagePlus" size={32} className="text-white/20 group-hover:text-white/50 transition-colors" />
                                <span className="text-xs text-text-secondary mt-2">Upload Logo</span>
                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleChange} />
                            </div>
                        </div>
                        <div className="md:col-span-2 space-y-4">
                            <div>
                                <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Store Name</label>
                                <input
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                    defaultValue="My Awesome Store"
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Store Category</label>
                                <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary" onChange={handleChange}>
                                    <option>Fashion & Apparel</option>
                                    <option>Electronics</option>
                                    <option>Beauty & Health</option>
                                    <option>Home & Garden</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Store URL</label>
                                <div className="flex gap-2">
                                    <div className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-text-secondary font-mono text-sm flex items-center justify-between">
                                        <span>my-awesome-store.vayva.shop</span>
                                        <Link href="/admin/store/domains" className="text-primary hover:underline text-xs">Manage Domains</Link>
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-text-secondary"><Icon name="Copy" size={18} /></Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </GlassPanel>

                {/* 2. Contact Information */}
                <GlassPanel className="p-6">
                    <h2 className="font-bold text-white text-lg mb-6">Contact Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Support Phone <span className="text-state-warning">*</span></label>
                            <input
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                defaultValue="+234 812 345 6789"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Support Email</label>
                            <input
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                defaultValue="support@mystore.com"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5">
                                <div>
                                    <div className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-1">WhatsApp Number</div>
                                    <div className="text-white font-mono">+234 812 345 6789</div>
                                </div>
                                <Link href="/admin/whatsapp/connect">
                                    <Button variant="outline" size="sm">Manage Connection</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </GlassPanel>

                {/* 3. Business Address */}
                <GlassPanel className="p-6">
                    <h2 className="font-bold text-white text-lg mb-6">Business Address</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Address Line 1 <span className="text-state-warning">*</span></label>
                            <input
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                defaultValue="12 Lekki Phase 1"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">City <span className="text-state-warning">*</span></label>
                            <input
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                defaultValue="Lagos"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">State <span className="text-state-warning">*</span></label>
                            <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary" onChange={handleChange}>
                                <option>Lagos</option>
                                <option>Abuja (FCT)</option>
                                <option>Rivers</option>
                                <option>Ogun</option>
                                {/* Add more states */}
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Landmark (Optional)</label>
                            <input
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                placeholder="Near Ebeano Supermarket"
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </GlassPanel>

                {/* 4. Regional Settings */}
                <GlassPanel className="p-6">
                    <h2 className="font-bold text-white text-lg mb-6">Regional Settings</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Currency</label>
                            <div className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white/50 cursor-not-allowed">
                                Nigerian Naira (₦)
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Timezone</label>
                            <div className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white/50 cursor-not-allowed">
                                Africa/Lagos (GMT+1)
                            </div>
                        </div>
                    </div>
                </GlassPanel>

                {/* Sticky Save Bar */}
                <div className={`fixed bottom-0 left-0 right-0 p-4 bg-[#142210]/95 border-t border-white/10 backdrop-blur-md z-50 flex items-center justify-between transition-transform duration-300 ${isDirty ? 'translate-y-0' : 'translate-y-full'}`}>
                    <div className="max-w-4xl mx-auto w-full flex items-center justify-between px-4">
                        <span className="text-sm text-white">You have unsaved changes</span>
                        <div className="flex gap-3">
                            <Button variant="ghost" className="text-white hover:bg-white/10" onClick={() => setIsDirty(false)}>Discard</Button>
                            <Button className="bg-primary hover:bg-primary/90 text-black border-none" onClick={handleSave}>Save Changes</Button>
                        </div>
                    </div>
                </div>

            </div>
        </AppShell>
    );
}
