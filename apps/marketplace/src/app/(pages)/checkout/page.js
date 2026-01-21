"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCart } from "@/context/CartContext";
import { useSession } from "next-auth/react";
import { Button } from "@vayva/ui";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
export default function CheckoutPage() {
    const { cart, isLoading } = useCart();
    const { data: session } = useSession();
    const router = useRouter();
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    // Redirect if empty
    useEffect(() => {
        if (!isLoading && (!cart || cart.items.length === 0)) {
            router.push("/");
        }
    }, [cart, isLoading, router]);
    if (isLoading || !cart) {
        return _jsx("div", { className: "p-8 text-center", children: "Loading checkout..." });
    }
    const grandTotal = cart.groups.reduce((acc, group) => acc + group.subtotal + group.deliveryFee, 0);
    const handlePlaceOrder = async () => {
        if (!session?.user) {
            // Should be handled by middleware or UI redirect, but safe guard
            router.push("/api/auth/signin");
            return;
        }
        setIsPlacingOrder(true);
        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cartId: cart.id })
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Failed to place order");
            }
            // Success - Redirect to tracking (Order Details)
            // Force refresh to clear cart state if context doesn't auto-update (it should if we invalidate)
            // Ideally, cart context listens to this or we call clearCart(), 
            // but the backend deleted the cart, so next fetch will verify "empty".
            router.push(`/orders/${data.orderId}`);
            router.refresh();
        }
        catch (error) {
            console.error("Order placement failed", error);
            alert(error.message || "Something went wrong. Please try again.");
        }
        finally {
            setIsPlacingOrder(false);
        }
    };
    return (_jsxs("div", { className: "container mx-auto px-4 py-8 max-w-5xl", children: [_jsx("h1", { className: "text-3xl font-bold mb-8", children: "Checkout" }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [_jsx("div", { className: "lg:col-span-2 space-y-6", children: cart.groups.map((group) => (_jsx(CheckoutGroup, { group: group }, group.storeId))) }), _jsx("div", { className: "lg:col-span-1", children: _jsxs("div", { className: "bg-gray-50 p-6 rounded-xl border sticky top-24", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Order Summary" }), _jsxs("div", { className: "space-y-3 text-sm border-b pb-4 mb-4", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "Subtotal" }), _jsxs("span", { children: ["\u20A6", cart.cartTotal.toLocaleString()] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "Delivery Fees" }), _jsxs("span", { children: ["\u20A6", (grandTotal - cart.cartTotal).toLocaleString()] })] })] }), _jsxs("div", { className: "flex justify-between text-xl font-bold mb-6", children: [_jsx("span", { children: "Total" }), _jsxs("span", { children: ["\u20A6", grandTotal.toLocaleString()] })] }), cart.payableAmount < grandTotal && (_jsxs("div", { className: "bg-blue-50 border border-blue-100 rounded-lg p-3 mb-6", children: [_jsxs("div", { className: "flex justify-between text-sm mb-1 text-blue-800", children: [_jsx("span", { children: "Pay Today" }), _jsxs("span", { className: "font-bold", children: ["\u20A6", Number(cart.payableAmount).toLocaleString()] })] }), _jsxs("div", { className: "flex justify-between text-xs text-blue-600", children: [_jsx("span", { children: "Pay Later" }), _jsxs("span", { children: ["\u20A6", (grandTotal - cart.payableAmount).toLocaleString()] })] })] })), _jsx(Button, { className: "w-full h-12 text-base", onClick: handlePlaceOrder, disabled: isPlacingOrder, children: isPlacingOrder ? "Placing Order..." : (cart.payableAmount < grandTotal ? `Pay Deposit (₦${Number(cart.payableAmount).toLocaleString()})` : "Place Order") }), _jsx("p", { className: "text-xs text-muted-foreground text-center mt-4", children: "By placing your order, you agree to our Terms of Service." })] }) })] })] }));
}
function CheckoutGroup({ group }) {
    return (_jsxs("div", { className: "border rounded-xl bg-white overflow-hidden", children: [_jsx("div", { className: "bg-gray-50 px-6 py-3 border-b", children: _jsxs("h3", { className: "font-semibold flex items-center gap-2", children: ["Package from ", group.storeName] }) }), _jsxs("div", { className: "p-6 space-y-4", children: [group.items.map((item) => (_jsxs("div", { className: "flex gap-4", children: [_jsx("div", { className: "h-16 w-16 bg-gray-100 rounded-md relative overflow-hidden shrink-0", children: item.variant.productImage || item.variant.product.productImages?.[0] ? (_jsx(Image, { src: item.variant.productImage?.url || item.variant.product.productImages?.[0]?.url || "", alt: "Product", fill: true, className: "object-cover" })) : null }), _jsxs("div", { className: "flex-1", children: [_jsx("h4", { className: "font-medium text-sm", children: item.variant.product.title }), _jsx("div", { className: "text-xs text-muted-foreground", children: item.variant.title !== "Default Variant" && item.variant.title }), _jsxs("div", { className: "text-sm mt-1", children: ["Qty: ", item.quantity, " \u00D7 \u20A6", Number(item.variant.price).toLocaleString()] })] }), _jsx("div", { className: "flex flex-col items-end justify-between", children: _jsxs("div", { className: "font-medium", children: ["\u20A6", (Number(item.variant.price) * item.quantity).toLocaleString()] }) })] }, item.id))), _jsxs("div", { className: "border-t pt-4 mt-4 flex justify-between items-center text-sm", children: [_jsxs("span", { className: "text-muted-foreground", children: ["Delivery Method: ", group.deliveryFeeType] }), _jsxs("span", { className: "font-medium", children: ["Delivery: \u20A6", group.deliveryFee.toLocaleString()] })] })] })] }));
}
