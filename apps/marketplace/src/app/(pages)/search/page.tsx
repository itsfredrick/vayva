"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Search, MapPin, Filter, ArrowLeft, Loader2, MessageCircle, ShoppingCart } from "lucide-react";
import { Button } from "@vayva/ui";
import { SearchResult } from "@vayva/shared";

function SearchContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const initialQuery = searchParams.get("q") || "";
    const initialCategory = searchParams.get("category") || "All";
    const initialChinaBulk = searchParams.get("chinaBulk") === "true";

    const [query, setQuery] = useState(initialQuery);
    const [category, setCategory] = useState(initialCategory);
    const [chinaBulk, setChinaBulk] = useState(initialChinaBulk);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(true);

    const CATEGORIES = ["All", "Vehicles", "Property", "Electronics", "Fashion", "Food"];

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (query) params.append("q", query);
                if (category && category !== "All") params.append("category", category);
                if (chinaBulk) params.append("chinaBulk", "true");

                const res = await fetch(`/api/search?${params.toString()}`);
                const data = await res.json();
                setResults(data.results || []);
            } catch (error) {
                console.error("Search failed", error);
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(fetchResults, 500);
        return () => clearTimeout(debounce);
    }, [query, category, chinaBulk]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.push(`/search?q=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
                    <Link href="/" className="p-2 hover:bg-gray-50 rounded-full text-gray-500">
                        <ArrowLeft size={20} />
                    </Link>

                    <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2.5">
                        <Search size={16} className="text-gray-400" />
                        <input
                            type="text"
                            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-400"
                            placeholder="Search items, services..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </form>

                    <Button variant="ghost" size="icon" className="rounded-full text-gray-600 relative">
                        <Filter size={20} />
                        {category !== "All" && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#22C55E] rounded-full"></span>}
                    </Button>
                </div>

                {/* Category Tabs */}
                <div className="max-w-7xl mx-auto px-4 flex gap-4 overflow-x-auto pb-0 hide-scrollbar border-b border-transparent">
                    {CATEGORIES.map((cat) => (
                        <Button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            variant="ghost"
                            className={`pb-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 rounded-none h-auto ${category === cat
                                ? "border-[#22C55E] text-[#22C55E]"
                                : "border-transparent text-gray-500 hover:text-gray-800"
                                }`}
                        >
                            {cat}
                        </Button>
                    ))}
                    <div className="flex-1" />
                    <Button
                        onClick={() => setChinaBulk(!chinaBulk)}
                        variant="ghost"
                        className={`pb-3 px-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 rounded-t-lg h-auto ${chinaBulk
                            ? "border-orange-500 text-orange-600 bg-orange-50"
                            : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                            }`}
                    >
                        🇨🇳 China Bulk {chinaBulk && "✓"}
                    </Button>
                </div>
            </header>

            {/* Results */}
            <main className="flex-1 max-w-7xl mx-auto w-full p-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <Loader2 size={32} className="animate-spin mb-3" />
                        <p className="text-sm">Searching...</p>
                    </div>
                ) : results.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <Search size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">No results found</h3>
                        <p className="text-gray-500 text-sm">Try adjusting your filters or search terms.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {results.map((item) => (
                            <Link key={item.id} href={`/listing/${item.id}`} className="group block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                                <div className="aspect-[4/3] bg-gray-100 relative">
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />

                                    {/* Mode Badge */}
                                    <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide text-white ${item.isChinaBulk
                                        ? "bg-orange-600"
                                        : item.mode === "CHECKOUT"
                                            ? "bg-black"
                                            : "bg-blue-600"
                                        }`}>
                                        {item.isChinaBulk ? "China Bulk" : item.mode === "CHECKOUT" ? "Buy Now" : "Classified"}
                                    </div>

                                    {item.isPromoted && (
                                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-yellow-400 text-yellow-900">
                                            Promoted
                                        </div>
                                    )}
                                </div>

                                <div className="p-3">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <h3 className="font-medium text-gray-900 line-clamp-2 text-sm group-hover:text-[#22C55E] transition-colors">
                                            {item.title}
                                        </h3>
                                    </div>

                                    <p className="text-[#22C55E] font-bold text-lg">
                                        ₦{item.price.toLocaleString()}
                                    </p>

                                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-2 mb-3">
                                        <MapPin size={12} />
                                        <span className="truncate">{item.location}</span>
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
                                                {item.merchant.name[0]}
                                            </div>
                                            <span className="text-xs text-gray-600 truncate max-w-[80px]">{item.merchant.name}</span>
                                            {item.merchant.isVerified && (
                                                <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>

                                        <Button
                                            variant={item.mode === "CHECKOUT" ? "primary" : "secondary"}
                                            size="icon"
                                            className="rounded-full h-8 w-8"
                                        >
                                            {item.mode === "CHECKOUT" ? <ShoppingCart size={14} /> : <MessageCircle size={14} />}
                                        </Button>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 size={32} className="animate-spin text-gray-400" />
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
}
