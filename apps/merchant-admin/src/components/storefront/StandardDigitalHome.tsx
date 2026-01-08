"use client";

import React, { useState } from "react";
import {
    useStorefrontProducts,
    useStorefrontStore,
} from "@/hooks/storefront/useStorefront";
import { useStorefrontCart } from "@/hooks/storefront/useStorefrontCart";
import { CheckoutModal } from "./CheckoutModal";
import { Download, Monitor, Zap, CheckCircle, ShoppingBag, X } from "lucide-react";

export function StandardDigitalHome({
    storeName: initialStoreName,
    storeSlug
}: {
    storeName?: string;
    storeSlug?: string
}) {
    const { store } = useStorefrontStore(storeSlug);
    const { products, isLoading } = useStorefrontProducts(storeSlug, { limit: 8 });
    const { cart, addToCart, removeFromCart, total, isOpen: isCartOpen, setIsOpen: setIsCartOpen, clearCart } = useStorefrontCart(storeSlug || "");
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    const displayName = store?.name || initialStoreName || "Digital Store";

    return (
        <div className="min-h-screen bg-[#111] text-white font-mono selection:bg-purple-500 selection:text-white">
            <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} cart={cart} total={total} storeSlug={storeSlug || ""} onSuccess={clearCart} />

            <nav className="border-b border-gray-800 px-6 py-6 flex justify-between items-center sticky top-0 bg-[#111]/90 backdrop-blur z-50">
                <div className="text-xl font-bold tracking-tighter text-purple-400">
                    <Monitor className="inline-block w-6 h-6 mr-2 mb-1" />
                    {displayName}
                </div>
                <button
                    onClick={() => setIsCartOpen(true)}
                    className="hover:text-purple-400 transition-colors relative"
                >
                    My Library [{cart.length}]
                </button>
            </nav>

            <div className="max-w-6xl mx-auto px-6 py-20 text-center">
                <div className="inline-block mb-6 px-4 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs tracking-widest uppercase">
                    Instant Delivery
                </div>
                <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                    Premium Digital Assets.
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg mb-12 leading-relaxed">
                    High-quality resources for creators, developers, and designers.
                    Secure downloads immediately after purchase.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
                    {isLoading ? (
                        <div className="col-span-4 text-center text-gray-600 py-20">Loading assets...</div>
                    ) : products.length === 0 ? (
                        <div className="col-span-4 text-center border border-dashed border-gray-800 rounded-xl py-20 text-gray-500">
                            No digital products found.
                        </div>
                    ) : (
                        products.map(product => (
                            <div key={product.id} className="group bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-purple-500/50 transition-all hover:bg-gray-900 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Download className="w-5 h-5 text-purple-400" />
                                </div>

                                <div className="aspect-square bg-gray-800 rounded-lg mb-6 overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                                    <img src={product.image || `https://via.placeholder.com/300?text=.ZIP`} className="w-full h-full object-cover mix-blend-overlay opacity-80" />
                                </div>

                                <h3 className="text-lg font-bold mb-2">{product.name}</h3>
                                <div className="flex justify-between items-center mt-4">
                                    <span className="text-purple-400 font-bold">₦{product.price.toLocaleString()}</span>
                                    <button
                                        onClick={() => addToCart(product)}
                                        className="text-xs bg-white text-black px-3 py-2 rounded font-bold hover:bg-purple-400 hover:text-white transition-colors uppercase"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="border-t border-gray-800 bg-gray-900/50 py-12">
                <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex gap-4">
                        <Zap className="w-8 h-8 text-purple-500" />
                        <div>
                            <h4 className="font-bold mb-1">Instant Access</h4>
                            <p className="text-sm text-gray-500">Download links sent to your email immediately.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <CheckCircle className="w-8 h-8 text-purple-500" />
                        <div>
                            <h4 className="font-bold mb-1">Lifetime Updates</h4>
                            <p className="text-sm text-gray-500">Get access to future versions for free.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <Monitor className="w-8 h-8 text-purple-500" />
                        <div>
                            <h4 className="font-bold mb-1">Commercial License</h4>
                            <p className="text-sm text-gray-500">Use in personal and commercial projects.</p>
                        </div>
                    </div>
                </div>
            </div>

            {isCartOpen && (
                <div className="fixed inset-0 z-[60] flex justify-end">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
                    <div className="relative w-full max-w-md bg-[#181818] border-l border-gray-800 h-full p-8 flex flex-col shadow-2xl animate-in slide-in-from-right">
                        <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
                            <h2 className="text-xl font-bold tracking-tight">Purchase Summary</h2>
                            <button onClick={() => setIsCartOpen(false)}><X className="w-6 h-6 text-gray-500 hover:text-white" /></button>
                        </div>

                        <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar">
                            {cart.map(item => (
                                <div key={item.id} className="bg-gray-900 p-4 rounded-lg flex justify-between items-center group border border-transparent hover:border-gray-700">
                                    <div>
                                        <div className="font-bold">{item.name}</div>
                                        <div className="text-xs text-purple-400">Digital License</div>
                                    </div>
                                    <div className="flex gap-4 items-center">
                                        <span>₦{item.price.toLocaleString()}</span>
                                        <button onClick={() => removeFromCart(item.id)} className="text-gray-600 hover:text-red-500"><X className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-8 border-t border-gray-800">
                            <div className="flex justify-between text-xl font-bold mb-6">
                                <span>Total</span>
                                <span className="text-purple-400">₦{total.toLocaleString()}</span>
                            </div>
                            <button
                                onClick={() => setIsCheckoutOpen(true)}
                                className="w-full bg-purple-600 hover:bg-purple-500 text-white py-4 rounded-lg font-bold tracking-wide transition-all shadow-lg shadow-purple-900/20"
                            >
                                Confirm & Download
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
