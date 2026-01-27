"use client";

import React from "react";
import Link from "next/link";
import { Button, Icon } from "@vayva/ui";
import { Logo } from "@/components/Logo";

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = React.use(params);
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Simple Checkout Header */}
      <header className="border-b border-border bg-background">
        <div className="max-w-5xl mx-auto px-4 h-20 flex items-center justify-between">
          <Logo href={`/store/${slug}`} size="sm" showText />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="Lock" size={14} /> Secure Checkout
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left: Form */}
        <div className="space-y-8">
          {/* Contact */}
          <section>
            <h2 className="font-bold text-foreground text-lg mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">
                1
              </span>
              Contact Info
            </h2>
            <div className="space-y-4">
              <input
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary placeholder:text-muted-foreground/70"
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
                  className="text-xs text-muted-foreground cursor-pointer"
                >
                  Email me with news and offers
                </label>
              </div>
            </div>
          </section>

          {/* Delivery */}
          <section>
            <h2 className="font-bold text-foreground text-lg mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">
                2
              </span>
              Delivery Address
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                className="col-span-2 bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary placeholder:text-muted-foreground/70"
                placeholder="Full name"
              />
              <input
                className="col-span-2 bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary placeholder:text-muted-foreground/70"
                placeholder="Address"
              />
              <input
                className="bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary placeholder:text-muted-foreground/70"
                placeholder="City"
              />
              <select className="bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary text-muted-foreground">
                <option>Lagos</option>
                <option>Abuja</option>
              </select>
              <input
                className="col-span-2 bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary placeholder:text-muted-foreground/70"
                placeholder="Phone (+234...)"
              />
            </div>
          </section>

          {/* Payment */}
          <section>
            <h2 className="font-bold text-foreground text-lg mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">
                3
              </span>
              Payment
            </h2>
            <div className="p-4 rounded-xl border border-border bg-muted text-center space-y-3">
              <Icon
                name="CreditCard"
                size={32}
                className="mx-auto text-muted-foreground"
              />
              <p className="text-sm text-muted-foreground">
                After clicking "Pay Now", you will be redirected to Paystack to
                complete your purchase securely.
              </p>
            </div>
          </section>

          <Link href={`/store/${slug}/order-confirmation`}>
            <Button
              size="lg"
              className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold h-12"
            >
              Pay Now ₦ 24,000
            </Button>
          </Link>
        </div>

        {/* Right: Summary */}
        <div className="bg-card rounded-2xl p-6 h-fit border border-border">
          <h3 className="font-bold text-foreground mb-6">Order Summary</h3>
          <div className="space-y-4 mb-6 border-b border-border pb-6 max-h-[300px] overflow-y-auto">
            {[1, 2].map((item: any) => (
              <div key={item} className="flex gap-4">
                <div className="w-16 h-16 bg-muted rounded-lg border border-border relative">
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-muted rounded-full flex items-center justify-center text-[10px] font-bold text-foreground">
                    1
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-foreground">
                    Premium Cotton Tee
                  </h4>
                  <p className="text-xs text-muted-foreground">M / Black</p>
                </div>
                <div className="text-sm font-bold text-foreground">₦ 12,000</div>
              </div>
            ))}
          </div>
          <div className="space-y-2 mb-6 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground">₦ 24,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-foreground">Free</span>
            </div>
          </div>
          <div className="flex justify-between items-center border-t border-border pt-4">
            <span className="font-bold text-foreground">Total</span>
            <span className="text-2xl font-bold text-foreground">₦ 24,000</span>
          </div>
        </div>
      </main>
    </div>
  );
}
