"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Input } from "@vayva/ui";
import { BrandLogo } from "@/components/BrandLogo";

type AliExpressSearchItem = {
  id: string;
  title: string;
  productUrl: string;
  imageUrl: string;
  currency: string;
  price: number;
  originalPrice?: number;
  orders?: number;
  rating?: number;
  shippingPrice?: number;
};

type AliExpressSearchResponse = {
  items: AliExpressSearchItem[];
  page: number;
  limit: number;
  hasMore: boolean;
};

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
  meta?: Record<string, unknown>;
};

function formatMoney(currency: string, amount: number): string {
  const rounded = Math.round(amount * 100) / 100;
  if (currency === "USD") return `$${rounded.toLocaleString()}`;
  if (currency === "NGN") return `₦${rounded.toLocaleString()}`;
  return `${currency} ${rounded.toLocaleString()}`;
}

function ChinaBulkContent(): React.JSX.Element {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [items, setItems] = useState<AliExpressSearchItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const debouncedQuery = useMemo(() => query.trim(), [query]);

  useEffect(() => {
    const next = new URLSearchParams(searchParams.toString());
    if (query) next.set("q", query);
    else next.delete("q");
    router.replace(`/china-bulk?${next.toString()}`);
  }, [query, router, searchParams]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!debouncedQuery) {
        setItems([]);
        setConfigured(null);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `/api/china/aliexpress/search?q=${encodeURIComponent(debouncedQuery)}&page=1&limit=20`,
        );
        const payload = (await res.json()) as ApiResponse<AliExpressSearchResponse>;

        if (cancelled) return;

        if (!payload.success) {
          if (payload.error?.code === "NOT_CONFIGURED") {
            setConfigured(false);
            setItems([]);
            return;
          }
          setConfigured(true);
          setError(payload.error?.message || "Search failed");
          setItems([]);
          return;
        }

        setConfigured(true);
        setItems(payload.data?.items || []);
      } catch {
        if (cancelled) return;
        setConfigured(true);
        setError("Search failed");
        setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const t = setTimeout(run, 300);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [debouncedQuery]);

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b bg-white">
        <div className="container mx-auto max-w-5xl px-4 py-6">
          <div className="flex items-center gap-3">
            <BrandLogo className="h-6" />
            <div className="text-2xl font-extrabold text-gray-900">China Bulk</div>
          </div>
          <div className="mt-1 text-sm text-gray-600">
            Search AliExpress catalog (affiliate) or submit a sourcing request for wholesale quotes.
          </div>

          <div className="mt-5 flex gap-3">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products (e.g. solar lamp, phone case, sneakers)"
              className="h-12"
            />
            <Button
              className="h-12 px-5 font-extrabold"
              onClick={() => router.push("/sourcing/request")}
              variant="outline"
              type="button"
            >
              Request Quote
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 py-8">
        {configured === false ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="text-lg font-extrabold text-gray-900">AliExpress catalog not configured</div>
            <div className="mt-2 text-sm text-gray-600">
              You can still use China Bulk by submitting a request. Once AliExpress keys are added, catalog search will appear here.
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button className="h-11 px-6 font-extrabold" onClick={() => router.push("/sourcing/request")}>
                Create sourcing request
              </Button>
              <Link
                href="/search?chinaBulk=true"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-gray-200 bg-white px-6 text-sm font-bold text-gray-900 hover:bg-gray-100"
              >
                Browse China Bulk suppliers
              </Link>
            </div>
          </div>
        ) : null}

        {error ? (
          <div className="mb-6 rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-800">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 12 }).map((_, idx) => (
              <div key={idx} className="rounded-xl border border-gray-100 bg-white p-3">
                <div className="aspect-[4/3] w-full rounded-lg bg-gray-100" />
                <div className="mt-3 h-3 w-3/4 rounded bg-gray-100" />
                <div className="mt-2 h-4 w-1/2 rounded bg-gray-100" />
              </div>
            ))}
          </div>
        ) : null}

        {!loading && configured !== false && items.length === 0 && debouncedQuery ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="text-sm font-bold text-gray-900">No results yet</div>
            <div className="mt-1 text-sm text-gray-600">
              Try a different keyword or submit a sourcing request for factory/wholesale quotes.
            </div>
            <div className="mt-4">
              <Button className="h-11 px-6 font-extrabold" onClick={() => router.push("/sourcing/request")}
                type="button">
                Request a quote
              </Button>
            </div>
          </div>
        ) : null}

        {!loading && items.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {items.map((item) => (
              <a
                key={item.id}
                href={item.productUrl}
                target="_blank"
                rel="noreferrer"
                className="group block overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-[4/3] bg-gray-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>
                <div className="p-3">
                  <div className="line-clamp-2 text-sm font-medium text-gray-900 group-hover:text-primary">
                    {item.title}
                  </div>
                  <div className="mt-2 text-base font-extrabold text-primary">
                    {formatMoney(item.currency, item.price)}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-gray-500">
                    {typeof item.orders === "number" ? (
                      <span className="rounded-full bg-gray-100 px-2 py-1">{item.orders.toLocaleString()} orders</span>
                    ) : null}
                    {typeof item.rating === "number" ? (
                      <span className="rounded-full bg-gray-100 px-2 py-1">{item.rating.toFixed(1)} rating</span>
                    ) : null}
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : null}

        {!debouncedQuery ? (
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="text-sm font-extrabold text-gray-900">Wholesale-first flow</div>
              <div className="mt-2 text-sm text-gray-600">
                If you need MOQ pricing, factory options, or consolidated shipping, use Request Quote.
              </div>
              <div className="mt-4">
                <Button className="h-11 px-6 font-extrabold" onClick={() => router.push("/sourcing/request")}
                  type="button">
                  Request a quote
                </Button>
              </div>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="text-sm font-extrabold text-gray-900">Browse local + import suppliers</div>
              <div className="mt-2 text-sm text-gray-600">
                Use China Bulk filter on search to browse suppliers tagged for import.
              </div>
              <div className="mt-4">
                <Link
                  href="/search?chinaBulk=true"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-extrabold text-white glow-primary"
                >
                  Browse China Bulk
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function ChinaBulkPage(): React.JSX.Element {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    }>
      <ChinaBulkContent />
    </Suspense>
  );
}
