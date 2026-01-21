"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@vayva/ui";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
export default function NewMenuItemPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        imageUrl: "",
    });
    const [metadata, setMetadata] = useState({
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: false,
        spiceLevel: "MILD",
        prepTimeMinutes: 15,
        calories: 0,
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/menu-items", {
                method: "POST",
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    metadata
                }),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to create menu item");
            }
            toast.success("Menu item created!");
            router.push("/dashboard/menu-items");
        }
        catch (error) {
            toast.error(error.message);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "max-w-2xl mx-auto space-y-6 pb-10", children: [_jsxs(Button, { variant: "ghost", onClick: () => router.back(), className: "mb-4", children: [_jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }), " Back to Menu"] }), _jsxs("div", { className: "space-y-1", children: [_jsx("h2", { className: "text-3xl font-bold tracking-tight", children: "Add Menu Item" }), _jsx("p", { className: "text-muted-foreground", children: "Create a new dish for your restaurant menu." })] }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Basic Details" }), _jsx(CardDescription, { children: "Dish name, price, and description." })] }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "name", children: "Dish Name" }), _jsx(Input, { id: "name", required: true, value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }), placeholder: "e.g. Spicy Chicken Burger" })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "price", children: "Price (NGN)" }), _jsx(Input, { id: "price", type: "number", required: true, value: formData.price, onChange: (e) => setFormData({ ...formData, price: e.target.value }), placeholder: "0.00" })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "description", children: "Description" }), _jsx(Textarea, { id: "description", value: formData.description, onChange: (e) => setFormData({ ...formData, description: e.target.value }), placeholder: "Describe the dish..." })] })] })] }), _jsxs(Card, { className: "mt-6", children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Food Specifics" }), _jsx(CardDescription, { children: "Dietary info, prep time, and spice level." })] }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between border p-4 rounded-lg", children: [_jsxs("div", { className: "space-y-0.5", children: [_jsx(Label, { children: "Vegetarian" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Is this dish vegetarian friendly?" })] }), _jsx(Switch, { checked: metadata.isVegetarian ?? false, onCheckedChange: (checked) => setMetadata({ ...metadata, isVegetarian: checked }) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "prepTime", children: "Prep Time (mins)" }), _jsx(Input, { id: "prepTime", type: "number", value: metadata.prepTimeMinutes, onChange: (e) => setMetadata({ ...metadata, prepTimeMinutes: parseInt(e.target.value) }) })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { children: "Spice Level" }), _jsxs(Select, { value: metadata.spiceLevel, onValueChange: (val) => setMetadata({ ...metadata, spiceLevel: val }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select level" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "MILD", children: "Mild" }), _jsx(SelectItem, { value: "MEDIUM", children: "Medium" }), _jsx(SelectItem, { value: "HOT", children: "Hot" }), _jsx(SelectItem, { value: "EXTRA_HOT", children: "Extra Hot" })] })] })] })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "calories", children: "Calories (kcal)" }), _jsx(Input, { id: "calories", type: "number", value: metadata.calories, onChange: (e) => setMetadata({ ...metadata, calories: parseInt(e.target.value) }) })] })] }), _jsx(CardFooter, { className: "flex justify-end", children: _jsxs(Button, { type: "submit", disabled: loading, children: [loading && _jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), "Create Dish"] }) })] })] })] }));
}
