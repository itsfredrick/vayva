'use client';

import React from 'react';
import { MarketShell } from '@/components/market/market-shell';
import { MarketProductCard, MarketProduct } from '@/components/market/market-product-card';
import { Button , Icon } from '@vayva/ui';

const MOCK_PRODUCTS: MarketProduct[] = [
    { id: '1', name: 'MacBook Pro M3 Max', price: '₦ 3,500,000', image: '', sellerName: 'TechDepot', sellerVerified: true, inStock: true, rating: 4.8 },
    { id: '2', name: 'iPad Pro 12.9"', price: '₦ 1,800,000', image: '', sellerName: 'TechDepot', sellerVerified: true, inStock: true, rating: 5.0 },
    { id: '3', name: 'Magic Keyboard', price: '₦ 450,000', image: '', sellerName: 'TechDepot', sellerVerified: true, inStock: true, rating: 4.9 },
];

export default function SellerProfilePage({ params }: { params: { id: string } }) {
    const sellerName = 'TechDepot'; // derived from params id in real app

    return (
        <MarketShell>

            {/* Seller Hero */}
            <div className="bg-[#0b141a] border-b border-white/5 py-12">
                <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center md:items-start gap-8">
                    <div className="w-24 h-24 rounded-2xl bg-indigo-500 flex items-center justify-center text-4xl font-bold text-white shadow-2xl">
                        {sellerName.charAt(0)}
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center md:justify-start gap-2">
                            {sellerName}
                            <Icon name="ShieldCheck" className="text-blue-400" size={24} />
                        </h1>
                        <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-text-secondary mb-4">
                            <span className="flex items-center gap-1"><Icon name="MapPin" size={16} /> Ikeja, Lagos</span>
                            <span className="flex items-center gap-1"><Icon name="Star" size={16} className="text-yellow-400" /> 4.8 (120 reviews)</span>
                            <span className="flex items-center gap-1"><Icon name="Clock" size={16} /> Joined 2024</span>
                        </div>
                        <p className="text-white/80 max-w-xl">
                            Your #1 source for premium Apple products in Lagos. We sell authentic gadgets with warranty. Fast delivery guaranteed.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button className="rounded-full bg-white text-black hover:bg-white/90 font-bold">
                            <Icon name="MessageCircle" size={18} className="mr-2" /> Message
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full border-white/10 text-white hover:bg-white/5">
                            <Icon name="Share2" size={18} />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8">

                {/* Tabs */}
                <div className="flex gap-8 border-b border-white/5 mb-8 overflow-x-auto">
                    <button className="pb-4 text-primary font-bold border-b-2 border-primary whitespace-nowrap">Products (24)</button>
                    <button className="pb-4 text-text-secondary hover:text-white font-medium whitespace-nowrap">About</button>
                    <button className="pb-4 text-text-secondary hover:text-white font-medium whitespace-nowrap">Policies</button>
                    <button className="pb-4 text-text-secondary hover:text-white font-medium whitespace-nowrap">Reviews</button>
                </div>

                {/* Content */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {MOCK_PRODUCTS.map(product => (
                        <MarketProductCard key={product.id} product={product} />
                    ))}
                </div>

            </div>
        </MarketShell>
    );
}
