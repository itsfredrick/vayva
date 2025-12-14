'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MarketShell } from '@/components/market/market-shell';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

const MOCK_PRODUCT = {
    id: '1',
    name: 'MacBook Pro M3 Max - 1TB SSD, 36GB RAM',
    price: 3500000,
    curr: '₦',
    seller: {
        name: 'TechDepot',
        verified: true,
        rating: 4.8,
        slug: 'techdepot',
        location: 'Ikeja, Lagos'
    },
    images: ['', '', ''],
    desc: 'Brand new factory sealed MacBook Pro M3 Max. 1 year Apple Warranty included. Fast shipping within Lagos.',
};

export default function MarketPDP({ params }: { params: { id: string } }) {
    const [qty, setQty] = useState(1);

    return (
        <MarketShell>
            <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-8">

                {/* Breadcrumb */}
                <div className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-8 flex items-center gap-2">
                    <Link href="/market" className="hover:text-white">Home</Link>
                    <Icon name="chevron_right" size={14} />
                    <Link href="/market/search" className="hover:text-white">Computers</Link>
                    <Icon name="chevron_right" size={14} />
                    <span className="text-white">MacBooks</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

                    {/* Gallery (Left) */}
                    <div className="space-y-4">
                        <div className="aspect-video bg-[#0b141a] rounded-2xl w-full relative overflow-hidden flex items-center justify-center border border-white/5">
                            <Icon name="computer" size={64} className="text-white/10" />
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="aspect-square bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors border border-white/5" />
                            ))}
                        </div>
                    </div>

                    {/* Details (Right) */}
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">{MOCK_PRODUCT.name}</h1>
                        <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400 mb-8 inline-block">
                            {MOCK_PRODUCT.curr} {MOCK_PRODUCT.price.toLocaleString()}
                        </div>

                        {/* Seller Card (Embedded) */}
                        <div className="bg-white/5 rounded-xl p-4 border border-white/5 mb-8 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xl">
                                    {MOCK_PRODUCT.seller.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-bold text-white flex items-center gap-1">
                                        {MOCK_PRODUCT.seller.name}
                                        {MOCK_PRODUCT.seller.verified && <Icon name="verified" size={16} className="text-blue-400" />}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-text-secondary">
                                        <span className="flex items-center gap-0.5"><Icon name="star" size={12} className="text-yellow-400" /> {MOCK_PRODUCT.seller.rating}</span>
                                        <span>•</span>
                                        <span>{MOCK_PRODUCT.seller.location}</span>
                                    </div>
                                </div>
                            </div>
                            <Link href={`/market/sellers/${MOCK_PRODUCT.seller.slug}`}>
                                <Button variant="outline" size="sm" className="border-white/10 text-white hover:bg-white/5">View Profile</Button>
                            </Link>
                        </div>

                        {/* Buy Panel */}
                        <div className="space-y-6 mb-10 p-6 rounded-2xl bg-white/5 border border-white/5">
                            <div className="flex items-center gap-4 text-sm text-text-secondary border-b border-white/5 pb-4">
                                <Icon name="local_shipping" size={18} />
                                <span>Ships to <strong className="text-white">Lagos Mainland</strong> in <strong className="text-white">1-2 days</strong></span>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex items-center bg-[#0b141a] border border-white/10 rounded-full h-12 px-2">
                                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-8 h-full flex items-center justify-center text-white/50 hover:text-white"><Icon name="remove" size={16} /></button>
                                    <span className="w-8 text-center text-white font-bold">{qty}</span>
                                    <button onClick={() => setQty(qty + 1)} className="w-8 h-full flex items-center justify-center text-white/50 hover:text-white"><Icon name="add" size={16} /></button>
                                </div>
                                <Button className="flex-1 h-12 rounded-full bg-primary text-black hover:bg-primary/90 font-bold text-base shadow-[0_0_20px_rgba(70,236,19,0.2)]">
                                    Add to Cart
                                </Button>
                            </div>

                            <p className="text-xs text-center text-text-secondary">Transactions are secured by Vayva. Money held in escrow until delivery.</p>
                        </div>

                        {/* Description */}
                        <div className="mb-8">
                            <h3 className="font-bold text-white mb-2">Description</h3>
                            <p className="text-text-secondary leading-relaxed">{MOCK_PRODUCT.desc}</p>
                        </div>

                        {/* Report */}
                        <div className="flex items-center gap-2 mt-12 text-xs text-text-secondary cursor-pointer hover:text-state-danger transition-colors opacity-60 hover:opacity-100">
                            <Icon name="flag" size={14} /> Report this listing
                        </div>

                    </div>
                </div>
            </div>
        </MarketShell>
    );
}
