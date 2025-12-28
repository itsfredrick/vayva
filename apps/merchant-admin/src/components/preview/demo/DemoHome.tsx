import React from "react";
import type { DemoStore } from "@/lib/preview/demo-data";

export function DemoHome({ demo }: { demo: DemoStore }) {
    const featured = demo.products.slice(0, 6);

    return (
        <div className="mx-auto max-w-6xl px-4 py-10">
            <div className="rounded-2xl border bg-white p-8 shadow-sm">
                <div className="text-2xl font-semibold text-gray-900">{demo.storeName}</div>
                <div className="mt-2 text-sm text-gray-500">
                    Live preview demo storefront. Buttons are non-functional in preview mode.
                </div>

                <div className="mt-8 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {featured.map((p) => (
                        <div key={p.id} className="rounded-xl border p-4 bg-white">
                            <div className="overflow-hidden rounded-lg border bg-gray-50">
                                <img src={p.image} alt={p.name} className="h-36 w-full object-cover" />
                            </div>
                            <div className="mt-3 text-sm font-medium text-gray-900">{p.name}</div>
                            <div className="mt-1 text-xs text-gray-500">₦{p.price.toLocaleString()}</div>
                            <button
                                type="button"
                                className="mt-3 w-full rounded-lg bg-black px-3 py-2 text-sm text-white hover:opacity-90"
                            >
                                Add to cart (preview)
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
