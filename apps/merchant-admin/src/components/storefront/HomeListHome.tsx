"use client";

import React from "react";
import { Search, MapPin, Bed, Bath } from "lucide-react";
import { useStorefrontStore } from "@/hooks/storefront/useStorefront";

interface HomeListHomeProps {
    storeName?: string;
    storeSlug?: string;
}

export default function HomeListHome({
    storeName: initialStoreName,
    storeSlug,
}: HomeListHomeProps) {
    const { store } = useStorefrontStore(storeSlug);
    const displayName = store?.name || initialStoreName || "HomeList Realty";

    const properties = [
        {
            id: 1,
            name: "Modern Loft in Lekki",
            price: 85000000,
            beds: 3,
            baths: 2,
            location: "Lekki Phase 1, Lagos",
            image: "https://images.unsplash.com/photo-1600596542815-22b5c010deb7?auto=format&fit=crop&q=80&w=800",
        },
        {
            id: 2,
            name: "Seaside Villa",
            price: 120000000,
            beds: 5,
            baths: 4,
            location: "Victoria Island, Lagos",
            image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800",
        },
        {
            id: 3,
            name: "Cozy Apartment",
            price: 45000000,
            beds: 2,
            baths: 2,
            location: "Yaba, Lagos",
            image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&q=80&w=800",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-slate-800">
            {/* Navigation */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
                    <div className="text-2xl font-serif font-bold tracking-tight text-slate-900">
                        {displayName}
                    </div>
                    <div className="hidden md:flex gap-6 font-medium text-slate-600">
                        <a href="#">Buy</a>
                        <a href="#">Rent</a>
                        <a href="#">Sell</a>
                    </div>
                    <button className="border border-slate-300 px-4 py-2 rounded-lg font-medium hover:bg-slate-50">
                        Contact Us
                    </button>
                </div>
            </nav>

            {/* Hero with Search */}
            <div className="relative h-[50vh] bg-slate-900 flex flex-col items-center justify-center p-4">
                <img src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=2000" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                <div className="relative z-10 w-full max-w-4xl text-center">
                    <h1 className="text-white text-4xl md:text-5xl font-bold mb-8 shadow-black/50 drop-shadow-lg">Find Your Dream Home</h1>
                    <div className="bg-white p-2 rounded-xl flex shadow-xl">
                        <input
                            type="text"
                            placeholder="Search by city, neighborhood, or address..."
                            className="flex-1 px-4 py-3 outline-none text-lg rounded-l-lg"
                        />
                        <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 flex items-center gap-2">
                            <Search className="w-5 h-5" />
                            Search
                        </button>
                    </div>
                </div>
            </div>

            {/* Listings */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                <h2 className="text-3xl font-bold mb-8">Latest Listings</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {properties.map(p => (
                        <div key={p.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all group cursor-pointer">
                            <div className="h-64 overflow-hidden">
                                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-slate-900 mb-1">{p.name}</h3>
                                <div className="flex items-center text-slate-500 text-sm mb-4">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    {p.location}
                                </div>
                                <div className="flex items-center gap-6 mb-6 text-sm font-medium text-slate-700">
                                    <span className="flex items-center gap-2"><Bed className="w-4 h-4" /> {p.beds} Beds</span>
                                    <span className="flex items-center gap-2"><Bath className="w-4 h-4" /> {p.baths} Baths</span>
                                </div>
                                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                                    <span className="text-2xl font-bold text-indigo-600">₦{(p.price / 1000000).toFixed(1)}M</span>
                                    <button className="text-sm font-bold border border-indigo-600 text-indigo-600 px-3 py-1 rounded hover:bg-indigo-50">Details</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
