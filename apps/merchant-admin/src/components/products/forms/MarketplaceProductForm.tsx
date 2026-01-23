"use client";

import { useForm } from "react-hook-form";
import { Button, Input, Label, Select, Textarea } from "@vayva/ui";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface MarketplaceProductFormProps {
    productId?: string;
    initialData?: unknown;
}

export function MarketplaceProductForm({ productId: unknown, initialData }: MarketplaceProductFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const defaultValues = initialData || {
        title: "",
        description: "",
        price: 0,
        vendorName: "",
        vendorId: "",
        commissionRate: 10,
        approvalStatus: "PENDING",
        categoryTags: "", // "Comma separated"
    };

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues
    });

    const onSubmit = async (data: unknown) => {
        setIsSubmitting(true);
        try {
            const payload = {
                title: data.title,
                description: data.description,
                price: Number(data.price),
                tags: data.categoryTags.split(",").map((t: string) => t.trim()).filter(Boolean),
                metadata: {
                    type: "marketplace",
                    vendorName: data.vendorName,
                    vendorId: data.vendorId,
                    commissionRate: Number(data.commissionRate),
                    approvalStatus: data.approvalStatus
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
                <h3 className="text-xl font-semibold border-b pb-2">Product Info</h3>

                <div>
                    <Label htmlFor="title">Product Name</Label>
                    <Input
                        id="title"
                        {...register("title", { required: "Name is required" })}
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message as string}</p>}
                </div>

                <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        {...register("description")}
                        rows={4}
                    />
                </div>

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
                    <Label htmlFor="categoryTags">Category Tags (Comma separated)</Label>
                    <Input
                        id="categoryTags"
                        {...register("categoryTags")}
                        placeholder="electronics, used, refurbished"
                    />
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-xl font-semibold border-b pb-2">Vendor Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="vendorName">Vendor Name</Label>
                        <Input
                            id="vendorName"
                            {...register("vendorName", { required: true })}
                            placeholder="Seller's Brand Name"
                        />
                    </div>
                    <div>
                        <Label htmlFor="vendorId">Vendor ID / Reference</Label>
                        <Input
                            id="vendorId"
                            {...register("vendorId")}
                            placeholder="Optional internal ID"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                        <Input
                            id="commissionRate"
                            type="number"
                            step="0.1"
                            {...register("commissionRate", { min: 0, max: 100 })}
                        />
                        <p className="text-xs text-gray-500 mt-1">Percentage taken by platform per sale.</p>
                    </div>
                    <div>
                        <Label htmlFor="approvalStatus">Approval Status</Label>
                        <Select
                            id="approvalStatus"
                            {...register("approvalStatus")}
                        >
                            <option value="PENDING">Pending Review</option>
                            <option value="APPROVED">Approved</option>
                            <option value="REJECTED">Rejected</option>
                        </Select>
                    </div>
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
