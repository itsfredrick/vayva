"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
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
export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isBulkMode, setIsBulkMode] = useState(false);
    const [filters, setFilters] = useState({ status: "ALL", category: "ALL" });
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
                });
                const res = await fetch(`/api/products/items?${query.toString()}`);
                const data = await res.json();
                // Handle new API response structure { data, meta }
                if (data.data && Array.isArray(data.data)) {
                    setProducts(data.data);
                    setMeta(data.meta);
                }
                else if (Array.isArray(data)) {
                    // Fallback for backward compatibility if API rollback happens
                    setProducts(data);
                }
            }
            catch (e) {
                logger.error("Failed to load products", ErrorCategory.API, e);
            }
            finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [page, debouncedSearch, filters, router]);
    const handlePageChange = (newPage) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        router.push(`/dashboard/products?${params.toString()}`);
    };
    const handleSearch = (value) => {
        setSearchValue(value);
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set("search", value);
        }
        else {
            params.delete("search");
        }
        params.set("page", "1");
        router.push(`/dashboard/products?${params.toString()}`, { scroll: false });
    };
    if (loading) {
        return (_jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("div", { className: "h-8 w-48 bg-gray-100 rounded animate-pulse" }), _jsx("div", { className: "h-10 w-32 bg-gray-100 rounded animate-pulse" })] }), _jsxs("div", { className: "bg-white rounded-xl border border-gray-100 overflow-hidden", children: [_jsx("div", { className: "h-12 bg-gray-50 border-b border-gray-100" }), [1, 2, 3, 4, 5].map((i) => (_jsxs("div", { className: "h-16 border-b border-gray-100 flex items-center px-6 gap-8", children: [_jsx("div", { className: "h-4 w-48 bg-gray-50 rounded animate-pulse" }), _jsx("div", { className: "h-4 w-24 bg-gray-50 rounded animate-pulse" }), _jsx("div", { className: "h-6 w-20 bg-gray-50 rounded-full animate-pulse ml-auto" })] }, i)))] })] }));
    }
    if (products.length === 0 && page === 1 && !search) {
        return (_jsx(EmptyState, { title: "No products added", description: "You haven't added any products to your store yet.", actionLabel: "Add Product", actionHref: "/dashboard/products/new", icon: Package }));
    }
    return (_jsxs("div", { className: "p-6", children: [_jsx(ProductsHeader, { isBulkMode: isBulkMode, onToggleBulkMode: () => setIsBulkMode(!isBulkMode) }), isBulkMode ? (_jsx(BulkProductTable, { initialProducts: products })) : (_jsxs(_Fragment, { children: [_jsx(ProductsFilterBar, { search: searchValue, onSearch: handleSearch, filters: filters, onFilterChange: setFilters, onRefresh: () => router.refresh() }), products.length === 0 ? (_jsx("div", { className: "bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-500", children: "No products found matching your search." })) : (_jsx(ProductsTable, { products: products, meta: meta, page: page, limit: limit, onPageChange: handlePageChange })), _jsx("div", { className: "fixed bottom-20 right-6 md:hidden", children: _jsx(Link, { href: "/dashboard/products/new", children: _jsx(Button, { size: "icon", className: "h-14 w-14 rounded-full shadow-lg bg-primary text-white", children: _jsx(PlusCircle, { className: "w-6 h-6" }) }) }) })] }))] }));
}
