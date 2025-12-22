'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AppShell , GlassPanel , Button , Icon } from '@vayva/ui';
import { MarketplaceStatusBadge } from '@/components/marketplace-status-badge';

export default function ListingDetailPage() {
    const params = useParams();
    const id = params.id as string;

    const [isVisible, setIsVisible] = useState(true);

    const listing = {
        id,
        name: 'Ultra-Soft T-Shirt',
        status: 'Listed',
        price: '₦ 10,000',
        description: 'Experience ultimate comfort with our premium cotton blend t-shirt. Perfect for everyday wear.',
        category: 'Fashion / Men / Tops',
        images: [1, 2, 3]
    };

    return (
        <AppShell sidebar={<></>} header={<></>}>
            <div className="flex flex-col gap-6 max-w-6xl mx-auto">
                {/* Header Actions */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-white">{listing.name}</h1>
                    <div className="flex gap-2">
                        <Button variant="ghost">View on Marketplace</Button>
                        <Button>Save Changes</Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        {/* 1. Status & Visibility */}
                        <GlassPanel className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-white">Listing Status</h3>
                                <MarketplaceStatusBadge status={isVisible ? 'Listed' : 'Unlisted'} />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5">
                                <div>
                                    <span className="font-bold text-white block">Visible on Marketplace</span>
                                    <span className="text-xs text-text-secondary">Customers can find and purchase this item.</span>
                                </div>
                                <input type="checkbox" className="toggle toggle-primary" checked={isVisible} onChange={(e) => setIsVisible(e.target.checked)} />
                            </div>
                        </GlassPanel>

                        {/* 2. Presentation */}
                        <GlassPanel className="p-6 space-y-4">
                            <h3 className="font-bold text-white mb-2">Presentation</h3>
                            <div>
                                <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Listing Title</label>
                                <input className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-primary" defaultValue={listing.name} />
                            </div>
                            <div>
                                <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Short Description</label>
                                <textarea className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-primary min-h-[100px]" defaultValue={listing.description} />
                                <div className="text-right text-[10px] text-text-secondary mt-1">85 / 400 characters</div>
                            </div>
                            <div>
                                <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Images</label>
                                <div className="grid grid-cols-4 gap-4">
                                    {listing.images.map((img, i) => (
                                        <div key={i} className="aspect-square rounded-lg bg-white/5 border border-white/10 flex items-center justify-center relative cursor-pointer hover:border-primary transition-colors group">
                                            <span className="text-xs font-bold text-text-secondary">IMG {img}</span>
                                            {i === 0 && <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-primary text-black text-[10px] font-bold uppercase">Main</span>}
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Icon name={"CheckCircle" as any} className="text-primary" />
                                            </div>
                                        </div>
                                    ))}
                                    <div className="aspect-square rounded-lg border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-text-secondary hover:text-white hover:border-white/30 cursor-pointer transition-colors">
                                        <Icon name={"Plus" as any} />
                                        <span className="text-xs font-bold mt-1">Add</span>
                                    </div>
                                </div>
                            </div>
                        </GlassPanel>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="flex flex-col gap-6">
                        {/* Pricing */}
                        <GlassPanel className="p-6">
                            <h3 className="font-bold text-white mb-4">Pricing</h3>
                            <div className="bg-white/5 border border-white/5 rounded-lg p-4 mb-4">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm text-text-secondary">Base Price</span>
                                    <span className="text-white font-bold">{listing.price}</span>
                                </div>
                                <div className="text-[10px] text-text-secondary">Managed in Product Catalog</div>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                                <input type="checkbox" className="checkbox checkbox-xs border-white/20" />
                                <span className="text-xs text-white">Override price for Marketplace</span>
                            </div>
                        </GlassPanel>

                        {/* Performance */}
                        <GlassPanel className="p-6">
                            <h3 className="font-bold text-white mb-4">Performance</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-xs text-text-secondary uppercase tracking-wider">Views</div>
                                    <div className="text-xl font-bold text-white">450</div>
                                </div>
                                <div>
                                    <div className="text-xs text-text-secondary uppercase tracking-wider">Orders</div>
                                    <div className="text-xl font-bold text-white">12</div>
                                </div>
                            </div>
                        </GlassPanel>

                        {/* Compliance */}
                        <GlassPanel className="p-6">
                            <h3 className="font-bold text-white mb-4">Compliance</h3>
                            <div className="space-y-3">
                                {[
                                    { label: 'Images meet quality', met: true },
                                    { label: 'Description present', met: true },
                                    { label: 'Prohibited items check', met: true },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <Icon name={"CheckCircle" as any} size={16} className="text-state-success" />
                                        <span className="text-sm text-white">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </GlassPanel>

                        {/* Actions */}
                        <GlassPanel className="p-6">
                            <h3 className="font-bold text-white mb-4">Actions</h3>
                            <div className="space-y-2">
                                <Link href="/admin/products/123">
                                    <Button variant="outline" className="w-full justify-start text-xs">
                                        <Icon name={"Edit" as any} size={14} className="mr-2" />
                                        Edit Original Product
                                    </Button>
                                </Link>
                                <Button variant="outline" className="w-full justify-start text-xs text-state-danger hover:text-state-danger hover:bg-state-danger/10 border-state-danger/20">
                                    <Icon name={"Trash2" as any} size={14} className="mr-2" />
                                    Remove Listing
                                </Button>
                            </div>
                        </GlassPanel>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
