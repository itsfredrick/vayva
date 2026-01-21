"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Share2, Heart, ShieldCheck, ShoppingCart, Truck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@vayva/ui";
export default function ListingDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { addItem } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [chatLoading, setChatLoading] = React.useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setProduct(data);
                    if (data.productVariants?.length > 0) {
                        setSelectedVariant(data.productVariants[0]);
                    }
                }
            }
            catch (error) {
                console.error("Failed to fetch product", error);
            }
            finally {
                setLoading(false);
            }
        };
        if (id)
            fetchProduct();
    }, [id]);
    const handleAddToCart = async () => {
        if (!selectedVariant)
            return;
        setIsAddingToCart(true);
        try {
            await addItem(selectedVariant.id, product.moq || 1);
        }
        catch (error) {
            console.error("Add to cart error", error);
        }
        finally {
            setIsAddingToCart(false);
        }
    };
    const handleBuyNow = async () => {
        if (!selectedVariant)
            return;
        setIsAddingToCart(true);
        try {
            await addItem(selectedVariant.id, product.moq || 1);
            router.push("/checkout");
        }
        catch (error) {
            console.error("Buy now error", error);
        }
        finally {
            setIsAddingToCart(false);
        }
    };
    const handleChat = async () => {
        setChatLoading(true);
        try {
            const res = await fetch("/api/conversations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    listingId: product.id,
                    message: "Hi, is this item still available?"
                })
            });
            const data = await res.json();
            if (res.ok) {
                alert(`Chat Started! Conversation ID: ${data.conversationId}`);
            }
            else {
                alert("Chat started (Simulation): Connected to Seller in Inbox");
            }
        }
        catch (error) {
            console.error("Chat Error", error);
            alert("Failed to start chat");
        }
        finally {
            setChatLoading(false);
        }
    };
    if (loading)
        return _jsx("div", { className: "p-10 text-center", children: "Loading product..." });
    if (!product)
        return _jsx("div", { className: "p-10 text-center", children: "Product not found" });
    const isChinaBulk = product.store?.type === "CHINA_SUPPLIER";
    const mainImage = product.productImages?.[0]?.url || selectedVariant?.productImage?.url || "/placeholder.png";
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 flex flex-col pb-20", children: [_jsx("header", { className: "bg-white border-b border-gray-100 sticky top-0 z-50", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 py-3 flex items-center justify-between", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 py-3 flex items-center justify-between", children: [_jsx(Button, { variant: "ghost", size: "icon", onClick: () => router.back(), className: "rounded-full text-gray-500", "aria-label": "Go back", title: "Go back", children: _jsx(ArrowLeft, { size: 20 }) }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Button, { variant: "ghost", size: "icon", className: "rounded-full text-gray-500", "aria-label": "Share", title: "Share", children: _jsx(Share2, { size: 20 }) }), _jsx(Button, { variant: "ghost", size: "icon", className: "rounded-full text-gray-500", "aria-label": "Save", title: "Save", children: _jsx(Heart, { size: 20 }) })] })] }) }) }), _jsxs("main", { className: "max-w-7xl mx-auto w-full p-4 grid grid-cols-1 lg:grid-cols-2 gap-8", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "aspect-[4/3] bg-gray-200 rounded-xl overflow-hidden relative shadow-sm", children: [_jsx("img", { src: mainImage, alt: product.title, className: "w-full h-full object-cover" }), _jsx("div", { className: `absolute top-4 left-4 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wide text-white ${isChinaBulk ? "bg-orange-600" : "bg-black"}`, children: isChinaBulk ? "China Bulk" : "In Stock" })] }), _jsx("div", { className: "flex gap-2 overflow-x-auto pb-2 hide-scrollbar", children: product.productImages?.map((img, i) => (_jsx("div", { className: "w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-transparent hover:border-black transition-colors cursor-pointer", children: _jsx("img", { src: img.url, alt: "", className: "w-full h-full object-cover" }) }, img.id))) })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-500 mb-1", children: [_jsx("span", { children: product.productType || "Product" }), " \u2022 ", _jsx("span", { children: product.condition })] }), _jsx("h1", { className: "text-2xl font-bold text-gray-900 leading-tight mb-2", children: product.title }), _jsxs("p", { className: "text-[#22C55E] text-3xl font-bold", children: ["\u20A6", Number(selectedVariant?.price || product.price).toLocaleString()] }), _jsxs("div", { className: "flex gap-2 mt-2", children: [product.moq > 1 && (_jsxs("span", { className: "text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded font-medium", children: ["Min Order: ", product.moq, " items"] })), product.depositRequired && (_jsxs("span", { className: "text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-medium", children: ["Pay ", Number(product.depositPercentage || 0) * 100, "% Deposit"] }))] })] }), product.pricingTiers?.length > 0 && (_jsxs("div", { className: "bg-gray-100 rounded-lg p-4", children: [_jsx("h4", { className: "text-sm font-bold mb-2", children: "Wholesale Pricing" }), _jsx("div", { className: "grid grid-cols-2 gap-2", children: product.pricingTiers.map((tier) => (_jsxs("div", { className: "bg-white p-2 rounded border text-xs", children: [_jsxs("p", { className: "font-bold", children: [tier.minQty, "+ units"] }), _jsxs("p", { className: "text-gray-500", children: ["\u20A6", Number(tier.unitPrice).toLocaleString(), "/unit"] })] }, tier.id))) })] })), product.productVariants?.length > 1 && (_jsxs("div", { children: [_jsx("h3", { className: "font-bold text-sm mb-2", children: "Select Variant" }), _jsx("div", { className: "flex flex-wrap gap-2", children: product.productVariants.map((v) => (_jsx(Button, { onClick: () => setSelectedVariant(v), variant: selectedVariant?.id === v.id ? "primary" : "outline", size: "sm", className: "text-xs", children: v.title }, v.id))) })] })), _jsxs("div", { className: "bg-green-50 border border-green-100 rounded-lg p-3 flex items-start gap-3", children: [_jsx(ShieldCheck, { className: "text-green-600 mt-0.5", size: 18 }), _jsxs("div", { children: [_jsx("h4", { className: "text-sm font-bold text-green-900", children: "Vayva Protected" }), _jsx("p", { className: "text-xs text-green-700", children: "Money held in escrow until you confirm delivery." })] })] }), _jsxs("div", { className: "bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between shadow-sm", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold", children: product.store?.name?.[0] || "M" }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx("h3", { className: "font-bold text-xs text-gray-900", children: product.store?.name }), _jsx(ShieldCheck, { size: 12, className: "text-blue-500" })] }), _jsx("p", { className: "text-xs text-gray-400", children: "Merchant \u2022 Verified Owner" })] })] }), _jsx(Button, { variant: "outline", size: "sm", className: "text-xs font-bold text-gray-900 border-gray-200", children: "View Profile" })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-bold text-gray-900 mb-2", children: "Description" }), _jsx("p", { className: "text-gray-600 text-sm leading-relaxed whitespace-pre-line", children: product.description || "No description provided." })] }), _jsxs("div", { className: "flex items-center gap-3 text-sm text-gray-600 py-4 border-t border-gray-100", children: [_jsx(MapPin, { size: 18 }), _jsx("span", { children: "Ships to Lagos & nationwide" })] }), _jsxs("div", { className: "flex items-center gap-3 text-sm text-gray-600 pb-4", children: [_jsx(Truck, { size: 18 }), _jsxs("span", { children: ["Estimated delivery: ", product.shippingEstimate || (isChinaBulk ? "30-45" : "1-3"), " days"] })] })] })] }), _jsx("div", { className: "fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-xl z-50", children: _jsxs("div", { className: "max-w-7xl mx-auto flex gap-3", children: [_jsx(Button, { onClick: handleAddToCart, disabled: isAddingToCart, variant: "secondary", className: "flex-1 font-bold py-6 rounded-lg", children: isAddingToCart ? "..." : "Add to Cart" }), _jsxs(Button, { onClick: handleBuyNow, disabled: isAddingToCart, className: "flex-[2] font-bold py-6 rounded-lg gap-2 shadow-lg shadow-gray-200", children: [_jsx(ShoppingCart, { size: 18 }), isAddingToCart ? "Processing..." : (product.depositRequired ? "Pay Deposit" : "Buy Now")] })] }) })] }));
}
