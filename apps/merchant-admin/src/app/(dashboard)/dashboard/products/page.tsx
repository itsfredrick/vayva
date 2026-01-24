"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import { Package, PlusCircle } from "lucide-react";
import Link from "next/link";

import { Button } from "@vayva/ui";
import { EmptyState } from "@/components/ui/empty-state";
import { logger, ErrorCategory } from "@/lib/logger";

import { BulkProductTable } from "@/components/products/BulkProductTable";
import { ProductsHeader } from "@/components/products/ProductsHeader";
import { ProductsFilterBar } from "@/components/products/ProductsFilterBar";
import { ProductsTable } from "@/components/products/ProductsTable";

interface Product {
    id: string;
    name: string;
    price: number;
    currency: string;
    status: string;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [meta, setMeta] = useState<{ total: number, limit: number, offset: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const [isBulkMode, setIsBulkMode] = useState(false);
    const [filters, setFilters] = useState<any>({ status: "ALL", category: "ALL" });
    const router = useRouter();
    const searchParams = useSearchParams();

    // Local search state for debouncing
    const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");
    const debouncedSearch = useDebounce(searchValue, 500);

    // Get page from URL
    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("search") || "";
    const limit = 20;

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const offset = (page - 1) * limit;
                const query = new URLSearchParams({
                    limit: limit.toString(),
                    offset: offset.toString(),
                    ...(debouncedSearch && { search: debouncedSearch }),
                    ...(filters.status !== "ALL" && { status: filters.status }),
                    ...(filters.category !== "ALL" && { category: filters.category })
                } as any);

                const res = await fetch(`/api/products/items?${query.toString()}`);
                const data = await res.json();

                // Handle new API response structure { data, meta }
                if (data.data && Array.isArray(data.data)) {
                    setProducts(data.data);
                    setMeta(data.meta);
                } else if (Array.isArray(data)) {
                    // Fallback for backward compatibility if API rollback happens
                    setProducts(data);
                }
            } catch (e: any) {
                logger.error("Failed to load products", ErrorCategory.API, e as Error, {});
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [page, debouncedSearch, filters, router]);

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        router.push(`/dashboard/products?${params.toString()}`);
    };

    const handleSearch = (value: string) => {
        setSearchValue(value);
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set("search", value);
        } else {
            params.delete("search");
        }
        params.set("page", "1");
        router.push(`/dashboard/products?${params.toString()}`, { scroll: false });
    };

    if (loading) {
        return (
            <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <div className="h-8 w-48 bg-gray-100 rounded animate-pulse" />
                    <div className="h-10 w-32 bg-gray-100 rounded animate-pulse" />
                </div>
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    <div className="h-12 bg-gray-50 border-b border-gray-100" />
                    {[1, 2, 3, 4, 5].map((i: any) => (
                        <div key={i} className="h-16 border-b border-gray-100 flex items-center px-6 gap-8">
                            <div className="h-4 w-48 bg-gray-50 rounded animate-pulse" />
                            <div className="h-4 w-24 bg-gray-50 rounded animate-pulse" />
                            <div className="h-6 w-20 bg-gray-50 rounded-full animate-pulse ml-auto" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (products.length === 0 && page === 1 && !search) {
        return (
            <EmptyState
                title="No products added"
                description="You haven't added any products to your store yet."
                actionLabel="Add Product"
                actionHref="/dashboard/products/new"
                icon={(Package as any)}
            />
        );
    }

    return (
        <div className="p-6">
            <ProductsHeader
                isBulkMode={isBulkMode}
                onToggleBulkMode={() => setIsBulkMode(!isBulkMode)}
            />

            {isBulkMode ? (
                <BulkProductTable initialProducts={products} />
            ) : (
                <>
                    <ProductsFilterBar
                        search={searchValue}
                        onSearch={handleSearch}
                        filters={filters}
                        onFilterChange={setFilters}
                        onRefresh={() => router.refresh()}
                    />

                    {products.length === 0 ? (
                        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-500">
                            No products found matching your search.
                        </div>
                    ) : (
                        <ProductsTable
                            products={products}
                            meta={meta}
                            page={page}
                            limit={limit}
                            onPageChange={handlePageChange}
                        />
                    )}

                    {/* Mobile FAB */}
                    <div className="fixed bottom-20 right-6 md:hidden">
                        <Link href="/dashboard/products/new">
                            <Button size="icon" className="h-14 w-14 rounded-full shadow-lg bg-primary text-white">
                                <PlusCircle className="w-6 h-6" />
                            </Button>
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}
