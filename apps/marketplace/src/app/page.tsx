"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter
import { Search, MapPin, ShoppingBag } from "lucide-react";
import { Button } from "@vayva/ui";

export default function MarketplaceHome(): React.JSX.Element {
    const router = useRouter(); // Initialize useRouter

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Mobile Header */}
            <header className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-[#22C55E]">
                    Vayva
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="rounded-full text-gray-600" aria-label="Search" title="Search" onClick={() => router.push("/search")}>
                        <Search size={20} />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full text-gray-600" aria-label="Cart" title="Cart">
                        <ShoppingBag size={20} />
                    </Button>
                </div>
            </header>

            {/* Location Filter */}
            <div className="bg-white px-4 py-3 border-b border-gray-100 flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={14} className="text-[#22C55E]" />
                <span>Lagos, Nigeria</span> • <span className="text-[#22C55E] font-medium">Change</span>
            </div>

            <main className="max-w-7xl mx-auto px-4 py-6 space-y-8">

                {/* Categories Grid */}
                <section>
                    <h2 className="font-bold text-lg mb-4 text-gray-900">Browse Categories</h2>
                    <div className="grid grid-cols-4 gap-4 text-center">
                        {["Vehicles", "Property", "Phones", "Fashion", "Home", "Food", "Jobs", "More"].map((cat) => (
                            <Button
                                key={cat}
                                onClick={() => router.push(`/search?category=${encodeURIComponent(cat === "More" ? "All" : cat)}`)}
                                variant="ghost"
                                className="flex flex-col items-center gap-2 h-auto p-0"
                            >
                                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-xs font-bold text-gray-400 hover:border-[#22C55E] hover:text-[#22C55E] transition-colors">
                                    {cat[0]}
                                </div>
                                <span className="text-xs font-medium text-gray-700">{cat}</span>
                            </Button>
                        ))}
                    </div>
                </section>

                {/* Trending Section */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold text-lg text-gray-900">Trending Near You</h2>
                        <Link href="/search" className="text-sm text-[#22C55E] font-medium">See All</Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="aspect-square bg-gray-100 relative">
                                    {/* Image Placeholder */}
                                </div>
                                <div className="p-3">
                                    <h3 className="font-medium text-gray-900 truncate">iPhone 14 Pro Max</h3>
                                    <p className="text-[#22C55E] font-bold mt-1">₦950,000</p>
                                    <p className="text-xs text-gray-500 mt-1">Lekki Phase 1</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </main>
        </div>
    );
}
