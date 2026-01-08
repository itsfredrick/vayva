"use client";

import { useForm } from "react-hook-form";
import { Button, Input, Textarea, Label } from "@vayva/ui";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface RetailProductFormProps {
    productId?: string;
    initialData?: any;
}

export function RetailProductForm({ productId, initialData }: RetailProductFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: initialData || {
            title: "",
            description: "",
            price: 0,
            sku: "",
            trackInventory: true,
            stockQuantity: 0,
        }
    });

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            const endpoint = productId
                ? `/api/products/${productId}`
                : "/api/products/create";

            const method = productId ? "PATCH" : "POST";

            const res = await fetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error("Failed to save product");

            toast.success(productId ? "Product updated" : "Product created");
            router.push("/dashboard/products");
        } catch (e) {
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Details */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Basic Info</h3>
                <div className="grid gap-4">
                    <div>
                        <Label htmlFor="title">Product Title</Label>
                        <Input
                            id="title"
                            {...register("title", { required: "Title is required" })}
                            placeholder="e.g. Classic White T-Shirt"
                        />
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message as string}</p>}
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            {...register("description")}
                            placeholder="Describe your product..."
                            rows={4}
                        />
                    </div>
                </div>
            </div>

            {/* Pricing & Inventory */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Pricing & Inventory</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <Label htmlFor="price">Price</Label>
                        <Input
                            id="price"
                            type="number"
                            step="0.01"
                            {...register("price", { required: true, min: 0 })}
                            prefix="₦"
                        />
                    </div>
                    <div>
                        <Label htmlFor="sku">SKU (Stock Keeping Unit)</Label>
                        <Input
                            id="sku"
                            {...register("sku")}
                            placeholder="TSH-001"
                        />
                    </div>
                    <div>
                        <Label htmlFor="stockQuantity">Stock Quantity</Label>
                        <Input
                            id="stockQuantity"
                            type="number"
                            {...register("stockQuantity", { min: 0 })}
                        />
                    </div>
                </div>
            </div>

            {/* Images - Placeholder for now */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Gallery</h3>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center text-gray-500">
                    <p>Image upload component would go here.</p>
                    <p className="text-xs mt-2">(Using placeholders for MVP)</p>
                </div>
            </div>

            <div className="pt-4 flex justify-end">
                <Button type="submit" disabled={isSubmitting} className="min-w-[150px]">
                    {isSubmitting ? "Saving..." : productId ? "Update Product" : "Create Product"}
                </Button>
            </div>
        </form>
    );
}
