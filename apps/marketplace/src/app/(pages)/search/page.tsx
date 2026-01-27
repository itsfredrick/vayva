"use client";

import React, { useCallback, useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Search, ArrowLeft, Loader2, SlidersHorizontal } from "lucide-react";
import { Button, Drawer, Select } from "@vayva/ui";
import { SearchResult } from "@vayva/shared";
import { BrandLogo } from "@/components/BrandLogo";
import {
    ProductCard,
} from "@/components/marketplace/ProductCard";
import {
    ProductCardSkeleton,
} from "@/components/marketplace/ProductCardSkeleton";
import {
    SearchFilters,
    SearchFilterState,
} from "@/components/marketplace/SearchFilters";

function SearchContent(): React.JSX.Element {
    const searchParams = useSearchParams();
    const router = useRouter();

    const initialQuery = searchParams.get("q") || "";
    const initialCategory = searchParams.get("category") || "All";
    const initialChinaBulk = searchParams.get("chinaBulk") === "true";
    const initialSort = (searchParams.get("sort") || "new") as "new" | "price_asc" | "price_desc";

    const [query, setQuery] = useState(initialQuery);
    const [category, setCategory] = useState(initialCategory);
    const [sort, setSort] = useState<"new" | "price_asc" | "price_desc">(initialSort);

    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [filters, setFilters] = useState<SearchFilterState>({
        minPrice: searchParams.get("minPrice") || "",
        maxPrice: searchParams.get("maxPrice") || "",
        minMoq: searchParams.get("minMoq") || "",
        verifiedOnly: searchParams.get("verified") === "true",
        chinaBulkOnly: initialChinaBulk,
        location: searchParams.get("location") || "All Nigeria",
    });

    const CATEGORIES = ["All", "Vehicles", "Property", "Electronics", "Fashion", "Food"];

    const pushQueryState = (next: {
        query: string;
        category: string;
        sort: "new" | "price_asc" | "price_desc";
        filters: SearchFilterState;
    }): void => {
        const params = new URLSearchParams();
        if (next.query) params.set("q", next.query);
        if (next.category && next.category !== "All") params.set("category", next.category);
        if (next.sort && next.sort !== "new") params.set("sort", next.sort);

        if (next.filters.minPrice) params.set("minPrice", next.filters.minPrice);
        if (next.filters.maxPrice) params.set("maxPrice", next.filters.maxPrice);
        if (next.filters.minMoq) params.set("minMoq", next.filters.minMoq);
        if (next.filters.verifiedOnly) params.set("verified", "true");
        if (next.filters.chinaBulkOnly) params.set("chinaBulk", "true");
        if (next.filters.location && next.filters.location !== "All Nigeria") params.set("location", next.filters.location);

        router.push(`/search?${params.toString()}`);
    };

    useEffect(() => {
        let cancelled = false;

        const fetchPage = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (query) params.set("q", query);
                if (category && category !== "All") params.set("category", category);
                if (filters.chinaBulkOnly) params.set("chinaBulk", "true");
                if (sort && sort !== "new") params.set("sort", sort);

                if (filters.minPrice) params.set("minPrice", filters.minPrice);
                if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
                if (filters.minMoq) params.set("minMoq", filters.minMoq);
                if (filters.verifiedOnly) params.set("verified", "true");
                if (filters.location && filters.location !== "All Nigeria") params.set("location", filters.location);

                params.set("page", "1");
                params.set("limit", "24");

                const res = await fetch(`/api/search?${params.toString()}`);
                const payload = await res.json();

                const nextResults = (payload?.data?.results ?? payload?.results ?? []) as SearchResult[];
                const nextHasMore = Boolean(payload?.meta?.hasMore ?? payload?.metadata?.hasMore);

                if (cancelled) return;
                setResults(nextResults);
                setHasMore(nextHasMore);
                setPage(1);
            } catch (error) {
                console.error("Search failed", error);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        const debounce = setTimeout(fetchPage, 350);
        return () => {
            cancelled = true;
            clearTimeout(debounce);
        };
    }, [query, category, filters, sort]);

    const loadMore = useCallback(async (): Promise<void> => {
        if (!hasMore) return;
        setIsFetchingMore(true);
        try {
            const nextPage = page + 1;
            const params = new URLSearchParams();
            if (query) params.set("q", query);
            if (category && category !== "All") params.set("category", category);
            if (filters.chinaBulkOnly) params.set("chinaBulk", "true");
            if (sort && sort !== "new") params.set("sort", sort);

            if (filters.minPrice) params.set("minPrice", filters.minPrice);
            if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
            if (filters.minMoq) params.set("minMoq", filters.minMoq);
            if (filters.verifiedOnly) params.set("verified", "true");

            params.set("page", String(nextPage));
            params.set("limit", "24");

            const res = await fetch(`/api/search?${params.toString()}`);
            const payload = await res.json();
            const nextResults = (payload?.data?.results ?? payload?.results ?? []) as SearchResult[];
            const nextHasMore = Boolean(payload?.meta?.hasMore ?? payload?.metadata?.hasMore);

            setResults((prev) => [...prev, ...nextResults]);
            setHasMore(nextHasMore);
            setPage(nextPage);
        } catch (error) {
            console.error("Load more failed", error);
        } finally {
            setIsFetchingMore(false);
        }
    }, [category, filters, hasMore, page, query, sort]);

    useEffect(() => {
        if (!hasMore) return;

        const onScroll = () => {
            if (loading || isFetchingMore) return;
            const scrollPos = window.innerHeight + window.scrollY;
            const threshold = document.body.offsetHeight - 900;
            if (scrollPos >= threshold) {
                void loadMore();
            }
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [hasMore, isFetchingMore, loadMore, loading]);

    const handleSearch = (e: React.FormEvent): void => {
        e.preventDefault();
        pushQueryState({ query, category, sort, filters });
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
                    <Link href="/" className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                        <ArrowLeft size={20} />
                    </Link>

                    <Link href="/" className="shrink-0">
                        <BrandLogo className="h-5" />
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

                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full text-gray-600 relative"
                        onClick={() => setIsFilterOpen(true)}
                        aria-label="Filters"
                        title="Filters"
                    >
                        <SlidersHorizontal size={20} />
                        {(filters.verifiedOnly || filters.minPrice || filters.maxPrice || filters.minMoq || filters.chinaBulkOnly || category !== "All") && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full"></span>
                        )}
                    </Button>
                </div>

                {/* Category Tabs */}
                <div className="max-w-7xl mx-auto px-4 flex gap-4 overflow-x-auto pb-0 hide-scrollbar border-b border-transparent">
                    {CATEGORIES.map((cat) => (
                        <Button
                            key={cat}
                            onClick={() => {
                                setCategory(cat);
                                pushQueryState({
                                    query,
                                    category: cat,
                                    sort,
                                    filters,
                                });
                            }}
                            variant="ghost"
                            className={`pb-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 rounded-none h-auto ${category === cat
                                ? "border-primary text-primary"
                                : "border-transparent text-gray-500 hover:text-gray-800"
                                }`}
                        >
                            {cat}
                        </Button>
                    ))}
                    <div className="flex-1" />
                    <Button
                        onClick={() => {
                            const nextChinaBulkOnly = !filters.chinaBulkOnly;
                            const nextFilters: SearchFilterState = {
                                ...filters,
                                chinaBulkOnly: nextChinaBulkOnly,
                            };
                            setFilters(nextFilters);
                            pushQueryState({
                                query,
                                category,
                                sort,
                                filters: nextFilters,
                            });
                        }}
                        variant="ghost"
                        className={`pb-3 px-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 rounded-t-lg h-auto ${filters.chinaBulkOnly
                            ? "border-primary text-primary bg-primary/10"
                            : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                            }`}
                    >
                        🇨🇳 China Bulk {filters.chinaBulkOnly && "✓"}
                    </Button>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
                    <div className="text-xs text-gray-500">
                        {loading ? "Searching…" : `${results.length.toLocaleString()} results`}
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="text-xs font-medium text-gray-500">Sort</div>
                        <Select
                            value={sort}
                            onChange={(e) => {
                                const nextSort = e.target.value as "new" | "price_asc" | "price_desc";
                                setSort(nextSort);
                                pushQueryState({ query, category, sort: nextSort, filters });
                            }}
                            className="h-9 rounded-lg"
                        >
                            <option value="new">Newest</option>
                            <option value="price_asc">Price: Low → High</option>
                            <option value="price_desc">Price: High → Low</option>
                        </Select>
                    </div>
                </div>
            </header>

            {/* Results */}
            <main className="flex-1 max-w-7xl mx-auto w-full p-4">
                <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
                    <aside className="hidden lg:block">
                        <div className="sticky top-[140px] rounded-xl border border-gray-100 bg-white p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="text-sm font-bold text-gray-900">Filters</div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs"
                                    onClick={() => {
                                        const cleared: SearchFilterState = {
                                            minPrice: "",
                                            maxPrice: "",
                                            minMoq: "",
                                            verifiedOnly: false,
                                            chinaBulkOnly: false,
                                            location: "All Nigeria",
                                        };
                                        setFilters(cleared);
                                        pushQueryState({ query, category, sort, filters: cleared });
                                    }}
                                >
                                    Reset
                                </Button>
                            </div>

                            <SearchFilters
                                value={filters}
                                onChange={(next) => {
                                    setFilters(next);
                                }}
                            />

                            <div className="mt-4">
                                <Button
                                    className="w-full"
                                    onClick={() => {
                                        pushQueryState({ query, category, sort, filters });
                                    }}
                                >
                                    Apply
                                </Button>
                            </div>
                        </div>
                    </aside>

                    <section>
                        {loading ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <ProductCardSkeleton key={i} className="rounded-xl overflow-hidden" />
                                ))}
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
                            <>
                                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {results.map((item) => (
                                        <ProductCard key={item.id} item={item} />
                                    ))}
                                </div>

                                {isFetchingMore ? (
                                    <div className="mt-6 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                        {Array.from({ length: 8 }).map((_, i) => (
                                            <ProductCardSkeleton key={i} className="rounded-xl overflow-hidden" />
                                        ))}
                                    </div>
                                ) : null}

                                {!hasMore ? (
                                    <div className="py-10 text-center text-sm text-gray-500">
                                        You’ve reached the end.
                                    </div>
                                ) : (
                                    <div className="py-10 text-center">
                                        <Button
                                            variant="outline"
                                            onClick={() => void loadMore()}
                                            disabled={isFetchingMore}
                                        >
                                            Load more
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </section>
                </div>

                <Drawer
                    isOpen={isFilterOpen}
                    onClose={() => setIsFilterOpen(false)}
                    title="Filters"
                    className="sm:max-w-[440px]"
                >
                    <SearchFilters
                        value={filters}
                        onChange={(next) => {
                            setFilters(next);
                        }}
                    />
                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <Button
                            variant="outline"
                            onClick={() => {
                                const cleared: SearchFilterState = {
                                    minPrice: "",
                                    maxPrice: "",
                                    minMoq: "",
                                    verifiedOnly: false,
                                    chinaBulkOnly: false,
                                    location: "All Nigeria",
                                };
                                setFilters(cleared);
                            }}
                        >
                            Reset
                        </Button>
                        <Button
                            onClick={() => {
                                setIsFilterOpen(false);
                                pushQueryState({ query, category, sort, filters });
                            }}
                        >
                            Apply
                        </Button>
                    </div>
                </Drawer>
            </main>
        </div>
    );
}

export default function SearchPage(): React.JSX.Element {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Loader2 size={32} className="animate-spin text-gray-400" />
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
}
