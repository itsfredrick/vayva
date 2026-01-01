"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { StorefrontProduct } from "@/types/storefront";

export type StorefrontRoute =
  | "home"
  | "product_detail"
  | "cart"
  | "checkout"
  | "checkout_success";

export interface CartItem {
  product: StorefrontProduct;
  quantity: number;
  selectedVariants: Record<string, string>; // { "Size": "M" }
  selectedModifiers?: Record<string, string[]>; // { "Extras": ["Plantain", "Coleslaw"], "Protein": ["Beef"] } (Storing strings for simplicity, price calc needs lookup)
}

interface StorefrontContextType {
  route: StorefrontRoute;
  currentProduct: StorefrontProduct | null;
  cart: CartItem[];
  cartTotal: number;

  // Actions
  navigate: (route: StorefrontRoute, product?: StorefrontProduct) => void;
  addToCart: (
    product: StorefrontProduct,
    quantity: number,
    variants: Record<string, string>,
    modifiers?: Record<string, string[]>,
  ) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, delta: number) => void;
  clearCart: () => void;

  // Helpers
  cartCount: number;
}

const StorefrontContext = createContext<StorefrontContextType | undefined>(
  undefined,
);

export function StorefrontProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<StorefrontRoute>("home");
  const [currentProduct, setCurrentProduct] =
    useState<StorefrontProduct | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  const navigate = (newRoute: StorefrontRoute, product?: StorefrontProduct) => {
    if (product) setCurrentProduct(product);
    setRoute(newRoute);
    // Scroll to top on route change (simulated)
    const container = document.getElementById("storefront-container");
    if (container) container.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addToCart = (
    product: StorefrontProduct,
    quantity: number,
    variants: Record<string, string>,
    modifiers: Record<string, string[]> = {},
  ) => {
    setCart((prev) => {
      // Check if item exists with exact same variants & modifiers
      // Simple JSON stringify comparison for MVP
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          JSON.stringify(item.selectedVariants) === JSON.stringify(variants) &&
          JSON.stringify(item.selectedModifiers || {}) ===
            JSON.stringify(modifiers),
      );

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

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, delta: number) => {
    setCart((prev) => {
      const newCart = [...prev];
      const item = newCart[index];
      const newQty = item.quantity + delta;

      if (newQty <= 0) return prev.filter((_, i) => i !== index);

      item.quantity = newQty;
      return newCart;
    });
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => {
    let itemPrice = item.product.price;

    // Add modifier prices
    if (item.selectedModifiers && item.product.modifiers) {
      Object.entries(item.selectedModifiers).forEach(
        ([modName, selectedOptions]) => {
          const modDef = item.product.modifiers?.find(
            (m) => m.name === modName,
          );
          if (modDef) {
            selectedOptions.forEach((optLabel) => {
              const optDef = modDef.options.find((o) => o.label === optLabel);
              if (optDef) itemPrice += optDef.price;
            });
          }
        },
      );
    }

    return sum + itemPrice * item.quantity;
  }, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <StorefrontContext.Provider
      value={{
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
      }}
    >
      {children}
    </StorefrontContext.Provider>
  );
}

export const useStorefront = () => {
  const context = useContext(StorefrontContext);
  if (!context)
    throw new Error("useStorefront must be used within a StorefrontProvider");
  return context;
};
