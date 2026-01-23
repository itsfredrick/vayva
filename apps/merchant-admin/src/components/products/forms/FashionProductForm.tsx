"use client";

import { useForm } from "react-hook-form";
import { Button, Input, Label, Textarea } from "@vayva/ui";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RetailProductForm } from "./RetailProductForm";

// For now, we will duplicate logic slightly to allow full control over layout, 
// or we could wrap RetailForm. But since the requirements ask for specific fields 
// like "Size Chart" and "Material", it's cleaner to build a dedicated form that 
// *includes* the retail fields but adds the fashion specifics.

export function FashionProductForm({ productId }: { productId?: string }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data: unknown) => {
        setIsSubmitting(true);
        // Transform flat data into structured metadata
        const payload = {
            ...data,
            metadata: {
                sizeChartUrl: data.sizeChartUrl,
                materials: data.materials,
                careInstructions: data.careInstructions,
                colors: data.colors ? data.colors.split(",").map((c: string) => c.trim()) : [],
            }
        };

        try {
            const endpoint = productId ? `/api/products/${productId}` : "/api/products/create";
            const method = productId ? "PATCH" : "POST";

            const res = await fetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed");

            toast.success("Fashion Product Saved");
            router.push("/dashboard/products");
        } catch (e) {
            toast.error("Error saving product");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* 1. Core Retail Fields (Replicated for control) */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2 text-pink-600">Fashion Essentials</h3>
                <div className="grid gap-4">
                    <div>
                        <Label>Product Name</Label>
                        <Input {...register("title", { required: true })} placeholder="e.g. Summer Floral Dress" />
                    </div>
                    <div>
                        <Label>Description</Label>
                        <Textarea {...register("description")} placeholder="Describe the fit, feel, and style..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Price (₦)</Label>
                            <Input type="number" {...register("price", { required: true })} />
                        </div>
                        <div>
                            <Label>SKU</Label>
                            <Input {...register("sku")} />
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Fashion Specifics */}
            <div className="space-y-4 bg-pink-50/50 p-6 rounded-lg border border-pink-100">
                <h3 className="text-lg font-semibold text-pink-700 flex items-center gap-2">
                    <span>👗</span>
                    Style & Fit Details
                </h3>

                <div className="space-y-4 mb-6">
                    <Label>Product Gallery (Minimum 4 images recommended)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i: unknown) => (
                            <div key={i} className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-white hover:bg-gray-50 transition-colors cursor-pointer">
                                <span className="text-2xl text-gray-300">+</span>
                                <span className="text-xs text-gray-400 mt-1">Image {i}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="colors">Color Variants (comma separated)</Label>
                        <Input
                            id="colors"
                            {...register("colors")}
                            placeholder="Red, Blue, Emerald Green"
                        />
                        <p className="text-xs text-gray-500 mt-1">We'll generate swatches automatically.</p>
                    </div>

                    <div>
                        <Label htmlFor="materials">Material Composition</Label>
                        <Input
                            id="materials"
                            {...register("materials")}
                            placeholder="100% Cotton, Polyester Blend..."
                        />
                    </div>

                    <div className="col-span-2">
                        <Label htmlFor="careInstructions">Care Instructions</Label>
                        <Input
                            id="careInstructions"
                            {...register("careInstructions")}
                            placeholder="Machine wash cold, Tumble dry low"
                        />
                    </div>

                    <div className="col-span-2 border-2 border-dashed border-pink-200 rounded p-4 bg-white">
                        <Label>Size Chart (Upload Image/PDF)</Label>
                        <div className="mt-2 text-center py-4 text-pink-400">
                            Tap to upload Size Guide
                            <input type="hidden" {...register("sizeChartUrl")} value="" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting} className="bg-pink-600 hover:bg-pink-700 text-white">
                    {isSubmitting ? "Saving..." : "Save Fashion Item"}
                </Button>
            </div>
        </form>
    );
}
