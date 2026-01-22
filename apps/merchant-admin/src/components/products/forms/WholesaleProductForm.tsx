"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { Button, Input, Label, Textarea } from "@vayva/ui";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2, Plus, Upload } from "lucide-react";

interface WholesaleProductFormProps {
    productId?: string;
    initialData?: unknown;
}

export function WholesaleProductForm({ productId, initialData }: WholesaleProductFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const defaultValues = initialData || {
        title: "",
        description: "",
        moq: 1,
        unitOfMeasure: "unit",
        pricingTiers: [
            { minQty: 1, maxQty: 50, price: 0 }
        ]
    };

    const { register, control, handleSubmit, formState: { errors } } = useForm({
        defaultValues
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "pricingTiers"
    });

    const onSubmit = async (data: unknown) => {
        setIsSubmitting(true);
        try {
            // Base price is the price for the first tier (assumed highest price)
            const basePrice = data.pricingTiers[0]?.price || 0;

            const payload = {
                title: data.title,
                description: data.description,
                price: basePrice,
                trackInventory: true,
                metadata: {
                    type: "wholesale",
                    moq: Number(data.moq),
                    unitOfMeasure: data.unitOfMeasure,
                    pricingTiers: data.pricingTiers.map((t: unknown) => ({
                        minQty: Number(t.minQty),
                        maxQty: Number(t.maxQty) || null, // null means unlimited
                        price: Number(t.price)
                    }))
                }
            };

            const endpoint = productId
                ? `/api/products/${productId}`
                : "/api/products/create";

            const method = productId ? "PATCH" : "POST";

            const res = await fetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto">
            <div className="space-y-4">
                <h3 className="text-xl font-semibold border-b pb-2">Product Details</h3>

                <div>
                    <Label htmlFor="title">Product Name</Label>
                    <Input
                        id="title"
                        {...register("title", { required: "Product name is required" })}
                        placeholder="e.g. Industrial Steel bolts"
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message as string}</p>}
                </div>

                <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        {...register("description")}
                        placeholder="Technical specifications..."
                        rows={4}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="moq">Minimum Order Quantity (MOQ)</Label>
                        <Input
                            id="moq"
                            type="number"
                            {...register("moq", { required: true, min: 1 })}
                            placeholder="1"
                        />
                    </div>
                    <div>
                        <Label htmlFor="unitOfMeasure">Unit of Measure</Label>
                        <Input
                            id="unitOfMeasure"
                            {...register("unitOfMeasure", { required: true })}
                            placeholder="e.g. kg, box, pallet, container"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="text-xl font-semibold">Tiered Pricing</h3>
                    <Button type="button" variant="outline" size="sm" onClick={() => append({ minQty: 0, maxQty: 0, price: 0 })}>
                        <Plus className="w-4 h-4 mr-2" /> Add Tier
                    </Button>
                </div>

                <p className="text-sm text-gray-500">Define price breaks based on quantity ordered.</p>

                <div className="space-y-4">
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex gap-4 items-end bg-gray-50 p-4 rounded-lg border">
                            <div className="flex-1">
                                <Label>Min Qty</Label>
                                <Input
                                    type="number"
                                    {...register(`pricingTiers.${index}.minQty` as const, { required: true, min: 0 })}
                                />
                            </div>
                            <div className="flex-1">
                                <Label>Max Qty (leave 0 for ∞)</Label>
                                <Input
                                    type="number"
                                    {...register(`pricingTiers.${index}.maxQty` as const)}
                                />
                            </div>
                            <div className="w-32">
                                <Label>Unit Price</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    {...register(`pricingTiers.${index}.price` as const, { required: true, min: 0 })}
                                    prefix="₦"
                                />
                            </div>
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => remove(index)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-xl font-semibold border-b pb-2">Catalog & Resources</h3>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 mb-2">Upload Product Catalog or Spec Sheet (PDF)</p>
                    <Button type="button" variant="outline" disabled>
                        Choose File
                    </Button>
                    <p className="text-xs text-gray-400 mt-2">(File upload implementation pending)</p>
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
