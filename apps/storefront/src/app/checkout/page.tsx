"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { StorefrontService } from "@/services/storefront.service";
import { StoreShell } from "@/components/StoreShell";
import NextLink from "next/link";
const Link = NextLink as any;
import {
  ChevronRight as ChevronRightIcon,
  AlertCircle as AlertCircleIcon,
} from "lucide-react";
const ChevronRight = ChevronRightIcon as any;
const AlertCircle = AlertCircleIcon as any;
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { store, cart, clearCart } = useStore();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"DELIVERY" | "PICKUP">(
    "DELIVERY",
  );

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = deliveryMethod === "DELIVERY" ? 1500 : 0; // Flat rate for demo
  const total = subtotal + shipping;

  if (!store) return null;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // 1. Create Order
      const orderData = {
        storeId: store.id,
        items: cart.map((item) => ({
          productId: item.productId,
          variantId: item.variantId || "default",
          quantity: item.quantity,
          price: item.price,
          title: item.productName,
        })),
        customer: {
          email,
          name: `${firstName} ${lastName}`,
          phone,
          address: `${address}, ${city}, ${state}`,
          deliveryMethod,
        },
        shippingTotal: shipping,
        total: total,
      };

      const order = await StorefrontService.createOrder(orderData);

      // 2. Initialize Payment
      const payment = await StorefrontService.initializePayment({
        orderId: order.orderId!, // Assert existence as createOrder succeeded
        email: email,
        amount: total * 100, // Paystack expects Kobo
        callbackUrl: `${window.location.origin}/order/confirmation?store=${store.slug}&orderId=${order.orderId}`,
      });

      // 3. Clear Cart (or wait for confirmation?)
      // Usually we clear cart after successful payment redirect back,
      // but for simplicity in V1 we clear it now or on success page.
      // Let's clear on success page.

      // 4. Redirect to Paystack
      if (payment.data?.authorization_url) {
        window.location.href = payment.data.authorization_url;
      } else {
        throw new Error("Payment initialization failed: No URL returned");
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      setError(
        err.message || "An error occurred during checkout. Please try again.",
      );
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      {/* Left: Form */}
      <div className="flex-1 bg-white p-8 md:p-12 lg:p-20 order-2 md:order-1">
        <div className="max-w-xl mx-auto">
          <div className="mb-8">
            <Link
              href={`/?store=${store.slug}`}
              className="text-xl font-bold tracking-tight"
            >
              {store.name}
            </Link>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-4">
              <Link href={`/cart?store=${store.slug}`}>Cart</Link>
              <ChevronRight size={12} />
              <span className="text-black font-bold">Information</span>
              <ChevronRight size={12} />
              <span>Payment</span>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3 text-red-600 text-sm">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handlePlaceOrder} className="space-y-8">
            <div>
              <h2 className="text-lg font-bold mb-4">Contact</h2>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg mb-2 focus:ring-1 focus:ring-black outline-none"
                required
              />
            </div>

            <div>
              <h2 className="text-lg font-bold mb-4">Delivery method</h2>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div
                  className={`p-4 flex justify-between items-center cursor-pointer border-b border-gray-100 ${deliveryMethod === "DELIVERY" ? "bg-gray-50" : ""}`}
                  onClick={() => setDeliveryMethod("DELIVERY")}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      checked={deliveryMethod === "DELIVERY"}
                      readOnly
                      className="accent-black"
                    />
                    <span className="text-sm">Ship to my address</span>
                  </div>
                  <span className="text-sm font-bold">₦1,500</span>
                </div>
                <div
                  className={`p-4 flex justify-between items-center cursor-pointer ${deliveryMethod === "PICKUP" ? "bg-gray-50" : ""}`}
                  onClick={() => setDeliveryMethod("PICKUP")}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      checked={deliveryMethod === "PICKUP"}
                      readOnly
                      className="accent-black"
                    />
                    <span className="text-sm">Local pickup</span>
                  </div>
                  <span className="text-sm font-bold">Free</span>
                </div>
              </div>
            </div>

            {deliveryMethod === "DELIVERY" && (
              <div>
                <h2 className="text-lg font-bold mb-4">Shipping address</h2>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-black outline-none"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-black outline-none"
                    required
                  />
                </div>
                <input
                  type="text"
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg mt-4 focus:ring-1 focus:ring-black outline-none"
                  required
                />
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <input
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-black outline-none"
                    required
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-black outline-none"
                    required
                  />
                </div>
                <input
                  type="tel"
                  placeholder="Phone (e.g. 08031234567)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg mt-4 focus:ring-1 focus:ring-black outline-none"
                  required
                />
              </div>
            )}

            <div className="pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <Link
                  href={`/cart?store=${store.slug}`}
                  className="text-sm text-gray-500 hover:text-black"
                >
                  Return to cart
                </Link>
                <button
                  type="submit"
                  disabled={submitting || cart.length === 0}
                  className="bg-black text-white px-10 py-5 rounded-lg font-bold text-sm hover:bg-gray-900 transition-all disabled:opacity-50 shadow-lg shadow-black/10"
                >
                  {submitting
                    ? "Preparing your order..."
                    : "Pay Now with Paystack"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Right: Summary */}
      <div className="w-full md:w-[450px] bg-gray-50 border-l border-gray-200 p-8 md:p-12 order-1 md:order-2">
        <div className="max-w-md mx-auto sticky top-12">
          <div className="space-y-4 mb-8">
            {cart.map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="w-16 h-16 bg-white border border-gray-200 rounded-lg relative overflow-hidden">
                  {item.image && (
                    <img
                      src={item.image}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-gray-500 text-white text-xs flex items-center justify-center rounded-full font-bold">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm truncate max-w-[150px]">
                    {item.productName}
                  </h4>
                  <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                </div>
                <span className="font-bold text-sm">
                  ₦{item.price.toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2 py-6 border-t border-gray-200 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-medium">₦{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Shipping</span>
              <span className="font-medium">₦{shipping.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex justify-between pt-6 border-t border-gray-200">
            <span className="text-lg font-bold">Total</span>
            <div className="text-right">
              <span className="text-xs text-gray-400 mr-2 uppercase tracking-widest">
                NGN
              </span>
              <span className="text-2xl font-bold">
                ₦{total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
