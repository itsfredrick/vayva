'use client';

import React from 'react';
import { StoreShell } from '@/components/storefront/store-shell';
import { ProductCard, Product } from '@/components/storefront/product-card';
import { Button , Icon } from '@vayva/ui';
import { formatNGN } from '@/config/pricing';

const MOCK_PRODUCTS: Product[] = [
    { id: '1', name: 'Premium Cotton Tee', price: formatNGN(12000), image: '', slug: 'premium-cotton-tee', inStock: true },
    { id: '2', name: 'Slim Fit Chinos', price: formatNGN(18500), image: '', slug: 'slim-fit-chinos', inStock: true },
    { id: '3', name: 'Vintage Denim Jacket', price: formatNGN(45000), image: '', slug: 'vintage-denim-jacket', inStock: false },
    { id: '4', name: 'Leather Sneakers', price: formatNGN(35000), image: '', slug: 'leather-sneakers', inStock: true },
    { id: '5', name: 'Summer Shorts', price: formatNGN(10000), image: '', slug: 'summer-shorts', inStock: true },
    { id: '6', name: 'Graphic Hoodie', price: formatNGN(25000), image: '', slug: 'graphic-hoodie', inStock: true },
];

export default function CollectionPage({ params }: { params: { slug: string, collection: string } }) {
    const collectionName = params.collection.charAt(0).toUpperCase() + params.collection.slice(1);

    return (
        <StoreShell slug={params.slug}>
            <div className="max-w-7xl mx-auto px-4 py-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                    <div>
                        <div className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 flex items-center gap-2">
                            Home <Icon name="ChevronRight" size={14} /> Collections <Icon name="ChevronRight" size={14} /> <span className="text-white">{collectionName}</span>
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-2">{collectionName}</h1>
                        <p className="text-text-secondary">Found {MOCK_PRODUCTS.length} products</p>
                    </div>

                    {/* Toolbar */}
                    <div className="flex gap-3 w-full md:w-auto">
                        <Button variant="outline" size="sm" className="hidden md:flex">
                            <Icon name={"Sliders" as any} size={14} className="mr-2" />
                            Filter
                        </Button>
                        <Button variant="outline" className="flex-1 md:flex-none justify-between text-white border-white/10 hover:bg-white/5 gap-4">
                            <span className="flex items-center gap-2"><Icon name="ArrowUpDown" size={16} /> Sort</span>
                            <Icon name="ChevronDown" size={16} className="text-text-secondary" />
                        </Button>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                    {MOCK_PRODUCTS.map(product => (
                        <ProductCard key={product.id} product={product} storeSlug={params.slug} />
                    ))}
                </div>

                {/* Load More */}
                <div className="mt-16 text-center">
                    <Button variant="ghost" className="text-text-secondary hover:text-white">Load more products</Button>
                </div>

            </div>
        </StoreShell>
    );
}
