"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Button } from "@vayva/ui";
import { StoreShell } from "@/components/StoreShell";
import { ProductCard } from "@/components/ProductCard";
import { useStore } from "@/context/StoreContext";
import { StorefrontService } from "@/services/storefront.service";
import { ProductGridSkeleton } from "@/components/Skeletons";
export default function ProductsPage() {
    const { store } = useStore();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("all");
    useEffect(() => {
        if (store) {
            const load = async () => {
                const data = await StorefrontService.getProducts(store.id);
                setProducts(data);
                setLoading(false);
            };
            load();
        }
    }, [store]);
    const categories = [
        "all",
        ...Array.from(new Set(products.map((p) => p.category).filter((cat) => !!cat))),
    ];
    const filteredProducts = selectedCategory === "all"
        ? products
        : products.filter((p) => p.category === selectedCategory);
    if (!store)
        return null;
    return (_jsx(StoreShell, { children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 py-12", children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-4xl font-bold tracking-tight mb-2", children: "All Products" }), _jsxs("p", { className: "text-gray-500", children: ["Showing ", filteredProducts.length, " items"] })] }), _jsx("div", { className: "flex flex-wrap gap-2", children: categories.map((cat) => (_jsx(Button, { onClick: () => setSelectedCategory(cat), className: `px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat
                                    ? "bg-black text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`, children: cat.charAt(0).toUpperCase() + cat.slice(1) }, cat))) })] }), loading ? (_jsx(ProductGridSkeleton, {})) : filteredProducts.length > 0 ? (_jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10", children: filteredProducts.map((product) => (_jsx(ProductCard, { product: product, storeSlug: store.slug }, product.id))) })) : (_jsxs("div", { className: "text-center py-40 border border-dashed border-gray-200 rounded-2xl", children: [_jsx("p", { className: "text-gray-500", children: "No products found for this selection." }), _jsx(Button, { onClick: () => setSelectedCategory("all"), className: "mt-4 text-sm font-bold underline", children: "View all products" })] }))] }) }));
}
