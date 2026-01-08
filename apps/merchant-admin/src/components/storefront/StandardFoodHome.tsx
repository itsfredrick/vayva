"use client";

import React, { useState } from "react";
import {
    useStorefrontProducts,
    useStorefrontStore,
} from "@/hooks/storefront/useStorefront";
import { useStorefrontCart } from "@/hooks/storefront/useStorefrontCart";
import { CheckoutModal } from "./CheckoutModal";
import { ShoppingBag, Star, Clock, MapPin, X, Plus, Minus, ChefHat } from "lucide-react";

export function StandardFoodHome({
    storeName: initialStoreName,
    storeSlug
}: {
    storeName?: string;
    storeSlug?: string
}) {
    const { store } = useStorefrontStore(storeSlug);
    const { products, isLoading } = useStorefrontProducts(storeSlug, { limit: 20 });
    const { cart, addToCart, removeFromCart, updateQuantity, total, isOpen: isCartOpen, setIsOpen: setIsCartOpen, clearCart } = useStorefrontCart(storeSlug || "");
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    const displayName = store?.name || initialStoreName || "Modern Bistro";

    return (
        <div className="min-h-screen bg-[#FDFBF7] text-[#2C2C2C] font-serif">
            <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} cart={cart} total={total} storeSlug={storeSlug || ""} onSuccess={clearCart} />

            {/* Elegant Navbar */}
            <nav className="border-b border-[#E5E1D8] px-8 py-6 flex justify-between items-center bg-white sticky top-0 z-50">
                <div className="text-2xl italic font-bold tracking-tight text-[#2C2C2C]">{displayName}</div>
                <div className="flex gap-8 text-sm font-sans uppercase tracking-widest text-[#888]">
                    <a href="#" className="hover:text-black">Menu</a>
                    <a href="#" className="hover:text-black">Reservations</a>
                </div>
                <button
                    onClick={() => setIsCartOpen(true)}
                    className="relative group"
                >
                    <div className="flex items-center gap-2 border border-[#E5E1D8] px-4 py-2 rounded-full group-hover:bg-[#2C2C2C] group-hover:text-white transition-colors">
                        <span className="text-xs font-sans font-bold uppercase tracking-widest">Order</span>
                        <div className="w-5 h-5 flex items-center justify-center bg-[#E5E1D8] rounded-full text-[10px] font-bold group-hover:bg-white group-hover:text-black">
                            {cart.length}
                        </div>
                    </div>
                </button>
            </nav>

            {/* Hero */}
            <div className="relative py-24 px-6 text-center overflow-hidden">
                <div className="max-w-2xl mx-auto space-y-6 relative z-10">
                    <div className="inline-flex justify-center items-center w-12 h-12 rounded-full bg-[#E5E1D8] mb-4">
                        <ChefHat className="w-6 h-6 opacity-50" />
                    </div>
                    <h1 className="text-5xl md:text-7xl leading-tight font-medium italic">
                        Taste the <br /> extraordinary.
                    </h1>
                    <p className="font-sans text-[#888] text-lg max-w-md mx-auto">
                        Locally sourced ingredients, crafted with passion. Experience dining reimagined.
                    </p>
                    <div className="flex justify-center gap-4 pt-4 font-sans text-xs font-bold uppercase tracking-widest text-[#888]">
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Open 10am - 10pm</span>
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Downtown</span>
                    </div>
                </div>
            </div>

            {/* Menu Grid */}
            <div className="max-w-7xl mx-auto px-6 pb-20 font-sans">
                <div className="flex items-center gap-4 mb-12">
                    <div className="h-px bg-[#E5E1D8] flex-1"></div>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-[#888]">Signature Dishes</h2>
                    <div className="h-px bg-[#E5E1D8] flex-1"></div>
                </div>

                {isLoading ? (
                    <div className="text-center py-20 text-[#888] italic">Preparing menu...</div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20 border border-[#E5E1D8] rounded-2xl">
                        <p className="text-[#888]">Menu currently unavailable.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                        {products.map((item) => (
                            <div key={item.id} className="group flex gap-6 cursor-pointer" onClick={() => addToCart(item)}>
                                <div className="w-32 h-32 md:w-40 md:h-40 bg-[#E5E1D8] rounded-full overflow-hidden flex-shrink-0 relative">
                                    <img src={item.image || `https://via.placeholder.com/200?text=Dish`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0" />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Plus className="text-white w-8 h-8" />
                                    </div>
                                </div>
                                <div className="flex-1 py-2">
                                    <div className="flex justify-between items-baseline border-b border-[#E5E1D8] pb-2 mb-3 border-dashed group-hover:border-solid group-hover:border-[#2C2C2C] transition-all">
                                        <h3 className="text-xl font-serif italic font-medium">{item.name}</h3>
                                        <span className="font-bold text-lg">₦{item.price.toLocaleString()}</span>
                                    </div>
                                    <p className="text-[#888] text-sm leading-relaxed mb-3 line-clamp-2">{item.description}</p>
                                    <button className="text-xs font-bold uppercase tracking-widest border-b border-transparent hover:border-black transition-all">Add to Order</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Cart (Reuse standard) */}
            {isCartOpen && (
                <div className="fixed inset-0 z-[60] flex justify-end font-sans">
                    <div className="absolute inset-0 bg-[#2C2C2C]/10 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
                    <div className="relative w-full max-w-md bg-white h-full p-8 flex flex-col shadow-2xl animate-in slide-in-from-right">
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-2xl font-serif italic">Your Order</h2>
                            <button onClick={() => setIsCartOpen(false)}><X className="w-6 h-6 hover:rotate-90 transition-transform" /></button>
                        </div>

                        <div className="flex-1 space-y-6 overflow-y-auto">
                            {cart.map(item => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="w-16 h-16 bg-[#E5E1D8] rounded-full overflow-hidden flex-shrink-0">
                                        {item.image && <img src={item.image} className="w-full h-full object-cover" />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between font-bold text-lg mb-1">
                                            <span>{item.name}</span>
                                            <span>₦{(item.price * item.quantity).toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => updateQuantity(item.id, -1)} className="hover:bg-[#FDFBF7] p-1 rounded"><Minus className="w-3 h-3" /></button>
                                            <span className="font-mono text-sm">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, 1)} className="hover:bg-[#FDFBF7] p-1 rounded"><Plus className="w-3 h-3" /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-8 border-t border-[#E5E1D8]">
                            <div className="flex justify-between text-2xl font-serif italic mb-6">
                                <span>Total</span>
                                <span>₦{total.toLocaleString()}</span>
                            </div>
                            <button
                                onClick={() => setIsCheckoutOpen(true)}
                                className="w-full bg-[#2C2C2C] text-white py-4 rounded-full font-bold uppercase tracking-widest hover:bg-black transition-colors"
                            >
                                Confirm Order
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
