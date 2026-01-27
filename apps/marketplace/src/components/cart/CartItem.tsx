"use client";

import React from "react";

import Image from "next/image";
import { Button } from "@vayva/ui";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { CartWithRelations } from "@vayva/shared/cart-service";

interface CartItemProps {
    item: CartWithRelations['items'][number];
}

// format currency helper
const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
    }).format(amount);
};

export function CartItemRow({ item }: CartItemProps): React.JSX.Element {
    const { updateItem, removeItem, isLoading } = useCart();

    // Type casting to avoid 'any' for CI compliance while resolving property access
    const variant = item.variant as unknown as {
        id: string;
        title: string;
        price: number;
        product: {
            title: string;
            productImages?: { url: string }[]
        };
        productImage?: { url: string };
    };
    const product = variant.product;
    const image = product.productImages?.[0] || variant.productImage;

    const handleUpdate = (qty: number): void => {
        if (qty < 1) return;
        updateItem(item.id, qty);
    };

    return (
        <div className="flex gap-4 py-4 border-b last:border-0 hover:bg-gray-100/50 transition-colors">
            <div className="h-20 w-20 relative bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                {image ? (
                    <Image
                        src={image?.url || ""}
                        alt={product.title}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No Img</div>
                )}
            </div>

            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <h4 className="font-medium text-sm line-clamp-1">{product.title}</h4>
                    <div className="text-xs text-muted-foreground mt-1">
                        {variant.title !== "Default Variant" && variant.title}
                    </div>
                    <div className="text-sm font-semibold mt-1">
                        {formatCurrency(Number(variant.price))}
                    </div>
                </div>

                <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-1 border rounded-md">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 p-1"
                            onClick={() => handleUpdate(item.quantity - 1)}
                            disabled={isLoading}
                            aria-label="Decrease quantity"
                            title="Decrease quantity"
                        >
                            <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-xs w-6 text-center">{item.quantity}</span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 p-1"
                            onClick={() => handleUpdate(item.quantity + 1)}
                            disabled={isLoading}
                            aria-label="Increase quantity"
                            title="Increase quantity"
                        >
                            <Plus className="h-3 w-3" />
                        </Button>
                    </div>

                    <Button
                        onClick={() => removeItem(item.id)}
                        variant="ghost"
                        size="icon"
                        className="text-gray-500 hover:text-black hover:bg-gray-100 h-6 w-6 p-1"
                        disabled={isLoading}
                        aria-label="Remove item"
                        title="Remove item"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
