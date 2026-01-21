"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from "react";
const StorefrontContext = createContext(undefined);
export function StorefrontProvider({ children }) {
    const [route, setRoute] = useState("home");
    const [currentProduct, setCurrentProduct] = useState(null);
    const [cart, setCart] = useState([]);
    const navigate = (newRoute, product) => {
        if (product)
            setCurrentProduct(product);
        setRoute(newRoute);
        // Scroll to top on route change (simulated)
        const container = document.getElementById("storefront-container");
        if (container)
            container.scrollTo({ top: 0, behavior: "smooth" });
    };
    const addToCart = (product, quantity, variants, modifiers = {}) => {
        setCart((prev) => {
            // Check if item exists with exact same variants & modifiers
            // Simple JSON stringify comparison for MVP
            const existingIndex = prev.findIndex((item) => item.product.id === product.id &&
                JSON.stringify(item.selectedVariants) === JSON.stringify(variants) &&
                JSON.stringify(item.selectedModifiers || {}) ===
                    JSON.stringify(modifiers));
            if (existingIndex >= 0) {
                const newCart = [...prev];
                newCart[existingIndex].quantity += quantity;
                return newCart;
            }
            return [
                ...prev,
                {
                    product,
                    quantity,
                    selectedVariants: variants,
                    selectedModifiers: modifiers,
                },
            ];
        });
    };
    const removeFromCart = (index) => {
        setCart((prev) => prev.filter((_, i) => i !== index));
    };
    const updateQuantity = (index, delta) => {
        setCart((prev) => {
            const newCart = [...prev];
            const item = newCart[index];
            const newQty = item.quantity + delta;
            if (newQty <= 0)
                return prev.filter((_, i) => i !== index);
            item.quantity = newQty;
            return newCart;
        });
    };
    const clearCart = () => setCart([]);
    const cartTotal = cart.reduce((sum, item) => {
        let itemPrice = item.product.price;
        // Add modifier prices
        if (item.selectedModifiers && item.product.modifiers) {
            Object.entries(item.selectedModifiers).forEach(([modName, selectedOptions]) => {
                const modDef = item.product.modifiers?.find((m) => m.name === modName);
                if (modDef) {
                    selectedOptions.forEach((optLabel) => {
                        const optDef = modDef.options.find((o) => o.label === optLabel);
                        if (optDef)
                            itemPrice += optDef.price;
                    });
                }
            });
        }
        return sum + itemPrice * item.quantity;
    }, 0);
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    return (_jsx(StorefrontContext.Provider, { value: {
            route,
            currentProduct,
            cart,
            cartTotal,
            navigate,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartCount,
        }, children: children }));
}
export const useStorefront = () => {
    const context = useContext(StorefrontContext);
    if (!context)
        throw new Error("useStorefront must be used within a StorefrontProvider");
    return context;
};
