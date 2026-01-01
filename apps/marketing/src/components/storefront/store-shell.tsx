"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, Button } from "@vayva/ui";

interface StoreShellProps {
  children: React.ReactNode;
  storeName?: string;
  slug?: string;
  plan?: "STARTER" | "GROWTH" | "PRO";
}

export function StoreShell({
  children,
  storeName = "Vayva Store",
  slug = "demo-store",
  plan = "STARTER",
}: StoreShellProps) {
  const pathname = usePathname();
  const isCartOpen = false; // Test state

  return (
    <div className="min-h-screen bg-[#142210] text-white font-sans selection:bg-primary/30 relative">
      {/* Vayva Watermark (Starter Plan Only) */}
      {plan === "STARTER" && (
        <div className="fixed bottom-6 right-6 z-[60] bg-white text-black px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500 hover:scale-105 transition-transform cursor-pointer">
          <svg
            width="18"
            height="18"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 10L50 90L90 10"
              stroke="#059669"
              strokeWidth="15"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 10L35 60"
              stroke="#0B0B0B"
              strokeWidth="18"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#0B0B0B]">
            Powered by Vayva
          </span>
        </div>
      )}

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#142210]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Left: Logo & Name */}
          <Link
            href={`/store/${slug}`}
            className="flex items-center gap-2 shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-black font-bold">
              <svg
                width="14"
                height="14"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 10L50 90L90 10"
                  stroke="black"
                  strokeWidth="20"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="font-bold text-lg tracking-tight hidden md:block">
              {storeName}
            </span>
          </Link>

          {/* Center: Search (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <Icon
              name="Search"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50"
              size={18}
            />
            <input
              className="w-full h-10 bg-white/5 border border-white/10 rounded-full pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors placeholder:text-white/30"
              placeholder="Search products..."
            />
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 md:gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white"
            >
              <Icon name="Search" />
            </Button>
            <Link href={`/store/${slug}/track`}>
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:flex text-white/70 hover:text-white gap-2"
              >
                <Icon name="Truck" size={18} />{" "}
                <span className="text-xs">Track Order</span>
              </Button>
            </Link>
            <Link href={`/store/${slug}/cart`}>
              <Button
                variant="ghost"
                size="icon"
                className="text-white relative"
              >
                <Icon name="ShoppingBag" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-300px)]">{children}</main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#0b141a] pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="font-bold text-white mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>
                <Link
                  href={`/store/${slug}/collections/new`}
                  className="hover:text-white"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  href={`/store/${slug}/collections/best-sellers`}
                  className="hover:text-white"
                >
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link
                  href={`/store/${slug}/collections/all`}
                  className="hover:text-white"
                >
                  All Products
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>
                <Link
                  href={`/store/${slug}/track`}
                  className="hover:text-white"
                >
                  Track Order
                </Link>
              </li>
              <li>
                <Link
                  href={`/store/${slug}/policies/shipping`}
                  className="hover:text-white"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  href={`/store/${slug}/policies/returns`}
                  className="hover:text-white"
                >
                  Returns & Exchanges
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>
                <Link
                  href={`/store/${slug}/policies/privacy`}
                  className="hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href={`/store/${slug}/policies/terms`}
                  className="hover:text-white"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-black font-bold">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 10L50 90L90 10"
                    stroke="#000"
                    strokeWidth="20"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="font-bold text-lg">{storeName}</span>
            </div>
            <p className="text-xs text-text-secondary mb-4">
              Premium shopping experience powered by Vayva AI.
              <br />
              Lagos, Nigeria.
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-white/5 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-xs text-white/30">
          <p>
            &copy; {new Date().getFullYear()} {storeName}. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <svg
              width="12"
              height="12"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 10L50 90L90 10"
                stroke="white"
                strokeWidth="15"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeOpacity="0.4"
              />
            </svg>
            <p className="font-bold uppercase tracking-widest">
              Powered by Vayva
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
