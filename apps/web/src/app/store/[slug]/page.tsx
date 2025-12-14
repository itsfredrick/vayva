'use client';

import React from 'react';
import Link from 'next/link';
import { StoreShell } from '@/components/storefront/store-shell';
import { ProductCard, Product } from '@/components/storefront/product-card';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

const MOCK_PRODUCTS: Product[] = [
    { id: '1', name: 'Premium Cotton Tee', price: '₦ 12,000', image: '', slug: 'premium-cotton-tee', inStock: true },
    { id: '2', name: 'Slim Fit Chinos', price: '₦ 18,500', image: '', slug: 'slim-fit-chinos', inStock: true },
    { id: '3', name: 'Vintage Denim Jacket', price: '₦ 45,000', image: '', slug: 'vintage-denim-jacket', inStock: false },
    { id: '4', name: 'Leather Sneakers', price: '₦ 35,000', image: '', slug: 'leather-sneakers', inStock: true },
];

const CATEGORIES = [
    { name: 'Men', image: 'man' },
    { name: 'Women', image: 'woman' },
    { name: 'Accessories', image: 'watch' },
    { name: 'Footwear', image: 'hiking' },
];

export default function StoreHomepage({ params }: { params: { slug: string } }) {
    return (
        <StoreShell slug={params.slug}>

            {/* Hero Section */}
            <section className="relative h-[500px] flex items-center overflow-hidden">
                <div className="absolute inset-0 bg-[#142210]">
                    {/* Abstract Background pattern */}
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
                </div>

                <div className="max-w-7xl mx-auto px-4 relative z-10 w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6 text-center md:text-left">
                        <span className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-wider text-primary">New Collection 2026</span>
                        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight">
                            Elevate Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">Everyday Style.</span>
                        </h1>
                        <p className="text-lg text-text-secondary max-w-lg mx-auto md:mx-0">
                            Discover premium essentials crafted for the modern individual. Designed in Lagos, worn worldwide.
                        </p>
                        <div className="flex gap-4 justify-center md:justify-start">
                            <Link href={`/store/${params.slug}/collections/all`}>
                                <Button size="lg" className="bg-primary text-black hover:bg-primary/90 rounded-full font-bold px-8">
                                    Shop Now
                                </Button>
                            </Link>
                            <Link href={`/store/${params.slug}/collections/new`}>
                                <Button size="lg" variant="outline" className="rounded-full px-8 text-white hover:bg-white/5 border-white/20">
                                    View Lookbook
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Hero Visual Mockup */}
                    <div className="hidden md:block relative h-[400px]">
                        <div className="absolute right-0 top-0 w-64 h-80 bg-white/5 rounded-2xl rotate-3 border border-white/10 backdrop-blur-sm z-10"></div>
                        <div className="absolute right-12 top-12 w-64 h-80 bg-white/10 rounded-2xl -rotate-2 border border-white/10 backdrop-blur-md z-20 flex items-center justify-center">
                            <Icon name="shopping_bag" size={64} className="text-white/20" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Strip */}
            <section className="py-12 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 overflow-x-auto scrollbar-hide">
                    <div className="flex gap-4 min-w-max">
                        {CATEGORIES.map(cat => (
                            <Link key={cat.name} href={`/store/${params.slug}/collections/${cat.name.toLowerCase()}`}>
                                <div className="group flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                                    <Icon name={cat.image} className="text-text-secondary group-hover:text-primary transition-colors" />
                                    <span className="font-bold text-white text-sm">{cat.name}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2">Featured Drops</h2>
                            <p className="text-text-secondary">Handpicked just for you.</p>
                        </div>
                        <Link href={`/store/${params.slug}/collections/all`} className="text-primary hover:text-primary/80 text-sm font-bold flex items-center gap-1">
                            View All <Icon name="arrow_forward" size={16} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {MOCK_PRODUCTS.map(product => (
                            <ProductCard key={product.id} product={product} storeSlug={params.slug} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust Signals */}
            <section className="py-16 bg-[#0b141a]">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: 'local_shipping', title: 'Fast Delivery', desc: 'Lagos delivery within 24 hours.' },
                        { icon: 'verified_user', title: 'Secure Payment', desc: '100% secure checkout via Paystack.' },
                        { icon: 'chat', title: 'WhatsApp Support', desc: 'Chat with us anytime for help.' },
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/5 border border-white/5">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                                <Icon name={item.icon} size={24} />
                            </div>
                            <h3 className="font-bold text-white text-lg mb-2">{item.title}</h3>
                            <p className="text-sm text-text-secondary">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

        </StoreShell>
    );
}
