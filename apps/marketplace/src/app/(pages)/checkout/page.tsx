"use client";

import { useCart } from "@/context/CartContext";
import { useSession } from "next-auth/react";
import { Button } from "@vayva/ui";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { SplitCartGroup, CartWithRelations } from "@vayva/shared/cart-service";

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
        return <div className="p-8 text-center">Loading checkout...</div>;
    }

    const grandTotal = cart.groups.reduce((acc: number, group: SplitCartGroup) => acc + group.subtotal + group.deliveryFee, 0);

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

        } catch (error) {
            const err = error as Error;
            console.error("Order placement failed", err);
            alert(err.message || "Something went wrong. Please try again.");
        } finally {
            setIsPlacingOrder(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content - Order Groups */}
                <div className="lg:col-span-2 space-y-6">
                    {cart.groups.map((group: SplitCartGroup) => (
                        <CheckoutGroup key={group.storeId} group={group} />
                    ))}
                </div>

                {/* Sidebar - Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-50 p-6 rounded-xl border sticky top-24">
                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                        <div className="space-y-3 text-sm border-b pb-4 mb-4">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>₦{cart.cartTotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Delivery Fees</span>
                                <span>₦{(grandTotal - cart.cartTotal).toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="flex justify-between text-xl font-bold mb-6">
                            <span>Total</span>
                            <span>₦{grandTotal.toLocaleString()}</span>
                        </div>

                        {/* Deposit Breakdown */}
                        {cart.payableAmount < grandTotal && (
                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-6">
                                <div className="flex justify-between text-sm mb-1 text-blue-800">
                                    <span>Pay Today</span>
                                    <span className="font-bold">₦{Number(cart.payableAmount).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-xs text-blue-600">
                                    <span>Pay Later</span>
                                    <span>₦{(grandTotal - cart.payableAmount).toLocaleString()}</span>
                                </div>
                            </div>
                        )}

                        <Button
                            className="w-full h-12 text-base"
                            onClick={handlePlaceOrder}
                            disabled={isPlacingOrder}
                        >
                            {isPlacingOrder ? "Placing Order..." : (cart.payableAmount < grandTotal ? `Pay Deposit (₦${Number(cart.payableAmount).toLocaleString()})` : "Place Order")}
                        </Button>

                        <p className="text-xs text-muted-foreground text-center mt-4">
                            By placing your order, you agree to our Terms of Service.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}


function CheckoutGroup({ group }: { group: SplitCartGroup }) {
    return (
        <div className="border rounded-xl bg-white overflow-hidden">
            <div className="bg-gray-50 px-6 py-3 border-b">
                <h3 className="font-semibold flex items-center gap-2">
                    Package from {group.storeName}
                </h3>
            </div>
            <div className="p-6 space-y-4">
                {group.items.map((item: CartWithRelations['items'][number]) => (
                    <div key={item.id} className="flex gap-4">
                        <div className="h-16 w-16 bg-gray-100 rounded-md relative overflow-hidden shrink-0">
                            {item.variant.productImage || item.variant.product.productImages?.[0] ? (
                                <Image
                                    src={item.variant.productImage?.url || item.variant.product.productImages?.[0]?.url || ""}
                                    alt="Product"
                                    fill
                                    className="object-cover"
                                />
                            ) : null}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-medium text-sm">{item.variant.product.title}</h4>
                            <div className="text-xs text-muted-foreground">
                                {item.variant.title !== "Default Variant" && item.variant.title}
                            </div>
                            <div className="text-sm mt-1">
                                Qty: {item.quantity} × ₦{Number(item.variant.price).toLocaleString()}
                            </div>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                            <div className="font-medium">
                                ₦{(Number(item.variant.price) * item.quantity).toLocaleString()}
                            </div>
                        </div>
                    </div>
                ))}

                <div className="border-t pt-4 mt-4 flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Delivery Method: {group.deliveryFeeType}</span>
                    <span className="font-medium">Delivery: ₦{group.deliveryFee.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
}
