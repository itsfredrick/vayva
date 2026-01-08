"use client";

import React from "react";
import Link from "next/link";
import { MarketShell } from "@/components/market/market-shell";
import {
  MarketProductCard,
  MarketProduct,
} from "@/components/market/market-product-card";
import { Button, Icon } from "@vayva/ui";

const CATEGORIES = [
  { name: "Fashion", icon: "Shirt", count: "2.5k" },
  { name: "Electronics", icon: "Monitor", count: "1.2k" },
  { name: "Beauty", icon: "Sparkles", count: "850" },
  { name: "Home", icon: "Armchair", count: "3.4k" },
  { name: "Groceries", icon: "ShoppingCart", count: "500+" },
  { name: "Phones", icon: "Smartphone", count: "900+" },
  { name: "Services", icon: "PenTool", count: "120" },
  { name: "More", icon: "LayoutGrid", count: "View all" },
];

const DEMO_PRODUCTS: MarketProduct[] = [
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
    id: "2",
    name: "Nike Air Jordan 1 High",
    price: "₦ 180,000",
    image: "",
    sellerName: "KicksLagos",
    sellerVerified: true,
    inStock: true,
    rating: 4.9,
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
    id: "4",
    name: "Gucci Marmont Bag",
    price: "₦ 1,200,000",
    image: "",
    sellerName: "LuxuryHub",
    sellerVerified: true,
    inStock: false,
    rating: 5.0,
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

const FEATURED_SELLERS = [
  { name: "TechDepot", cat: "Electronics", logo: "T", verified: true },
  { name: "KicksLagos", cat: "Fashion", logo: "K", verified: true },
  { name: "OrganicLife", cat: "Groceries", logo: "O", verified: false },
  { name: "LuxuryHub", cat: "Fashion", logo: "L", verified: true },
];

export default function MarketHomePage() {
  return (
    <MarketShell>
      {/* Hero Discovery */}
      <section className="relative h-[400px] mb-12">
        <div className="absolute inset-0 bg-[#0f1a14] overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen opacity-30" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px] mix-blend-screen opacity-30" />
        </div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Discover Verified Sellers <br />{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">
              in Nigeria.
            </span>
          </h1>

          <div className="w-full max-w-2xl relative mb-8">
            <input
              className="w-full h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-full pl-6 pr-14 text-lg text-white placeholder:text-white/40 focus:outline-none focus:border-primary focus:bg-white/15 transition-all shadow-2xl"
              placeholder="What are you looking for today?"
            />
            <button className="absolute right-2 top-2 h-10 w-10 bg-primary rounded-full flex items-center justify-center text-black hover:bg-primary/90 transition-colors">
              <Icon name="Search" size={24} />
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {["Fashion", "Sneakers", "iPhone 15", "Skincare", "Lagos"].map(
              (tag) => (
                <Link
                  href="/market/search"
                  key={tag}
                  className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                >
                  {tag}
                </Link>
              ),
            )}
          </div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 lg:px-6 space-y-20 pb-12">
        {/* Categories */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold text-white">Shop by Category</h2>
            <Link
              href="/market/categories/all"
              className="text-primary hover:text-primary/80 font-bold text-sm flex items-center gap-1"
            >
              View All <Icon name="ArrowRight" size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                href={`/market/categories/${cat.name.toLowerCase()}`}
                key={cat.name}
              >
                <div className="group bg-white/5 rounded-xl p-4 border border-white/5 hover:border-primary/50 hover:bg-white/10 transition-all text-center h-full flex flex-col items-center justify-center gap-3">
                  <Icon
                    name={cat.icon as any}
                    size={32}
                    className="text-text-secondary group-hover:text-primary transition-colors"
                  />
                  <div>
                    <div className="font-bold text-white text-sm">
                      {cat.name}
                    </div>
                    <div className="text-[10px] text-text-secondary mt-1">
                      {cat.count}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold text-white">Trending on Vayva</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {DEMO_PRODUCTS.map((product) => (
              <MarketProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Featured Sellers */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold text-white">Top Sellers</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {FEATURED_SELLERS.map((seller) => (
              <Link
                href={`/market/sellers/${seller.name.toLowerCase()}`}
                key={seller.name}
              >
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group cursor-pointer">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white shadow-lg">
                    {seller.logo}
                  </div>
                  <div>
                    <div className="flex items-center gap-1 font-bold text-white group-hover:text-primary transition-colors">
                      {seller.name}
                      {seller.verified && (
                        <Icon
                          name="ShieldCheck"
                          size={16}
                          className="text-blue-400"
                        />
                      )}
                    </div>
                    <div className="text-sm text-text-secondary">
                      {seller.cat}
                    </div>
                  </div>
                  <Icon
                    name="ChevronRight"
                    className="ml-auto text-white/20 group-hover:text-white"
                  />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Trust Strip */}
        <section className="bg-gradient-to-r from-[#0f1a14] to-[#142210] rounded-2xl border border-white/5 p-8 flex flex-col md:flex-row justify-around gap-8 md:gap-0">
          {[
            {
              icon: "Lock",
              title: "Secure Payments",
              desc: "Your money is safe until delivery.",
            },
            {
              icon: "ShieldCheck",
              title: "Verified Sellers",
              desc: "We verify businesses for your safety.",
            },
            {
              icon: "Headphones",
              title: "Vayva Support",
              desc: "24/7 support via WhatsApp.",
            },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Icon name={item.icon as any} size={24} />
              </div>
              <div>
                <h3 className="font-bold text-white">{item.title}</h3>
                <p className="text-sm text-text-secondary">{item.desc}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </MarketShell>
  );
}
