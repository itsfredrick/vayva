import React, { useState } from "react";
import { CartItem } from "@/hooks/storefront/useStorefrontCart";
import { Modal } from "@vayva/ui";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  total: number;
  storeSlug: string;
  onSuccess: () => void;
}

export function CheckoutModal({
  isOpen,
  onClose,
  cart,
  total,
  storeSlug,
  onSuccess,
}: CheckoutModalProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(`/api/storefront/${storeSlug}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: formData,
          items: cart,
          total,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Checkout failed");

      if (data.authorization_url) {
        toast.loading("Redirecting to secure payment...", { duration: 4000 });
        // Delay slightly to show toast
        setTimeout(() => {
          window.location.href = data.authorization_url;
        }, 1000);
      } else {
        // Fallback for non-payment orders
        toast.success("Order placed successfully!");
        onSuccess();
        onClose();
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to process order");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Checkout (₦${total.toLocaleString()})`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Contact Info</label>
          <input
            required
            type="text"
            placeholder="Full Name"
            className="w-full p-2 border rounded-md"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              required
              type="email"
              placeholder="Email"
              className="w-full p-2 border rounded-md"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <input
              required
              type="tel"
              placeholder="Phone"
              className="w-full p-2 border rounded-md"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Delivery Address</label>
          <input
            required
            type="text"
            placeholder="Address Line"
            className="w-full p-2 border rounded-md"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />
          <input
            required
            type="text"
            placeholder="City"
            className="w-full p-2 border rounded-md"
            value={formData.city}
            onChange={(e) =>
              setFormData({ ...formData, city: e.target.value })
            }
          />
        </div>

        <div className="pt-4 border-t border-gray-100">
          <div className="flex justify-between mb-4 text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span>₦{total.toLocaleString()}</span>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : null}
            Pay ₦{total.toLocaleString()}
          </button>
        </div>
      </form>
    </Modal>
  );
}
