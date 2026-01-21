"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from "react-hook-form";
import { Button, Input, Label, Textarea } from "@vayva/ui";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
export function FoodProductForm({ productId }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit } = useForm();
    const onSubmit = async (data) => {
        setIsSubmitting(true);
        const payload = {
            title: data.itemName,
            description: data.description,
            price: data.price,
            productType: "food",
            metadata: {
                ingredients: data.ingredients,
                prepTimeMinutes: data.prepTime,
                dietaryTags: data.dietaryTags?.split(",").map((t) => t.trim()),
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
    return (_jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-8", children: [_jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-lg font-semibold border-b pb-2 text-orange-600", children: "Menu Item" }), _jsxs("div", { className: "grid gap-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "Dish Name" }), _jsx(Input, { ...register("itemName", { required: true }), placeholder: "e.g. Jollof Rice Special" })] }), _jsxs("div", { children: [_jsx(Label, { children: "Ingredients" }), _jsx(Textarea, { ...register("ingredients"), placeholder: "Rice, Tomatoes, Spices..." })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "Prep Time (Mins)" }), _jsx(Input, { type: "number", ...register("prepTime"), placeholder: "20" })] }), _jsxs("div", { children: [_jsx(Label, { children: "Price (\u20A6)" }), _jsx(Input, { type: "number", ...register("price", { required: true }) })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Dietary Tags" }), _jsx(Input, { ...register("dietaryTags"), placeholder: "Spicy, Vegan, Halal" })] })] })] }), _jsx("div", { className: "flex justify-end", children: _jsx(Button, { type: "submit", className: "bg-orange-600 hover:bg-orange-700", children: "Add to Menu" }) })] }));
}
