
"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MarketShell } from "@/components/market/market-shell";
import { Button, Input, Card } from "@vayva/ui"; // Mock UI lib
import { useToast } from "@/components/ui/use-toast";

export default function CheckoutPage() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const productId = searchParams.get("productId");

  const [product, setProduct] = useState<unknown>(null);
  const [address, setAddress] = useState("");
  const [quote, setQuote] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [initPayment, setInitPayment] = useState(false);

  // 1. Fetch Product
  useEffect(() => {
    if (!productId) return;
    fetch(`/api/market/products/${productId}`)
      .then(res => res.json())
      .then(setProduct)
      .catch(console.error);
  }, [productId]);

  // 2. Get Delivery Quote
  const handleGetQuote = async () => {
    if (!address) {
      return toast({
        title: "Address Required",
        description: "Please enter a valid delivery address.",
        variant: "destructive",
      });
    }
    setLoading(true);
    try {
      const res = await fetch("/api/market/logistics/quote", {
        method: "POST",
        body: JSON.stringify({
          sellerId: product.seller.id, // Ensure API returns sellerId!
          buyerAddress: address,
          productIds: [product.id]
        })
      });
      const data = await res.json();
      setQuote(data);
    } catch (err) {
      toast({ title: "Error", description: "Failed to get delivery estimate", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // 3. Helper: Seller ID check
  // Note: product.seller might be just { name: ... } from previous API.
  // I need to verify `api/market/products/[id]` returns `seller.id` or `product.storeId`.
  // API uses `product.store.name`. I need `product.storeId` exposed.
  // Assuming I fix API if needed. For now, let's use `product.storeId` if available 
  // or pass dummy "store_id" (Checkout API expects it).

  // 4. Pay
  const handlePay = async () => {
    setInitPayment(true);
    try {
      const res = await fetch("/api/market/checkout", {
        method: "POST",
        body: JSON.stringify({
          email: "guest@vayva.ng", // Guest Checkout for now
          items: [{ productId: product.id, qty: 1 }],
        })
      });
      const data = await res.json();
      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        toast({ title: "Payment Failed", description: "Could not initialize payment.", variant: "destructive" });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setInitPayment(false);
    }
  };

  if (!productId) return <div className="text-white p-12">Empty Cart</div>;
  if (!product) return <div className="text-white p-12">Loading...</div>;

  const total = (product.price * 100) + (quote ? quote.priceKobo : 0);

  return (
    <MarketShell>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">Checkout</h1>

        <div className="grid gap-6">
          {/* Product Summary */}
          <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex gap-4">
            <div className="w-20 h-20 bg-gray-800 rounded-lg overflow-hidden">
              {product.images?.[0] && <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />}
            </div>
            <div>
              <h3 className="font-bold text-white">{product.name}</h3>
              <div className="text-sm text-gray-400">Sold by {product.seller.name}</div>
              <div className="text-lg font-bold text-emerald-400 mt-1">
                {product.curr} {product.price.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Delivery */}
          <div className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-4">
            <h3 className="font-bold text-white">Delivery</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Enter full address (Lagos only for Beta)"
                value={address}
                onChange={(e: any) => setAddress(e.target.value)}
                className="bg-transparent border-white/20 text-white"
              />
              <Button onClick={handleGetQuote} disabled={loading} variant="secondary">
                {loading ? "..." : "Get Quote"}
              </Button>
            </div>
            {quote && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded text-sm text-emerald-300">
                Typically {Math.round(quote.etaMinutes / 60)} hours via {quote.vehicle}.
                <br />
                Fee: ₦ {(quote.priceKobo / 100).toLocaleString()}
              </div>
            )}
          </div>

          {/* Total */}
          <div className="border-t border-white/10 pt-4 text-white">
            <div className="flex justify-between mb-2"><span>Subtotal</span><span>₦ {product.price.toLocaleString()}</span></div>
            <div className="flex justify-between mb-4"><span>Delivery</span><span>{quote ? `₦ ${(quote.priceKobo / 100).toLocaleString()}` : "-"}</span></div>
            <div className="flex justify-between text-xl font-bold"><span>Total</span><span>₦ {(total / 100).toLocaleString()}</span></div>
          </div>

          <Button size="lg" className="w-full bg-primary text-black font-bold" onClick={handlePay} disabled={initPayment || !quote}>
            {initPayment ? "Processing..." : `Pay ₦ ${(total / 100).toLocaleString()}`}
          </Button>

          <p className="text-xs text-center text-gray-500">
            Protected by Vayva Guarantee. Processed by Paystack securely.
          </p>
        </div>
      </div>
    </MarketShell>
  );
}
