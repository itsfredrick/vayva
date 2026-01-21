
"use client";

import { useCart } from "@/context/CartContext";
import { Drawer, Button } from "@vayva/ui";
import { CartItemRow } from "./CartItem";
import { ShoppingBag, Store, Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import { SplitCartGroup, CartWithRelations } from "@vayva/shared/cart-service";

export function CartDrawer() {
    const { isOpen, setIsOpen, cart, isLoading } = useCart();
    const router = useRouter();

    const handleCheckout = () => {
        setIsOpen(false);
        router.push("/checkout");
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
        }).format(amount);
    };

    const hasItems = cart && cart.items.length > 0;

    // Calculate Grand Total (Items + Fees)
    const grandTotal = cart?.groups.reduce((acc: number, group: SplitCartGroup) => {
        return acc + group.subtotal + group.deliveryFee;
    }, 0) || 0;

    return (
        <Drawer
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title={`Your Cart (${cart?.items.length || 0})`}
            className="sm:max-w-[440px]"
        >
            {!hasItems && (
                <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
                    <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <ShoppingBag className="h-8 w-8 text-gray-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Your cart is empty</h3>
                        <p className="text-muted-foreground text-sm">Looks like you haven't added anything yet.</p>
                    </div>
                    <Button onClick={() => setIsOpen(false)} variant="outline">
                        Start Shopping
                    </Button>
                </div>
            )}

            {hasItems && (
                <div className="flex flex-col h-full">
                    <div className="flex-1 space-y-8 pb-20">
                        {/* Render Groups */}
                        {cart.groups.map((group: SplitCartGroup) => (
                            <div key={group.storeId} className="border rounded-xl overflow-hidden bg-white shadow-sm">
                                <div className="bg-gray-50 px-4 py-2 border-b flex items-center gap-2">
                                    <Store className="h-4 w-4 text-gray-500" />
                                    <span className="font-semibold text-sm">{group.storeName}</span>
                                </div>

                                <div className="px-4">
                                    {group.items.map((item: CartWithRelations['items'][number]) => (
                                        <CartItemRow key={item.id} item={item} />
                                    ))}
                                </div>

                                <div className="bg-blue-50/30 px-4 py-3 border-t flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-2 text-blue-800">
                                        <Truck className="h-3 w-3" />
                                        <span>Delivery Fee</span>
                                    </div>
                                    <span className="font-medium">{formatCurrency(group.deliveryFee)}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer Fixed */}
                    <div className="border-t bg-gray-50 mt-auto -mx-6 px-6 py-4 space-y-4">
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-muted-foreground">
                                <span>Subtotal</span>
                                <span>{formatCurrency(cart.cartTotal)}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                                <span>Total Delivery</span>
                                <span>{formatCurrency(grandTotal - cart.cartTotal)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                                <span>Total</span>
                                <span>{formatCurrency(grandTotal)}</span>
                            </div>
                        </div>

                        <Button
                            onClick={handleCheckout}
                            className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90"
                        >
                            Checkout Now
                        </Button>
                    </div>
                </div>
            )}
        </Drawer>
    );
}
