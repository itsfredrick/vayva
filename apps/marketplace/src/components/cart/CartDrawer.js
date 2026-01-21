"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCart } from "@/context/CartContext";
import { Drawer, Button } from "@vayva/ui";
import { CartItemRow } from "./CartItem";
import { ShoppingBag, Store, Truck } from "lucide-react";
import { useRouter } from "next/navigation";
export function CartDrawer() {
    const { isOpen, setIsOpen, cart, isLoading } = useCart();
    const router = useRouter();
    const handleCheckout = () => {
        setIsOpen(false);
        router.push("/checkout");
    };
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
        }).format(amount);
    };
    const hasItems = cart && cart.items.length > 0;
    // Calculate Grand Total (Items + Fees)
    const grandTotal = cart?.groups.reduce((acc, group) => {
        return acc + group.subtotal + group.deliveryFee;
    }, 0) || 0;
    return (_jsxs(Drawer, { isOpen: isOpen, onClose: () => setIsOpen(false), title: `Your Cart (${cart?.items.length || 0})`, className: "sm:max-w-[440px]", children: [!hasItems && (_jsxs("div", { className: "flex flex-col items-center justify-center h-[60vh] text-center space-y-4", children: [_jsx("div", { className: "h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center", children: _jsx(ShoppingBag, { className: "h-8 w-8 text-gray-400" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold", children: "Your cart is empty" }), _jsx("p", { className: "text-muted-foreground text-sm", children: "Looks like you haven't added anything yet." })] }), _jsx(Button, { onClick: () => setIsOpen(false), variant: "outline", children: "Start Shopping" })] })), hasItems && (_jsxs("div", { className: "flex flex-col h-full", children: [_jsx("div", { className: "flex-1 space-y-8 pb-20", children: cart.groups.map((group) => (_jsxs("div", { className: "border rounded-xl overflow-hidden bg-white shadow-sm", children: [_jsxs("div", { className: "bg-gray-50 px-4 py-2 border-b flex items-center gap-2", children: [_jsx(Store, { className: "h-4 w-4 text-gray-500" }), _jsx("span", { className: "font-semibold text-sm", children: group.storeName })] }), _jsx("div", { className: "px-4", children: group.items.map((item) => (_jsx(CartItemRow, { item: item }, item.id))) }), _jsxs("div", { className: "bg-blue-50/30 px-4 py-3 border-t flex justify-between items-center text-sm", children: [_jsxs("div", { className: "flex items-center gap-2 text-blue-800", children: [_jsx(Truck, { className: "h-3 w-3" }), _jsx("span", { children: "Delivery Fee" })] }), _jsx("span", { className: "font-medium", children: formatCurrency(group.deliveryFee) })] })] }, group.storeId))) }), _jsxs("div", { className: "border-t bg-gray-50 mt-auto -mx-6 px-6 py-4 space-y-4", children: [_jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { className: "flex justify-between text-muted-foreground", children: [_jsx("span", { children: "Subtotal" }), _jsx("span", { children: formatCurrency(cart.cartTotal) })] }), _jsxs("div", { className: "flex justify-between text-muted-foreground", children: [_jsx("span", { children: "Total Delivery" }), _jsx("span", { children: formatCurrency(grandTotal - cart.cartTotal) })] }), _jsxs("div", { className: "flex justify-between text-lg font-bold border-t pt-2 mt-2", children: [_jsx("span", { children: "Total" }), _jsx("span", { children: formatCurrency(grandTotal) })] })] }), _jsx(Button, { onClick: handleCheckout, className: "w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90", children: "Checkout Now" })] })] }))] }));
}
