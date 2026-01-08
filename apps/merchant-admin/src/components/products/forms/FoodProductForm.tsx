"use client";

import { useForm } from "react-hook-form";
import { Button, Input, Textarea, Label } from "@vayva/ui";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function FoodProductForm({ productId }: { productId?: string }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit } = useForm();

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        const payload = {
            title: data.itemName,
            description: data.description,
            price: data.price,
            productType: "food",
            metadata: {
                ingredients: data.ingredients,
                prepTimeMinutes: data.prepTime,
                dietaryTags: data.dietaryTags?.split(",").map((t: string) => t.trim()),
                addOns: [
                    // Mocking add-ons structure
                    { name: "Extra Cheese", price: 500 },
                    { name: "Spicy Sauce", price: 200 }
                ]
            }
        };
        toast.success("Menu item added");
        router.push("/dashboard/products");
        setIsSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2 text-orange-600">Menu Item</h3>
                <div className="grid gap-4">
                    <div>
                        <Label>Dish Name</Label>
                        <Input {...register("itemName", { required: true })} placeholder="e.g. Jollof Rice Special" />
                    </div>
                    <div>
                        <Label>Ingredients</Label>
                        <Textarea {...register("ingredients")} placeholder="Rice, Tomatoes, Spices..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Prep Time (Mins)</Label>
                            <Input type="number" {...register("prepTime")} placeholder="20" />
                        </div>
                        <div>
                            <Label>Price (₦)</Label>
                            <Input type="number" {...register("price", { required: true })} />
                        </div>
                    </div>
                    <div>
                        <Label>Dietary Tags</Label>
                        <Input {...register("dietaryTags")} placeholder="Spicy, Vegan, Halal" />
                    </div>
                </div>
            </div>
            <div className="flex justify-end">
                <Button type="submit" className="bg-orange-600 hover:bg-orange-700">Add to Menu</Button>
            </div>
        </form>
    );
}
