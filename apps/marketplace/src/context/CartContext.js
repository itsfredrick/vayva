"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
const CartContext = createContext(undefined);
export function CartProvider({ children }) {
    const [cart, setCart] = useState(null);
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
    const fetchCart = async (cartId) => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/cart?cartId=${cartId}`);
            if (res.ok) {
                const data = await res.json();
                setCart(data);
            }
        }
        catch (e) {
            console.error(e);
        }
        finally {
            setIsLoading(false);
        }
    };
    const addItem = async (variantId, quantity = 1) => {
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
        }
        catch (e) {
            console.error(e);
        }
        finally {
            setIsLoading(false);
        }
    };
    const updateItem = async (itemId, quantity) => {
        try {
            await fetch(`/api/cart/${itemId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ quantity })
            });
            if (cart?.id)
                fetchCart(cart.id);
        }
        catch (e) {
            console.error(e);
        }
    };
    const removeItem = async (itemId) => {
        try {
            await fetch(`/api/cart/${itemId}`, { method: "DELETE" });
            if (cart?.id)
                fetchCart(cart.id);
        }
        catch (e) {
            console.error(e);
        }
    };
    return (_jsx(CartContext.Provider, { value: {
            cart, isLoading, isOpen, setIsOpen, addItem, updateItem, removeItem,
            refreshCart: async () => { if (cart?.id)
                fetchCart(cart.id); }
        }, children: children }));
}
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context)
        throw new Error("useCart must be used within CartProvider");
    return context;
};
