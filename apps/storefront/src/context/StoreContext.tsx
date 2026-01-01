"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { StorefrontService } from "@/services/storefront.service";
import { PublicStore } from "@/types/storefront";

export interface CartItem {
  productId: string;
  variantId: string;
  productName: string;
  price: number;
  quantity: number;
  image?: string;
}

interface StoreContextType {
  store: PublicStore | null;
  isLoading: boolean;
  error: string | null;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

const StoreContext = createContext<StoreContextType>({
  store: null,
  isLoading: true,
  error: null,
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
});

export const useStore = () => useContext(StoreContext);

export function StoreProvider({ children }: { children: any }) {
  const searchParams = useSearchParams();
  const [store, setStore] = useState<PublicStore | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load Cart from LocalStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("vayva_cart");
      if (saved) {
        try {
          setCart(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse cart", e);
        }
      }
    }
  }, []);

  // Save Cart to LocalStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("vayva_cart", JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find(
        (i) => i.productId === item.productId && i.variantId === item.variantId,
      );
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId && i.variantId === item.variantId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i,
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.productId !== productId));
  };

  const clearCart = () => setCart([]);

  useEffect(() => {
    const initStore = async () => {
      // 1. Logic to determine slug
      // Prod: subdomain (e.g. demo.vayva.shop -> demo)
      // Dev: query param (e.g. localhost:3001/?store=demo -> demo)

      let slug = searchParams.get("store");

      if (!slug && typeof window !== "undefined") {
        const hostname = window.location.hostname;
        if (hostname.includes(".vayva.shop")) {
          slug = hostname.split(".")[0];
        }
      }

      if (slug) {
        try {
          const data = await StorefrontService.getStore(slug);
          if (data) {
            setStore(data);
          } else {
            setError("Store not found");
          }
        } catch (err) {
          setError("Failed to load store");
        }
      } else {
        // No slug, maybe show a landing/404 or just render nothing specific yet
        // For now, we leave store null.
      }
      setIsLoading(false);
    };

    initStore();
  }, [searchParams]);

  return (
    <StoreContext.Provider
      value={{
        store,
        isLoading,
        error,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}
