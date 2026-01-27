"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  ArrowRight,
  Zap,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { Button } from "@vayva/ui";
import { BrandLogo } from "@/components/BrandLogo";

export default function MarketplaceHome(): React.JSX.Element {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState("buying");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone, interest }),
      });
      if (res.ok) {
        setSuccess(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <BrandLogo priority className="h-7" />
        </div>
        <Link
          href="/"
          className="text-sm font-medium hover:opacity-70 transition-opacity flex items-center gap-1"
        >
          Back to Marketplace <ArrowRight size={14} />
        </Link>
      </header>

      {/* Hero Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-20 text-center max-w-4xl mx-auto w-full">
        <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold uppercase tracking-wider text-gray-600">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          Coming Soon
        </div>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
          The Marketplace <br className="hidden md:block" /> Built for AI
          Commerce.
        </h1>

        <p className="text-lg md:text-xl text-gray-500 max-w-2xl mb-12 leading-relaxed">
          Sell faster. Experience a Jiji-style marketplace powered by
          automated AI agents that handle inquiries, negotiations, and sales for
          you 24/7.
        </p>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mb-16 text-left">
          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center mb-4 shadow-sm">
              <Zap size={20} />
            </div>
            <h3 className="font-bold mb-2">AI Negotiations</h3>
            <p className="text-sm text-gray-500">
              Our agents handle price haggling and Q&A so you don't have to.
            </p>
          </div>
          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center mb-4 shadow-sm">
              <ShoppingBag size={20} />
            </div>
            <h3 className="font-bold mb-2">Unified Inventory</h3>
            <p className="text-sm text-gray-500">
              Sync products from your storefront instantly.
            </p>
          </div>
          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center mb-4 shadow-sm">
              <CheckCircle size={20} />
            </div>
            <h3 className="font-bold mb-2">Verified Trust</h3>
            <p className="text-sm text-gray-500">
              KYC-verified merchants and secure escrow payments.
            </p>
          </div>
        </div>

        {/* Waitlist Section */}
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-xl shadow-gray-100">
          {success ? (
            <div className="text-center py-10">
              <div className="mx-auto w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-2">You're on the list!</h3>
              <p className="text-gray-500 mb-6">
                We'll notify you as soon as the marketplace launches.
              </p>
              <Link href="/">
                <Button className="w-full py-3 font-bold rounded-lg">
                  Return to Marketplace
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="text-left space-y-4">
              <h3 className="text-xl font-bold mb-1">Join the Waitlist</h3>
              <p className="text-sm text-gray-500 mb-4">
                Be the first to know when we launch.
              </p>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="+234..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="interest" className="block text-xs font-bold uppercase text-gray-500 mb-1">
                  I am interested in
                </label>
                <select
                  id="interest"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                >
                  <option value="buying">Buying Products</option>
                  <option value="selling">Selling Products</option>
                  <option value="both">Both</option>
                </select>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-3 font-bold rounded-lg flex items-center justify-center gap-2 mt-2"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? "Joining..." : "Join Waitlist"}
              </Button>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-gray-400 border-t border-gray-100 w-full">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} Marketplace. All rights reserved.</p>
          <div className="flex gap-6">
            <Link
              href="/legal/privacy"
              className="hover:text-gray-600 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/legal/terms"
              className="hover:text-gray-600 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
