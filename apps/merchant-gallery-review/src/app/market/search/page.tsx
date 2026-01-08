"use client";

import React from "react";
import Link from "next/link";
import { MarketShell } from "@/components/market/market-shell";
import {
  MarketProductCard,
  MarketProduct,
} from "@/components/market/market-product-card";
import { Button, Icon } from "@vayva/ui";

const DEMO_RESULTS: MarketProduct[] = [
  {
    id: "1",
    name: "MacBook Pro M3 Max",
    price: "₦ 3,500,000",
    image: "",
    sellerName: "TechDepot",
    sellerVerified: true,
    inStock: true,
    rating: 4.8,
  },
  {
    id: "3",
    name: 'Samsung 65" 4K TV',
    price: "₦ 850,000",
    image: "",
    sellerName: "GadgetWorld",
    sellerVerified: false,
    inStock: true,
    rating: 4.5,
  },
  {
    id: "5",
    name: "PlayStation 5 Slim",
    price: "₦ 650,000",
    image: "",
    sellerName: "GamingArea",
    sellerVerified: true,
    inStock: true,
    rating: 4.7,
  },
];

export default function MarketSearchPage() {
  return (
    <MarketShell>
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-8">
        <h1 className="text-2xl font-bold text-white mb-8">
          Results for "Electronics"
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters (Desktop) */}
          <div className="hidden lg:block space-y-8">
            <div>
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Icon name="LayoutGrid" size={18} /> Category
              </h3>
              <div className="space-y-2">
                {[
                  "Electronics",
                  "Computing",
                  "Phones",
                  "Gaming",
                  "Accessories",
                ].map((c) => (
                  <div key={c} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={c}
                      className="rounded border-white/20 bg-white/5 accent-primary"
                      defaultChecked={c === "Electronics"}
                    />
                    <label
                      htmlFor={c}
                      className="text-sm text-text-secondary hover:text-white cursor-pointer"
                    >
                      {c}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Icon name="Banknote" size={18} /> Price Range
              </h3>
              <div className="space-y-3">
                <div className="flex gap-2 text-sm">
                  <input
                    className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-white"
                    placeholder="Min"
                  />
                  <span className="text-white/50">-</span>
                  <input
                    className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-white"
                    placeholder="Max"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-white/10 text-white hover:bg-white/5"
                >
                  Apply
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Icon name="MapPin" size={18} /> Location
              </h3>
              <div className="space-y-2">
                {["Lagos", "Abuja", "Port Harcourt"].map((c) => (
                  <div key={c} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={c}
                      className="rounded border-white/20 bg-white/5 accent-primary"
                    />
                    <label
                      htmlFor={c}
                      className="text-sm text-text-secondary hover:text-white cursor-pointer"
                    >
                      {c}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="col-span-1 lg:col-span-3">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {DEMO_RESULTS.map((product) => (
                <MarketProductCard key={product.id} product={product} />
              ))}
            </div>
            {/* Empty state hint */}
            {DEMO_RESULTS.length < 5 && (
              <div className="mt-12 p-8 rounded-xl bg-white/5 border border-white/5 text-center">
                <Icon
                  name="SearchX"
                  size={48}
                  className="mx-auto text-white/20 mb-4"
                />
                <h3 className="font-bold text-white">End of results</h3>
                <p className="text-sm text-text-secondary">
                  Try adjusting your filters or search for something else.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MarketShell>
  );
}
