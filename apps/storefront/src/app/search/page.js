"use client";
import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { StoreShell } from "@/components/StoreShell";
import { ProductCard } from "@/components/ProductCard";
import { useStore } from "@/context/StoreContext";
import { StorefrontService } from "@/services/storefront.service";
import { useSearchParams } from "next/navigation";
export default function SearchPage() {
    const { store } = useStore();
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (store) {
            const load = async () => {
                const data = await StorefrontService.getProducts(store.id);
                // Client-side filter for test
                const filtered = data.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
                setProducts(filtered);
                setLoading(false);
            };
            load();
        }
    }, [store, query]);
    if (!store)
        return null;
    return (_jsx(StoreShell, { children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 py-12", children: [_jsxs("h1", { className: "text-3xl font-bold mb-8", children: ["Search Results: \"", query, "\""] }), loading ? (_jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-6", children: [1, 2, 3, 4].map((i) => (_jsxs("div", { className: "animate-pulse", children: [_jsx("div", { className: "bg-gray-100 aspect-[4/5] rounded-xl mb-4" }), _jsx("div", { className: "h-4 bg-gray-100 w-2/3 rounded mb-2" })] }, i))) })) : products.length > 0 ? (_jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10", children: products.map((product) => (_jsx(ProductCard, { product: product, storeSlug: store.slug }, product.id))) })) : (_jsx("div", { className: "text-center py-20 border border-dashed border-gray-200 rounded-xl", children: _jsx("p", { className: "text-gray-500", children: "No products found matching your search." }) }))] }) }));
}
