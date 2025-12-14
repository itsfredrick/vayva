'use client';

import React from 'react';
import { MarketShell } from '@/components/market/market-shell';
import { MarketProductCard, MarketProduct } from '@/components/market/market-product-card';
import { Icon } from '@/components/ui/icon';

const MOCK_PRODUCTS: MarketProduct[] = [
    { id: '1', name: 'MacBook Pro M3 Max', price: '₦ 3,500,000', image: '', sellerName: 'TechDepot', sellerVerified: true, inStock: true, rating: 4.8 },
    { id: '3', name: 'Samsung 65" 4K TV', price: '₦ 850,000', image: '', sellerName: 'GadgetWorld', sellerVerified: false, inStock: true, rating: 4.5 },
    { id: '5', name: 'PlayStation 5 Slim', price: '₦ 650,000', image: '', sellerName: 'GamingArea', sellerVerified: true, inStock: true, rating: 4.7 },
];

export default function MarketCategoryPage({ params }: { params: { category: string } }) {
    const categoryName = params.category.charAt(0).toUpperCase() + params.category.slice(1);

    return (
        <MarketShell>
            <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">{categoryName}</h1>
                    <p className="text-text-secondary">Explore the best deals in {categoryName} from trusted sellers.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {MOCK_PRODUCTS.map(product => (
                        <MarketProductCard key={product.id} product={product} />
                    ))}
                    {MOCK_PRODUCTS.map(product => (
                        <MarketProductCard key={product.id + 'd'} product={product} />
                    ))}
                </div>
            </div>
        </MarketShell>
    );
}
