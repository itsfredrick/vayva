
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MarketShell } from "@/components/market/market-shell"; // Ensure this exists or imports correct shell
import { Icon, Button } from "@vayva/ui"; // Assume UI lib

interface MarketProduct {
  id: string;
  name: string;
  condition: string;
  curr: string;
  price: number;
  images: string[];
  warranty?: string;
  desc: string;
  seller: {
    id: string;
    name: string;
    logo?: string;
    verified: boolean;
    location: string;
  };
  specs?: Record<string, string>;
}

export default function MarketProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<MarketProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/market/products/${params.id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
      } catch (err: any) {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    }
    if (params.id) load();
  }, [params.id]);

  if (loading) return <MarketShell><div className="p-12 text-center text-white">Loading...</div></MarketShell>;
  if (error || !product) return <MarketShell><div className="p-12 text-center text-red-400">{error}</div></MarketShell>;

  return (
    <MarketShell>
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/market" className="hover:text-white">Market</Link>
          <span>/</span>
          <span className="text-white">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Left: Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-800 rounded-2xl overflow-hidden border border-white/10 relative">
              {/* Condition Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${product.condition === 'NEW' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                  'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  }`}>
                  {product.condition}
                </span>
              </div>

              {product.images?.[0] ? (
                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600">No Image</div>
              )}
            </div>
          </div>

          {/* Right: Details */}
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{product.name}</h1>
            <div className="flex items-center gap-4 mb-6">
              <div className="text-2xl font-bold text-emerald-400">
                {product.curr} {product.price.toLocaleString()}
              </div>
              {product.warranty && (
                <div className="flex items-center gap-1 text-xs text-blue-300 bg-blue-500/10 px-2 py-1 rounded">
                  <Icon name="ShieldCheck" size={14} />
                  {product.warranty}
                </div>
              )}
            </div>

            {/* Seller Card */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  {product.seller.logo ? <img src={product.seller.logo} className="w-full h-full rounded-full" /> : product.seller.name[0]}
                </div>
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-1">
                    {product.seller.name}
                    {product.seller.verified && <Icon name="BadgeCheck" size={14} className="text-blue-400" />}
                  </div>
                  <div className="text-xs text-gray-400">{product.seller.location}</div>
                </div>
              </div>
              <Button variant="outline" size="sm">View Store</Button>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-12">
              <Button size="lg" className="w-full bg-primary text-black hover:bg-primary/90 font-bold">
                Add to Cart
              </Button>
              <Button size="lg" variant="outline" className="w-full">
                Make Offer
              </Button>
            </div>

            {/* Tech Specs Table */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="border-t border-white/10 pt-8">
                <h3 className="text-lg font-bold text-white mb-4">Technical Specifications</h3>
                <div className="grid grid-cols-1 gap-y-2">
                  {Object.entries(product.specs).map(([key, val]: [string, string]) => (
                    <div key={key} className="grid grid-cols-2 py-2 border-b border-white/5">
                      <div className="text-sm text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                      <div className="text-sm text-white font-medium">{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="mt-8">
              <h3 className="text-lg font-bold text-white mb-2">Description</h3>
              <p className="text-gray-400 leading-relaxed text-sm">{product.desc}</p>
            </div>

          </div>
        </div>
      </div>
    </MarketShell>
  );
}
