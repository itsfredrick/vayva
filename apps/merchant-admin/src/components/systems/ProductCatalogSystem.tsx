"use client";

import React, { useState } from "react";
import { Button, Icon, cn, Input } from "@vayva/ui";
import { Switch } from "@/components/ui/Switch";

// Master Prompt System 1: Product Catalog Onboarding
// Three Micro-steps: Product -> Variants -> Pricing
// Live Preview Card
// On Completion: product_catalog_initialized = true

interface ProductState {
  name: string;
  category: string;
  description: string;
  type: "physical" | "digital" | "service";
  hasVariants: boolean;
  variants: { group: string; options: string[] }[];
  priceMode: "single" | "variant";
  basePrice: string;
}

export function ProductCatalogSystem({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [step, setStep] = useState<"create" | "variants" | "pricing">("create");
  const [product, setProduct] = useState<ProductState>({
    name: "",
    category: "Retail", // Should ideally come from business state
    description: "",
    type: "physical",
    hasVariants: false,
    variants: [{ group: "Size", options: ["S", "M", "L"] }], // Default example
    priceMode: "single",
    basePrice: "",
  });

  const handleNext = () => {
    if (step === "create") {
      if (product.hasVariants) setStep("variants");
      else setStep("pricing");
    } else if (step === "variants") {
      setStep("pricing");
    } else {
      // Finish
      onComplete();
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-[600px]">
      {/* Editor Panel */}
      <div className="flex-1 overflow-y-auto pr-2">
        <div className="mb-6">
          <div className="flex gap-2 mb-2">
            {["create", "variants", "pricing"].map((s, idx) => (
              <div
                key={s}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors",
                  // Complex logic for progress bar color
                  step === s ||
                    (step === "pricing" && s !== "pricing") ||
                    (step === "variants" && s === "create")
                    ? "bg-black"
                    : "bg-gray-100",
                )}
              />
            ))}
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            {step === "create" && "Create your first product"}
            {step === "variants" && "Add product options"}
            {step === "pricing" && "Set your price"}
          </h2>
        </div>

        {step === "create" && (
          <div className="space-y-4 animate-in slide-in-from-right-4 fade-in">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Product Name <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g. Classic White Tee"
                value={product.name}
                onChange={(e) =>
                  setProduct({ ...product, name: e.target.value })
                }
                autoFocus
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Product Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["physical", "digital", "service"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setProduct({ ...product, type: t })}
                    className={cn(
                      "p-2 rounded-lg border text-sm capitalize transition-colors",
                      product.type === t
                        ? "bg-black text-white border-black"
                        : "bg-white text-gray-500 border-gray-200",
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div>
                <span className="font-bold text-sm block text-gray-900">
                  This product has options
                </span>
                <span className="text-xs text-gray-500">
                  Like size, color, or material
                </span>
              </div>
              <Switch
                checked={product.hasVariants}
                onCheckedChange={(c) =>
                  setProduct({ ...product, hasVariants: c })
                }
              />
            </div>
          </div>
        )}

        {step === "variants" && (
          <div className="space-y-6 animate-in slide-in-from-right-4 fade-in">
            {product.variants.map((variant, idx) => (
              <div
                key={idx}
                className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3"
              >
                <div className="flex justify-between">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Option Name
                  </label>
                  <button className="text-xs text-red-500 hover:underline">
                    Remove
                  </button>
                </div>
                <Input
                  value={variant.group}
                  onChange={(e) => {
                    const newV = [...product.variants];
                    newV[idx].group = e.target.value;
                    setProduct({ ...product, variants: newV });
                  }}
                />
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                    Values (comma separated)
                  </label>
                  <Input
                    placeholder="Small, Medium, Large"
                    value={variant.options.join(", ")}
                    onChange={(e) => {
                      const newV = [...product.variants];
                      newV[idx].options = e.target.value
                        .split(",")
                        .map((s) => s.trim());
                      setProduct({ ...product, variants: newV });
                    }}
                  />
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              className="w-full border-dashed border-gray-300 text-gray-500"
              onClick={() => {
                setProduct({
                  ...product,
                  variants: [
                    ...product.variants,
                    { group: "New Option", options: [] },
                  ],
                });
              }}
            >
              + Add another option
            </Button>
          </div>
        )}

        {step === "pricing" && (
          <div className="space-y-6 animate-in slide-in-from-right-4 fade-in">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Selling Price <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  ₦
                </span>
                <Input
                  className="pl-8 text-lg font-mono"
                  placeholder="0.00"
                  value={product.basePrice}
                  onChange={(e) =>
                    setProduct({ ...product, basePrice: e.target.value })
                  }
                  autoFocus
                />
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-xl border border-green-100 flex items-start gap-3">
              <Icon
                name="MessageCircle"
                className="text-green-600 mt-1"
                size={16}
              />
              <div className="space-y-1">
                <h4 className="font-bold text-green-900 text-sm">
                  WhatsApp Automation
                </h4>
                <p className="text-xs text-green-700">
                  When customers ask "How much?", our AI will reply: <br />{" "}
                  "It's ₦{product.basePrice || "..."} per unit."
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end">
          <Button
            onClick={handleNext}
            disabled={!product.name}
            className="!bg-black text-white px-8 h-12 rounded-xl"
          >
            {step === "pricing" ? "Finish & Save" : "Next"}
          </Button>
        </div>
      </div>

      {/* Live Preview Panel */}
      <div className="w-[320px] bg-gray-100 rounded-3xl p-6 border border-gray-200 hidden lg:flex flex-col items-center justify-center relative">
        <div className="absolute top-4 left-0 w-full text-center">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Customer View
          </span>
        </div>

        <div className="bg-white rounded-2xl shadow-xl w-full overflow-hidden max-w-[260px] transform transition-all hover:scale-105 duration-300">
          <div className="aspect-square bg-gray-200 flex items-center justify-center relative">
            <Icon name="Image" className="text-gray-400" size={32} />
            {product.type === "digital" && (
              <div className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm">
                DIGITAL
              </div>
            )}
          </div>
          <div className="p-4 space-y-2">
            <div
              className="h-4 w-3/4 bg-gray-100 rounded animate-pulse"
              style={{ display: product.name ? "none" : "block" }}
            />
            {product.name && (
              <h3 className="font-bold text-gray-900 leading-tight">
                {product.name}
              </h3>
            )}

            <div className="flex items-baseline gap-1">
              <span className="text-xs text-gray-500">₦</span>
              <span className="text-lg font-bold text-black">
                {product.basePrice || "0.00"}
              </span>
            </div>

            {product.hasVariants && (
              <div className="flex gap-1 flex-wrap pt-2">
                {product.variants[0]?.options.slice(0, 3).map((opt) => (
                  <span
                    key={opt}
                    className="text-[10px] border border-gray-200 px-1.5 py-0.5 rounded text-gray-600"
                  >
                    {opt}
                  </span>
                ))}
                {product.variants[0]?.options.length > 3 && (
                  <span className="text-[10px] text-gray-400">+More</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
