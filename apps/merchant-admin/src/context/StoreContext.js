"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useCheckout } from "@/hooks/useCheckout";
const StoreContext = createContext(undefined);
export const StoreProvider = ({ children, demoMode = false, merchantId, }) => {
    const [products, setProducts] = useState([]);
    const [merchant, setMerchant] = useState(null);
    const [store, setStore] = useState(null);
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
                    const storeProducts = await fetch("/api/products/items").then((r) => r.json());
                    setProducts(storeProducts);
                    setMerchant({
                        id: "test_mer_1",
                        name: "Demo Merchant Store",
                        phone: "2348000000000",
                        currency: "NGN",
                    });
                }
                else {
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
                        setStore(merchantInfo.store);
                    }
                    else {
                        // Fallback if fetch fails but we are not in demo (should ideally logout)
                        setMerchant({
                            id: "real_mer_1",
                            name: "My Store",
                            phone: "",
                            currency: "NGN",
                        });
                        setStore(null);
                    }
                }
            }
            catch (e) {
                console.error("Store Init Failed", e);
            }
            finally {
                setIsLoading(false);
            }
        };
        initStore();
    }, [demoMode, derivedMerchantId]);
    const handleCheckout = async (mode) => {
        if (demoMode) {
            alert("Demo Mode: Checkout is disabled. In a live store, this would process the order.");
            return;
        }
        await checkoutHook.checkout(mode, cart.cart, cart.cartTotal);
    };
    return (_jsx(StoreContext.Provider, { value: {
            isLoading,
            products,
            merchant,
            store,
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
        }, children: children }));
};
export const useStore = () => {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error("useStore must be used within a StoreProvider");
    }
    return context;
};
