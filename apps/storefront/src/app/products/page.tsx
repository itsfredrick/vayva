'use client';

import React, { useEffect, useState } from 'react';
import { StoreShell } from '@/components/StoreShell';
import { ProductCard } from '@/components/ProductCard';
import { useStore } from '@/context/StoreContext';
import { StorefrontService } from '@/services/storefront.service';
import { PublicProduct } from '@/types/storefront';

export default function ProductsPage() {
    const { store } = useStore();
    const [products, setProducts] = useState<PublicProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    useEffect(() => {
        if (store) {
            const load = async () => {
                const data = await StorefrontService.getProducts(store.id);
                setProducts(data);
                setLoading(false);
            };
            load();
        }
    }, [store]);

    const categories = ['all', ...Array.from(new Set(products.map(p => p.category).filter((cat): cat is string => !!cat)))];

    const filteredProducts = selectedCategory === 'all'
        ? products
        : products.filter(p => p.category === selectedCategory);

    if (!store) return null;

    return (
        <StoreShell>
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight mb-2">All Products</h1>
                        <p className="text-gray-500">Showing {filteredProducts.length} items</p>
                    </div>

                    {/* Simple Category Filter */}
                    <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat as string)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat
                                        ? 'bg-black text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="animate-pulse">
                                <div className="bg-gray-100 aspect-[4/5] rounded-xl mb-4"></div>
                                <div className="h-4 bg-gray-100 w-2/3 rounded mb-2"></div>
                                <div className="h-4 bg-gray-100 w-1/3 rounded"></div>
                            </div>
                        ))}
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} storeSlug={store.slug} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-40 border border-dashed border-gray-200 rounded-2xl">
                        <p className="text-gray-500">No products found for this selection.</p>
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className="mt-4 text-sm font-bold underline"
                        >
                            View all products
                        </button>
                    </div>
                )}
            </div>
        </StoreShell>
    );
}
