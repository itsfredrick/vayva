"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button, cn } from "@vayva/ui";
import type { SearchResult } from "@vayva/shared";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { ProductCardSkeleton } from "@/components/marketplace/ProductCardSkeleton";

export interface HomeProductModuleProps {
  title: string;
  subtitle?: string;
  href?: string;
  query?: string;
  category?: string;
  chinaBulk?: boolean;
  verifiedOnly?: boolean;
  sort?: "new" | "price_asc" | "price_desc";
  limit?: number;
  className?: string;
}

export function HomeProductModule({
  title,
  subtitle,
  href,
  query,
  category,
  chinaBulk,
  verifiedOnly,
  sort = "new",
  limit = 12,
  className,
}: HomeProductModuleProps): React.JSX.Element {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<SearchResult[]>([]);

  const requestUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (category && category !== "All") params.set("category", category);
    if (chinaBulk) params.set("chinaBulk", "true");
    if (verifiedOnly) params.set("verified", "true");
    if (sort && sort !== "new") params.set("sort", sort);
    params.set("page", "1");
    params.set("limit", String(limit));
    return `/api/search?${params.toString()}`;
  }, [category, chinaBulk, limit, query, sort, verifiedOnly]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      try {
        const res = await fetch(requestUrl);
        const payload = await res.json();
        const nextResults = (payload?.data?.results ?? payload?.results ?? []) as SearchResult[];
        if (!cancelled) setItems(nextResults);
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [requestUrl]);

  return (
    <section className={cn("space-y-3", className)}>
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <div className="text-lg font-extrabold text-gray-900 leading-tight">{title}</div>
          {subtitle ? (
            <div className="text-xs text-gray-500 mt-1">{subtitle}</div>
          ) : null}
        </div>
        {href ? (
          <a href={href} className="shrink-0">
            <Button variant="ghost" className="h-9 px-3 text-xs font-bold">
              See all
            </Button>
          </a>
        ) : null}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3">
          {Array.from({ length: limit }).map((_, i) => (
            <ProductCardSkeleton key={i} className="rounded-xl overflow-hidden" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3">
          {items.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
