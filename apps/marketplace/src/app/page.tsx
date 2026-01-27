"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";
import { Button, Input } from "@vayva/ui";
import { DealHero } from "@/components/marketplace/DealHero";
import { CategoryGrid } from "@/components/marketplace/CategoryGrid";
import { PromoCarousel } from "@/components/marketplace/PromoCarousel";
import { FlashDealsStrip } from "@/components/marketplace/FlashDealsStrip";
import { HomeProductModule } from "@/components/marketplace/HomeProductModule";
import { BrandLogo } from "@/components/BrandLogo";

export default function MarketplaceHome(): React.JSX.Element {
    const router = useRouter();
    const [query, setQuery] = useState("");

    const goSearch = (): void => {
        const params = new URLSearchParams();
        if (query.trim()) params.set("q", query.trim());
        router.push(`/search?${params.toString()}`);
    };

    return (
        <div className="min-h-screen bg-white pb-20">
            <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
                    <div className="shrink-0">
                        <BrandLogo priority className="h-6" />
                    </div>

                    <div className="flex-1">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                goSearch();
                            }}
                            className="relative"
                        >
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <Search className="h-5 w-5" />
                            </div>
                            <Input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search products, suppliers, factories…"
                                className="h-11 rounded-full pl-11 pr-28 bg-gray-100 border-gray-100 focus:bg-white"
                            />
                            <Button
                                type="submit"
                                className="absolute right-1 top-1 h-9 rounded-full px-4 font-extrabold glow-primary"
                            >
                                Search
                            </Button>
                        </form>
                    </div>

                    <div className="hidden sm:flex items-center gap-2 text-xs text-gray-600">
                        <MapPin className="h-4 w-4 text-primary" />
                        Lagos
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 pb-3 flex gap-2 overflow-x-auto">
                    {[
                        { label: "All", href: "/search" },
                        { label: "Phones", href: "/search?category=Electronics" },
                        { label: "Electronics", href: "/search?category=Electronics" },
                        { label: "Fashion", href: "/search?category=Fashion" },
                        { label: "Food", href: "/search?category=Food" },
                        { label: "China Bulk", href: "/search?chinaBulk=true" },
                        { label: "Verified", href: "/search?verified=true" },
                    ].map((c) => (
                        <a key={c.label} href={c.href} className="shrink-0">
                            <div className="h-8 px-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center text-xs font-bold text-gray-800">
                                {c.label}
                            </div>
                        </a>
                    ))}
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-5 space-y-6">
                <DealHero />
                <CategoryGrid />
                <PromoCarousel />
                <FlashDealsStrip />

                <HomeProductModule
                    title="Trending Now"
                    subtitle="Fast-moving items people are buying today"
                    href="/search"
                    sort="new"
                    limit={12}
                />

                <HomeProductModule
                    title="China Bulk · Factory Direct"
                    subtitle="MOQ + wholesale tiers. Best for importers"
                    href="/search?chinaBulk=true"
                    chinaBulk
                    limit={12}
                />

                <HomeProductModule
                    title="Verified Suppliers"
                    subtitle="Trust-first browsing"
                    href="/search?verified=true"
                    verifiedOnly
                    limit={12}
                />
            </main>
        </div>
    );
}
