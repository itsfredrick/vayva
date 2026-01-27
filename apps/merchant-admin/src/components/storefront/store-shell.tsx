"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, Icon } from "@vayva/ui";
import { Logo } from "@/components/Logo";
import { isFreePlan, type StorePlanSlug } from "@/lib/storefront/urls";

interface StoreShellProps {
  children: React.ReactNode;
  storeName?: string;
  slug?: string;
  plan?: StorePlanSlug;
}

export function StoreShell({
  children,
  storeName,
  slug,
  plan,
}: StoreShellProps) {
  const pathname = usePathname();
  // Cart state should be managed by context/parent, not hardcoded
  // const isCartOpen = false;

  const [resolvedStoreName, setResolvedStoreName] = useState<string | undefined>(storeName);
  const [resolvedPlan, setResolvedPlan] = useState<StorePlanSlug>(plan);

  useEffect(() => {
    if (!slug) return;
    if (resolvedStoreName && resolvedPlan) return;

    let cancelled = false;
    fetch(`/api/storefront/${slug}/store`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        if (!resolvedStoreName && data?.name) setResolvedStoreName(data.name);
        if (!resolvedPlan && data?.plan) setResolvedPlan(data.plan);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [slug, resolvedStoreName, resolvedPlan]);

  const showPoweredBy = isFreePlan(resolvedPlan);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 relative">
      {/* Vayva Watermark (Starter Plan Only) */}
      {showPoweredBy && (
        <div className="fixed bottom-6 right-6 z-[60] bg-card text-card-foreground px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-border animate-in fade-in slide-in-from-bottom-4 duration-500 hover:scale-105 transition-transform cursor-pointer">
          <Image
            src="/vayva-logo-official.svg"
            alt="Vayva"
            width={18}
            height={18}
            className="object-contain"
          />
          <span className="text-[10px] font-black uppercase tracking-widest">
            Powered by Vayva
          </span>
        </div>
      )}

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Left: Logo & Name */}
          <div className="flex items-center gap-2 shrink-0">
            <Logo href={`/store/${slug}`} size="sm" showText={false} />
            <span className="font-bold text-lg tracking-tight hidden md:block">
              {resolvedStoreName}
            </span>
          </div>

          {/* Center: Search (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <Icon
              name="Search"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <input
              className="w-full h-10 bg-muted border border-border rounded-full pl-10 pr-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground"
              placeholder="Search products..."
            />
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 md:gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
            >
              <Icon name="Search" />
            </Button>
            <Link href={`/store/${slug}/track`}>
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:flex text-muted-foreground hover:text-foreground gap-2"
              >
                <Icon name="Truck" size={18} />{" "}
                <span className="text-xs">Track Order</span>
              </Button>
            </Link>
            <Link href={`/store/${slug}/cart`}>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
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
      <footer className="border-t border-border/40 bg-muted pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="font-bold text-foreground mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>
                <Link
                  href={`/store/${slug}/collections/new`}
                  className="hover:text-foreground"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  href={`/store/${slug}/collections/best-sellers`}
                  className="hover:text-foreground"
                >
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link
                  href={`/store/${slug}/collections/all`}
                  className="hover:text-foreground"
                >
                  All Products
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-foreground mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>
                <Link
                  href={`/store/${slug}/track`}
                  className="hover:text-foreground"
                >
                  Track Order
                </Link>
              </li>
              <li>
                <Link
                  href={`/store/${slug}/policies/shipping`}
                  className="hover:text-foreground"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  href={`/store/${slug}/policies/returns`}
                  className="hover:text-foreground"
                >
                  Returns & Exchanges
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>
                <Link
                  href={`/store/${slug}/policies/privacy`}
                  className="hover:text-foreground"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href={`/store/${slug}/policies/terms`}
                  className="hover:text-foreground"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/vayva-logo-official.svg"
                alt="Vayva"
                width={32}
                height={32}
                className="object-contain"
              />
              <span className="font-bold text-lg text-foreground">{resolvedStoreName}</span>
            </div>
            <p className="text-xs text-text-secondary mb-4">
              Premium shopping experience.
              <br />
              Lagos, Nigeria.
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-border/40 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} {resolvedStoreName}. All rights reserved.
          </p>
          {showPoweredBy && (
            <div className="flex items-center gap-2">
              <Image
                src="/vayva-logo-official.svg"
                alt="Vayva"
                width={12}
                height={12}
                className="object-contain opacity-70"
              />
              <p className="font-bold uppercase tracking-widest text-muted-foreground">
                Powered by Vayva
              </p>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
