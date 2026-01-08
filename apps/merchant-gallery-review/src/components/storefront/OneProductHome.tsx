"use client";

import React, { useEffect, useState } from "react";
import { Star, CheckCircle, ArrowRight } from "lucide-react";
import { useStorefrontStore } from "@/hooks/storefront/useStorefront";

interface OneProductHomeProps {
    storeName?: string;
    storeSlug?: string;
}

export default function OneProductHome({
    storeName: initialStoreName,
    storeSlug,
}: OneProductHomeProps) {
    const { store } = useStorefrontStore(storeSlug);
    const displayName = store?.name || initialStoreName || "Aura Glow";

    const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 45, seconds: 30 });

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            {/* Urgency Bar */}
            <div className="bg-rose-600 text-white text-center py-3 font-bold text-sm tracking-wide">
                🔥 FLASH SALE ENDS IN: {timeLeft.hours}H {timeLeft.minutes}M {timeLeft.seconds}S
            </div>

            <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Left: Product Gallery */}
                <div className="space-y-4">
                    <div className="aspect-square bg-gray-100 rounded-3xl overflow-hidden relative shadow-2xl">
                        <img src="https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover" />
                        <div className="absolute top-6 left-6 bg-rose-600 text-white font-black px-4 py-2 rounded-lg text-xl -rotate-2">
                            50% OFF
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-black">
                            <img src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" />
                        </div>
                        <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-black">
                            <img src="https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" />
                        </div>
                        <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-black">
                            <img src="https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>

                {/* Right: Sales Copy */}
                <div>
                    <div className="flex items-center gap-1 mb-6">
                        <div className="flex text-yellow-400">
                            <Star className="fill-current w-5 h-5" />
                            <Star className="fill-current w-5 h-5" />
                            <Star className="fill-current w-5 h-5" />
                            <Star className="fill-current w-5 h-5" />
                            <Star className="fill-current w-5 h-5" />
                        </div>
                        <span className="text-gray-500 text-sm font-medium ml-2">Over 10,000+ Happy Customers</span>
                    </div>

                    <h1 className="text-5xl font-extrabold mb-6 leading-tight">The Ultimate Facial Serum for Radiant Skin</h1>

                    <div className="flex items-end gap-4 mb-8">
                        <span className="text-4xl font-bold text-rose-600">₦25,000</span>
                        <span className="text-2xl text-gray-400 line-through decoration-2">₦50,000</span>
                    </div>

                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                        Transform your skin overnight with our revolutionary formula. Infused with Vitamin C and Hyaluronic Acid, the Aura Glow serum targets dark spots and fine lines instantly.
                    </p>

                    <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="text-green-500 w-6 h-6" />
                            <span className="font-medium">Dermatologist Tested & Approved</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle className="text-green-500 w-6 h-6" />
                            <span className="font-medium">Vegan & Cruelty Free</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle className="text-green-500 w-6 h-6" />
                            <span className="font-medium">30-Day Money Back Guarantee</span>
                        </div>
                    </div>

                    <button className="w-full bg-black text-white py-6 rounded-xl font-bold text-xl uppercase tracking-wider hover:bg-gray-800 transition-transform hover:scale-[1.02] shadow-xl shadow-rose-200 mb-6 flex items-center justify-center gap-3">
                        Get Yours Now <ArrowRight />
                    </button>

                    <div className="text-center text-sm text-gray-500">
                        <p>Free Shipping Worldwide 🌍 • Secure Checkout 🔒</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
