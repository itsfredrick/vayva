import React, { useState } from "react";
import { X, ShoppingBag, CheckCircle } from "lucide-react";
import { PublicProduct } from "@/types/storefront";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: PublicProduct;
  qty: number;
  upsellProduct?: PublicProduct;
}

export const CheckoutModal = ({
  isOpen,
  onClose,
  product,
  qty,
  upsellProduct,
}: CheckoutModalProps) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [upsellAdded, setUpsellAdded] = useState(false);
  const [step, setStep] = useState(1);

  if (!isOpen) return null;

  const total =
    product.price * qty +
    (upsellAdded && upsellProduct ? upsellProduct.price : 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Determine items
      const items = [
        {
          productId: product.id,
          variantId: product.variants?.[0]?.id, // Default variant if any
          title: product.name,
          price: product.price,
          quantity: qty,
        },
      ];

      if (upsellAdded && upsellProduct) {
        items.push({
          productId: upsellProduct.id,
          variantId: upsellProduct.variants?.[0]?.id,
          title: upsellProduct.name,
          price: upsellProduct.price,
          quantity: 1,
        });
      }

      // Real API Call to Backend
      // Only works if storeId is available on product (it should be)
      // If CORS is an issue, we might need a proxy in next.config.js, but let's assume same-domain or CORS enabled.
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002"}/api/orders/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            storeId: (product as any).storeId, // Force cast if missing in type definition, checked in next step
            items,
            customer: {
              firstName: fullName.split(" ")[0],
              lastName: fullName.split(" ")[1] || "",
              email: email,
              phone: "08000000000", // Placeholder if not asked
            },
            deliveryMethod: "DELIVERY",
            paymentMethod: "BANK_TRANSFER", // Default for V1
            shippingAddress: {
              recipientName: fullName,
              addressLine1: address,
              city: city,
              addressState: state, // Aligning naming
            },
          }),
        },
      );

      if (res.ok) {
        setStep(2);
        setTimeout(() => onClose(), 5000); // Give more time to read confirmation
      } else {
        alert("Failed to place order. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (step === 2) {
    return (
      <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Order Confirmed!
          </h3>
          <p className="text-gray-500 mb-6">
            We've sent a receipt to <b>{email}</b>. We'll start processing your
            delivery to <b>{city}</b> shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-black/50 backdrop-blur-sm animate-in slide-in-from-right-10 duration-300">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2">
            <ShoppingBag size={20} /> Checkout
          </h2>
          <button onClick={onClose}>
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Order Summary */}
          <div className="mb-8">
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-4">
              Order Summary
            </h3>
            <div className="flex gap-4 mb-4">
              <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                <img
                  src={product.images?.[0]}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm text-gray-900">
                  {product.name}
                </h4>
                <div className="flex justify-between mt-1">
                  <span className="text-sm text-gray-500">Qty: {qty}</span>
                  <span className="font-bold text-sm">
                    ₦{(product.price * qty).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Upsell */}
            {upsellProduct && (
              <div
                className={`border-2 rounded-xl p-4 transition-all ${upsellAdded ? "border-green-500 bg-green-50" : "border-dashed border-gray-300"}`}
              >
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={upsellAdded}
                    onChange={() => setUpsellAdded(!upsellAdded)}
                    className="mt-1 w-5 h-5 rounded text-green-600 focus:ring-green-500"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-sm text-gray-900 block mb-1">
                        One-time Offer: Add {upsellProduct.name}?
                      </span>
                      <span className="font-bold text-sm text-gray-900">
                        {" "}
                        +₦{upsellProduct.price.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">
                      {upsellProduct.description}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form
            id="checkout-form"
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Contact Info
              </label>
              <input
                type="email"
                placeholder="Email Address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-black focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Shipping Address
              </label>
              <input
                type="text"
                placeholder="Full Name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-black focus:outline-none mb-2"
              />
              <input
                type="text"
                placeholder="Street Address"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-black focus:outline-none mb-2"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="City"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-1/2 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-black focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="State"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-1/2 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-black focus:outline-none"
                />
              </div>
            </div>
          </form>
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <span className="font-medium text-gray-600">Total to pay</span>
            <span className="font-black text-2xl text-gray-900">
              ₦{total.toLocaleString()}
            </span>
          </div>
          <button
            form="checkout-form"
            type="submit"
            disabled={loading}
            className="w-full bg-[#111827] text-white font-bold py-4 rounded-xl shadow-lg hover:bg-black transition-all disabled:opacity-50"
          >
            {loading ? "Processing..." : `Pay ₦${total.toLocaleString()}`}
          </button>
          <div className="text-center mt-3 flex items-center justify-center gap-2 text-xs text-gray-400">
            <span>🔒 Secure Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
};
