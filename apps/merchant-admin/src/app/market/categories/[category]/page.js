"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { MarketShell } from "@/components/market/market-shell";
import { MarketProductCard, } from "@/components/market/market-product-card";
const DEMO_PRODUCTS = [
    {
        id: "1",
        name: "MacBook Pro M3 Max",
        price: "₦ 3,500,000",
        image: "",
        sellerName: "TechDepot",
        sellerVerified: true,
        inStock: true,
        rating: 4.8,
    },
    {
        id: "3",
        name: 'Samsung 65" 4K TV',
        price: "₦ 850,000",
        image: "",
        sellerName: "GadgetWorld",
        sellerVerified: false,
        inStock: true,
        rating: 4.5,
    },
    {
        id: "5",
        name: "PlayStation 5 Slim",
        price: "₦ 650,000",
        image: "",
        sellerName: "GamingArea",
        sellerVerified: true,
        inStock: true,
        rating: 4.7,
    },
];
export default function MarketCategoryPage({ params, }) {
    const { category } = React.use(params);
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
    return (_jsx(MarketShell, { children: _jsxs("div", { className: "max-w-[1400px] mx-auto px-4 lg:px-6 py-8", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-white mb-2", children: categoryName }), _jsxs("p", { className: "text-text-secondary", children: ["Explore the best deals in ", categoryName, " from trusted sellers."] })] }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6", children: [DEMO_PRODUCTS.map((product) => (_jsx(MarketProductCard, { product: product }, product.id))), DEMO_PRODUCTS.map((product) => (_jsx(MarketProductCard, { product: product }, product.id + "d")))] })] }) }));
}
