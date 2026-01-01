"use client";

import React from "react";
import Link from "next/link";
import { Button, Icon } from "@vayva/ui";

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = React.use(params);
  return (
    <div className="min-h-screen bg-[#142210] text-white">
      {/* Simple Checkout Header */}
      <header className="border-b border-white/5 bg-[#142210]">
        <div className="max-w-5xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link href={`/store/${slug}`} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-black font-bold">
              V
            </div>
            <span className="font-bold text-lg hidden md:block">
              Vayva Store
            </span>
          </Link>
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Icon name="Lock" size={14} /> Secure Checkout
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left: Form */}
        <div className="space-y-8">
          {/* Contact */}
          <section>
            <h2 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">
                1
              </span>
              Contact Info
            </h2>
            <div className="space-y-4">
              <input
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary placeholder:text-text-secondary/50"
                placeholder="Email address"
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="news"
                  className="accent-primary"
                  defaultChecked
                />
                <label
                  htmlFor="news"
                  className="text-xs text-text-secondary cursor-pointer"
                >
                  Email me with news and offers
                </label>
              </div>
            </div>
          </section>

          {/* Delivery */}
          <section>
            <h2 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">
                2
              </span>
              Delivery Address
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                className="col-span-2 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary placeholder:text-text-secondary/50"
                placeholder="Full name"
              />
              <input
                className="col-span-2 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary placeholder:text-text-secondary/50"
                placeholder="Address"
              />
              <input
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary placeholder:text-text-secondary/50"
                placeholder="City"
              />
              <select className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary text-text-secondary">
                <option>Lagos</option>
                <option>Abuja</option>
              </select>
              <input
                className="col-span-2 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary placeholder:text-text-secondary/50"
                placeholder="Phone (+234...)"
              />
            </div>
          </section>

          {/* Payment */}
          <section>
            <h2 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">
                3
              </span>
              Payment
            </h2>
            <div className="p-4 rounded-xl border border-white/10 bg-white/5 text-center space-y-3">
              <Icon
                name="CreditCard"
                size={32}
                className="mx-auto text-white/50"
              />
              <p className="text-sm text-text-secondary">
                After clicking "Pay Now", you will be redirected to Paystack to
                complete your purchase securely.
              </p>
            </div>
          </section>

          <Link href={`/store/${slug}/order-confirmation`}>
            <Button
              size="lg"
              className="w-full rounded-full bg-primary text-black hover:bg-primary/90 font-bold h-12"
            >
              Pay Now ₦ 24,000
            </Button>
          </Link>
        </div>

        {/* Right: Summary */}
        <div className="bg-white/5 rounded-2xl p-6 h-fit border border-white/5">
          <h3 className="font-bold text-white mb-6">Order Summary</h3>
          <div className="space-y-4 mb-6 border-b border-white/10 pb-6 max-h-[300px] overflow-y-auto">
            {[1, 2].map((item) => (
              <div key={item} className="flex gap-4">
                <div className="w-16 h-16 bg-white/5 rounded-lg border border-white/5 relative">
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                    1
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-white">
                    Premium Cotton Tee
                  </h4>
                  <p className="text-xs text-text-secondary">M / Black</p>
                </div>
                <div className="text-sm font-bold text-white">₦ 12,000</div>
              </div>
            ))}
          </div>
          <div className="space-y-2 mb-6 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">Subtotal</span>
              <span className="text-white">₦ 24,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Shipping</span>
              <span className="text-white">Free</span>
            </div>
          </div>
          <div className="flex justify-between items-center border-t border-white/10 pt-4">
            <span className="font-bold text-white">Total</span>
            <span className="text-2xl font-bold text-white">₦ 24,000</span>
          </div>
        </div>
      </main>
    </div>
  );
}
