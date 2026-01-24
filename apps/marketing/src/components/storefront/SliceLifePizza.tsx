"use client";

import React from "react";
import { useStorefrontStore, useStorefrontProducts } from "@/hooks/storefront/useStorefront";
import { useStorefrontCart } from "@/hooks/storefront/useStorefrontCart";
import { StorefrontCart } from "@/components/storefront/StorefrontCart";
import { StorefrontSEO } from "@/components/storefront/StorefrontSEO";
import { Button } from "@vayva/ui";



export default function SliceLifePizza({ slug = "slice-life" }: { slug?: string }): React.JSX.Element {
    const { store } = useStorefrontStore(slug);
    const { cart } = useStorefrontCart(slug);
    const { products } = useStorefrontProducts(slug);

    if (!store) return <div className="p-10 text-center">Loading Slice Life...</div>;

    const productCount = (products || []).reduce((acc: number, item: any) => acc + 1, 0);

    return (
        <div className="min-h-screen bg-[#FFF5E1] font-sans text-stone-800">
            <StorefrontSEO title={store.name} description="Artisanal slices delivered to your door." />

            {/* Header */}
            <header className="sticky top-0 z-50 bg-[#FF6B35] text-white shadow-lg">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="text-2xl font-black tracking-tighter uppercase">
                        {store.name}
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="hidden md:inline font-medium">Order Online</span>
                        <StorefrontCart storeSlug={slug} />
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className="relative h-[400px] bg-stone-900 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-black/40 z-10" />
                <div className="relative z-20 text-center text-white px-4">
                    <h1 className="text-5xl md:text-7xl font-black mb-4 uppercase leading-none">
                        Hot & Fresh
                    </h1>
                    <p className="text-xl md:text-2xl font-light opacity-90">
                        Artisanal slices delivered to your door.
                    </p>
                </div>
            </section>

            {/* Menu */}
            <main className="container mx-auto px-4 py-16">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold uppercase text-[#FF6B35]">Menu</h2>
                    <span className="text-stone-500">{productCount} Items</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {(products as any[])?.map((product: any) => (
                        <div key={product.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                            {product.image ? (
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                                <img
                                    src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800"
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            )}
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2 group-hover:text-[#FF6B35] transition-colors">
                                    {product.name}
                                </h3>
                                <p className="text-stone-600 mb-4 line-clamp-2">
                                    {product.description || "Top quality ingredients baked to perfection."}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-black">
                                        ₦{product.price?.toLocaleString()}
                                    </span>
                                    <Button
                                        variant="primary"
                                        size="icon"
                                        className="w-12 h-12 rounded-full bg-[#FF6B35] text-white flex items-center justify-center hover:scale-110 transition-transform"
                                        onClick={() => { }}
                                        aria-label="Add to cart"
                                    >
                                        +
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <footer className="bg-stone-900 text-white py-12 text-center">
                <p className="opacity-50">&copy; {new Date().getFullYear()} {store.name}</p>
            </footer>
        </div>
    );
}
