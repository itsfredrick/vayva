"use client";

import { useForm } from "react-hook-form";
import { Button, Input, Label, Textarea } from "@vayva/ui";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface NonprofitProductFormProps {
    productId?: string;
    initialData?: any;
}

export function NonprofitProductForm({ productId, initialData }: NonprofitProductFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const defaultValues = initialData || {
        title: "",
        impactDescription: "",
        goalAmount: 0,
        suggestedAmounts: "10, 25, 50, 100", // Comma separated string for simplicity in input
        allowRecurring: true
    };

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues
    });

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            const payload: any = {
                title: data.title,
                description: data.impactDescription, // Mapping impact desc to main description
                price: 0, // Donations usually act as open price or varying, setting 0 as base
                trackInventory: false,
                metadata: {
                    type: "nonprofit",
                    goalAmount: Number(data.goalAmount),
                    suggestedAmounts: data.suggestedAmounts.split(",").map((s: any) => Number(s.trim())).filter(Boolean),
                    allowRecurring: data.allowRecurring
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

            if (!res.ok) throw new Error("Failed to save campaign");

            toast.success(productId ? "Campaign updated" : "Campaign created");
            router.push("/dashboard/products");
        } catch (e: any) {
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto">
            <div className="space-y-4">
                <h3 className="text-xl font-semibold border-b pb-2">Campaign Details</h3>

                <div>
                    <Label htmlFor="title">Campaign Name</Label>
                    <Input
                        id="title"
                        {...register("title", { required: "Campaign name is required" })}
                        placeholder="e.g. Clean Water project"
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message as string}</p>}
                </div>

                <div>
                    <Label htmlFor="goalAmount">Goal Amount</Label>
                    <Input
                        id="goalAmount"
                        type="number"
                        {...register("goalAmount", { min: 0 })}
                        prefix="₦"
                        placeholder="Target fundraising amount"
                    />
                </div>

                <div>
                    <Label htmlFor="impactDescription">Impact Description</Label>
                    <Textarea
                        id="impactDescription"
                        {...register("impactDescription", { required: true })}
                        placeholder="Tell donors what their money will achieve. E.g. $10 buys 5 books."
                        rows={5}
                    />
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-xl font-semibold border-b pb-2">Donation Options</h3>

                <div>
                    <Label htmlFor="suggestedAmounts">Suggested Donation Amounts</Label>
                    <Input
                        id="suggestedAmounts"
                        {...register("suggestedAmounts")}
                        placeholder="10, 25, 50, 100"
                    />
                    <p className="text-xs text-gray-500 mt-1">Comma separated list of amounts to show as buttons.</p>
                </div>

                <div className="flex items-center gap-2 mt-4">
                    <input
                        type="checkbox"
                        id="allowRecurring"
                        className="w-4 h-4"
                        {...register("allowRecurring")}
                    />
                    <Label htmlFor="allowRecurring" className="mb-0">Enable Recurring Monthly Giving option</Label>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-xl font-semibold border-b pb-2">Media</h3>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                    <p className="text-gray-600 mb-2">Upload Campaign Hero Image</p>
                    <Button type="button" variant="outline" disabled>
                        Choose Image
                    </Button>
                </div>
            </div>

            <div className="pt-4 flex justify-end">
                <Button type="submit" disabled={isSubmitting} className="min-w-[150px]">
                    {isSubmitting ? "Saving..." : productId ? "Update Campaign" : "Create Campaign"}
                </Button>
            </div>
        </form>
    );
}
