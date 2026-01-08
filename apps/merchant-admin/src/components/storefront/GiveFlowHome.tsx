"use client";

import React from "react";
import { Search, Heart, Share2 } from "lucide-react";
import { useStorefrontStore } from "@/hooks/storefront/useStorefront";

interface GiveFlowHomeProps {
    storeName?: string;
    storeSlug?: string;
}

export default function GiveFlowHome({
    storeName: initialStoreName,
    storeSlug,
}: GiveFlowHomeProps) {
    const { store } = useStorefrontStore(storeSlug);
    const displayName = store?.name || initialStoreName || "GiveFlow Charity";

    const campaigns = [
        {
            id: 1,
            name: "Clean Water Initiative",
            raised: 450000,
            goal: 1000000,
            image: "https://images.unsplash.com/photo-1541252260730-0412e8e2108e?auto=format&fit=crop&q=80&w=800",
        },
        {
            id: 2,
            name: "Education for All",
            raised: 125000,
            goal: 500000,
            image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800",
        },
        {
            id: 3,
            name: "Community Health Clinic",
            raised: 890000,
            goal: 900000,
            image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800",
        },
    ];

    return (
        <div className="min-h-screen bg-emerald-50 font-sans text-gray-900">
            {/* Navigation */}
            <nav className="bg-white shadow-sm sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
                    <div className="text-2xl font-bold tracking-tight text-emerald-800">
                        {displayName}
                    </div>
                    <button className="bg-emerald-600 text-white px-6 py-2 rounded-full font-bold hover:bg-emerald-700">
                        Donate Now
                    </button>
                </div>
            </nav>

            {/* Hero */}
            <div className="relative h-[60vh] bg-emerald-900 overflow-hidden flex items-center justify-center text-center text-white px-4">
                <div className="absolute inset-0 opacity-40">
                    <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover" />
                </div>
                <div className="relative z-10 max-w-3xl">
                    <h1 className="text-5xl font-bold mb-6">Make a Difference Today</h1>
                    <p className="text-xl mb-8 opacity-90">Join our mission to create sustainable change in communities worldwide.</p>
                    <div className="flex justify-center gap-4">
                        <button className="bg-white text-emerald-900 px-8 py-3 rounded-full font-bold hover:bg-gray-100">
                            Our Campaigns
                        </button>
                    </div>
                </div>
            </div>

            {/* Campaigns */}
            <div className="max-w-7xl mx-auto px-4 py-20">
                <h2 className="text-3xl font-bold text-center mb-12 text-emerald-900">Active Campaigns</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {campaigns.map((c) => (
                        <div key={c.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="h-48 relative">
                                <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                                <button className="absolute top-4 right-4 bg-white/80 p-2 rounded-full hover:bg-white text-emerald-600">
                                    <Share2 className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="p-6">
                                <h3 className="font-bold text-xl mb-2">{c.name}</h3>
                                <div className="w-full bg-gray-100 h-3 rounded-full mb-4 overflow-hidden">
                                    <div
                                        className="bg-emerald-500 h-full rounded-full"
                                        style={{ width: `${Math.min((c.raised / c.goal) * 100, 100)}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-sm font-medium mb-6">
                                    <span className="text-emerald-700">₦{c.raised.toLocaleString()} raised</span>
                                    <span className="text-gray-400">Goal: ₦{c.goal.toLocaleString()}</span>
                                </div>
                                <button className="w-full border-2 border-emerald-600 text-emerald-600 py-2 rounded-xl font-bold hover:bg-emerald-50">
                                    Donate
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
