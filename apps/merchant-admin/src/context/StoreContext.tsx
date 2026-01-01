"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useCart, CartItem, UseCartReturn } from "@/hooks/useCart";
import { useCheckout, CheckoutMode } from "@/hooks/useCheckout";
import { ProductServiceItem } from "@vayva/shared";

// -- Test Types until Shared is fully updated --
interface StoreMerchant {
  id: string;
  name: string;
  phone: string;
  currency: string;
}

interface StoreContextType {
  // State
  isLoading: boolean;
  products: ProductServiceItem[];
  merchant: StoreMerchant | null;
  currency: string;

  // Cart (Directly exposed from hook)
  cart: UseCartReturn["cart"];
  addToCart: UseCartReturn["addToCart"];
  removeFromCart: UseCartReturn["removeFromCart"];
  updateQuantity: UseCartReturn["updateQuantity"];
  clearCart: UseCartReturn["clearCart"];
  cartTotal: UseCartReturn["cartTotal"];
  itemCount: UseCartReturn["itemCount"];
  isCartOpen: boolean;
  toggleCart: (open?: boolean) => void;

  // Actions
  checkout: (mode: CheckoutMode) => Promise<void>;
  isCheckoutProcessing: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

interface StoreProviderProps {
  children: React.ReactNode;
  demoMode?: boolean;
  merchantId?: string; // If null, derives from session (or test in demo)
}

export const StoreProvider = ({
  children,
  demoMode = false,
  merchantId,
}: StoreProviderProps) => {
  const [products, setProducts] = useState<ProductServiceItem[]>([]);
  const [merchant, setMerchant] = useState<StoreMerchant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Initial Context Setup
  const derivedMerchantId = merchantId || (demoMode ? "test_mer_1" : undefined);

  // Hooks
  const cart = useCart(derivedMerchantId);
  const checkoutHook = useCheckout({
    merchantPhone: merchant?.phone,
  });

  // Load Data
  useEffect(() => {
    const initStore = async () => {
      setIsLoading(true);
      try {
        if (demoMode) {
          // Load Tests
          const storeProducts = await fetch("/api/products/items").then((r) =>
            r.json(),
          );
          setProducts(storeProducts);
          setMerchant({
            id: "test_mer_1",
            name: "Demo Merchant Store",
            phone: "2348000000000",
            currency: "NGN",
          });
        } else {
          // Load Real Data
          const [fetchedProducts, merchantInfo] = await Promise.all([
            fetch("/api/products/items").then((r) => r.json()).catch(() => []),
            fetch("/api/auth/merchant/me").then((r) => r.json()).catch(() => null)
          ]);

          setProducts(fetchedProducts);

          if (merchantInfo && merchantInfo.merchant) {
            setMerchant({
              id: merchantInfo.merchant.id,
              name: merchantInfo.store?.name || "My Store",
              phone: merchantInfo.merchant.phone || "",
              currency: merchantInfo.store?.currency || "NGN",
            });
          } else {
            // Fallback if fetch fails but we are not in demo (should ideally logout)
            setMerchant({
              id: "real_mer_1",
              name: "My Store",
              phone: "",
              currency: "NGN",
            });
          }
        }
      } catch (e) {
        console.error("Store Init Failed", e);
      } finally {
        setIsLoading(false);
      }
    };

    initStore();
  }, [demoMode, derivedMerchantId]);

  const handleCheckout = async (mode: CheckoutMode) => {
    if (demoMode) {
      alert(
        "Demo Mode: Checkout is disabled. In a live store, this would process the order.",
      );
      return;
    }
    await checkoutHook.checkout(mode, cart.cart, cart.cartTotal);
    // Optional: clear cart on success if callback supported
    // cart.clearCart();
  };

  return (
    <StoreContext.Provider
      value={{
        isLoading,
        products,
        merchant,
        currency: merchant?.currency || "NGN",

        // Cart
        cart: cart.cart,
        addToCart: cart.addToCart,
        removeFromCart: cart.removeFromCart,
        updateQuantity: cart.updateQuantity,
        clearCart: cart.clearCart,
        cartTotal: cart.cartTotal,
        itemCount: cart.itemCount,
        isCartOpen,
        toggleCart: (open) => setIsCartOpen(open ?? !isCartOpen),

        // Checkout
        checkout: handleCheckout,
        isCheckoutProcessing: checkoutHook.isProcessing,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
