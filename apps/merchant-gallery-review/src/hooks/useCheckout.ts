import { useState } from "react";
import { CartItem } from "./useCart";

export type CheckoutMode = "whatsapp" | "website";

interface CheckoutOptions {
  merchantPhone?: string; // For WhatsApp
  paystackPublicKey?: string; // For Web
}

interface UseCheckoutReturn {
  isProcessing: boolean;
  checkout: (
    mode: CheckoutMode,
    cart: CartItem[],
    total: number,
  ) => Promise<void>;
}

export const useCheckout = (options: CheckoutOptions): UseCheckoutReturn => {
  const [isProcessing, setIsProcessing] = useState(false);

  const generateWhatsAppMessage = (cart: CartItem[], total: number) => {
    let message = `*New Order Request*\n\n`;
    cart.forEach((item) => {
      message += `• ${item.quantity}x ${item.name}`;
      if (item.options && Object.keys(item.options).length > 0) {
        const opts = Object.values(item.options).join(", ");
        message += ` (${opts})`;
      }
      message += ` - ₦${(item.price * item.quantity).toLocaleString()}\n`;
    });
    message += `\n*Total: ₦${total.toLocaleString()}*\n\n`;
    message += `I would like to pay for this order. Please confirm availability.`;
    return encodeURIComponent(message);
  };

  const checkout = async (
    mode: CheckoutMode,
    cart: CartItem[],
    total: number,
  ) => {
    setIsProcessing(true);

    try {
      if (mode === "whatsapp") {
        if (!options.merchantPhone) {
          throw new Error("Merchant phone number is missing");
        }
        const message = generateWhatsAppMessage(cart, total);
        // Clean phone number (remove +, spaces)
        const phone = options.merchantPhone.replace(/[^0-9]/g, "");

        // Simulate network delay for UX
        await new Promise((resolve) => setTimeout(resolve, 800));

        window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
      } else if (mode === "website") {
        // Real API Flow (Phase 3 Wiring)
        // In live mode, this must hit /api/checkout/initialize
        try {
          const response = await fetch("/api/checkout/initialize", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: cart, total, method: "paystack" }),
          });

          if (!response.ok) throw new Error("Checkout initialization failed");

          const data = await response.json();

          if (data.checkoutUrl) {
            window.location.href = data.checkoutUrl;
          } else {
            // Test success fallback if API returns tested success (for now)
            alert(
              "Calculated Checkout: ₦" +
                total.toLocaleString() +
                " (Redirecting to Paystack...)",
            );
          }
        } catch (apiError) {
          console.error("Checkout API Error", apiError);
          // Fallback for Demo/Dev until API is fully ready
          alert("Checkout Service Unavailable. Please try WhatsApp.");
        }
      }
    } catch (e) {
      console.error("Checkout Failed", e);
      alert("Checkout could not be started. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    checkout,
  };
};
