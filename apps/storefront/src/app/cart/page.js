"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@vayva/ui";
import { StoreShell } from "@/components/StoreShell";
import { useStore } from "@/context/StoreContext";
import NextLink from "next/link";
const Link = NextLink;
export default function CartPage() {
    const { store, cart, removeFromCart } = useStore();
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (!store)
        return null;
    return (_jsx(StoreShell, { children: _jsxs("div", { className: "max-w-3xl mx-auto px-4 py-20", children: [_jsx("h1", { className: "text-3xl font-bold mb-8", children: "Shopping Cart" }), cart.length === 0 ? (_jsxs("div", { className: "text-center py-12", children: [_jsx("p", { className: "text-gray-500 mb-8", children: "Your cart is currently empty." }), _jsx(Link, { href: `/collections/all?store=${store.slug}`, children: _jsx(Button, { className: "bg-black text-white px-8 py-4 rounded-full font-bold text-sm tracking-wide hover:bg-gray-900 transition-colors", children: "Continue Shopping" }) })] })) : (_jsxs("div", { children: [_jsx("div", { className: "space-y-6 mb-8", children: cart.map((item, idx) => (_jsxs("div", { className: "flex gap-4 border-b border-gray-100 pb-6 last:border-0", children: [_jsx("div", { className: "w-24 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0", children: item.image && (_jsx("img", { src: item.image, alt: item.productName, className: "w-full h-full object-cover" })) }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsx("h3", { className: "font-bold", children: item.productName }), _jsxs("span", { className: "font-bold", children: ["\u20A6", (item.price * item.quantity).toLocaleString()] })] }), _jsxs("div", { className: "text-sm text-gray-500 mb-4", children: ["Quantity: ", item.quantity] }), _jsx(Button, { onClick: () => removeFromCart(item.productId), className: "text-xs text-red-500 underline hover:text-red-600", children: "Remove" })] })] }, idx))) }), _jsxs("div", { className: "border-t border-gray-200 pt-8", children: [_jsxs("div", { className: "flex justify-between text-lg font-bold mb-8", children: [_jsx("span", { children: "Subtotal" }), _jsxs("span", { children: ["\u20A6", subtotal.toLocaleString()] })] }), _jsx(Link, { href: `/checkout?store=${store.slug}`, children: _jsx(Button, { className: "w-full bg-black text-white py-4 rounded-full font-bold hover:bg-gray-900 transition-colors", children: "Proceed to Checkout" }) })] })] }))] }) }));
}
