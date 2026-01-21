"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { StoreShell } from "@/components/storefront/store-shell";
import { ProductCard } from "@/components/storefront/product-card";
import { Button, Icon } from "@vayva/ui";
import { formatNGN } from "@/config/pricing";
const DEMO_PRODUCTS = [
    {
        id: "1",
        name: "Premium Cotton Tee",
        price: formatNGN(12000),
        image: "",
        slug: "premium-cotton-tee",
        inStock: true,
    },
    {
        id: "2",
        name: "Slim Fit Chinos",
        price: formatNGN(18500),
        image: "",
        slug: "slim-fit-chinos",
        inStock: true,
    },
    {
        id: "3",
        name: "Vintage Denim Jacket",
        price: formatNGN(45000),
        image: "",
        slug: "vintage-denim-jacket",
        inStock: false,
    },
    {
        id: "4",
        name: "Leather Sneakers",
        price: formatNGN(35000),
        image: "",
        slug: "leather-sneakers",
        inStock: true,
    },
    {
        id: "5",
        name: "Summer Shorts",
        price: formatNGN(10000),
        image: "",
        slug: "summer-shorts",
        inStock: true,
    },
    {
        id: "6",
        name: "Graphic Hoodie",
        price: formatNGN(25000),
        image: "",
        slug: "graphic-hoodie",
        inStock: true,
    },
];
export default function CollectionPage({ params, }) {
    const { slug, collection } = React.use(params);
    const collectionName = collection.charAt(0).toUpperCase() + collection.slice(1);
    return (_jsx(StoreShell, { slug: slug, children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 py-8", children: [_jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12", children: [_jsxs("div", { children: [_jsxs("div", { className: "text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 flex items-center gap-2", children: ["Home ", _jsx(Icon, { name: "ChevronRight", size: 14 }), " Collections", " ", _jsx(Icon, { name: "ChevronRight", size: 14 }), " ", _jsx("span", { className: "text-white", children: collectionName })] }), _jsx("h1", { className: "text-4xl font-bold text-white mb-2", children: collectionName }), _jsxs("p", { className: "text-text-secondary", children: ["Found ", DEMO_PRODUCTS.length, " products"] })] }), _jsxs("div", { className: "flex gap-3 w-full md:w-auto", children: [_jsxs(Button, { variant: "outline", size: "sm", className: "hidden md:flex", children: [_jsx(Icon, { name: "Sliders", size: 14, className: "mr-2" }), "Filter"] }), _jsxs(Button, { variant: "outline", className: "flex-1 md:flex-none justify-between text-white border-white/10 hover:bg-white/5 gap-4", children: [_jsxs("span", { className: "flex items-center gap-2", children: [_jsx(Icon, { name: "ArrowUpDown", size: 16 }), " Sort"] }), _jsx(Icon, { name: "ChevronDown", size: 16, className: "text-text-secondary" })] })] })] }), _jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10", children: DEMO_PRODUCTS.map((product) => (_jsx(ProductCard, { product: product, storeSlug: slug }, product.id))) }), _jsx("div", { className: "mt-16 text-center", children: _jsx(Button, { variant: "ghost", className: "text-text-secondary hover:text-white", children: "Load more products" }) })] }) }));
}
