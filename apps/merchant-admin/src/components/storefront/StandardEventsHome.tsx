"use client";

import React, { useState } from "react";
import {
    useStorefrontProducts,
    useStorefrontStore,
} from "@/hooks/storefront/useStorefront";
import { useStorefrontCart } from "@/hooks/storefront/useStorefrontCart";
import { CheckoutModal } from "./CheckoutModal";
import { CalendarDays, MapPin, Ticket, User, ArrowRight, X } from "lucide-react";

export function StandardEventsHome({
    storeName: initialStoreName,
    storeSlug
}: {
    storeName?: string;
    storeSlug?: string
}) {
    const { store } = useStorefrontStore(storeSlug);
    const { products, isLoading } = useStorefrontProducts(storeSlug, { limit: 6 });
    const { cart, addToCart, removeFromCart, total, isOpen: isCartOpen, setIsOpen: setIsCartOpen, clearCart } = useStorefrontCart(storeSlug || "");
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    const displayName = store?.name || initialStoreName || "Event Hub";

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} cart={cart} total={total} storeSlug={storeSlug || ""} onSuccess={clearCart} />

            {/* Hero */}
            <div className="bg-indigo-900 text-white py-20 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="max-w-5xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 bg-indigo-800/50 border border-indigo-700 rounded-full px-4 py-1 text-sm font-medium text-indigo-200">
                            <CalendarDays className="w-4 h-4" /> Upcoming Season 2025
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none">
                            {displayName}
                        </h1>
                        <p className="text-xl text-indigo-200 max-w-lg">
                            Secure your spot for the most anticipated events of the year. Tickets selling fast.
                        </p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-2xl w-full md:w-80">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold">My Tickets</h3>
                            <span className="bg-indigo-500 px-2 py-0.5 rounded text-xs">{cart.length}</span>
                        </div>
                        {cart.length === 0 ? (
                            <div className="text-center py-6 text-indigo-200 text-sm">No tickets selected</div>
                        ) : (
                            <div className="space-y-2 mb-4">
                                {cart.map(item => (
                                    <div key={item.id} className="text-sm flex justify-between">
                                        <span className="truncate w-32">{item.name}</span>
                                        <button onClick={() => removeFromCart(item.id)} className="text-indigo-300 hover:text-white"><X className="w-3 h-3" /></button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <button
                            onClick={() => setIsCheckoutOpen(true)}
                            disabled={cart.length === 0}
                            className="w-full bg-white text-indigo-900 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors disabled:opacity-50"
                        >
                            Checkout
                        </button>
                    </div>
                </div>
            </div>

            {/* Events Grid */}
            <div className="max-w-6xl mx-auto px-6 -mt-10 relative z-20 pb-20">
                {isLoading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => <div key={i} className="h-64 bg-white rounded-2xl shadow-lg border border-slate-100 animate-pulse" />)}
                    </div>
                ) : products.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-12 text-center">
                        <p className="text-slate-500">No upcoming events found.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
                        {products.map((event) => (
                            <div key={event.id} className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col md:flex-row hover:-translate-y-1 transition-transform duration-300 group">
                                <div className="w-full md:w-56 bg-slate-200 relative">
                                    <img src={event.image || `https://via.placeholder.com/300x400?text=${event.name}`} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-center shadow-sm">
                                        <div className="text-xs text-slate-500 uppercase font-bold">FEB</div>
                                        <div className="text-xl font-bold text-slate-900">24</div>
                                    </div>
                                </div>
                                <div className="p-8 flex-1 flex flex-col items-start">
                                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3">
                                        <Ticket className="w-4 h-4" /> Available Now
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{event.name}</h3>
                                    <div className="flex items-center gap-4 text-slate-500 text-sm mb-6">
                                        <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Main Hall</div>
                                        <div className="flex items-center gap-1"><User className="w-4 h-4" /> +500 Going</div>
                                    </div>

                                    <div className="mt-auto w-full pt-6 border-t border-slate-100 flex items-center justify-between">
                                        <div>
                                            <div className="text-xs text-slate-400">Starting from</div>
                                            <div className="text-xl font-bold text-slate-900">₦{event.price.toLocaleString()}</div>
                                        </div>
                                        <button
                                            onClick={() => addToCart(event)}
                                            className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-600 transition-colors flex items-center gap-2"
                                        >
                                            Get Tickets <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
