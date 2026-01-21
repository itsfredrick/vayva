"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Image from "next/image";
import { Button } from "@vayva/ui";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
// format currency helper
const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
    }).format(amount);
};
export function CartItemRow({ item }) {
    const { updateItem, removeItem, isLoading } = useCart();
    const variant = item.variant;
    const product = variant.product;
    const image = product.productImages?.[0] || variant.productImage;
    const handleUpdate = (qty) => {
        if (qty < 1)
            return;
        updateItem(item.id, qty);
    };
    return (_jsxs("div", { className: "flex gap-4 py-4 border-b last:border-0 hover:bg-gray-50/50 transition-colors", children: [_jsx("div", { className: "h-20 w-20 relative bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-100", children: image ? (_jsx(Image, { src: image?.url || "", alt: product.title, fill: true, className: "object-cover" })) : (_jsx("div", { className: "w-full h-full flex items-center justify-center text-xs text-muted-foreground", children: "No Img" })) }), _jsxs("div", { className: "flex-1 flex flex-col justify-between", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-medium text-sm line-clamp-1", children: product.title }), _jsx("div", { className: "text-xs text-muted-foreground mt-1", children: variant.title !== "Default Variant" && variant.title }), _jsx("div", { className: "text-sm font-semibold mt-1", children: formatCurrency(Number(variant.price)) })] }), _jsxs("div", { className: "flex justify-between items-center mt-2", children: [_jsxs("div", { className: "flex items-center gap-1 border rounded-md", children: [_jsx(Button, { variant: "ghost", size: "icon", className: "h-6 w-6 p-1", onClick: () => handleUpdate(item.quantity - 1), disabled: isLoading, "aria-label": "Decrease quantity", title: "Decrease quantity", children: _jsx(Minus, { className: "h-3 w-3" }) }), _jsx("span", { className: "text-xs w-6 text-center", children: item.quantity }), _jsx(Button, { variant: "ghost", size: "icon", className: "h-6 w-6 p-1", onClick: () => handleUpdate(item.quantity + 1), disabled: isLoading, "aria-label": "Increase quantity", title: "Increase quantity", children: _jsx(Plus, { className: "h-3 w-3" }) })] }), _jsx(Button, { onClick: () => removeItem(item.id), variant: "ghost", size: "icon", className: "text-red-500 hover:text-red-700 h-6 w-6 p-1", disabled: isLoading, "aria-label": "Remove item", title: "Remove item", children: _jsx(Trash2, { className: "h-4 w-4" }) })] })] })] }));
}
