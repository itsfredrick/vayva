import React from "react";
import type { DemoProduct } from "@/lib/preview/demo-data";

export function DemoProductView({ product }: { product: DemoProduct }) {
    return (
        <div className="mx-auto max-w-6xl px-4 py-10">
            <div className="grid gap-8 rounded-2xl border bg-white p-6 shadow-sm lg:grid-cols-2">
                <div className="overflow-hidden rounded-xl border bg-gray-50">
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                </div>

                <div>
                    <div className="text-2xl font-semibold text-gray-900">{product.name}</div>
                    <div className="mt-2 text-sm text-gray-500">{product.category}</div>

                    <div className="mt-4 text-xl font-semibold text-gray-900">₦{product.price.toLocaleString()}</div>
                    <div className="mt-3 text-sm text-gray-500">{product.description}</div>

                    <div className="mt-6 flex gap-2">
                        <button className="rounded-lg bg-black px-4 py-2 text-sm text-white hover:opacity-90">
                            Add to cart (preview)
                        </button>
                        <button className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50">
                            Buy now (preview)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
