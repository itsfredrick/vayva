"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { StoreShell } from "@/components/StoreShell";
import { ProductCard } from "@/components/ProductCard";
import { useStore } from "@/context/StoreContext";
import { StorefrontService } from "@/services/storefront.service";
import { useParams } from "next/navigation";
import NextLink from "next/link";
const Link = NextLink;
export default function CollectionPage(props) {
    const { store } = useStore();
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (store) {
            const load = async () => {
                // In real app, filter by collection ID (id)
                const data = await StorefrontService.getProducts(store.id);
                setProducts(data);
                setLoading(false);
            };
            load();
        }
    }, [store, id]);
    if (!store)
        return null;
    const collectionName = id === "all"
        ? "All Products"
        : id === "new"
            ? "New Arrivals"
            : "Collection";
    return (_jsx(StoreShell, { children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 py-12", children: [_jsxs("div", { className: "flex items-center justify-between mb-8", children: [_jsx("h1", { className: "text-3xl font-bold", children: collectionName }), _jsxs("span", { className: "text-sm text-gray-500", children: [products.length, " products"] })] }), loading ? (_jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-6", children: [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (_jsxs("div", { className: "animate-pulse", children: [_jsx("div", { className: "bg-gray-100 aspect-[4/5] rounded-xl mb-4" }), _jsx("div", { className: "h-4 bg-gray-100 w-2/3 rounded mb-2" })] }, i))) })) : products.length > 0 ? (_jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10", children: products.map((product) => (_jsx(ProductCard, { product: product, storeSlug: store.slug }, product.id))) })) : (_jsxs("div", { className: "text-center py-20 border border-dashed border-gray-200 rounded-xl", children: [_jsx("p", { className: "text-gray-500", children: "No products found in this collection." }), _jsx(Link, { href: `/?store=${store.slug}`, className: "text-blue-600 mt-4 inline-block hover:underline", children: "Return Home" })] }))] }) }));
}
