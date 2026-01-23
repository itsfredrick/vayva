import { useState, useEffect } from "react";
import { toast } from "sonner";
export function useStorefrontCart(storeSlug: any) {
    const [cart, setCart] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    // Load cart from local storage on mount
    useEffect(() => {
        if (!storeSlug)
            return;
        const saved = localStorage.getItem(`vayva_cart_${storeSlug}`);
        if (saved) {
            try {
                setCart(JSON.parse(saved));
            }
            catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
    }, [storeSlug]);
    // Save cart to local storage on change
    useEffect(() => {
        if (!storeSlug)
            return;
        localStorage.setItem(`vayva_cart_${storeSlug}`, JSON.stringify(cart));
    }, [cart, storeSlug]);
    // Handle payment success callback
    useEffect(() => {
        if (typeof window === "undefined" || !storeSlug)
            return;
        const params = new URLSearchParams(window.location.search);
        if (params.get("payment_success") === "true") {
            // Check if we have a cart to clear (prevents double toast on refresh)
            const saved = localStorage.getItem(`vayva_cart_${storeSlug}`);
            if (saved && JSON.parse(saved).length > 0) {
                setCart([]);
                localStorage.removeItem(`vayva_cart_${storeSlug}`);
                toast.success("Payment successful! Your order has been placed.");
                // Clean URL to prevent re-triggering
                const newUrl = window.location.pathname;
                window.history.replaceState({}, "", newUrl);
            }
        }
    }, [storeSlug]);
    const addToCart = (product, quantity = 1) => {
        setCart((prev: any) => {
            const existing = prev.find((item: any) => item.id === product.id);
            if (existing) {
                return prev.map((item: any) => item.id === product.id
                    ? { ...item, quantity: item.quantity + quantity }
                    : item);
            }
            return [
                ...prev,
                {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity,
                },
            ];
        });
        setIsOpen(true); // Open cart sidebar/modal
    };
    const removeFromCart = (productId: any) => {
        setCart((prev: any) => prev.filter((item: any) => item.id !== productId));
    };
    const updateQuantity = (productId: any, delta: any) => {
        setCart((prev: any) => prev
            .map((item: any) => {
            if (item.id === productId) {
                const newQty = Math.max(0, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        })
            .filter((item: any) => item.quantity > 0));
    };
    const clearCart = () => {
        setCart([]);
        localStorage.removeItem(`vayva_cart_${storeSlug}`);
    };
    const total = cart.reduce((sum: any, item: any) => sum + item.price * item.quantity, 0);
    return {
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
        isOpen,
        setIsOpen,
    };
}
