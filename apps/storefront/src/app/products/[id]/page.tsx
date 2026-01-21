"use client";

import * as React from "react";
import { Button } from "@vayva/ui";
import { useEffect, useState } from "react";
import { StoreShell } from "@/components/StoreShell";
import { useStore } from "@/context/StoreContext";
import { StorefrontService } from "@/services/storefront.service";
import { PublicProduct } from "@/types/storefront";
import { useParams } from "next/navigation";
import NextLink from "next/link";
import { PDPSkeleton } from "@/components/Skeletons";
const Link = NextLink as any;

import Image from "next/image";
import { FoodPDP } from "@/components/pdp/FoodPDP"; import { ServicePDP } from "@/components/pdp/ServicePDP";
import { ReportProductDialog } from "@/components/pdp/ReportProductDialog";


export default function ProductPage(props: any) {
  const { id } = useParams() as { id: string };
  const { store, addToCart } = useStore();
  const [product, setProduct] = useState<PublicProduct | null>(null);
  const [loading, setLoading] = useState(true);

  // Track selections for each variant type (e.g. { "Size": "M", "Color": "Red" })
  const [selections, setSelections] = useState<Record<string, string>>({});

  useEffect(() => {
    if (store && id) {
      const load = async () => {
        const data = await StorefrontService.getProduct(id);
        setProduct(data);
        setLoading(false);

        // Auto-select first options
        if (data && data.variants) {
          const defaults: Record<string, string> = {};
          data.variants.forEach(v => {
            if (v.options.length > 0) defaults[v.name] = v.options[0];
          });
          setSelections(defaults);
        }
      };
      load();
    }
  }, [store, id]);

  const handleSelection = (variantName: string, option: string) => {
    setSelections(prev => ({ ...prev, [variantName]: option }));
  };

  if (!store) return null; // Handled by shell

  // Variant Rendering
  const industry = store.industry || "RETAIL";

  if (product && (industry.startsWith("FOOD") || industry === "RESTAURANT")) {
    return (
      <StoreShell>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <FoodPDP product={product} />
        </div>
      </StoreShell>
    );
  }

  if (product && (industry === "SERVICES" || industry === "BEAUTY" || industry === "CLINIC")) {
    return (
      <StoreShell>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <ServicePDP product={product} />
        </div>
      </StoreShell>
    );
  }

  return (
    <StoreShell>
      {loading ? (
        <PDPSkeleton />
      ) : !product ? (

        <div className="py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <Link
            href={`/?store=${store.slug}`}
            className="text-blue-600 hover:underline"
          >
            Return Home
          </Link>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden relative">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Info */}
          <div>
            <div className="mb-2">
              <span className="text-sm text-gray-400 uppercase tracking-widest">
                {product.category || "Product"}
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              {product.name}
            </h1>
            <div className="flex items-center gap-4 mb-8">
              <span className="text-2xl font-bold">
                ₦{product.price.toLocaleString()}
              </span>
            </div>

            <div className="prose text-gray-600 mb-8 leading-relaxed">
              {product.description}
            </div>

            {/* Variants */}
            {product.variants.map((v) => (
              <div key={v.id} className="mb-6">
                <label className="block text-sm font-bold mb-2">{v.name}</label>
                <div className="flex gap-2">
                  {v.options.map((opt) => {
                    const isSelected = selections[v.name] === opt;
                    return (
                      <Button
                        key={opt}
                        onClick={() => handleSelection(v.name, opt)}
                        className={`px-4 py-2 border rounded-lg text-sm transition-all ${isSelected
                          ? "border-black bg-black text-white"
                          : "border-gray-200 hover:border-black"
                          }`}
                      >
                        {opt}
                      </Button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="flex gap-4 pt-6 border-t border-gray-100">
              <Button
                onClick={() => {
                  // Construct Variant ID from selections
                  const variantId = Object.entries(selections)
                    .map(([k, v]) => `${k}:${v}`)
                    .sort()
                    .join(", ") || "default";

                  addToCart({
                    productId: product.id,
                    variantId: variantId,
                    quantity: 1,
                    price: product.price,
                    productName: product.name,
                    image: product.images[0],
                  });
                  // Optional: Redirect / show toast
                  window.location.href = `/cart?store=${store.slug}`;
                }}
                className="flex-1 bg-black text-white h-14 rounded-full font-bold hover:bg-gray-900 transition-colors"
              >
                Add to Cart
              </Button>
            </div>

            <div className="mt-8 space-y-4 text-sm text-gray-500">
              <div className="flex gap-4">
                <span className="font-bold text-black min-w-[100px]">
                  Shipping
                </span>
                <span>Calculated at checkout.</span>
              </div>
              <div className="flex gap-4">
                <span className="font-bold text-black min-w-[100px]">
                  Returns
                </span>
                <span>See our return policy for details.</span>
              </div>
            </div>

            <ReportProductDialog productId={product.id} />
          </div>
        </div>
      )}
    </StoreShell>
  );
}
