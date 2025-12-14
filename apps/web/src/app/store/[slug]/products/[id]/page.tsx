'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { StoreShell } from '@/components/storefront/store-shell';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

const MOCK_PRODUCT = {
    id: '1',
    name: 'Premium Cotton Tee',
    price: 12000,
    curr: '₦',
    desc: 'Crafted from 100% organic cotton, this tee offers a relaxed fit and breathable comfort for all-day wear. An essential for any wardrobe.',
    images: ['', '', ''],
    colors: ['Black', 'White', 'Navy'],
    sizes: ['S', 'M', 'L', 'XL'],
};

export default function ProductDetailPage({ params }: { params: { slug: string, id: string } }) {
    const [selectedColor, setSelectedColor] = useState(MOCK_PRODUCT.colors[0]);
    const [selectedSize, setSelectedSize] = useState(MOCK_PRODUCT.sizes[1]);
    const [qty, setQty] = useState(1);

    return (
        <StoreShell slug={params.slug}>
            <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">

                {/* Breadcrumb */}
                <div className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-8 flex items-center gap-2">
                    <Link href={`/store/${params.slug}`} className="hover:text-white">Home</Link>
                    <Icon name="chevron_right" size={14} />
                    <Link href={`/store/${params.slug}/collections/all`} className="hover:text-white">Products</Link>
                    <Icon name="chevron_right" size={14} />
                    <span className="text-white">{MOCK_PRODUCT.name}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">

                    {/* Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-[4/5] bg-white/5 rounded-2xl w-full relative overflow-hidden flex items-center justify-center">
                            <Icon name="image" size={64} className="text-white/10" />
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="aspect-square bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors" />
                            ))}
                        </div>
                    </div>

                    {/* Details */}
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{MOCK_PRODUCT.name}</h1>
                        <div className="text-2xl font-bold text-white mb-8">{MOCK_PRODUCT.curr} {MOCK_PRODUCT.price.toLocaleString()}</div>

                        <div className="space-y-8 mb-10">
                            {/* Colors */}
                            <div>
                                <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-3 block">Color: <span className="text-white">{selectedColor}</span></label>
                                <div className="flex gap-3">
                                    {MOCK_PRODUCT.colors.map(color => (
                                        <div
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`w-10 h-10 rounded-full cursor-pointer flex items-center justify-center border-2 transition-all
                                                ${selectedColor === color ? 'border-primary' : 'border-transparent hover:border-white/20'}
                                                ${color === 'White' ? 'bg-white' : color === 'Black' ? 'bg-gray-900' : 'bg-blue-900'}
                                            `}
                                        >
                                            {selectedColor === color && <Icon name="check" size={16} className={color === 'White' ? 'text-black' : 'text-white'} />}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Sizes */}
                            <div>
                                <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-3 block">Size: <span className="text-white">{selectedSize}</span></label>
                                <div className="flex gap-3">
                                    {MOCK_PRODUCT.sizes.map(size => (
                                        <div
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`w-12 h-10 rounded-lg flex items-center justify-center text-sm font-bold cursor-pointer transition-colors border
                                                ${selectedSize === size ? 'bg-primary text-black border-primary' : 'bg-white/5 text-white border-white/10 hover:border-white/30'}
                                            `}
                                        >
                                            {size}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Qty & Actions */}
                            <div className="flex gap-4">
                                <div className="flex items-center bg-white/5 border border-white/10 rounded-full h-12 px-2">
                                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-8 h-full flex items-center justify-center text-white/50 hover:text-white"><Icon name="remove" size={16} /></button>
                                    <span className="w-8 text-center text-white font-bold">{qty}</span>
                                    <button onClick={() => setQty(qty + 1)} className="w-8 h-full flex items-center justify-center text-white/50 hover:text-white"><Icon name="add" size={16} /></button>
                                </div>
                                <Button className="flex-1 h-12 rounded-full bg-primary text-black hover:bg-primary/90 font-bold text-base shadow-[0_0_20px_rgba(70,236,19,0.2)]">
                                    Add to Cart
                                </Button>
                            </div>

                            <Button variant="outline" className="w-full h-12 rounded-full border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 gap-2">
                                <Icon name="chat" /> Chat on WhatsApp about this item
                            </Button>
                        </div>

                        {/* Collapsibles */}
                        <div className="border-t border-white/10 divide-y divide-white/10">
                            <div className="py-4">
                                <h3 className="font-bold text-white mb-2 text-sm">Description</h3>
                                <p className="text-sm text-text-secondary leading-relaxed">{MOCK_PRODUCT.desc}</p>
                            </div>
                            <div className="py-4">
                                <div className="flex justify-between items-center cursor-pointer group">
                                    <h3 className="font-bold text-white text-sm group-hover:text-primary transition-colors">Delivery & Returns</h3>
                                    <Icon name="add" size={18} className="text-text-secondary" />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </StoreShell>
    );
}
