"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MarketShell } from "@/components/market/market-shell";
import { MarketProductCard, } from "@/components/market/market-product-card";
import { Button, Icon } from "@vayva/ui";
const DEMO_RESULTS = [
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
export default function MarketSearchPage() {
    return (_jsx(MarketShell, { children: _jsxs("div", { className: "max-w-[1400px] mx-auto px-4 lg:px-6 py-8", children: [_jsx("h1", { className: "text-2xl font-bold text-white mb-8", children: "Results for \"Electronics\"" }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-8", children: [_jsxs("div", { className: "hidden lg:block space-y-8", children: [_jsxs("div", { children: [_jsxs("h3", { className: "font-bold text-white mb-4 flex items-center gap-2", children: [_jsx(Icon, { name: "LayoutGrid", size: 18 }), " Category"] }), _jsx("div", { className: "space-y-2", children: [
                                                "Electronics",
                                                "Computing",
                                                "Phones",
                                                "Gaming",
                                                "Accessories",
                                            ].map((c) => (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", id: c, className: "rounded border-white/20 bg-white/5 accent-primary", defaultChecked: c === "Electronics" }), _jsx("label", { htmlFor: c, className: "text-sm text-text-secondary hover:text-white cursor-pointer", children: c })] }, c))) })] }), _jsxs("div", { children: [_jsxs("h3", { className: "font-bold text-white mb-4 flex items-center gap-2", children: [_jsx(Icon, { name: "Banknote", size: 18 }), " Price Range"] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex gap-2 text-sm", children: [_jsx("input", { className: "w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-white", placeholder: "Min" }), _jsx("span", { className: "text-white/50", children: "-" }), _jsx("input", { className: "w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-white", placeholder: "Max" })] }), _jsx(Button, { variant: "outline", size: "sm", className: "w-full border-white/10 text-white hover:bg-white/5", children: "Apply" })] })] }), _jsxs("div", { children: [_jsxs("h3", { className: "font-bold text-white mb-4 flex items-center gap-2", children: [_jsx(Icon, { name: "MapPin", size: 18 }), " Location"] }), _jsx("div", { className: "space-y-2", children: ["Lagos", "Abuja", "Port Harcourt"].map((c) => (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", id: c, className: "rounded border-white/20 bg-white/5 accent-primary" }), _jsx("label", { htmlFor: c, className: "text-sm text-text-secondary hover:text-white cursor-pointer", children: c })] }, c))) })] })] }), _jsxs("div", { className: "col-span-1 lg:col-span-3", children: [_jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6", children: DEMO_RESULTS.map((product) => (_jsx(MarketProductCard, { product: product }, product.id))) }), DEMO_RESULTS.length < 5 && (_jsxs("div", { className: "mt-12 p-8 rounded-xl bg-white/5 border border-white/5 text-center", children: [_jsx(Icon, { name: "SearchX", size: 48, className: "mx-auto text-white/20 mb-4" }), _jsx("h3", { className: "font-bold text-white", children: "End of results" }), _jsx("p", { className: "text-sm text-text-secondary", children: "Try adjusting your filters or search for something else." })] }))] })] })] }) }));
}
