"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@vayva/ui";
import { useEffect, useState } from "react";
import { StoreShell } from "@/components/StoreShell";
import { useStore } from "@/context/StoreContext";
import { StorefrontService } from "@/services/storefront.service";
import { useParams } from "next/navigation";
import NextLink from "next/link";
import { PDPSkeleton } from "@/components/Skeletons";
const Link = NextLink;
import Image from "next/image";
import { FoodPDP } from "@/components/pdp/FoodPDP";
import { ServicePDP } from "@/components/pdp/ServicePDP";
import { ReportProductDialog } from "@/components/pdp/ReportProductDialog";
export default function ProductPage(props) {
    const { id } = useParams();
    const { store, addToCart } = useStore();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    // Track selections for each variant type (e.g. { "Size": "M", "Color": "Red" })
    const [selections, setSelections] = useState({});
    useEffect(() => {
        if (store && id) {
            const load = async () => {
                const data = await StorefrontService.getProduct(id);
                setProduct(data);
                setLoading(false);
                // Auto-select first options
                if (data && data.variants) {
                    const defaults = {};
                    data.variants.forEach(v => {
                        if (v.options.length > 0)
                            defaults[v.name] = v.options[0];
                    });
                    setSelections(defaults);
                }
            };
            load();
        }
    }, [store, id]);
    const handleSelection = (variantName, option) => {
        setSelections(prev => ({ ...prev, [variantName]: option }));
    };
    if (!store)
        return null; // Handled by shell
    // Variant Rendering
    const industry = store.industry || "RETAIL";
    if (product && (industry.startsWith("FOOD") || industry === "RESTAURANT")) {
        return (_jsx(StoreShell, { children: _jsx("div", { className: "max-w-7xl mx-auto px-4 py-12", children: _jsx(FoodPDP, { product: product }) }) }));
    }
    if (product && (industry === "SERVICES" || industry === "BEAUTY" || industry === "CLINIC")) {
        return (_jsx(StoreShell, { children: _jsx("div", { className: "max-w-7xl mx-auto px-4 py-12", children: _jsx(ServicePDP, { product: product }) }) }));
    }
    return (_jsx(StoreShell, { children: loading ? (_jsx(PDPSkeleton, {})) : !product ? (_jsxs("div", { className: "py-20 text-center", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Product Not Found" }), _jsx(Link, { href: `/?store=${store.slug}`, className: "text-blue-600 hover:underline", children: "Return Home" })] })) : (_jsxs("div", { className: "max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-12", children: [_jsx("div", { className: "space-y-4", children: _jsx("div", { className: "aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden relative", children: _jsx(Image, { src: product.images[0], alt: product.name, fill: true, className: "object-cover", priority: true }) }) }), _jsxs("div", { children: [_jsx("div", { className: "mb-2", children: _jsx("span", { className: "text-sm text-gray-400 uppercase tracking-widest", children: product.category || "Product" }) }), _jsx("h1", { className: "text-4xl font-bold tracking-tight mb-4", children: product.name }), _jsx("div", { className: "flex items-center gap-4 mb-8", children: _jsxs("span", { className: "text-2xl font-bold", children: ["\u20A6", product.price.toLocaleString()] }) }), _jsx("div", { className: "prose text-gray-600 mb-8 leading-relaxed", children: product.description }), product.variants.map((v) => (_jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-sm font-bold mb-2", children: v.name }), _jsx("div", { className: "flex gap-2", children: v.options.map((opt) => {
                                        const isSelected = selections[v.name] === opt;
                                        return (_jsx(Button, { onClick: () => handleSelection(v.name, opt), className: `px-4 py-2 border rounded-lg text-sm transition-all ${isSelected
                                                ? "border-black bg-black text-white"
                                                : "border-gray-200 hover:border-black"}`, children: opt }, opt));
                                    }) })] }, v.id))), _jsx("div", { className: "flex gap-4 pt-6 border-t border-gray-100", children: _jsx(Button, { onClick: () => {
                                    // Construct Variant ID from selections
                                    const variantId = Object.entries(selections)
                                        .map(([k, v]) => `${k}:${v}`)
                                        .sort()
                                        .join(", ") || "default";
                                    addToCart({
                                        productId: product.id,
                                        variantId: variantId,
                                        quantity: 1,
                                        price: product.price,
                                        productName: product.name,
                                        image: product.images[0],
                                    });
                                    // Optional: Redirect / show toast
                                    window.location.href = `/cart?store=${store.slug}`;
                                }, className: "flex-1 bg-black text-white h-14 rounded-full font-bold hover:bg-gray-900 transition-colors", children: "Add to Cart" }) }), _jsxs("div", { className: "mt-8 space-y-4 text-sm text-gray-500", children: [_jsxs("div", { className: "flex gap-4", children: [_jsx("span", { className: "font-bold text-black min-w-[100px]", children: "Shipping" }), _jsx("span", { children: "Calculated at checkout." })] }), _jsxs("div", { className: "flex gap-4", children: [_jsx("span", { className: "font-bold text-black min-w-[100px]", children: "Returns" }), _jsx("span", { children: "See our return policy for details." })] })] }), _jsx(ReportProductDialog, { productId: product.id })] })] })) }));
}
