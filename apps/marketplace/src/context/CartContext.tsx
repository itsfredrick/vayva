
"use client";

import { createContext, useContext, useEffect, useState, PropsWithChildren } from "react";
import { EnrichedCart } from "@vayva/shared/cart-service";
import { useSession } from "next-auth/react";

interface CartContextType {
    cart: EnrichedCart | null;
    isLoading: boolean;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    addItem: (variantId: string, quantity?: number) => Promise<void>;
    updateItem: (itemId: string, quantity: number) => Promise<void>;
    removeItem: (itemId: string) => Promise<void>;
    refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: PropsWithChildren) {
    const [cart, setCart] = useState<EnrichedCart | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { data: session } = useSession();

    // Load Cart ID
    useEffect(() => {
        const savedId = localStorage.getItem("vayva_cart_id");
        if (savedId) {
            fetchCart(savedId);
        }
    }, []);

    const fetchCart = async (cartId: string) => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/cart?cartId=${cartId}`);
            if (res.ok) {
                const data = await res.json();
                setCart(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const addItem = async (variantId: string, quantity = 1) => {
        setIsLoading(true);
        try {
            const cartId = cart?.id || localStorage.getItem("vayva_cart_id");

            const res = await fetch("/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cartId, variantId, quantity }),
            });

            if (res.ok) {
                const updatedCart = await res.json();
                setCart(updatedCart);
                localStorage.setItem("vayva_cart_id", updatedCart.id);
                setIsOpen(true);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const updateItem = async (itemId: string, quantity: number) => {
        try {
            await fetch(`/api/cart/${itemId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ quantity })
            });
            if (cart?.id) fetchCart(cart.id);
        } catch (e) { console.error(e); }
    };

    const removeItem = async (itemId: string) => {
        try {
            await fetch(`/api/cart/${itemId}`, { method: "DELETE" });
            if (cart?.id) fetchCart(cart.id);
        } catch (e) { console.error(e); }
    };

    return (
        <CartContext.Provider value={{
            cart, isLoading, isOpen, setIsOpen, addItem, updateItem, removeItem,
            refreshCart: async () => { if (cart?.id) fetchCart(cart.id); }
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within CartProvider");
    return context;
};
