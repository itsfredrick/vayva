"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from "react-hook-form";
import { Button, Input, Label, Textarea } from "@vayva/ui";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
// For now, we will duplicate logic slightly to allow full control over layout, 
// or we could wrap RetailForm. But since the requirements ask for specific fields 
// like "Size Chart" and "Material", it's cleaner to build a dedicated form that 
// *includes* the retail fields but adds the fashion specifics.
export function FashionProductForm({ productId }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = async (data) => {
        setIsSubmitting(true);
        // Transform flat data into structured metadata
        const payload = {
            ...data,
            metadata: {
                sizeChartUrl: data.sizeChartUrl,
                materials: data.materials,
                careInstructions: data.careInstructions,
                colors: data.colors ? data.colors.split(",").map((c) => c.trim()) : [],
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
            if (!res.ok)
                throw new Error("Failed");
            toast.success("Fashion Product Saved");
            router.push("/dashboard/products");
        }
        catch (e) {
            toast.error("Error saving product");
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-8", children: [_jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-lg font-semibold border-b pb-2 text-pink-600", children: "Fashion Essentials" }), _jsxs("div", { className: "grid gap-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "Product Name" }), _jsx(Input, { ...register("title", { required: true }), placeholder: "e.g. Summer Floral Dress" })] }), _jsxs("div", { children: [_jsx(Label, { children: "Description" }), _jsx(Textarea, { ...register("description"), placeholder: "Describe the fit, feel, and style..." })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "Price (\u20A6)" }), _jsx(Input, { type: "number", ...register("price", { required: true }) })] }), _jsxs("div", { children: [_jsx(Label, { children: "SKU" }), _jsx(Input, { ...register("sku") })] })] })] })] }), _jsxs("div", { className: "space-y-4 bg-pink-50/50 p-6 rounded-lg border border-pink-100", children: [_jsxs("h3", { className: "text-lg font-semibold text-pink-700 flex items-center gap-2", children: [_jsx("span", { children: "\uD83D\uDC57" }), "Style & Fit Details"] }), _jsxs("div", { className: "space-y-4 mb-6", children: [_jsx(Label, { children: "Product Gallery (Minimum 4 images recommended)" }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [1, 2, 3, 4].map((i) => (_jsxs("div", { className: "aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-white hover:bg-gray-50 transition-colors cursor-pointer", children: [_jsx("span", { className: "text-2xl text-gray-300", children: "+" }), _jsxs("span", { className: "text-xs text-gray-400 mt-1", children: ["Image ", i] })] }, i))) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "colors", children: "Color Variants (comma separated)" }), _jsx(Input, { id: "colors", ...register("colors"), placeholder: "Red, Blue, Emerald Green" }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "We'll generate swatches automatically." })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "materials", children: "Material Composition" }), _jsx(Input, { id: "materials", ...register("materials"), placeholder: "100% Cotton, Polyester Blend..." })] }), _jsxs("div", { className: "col-span-2", children: [_jsx(Label, { htmlFor: "careInstructions", children: "Care Instructions" }), _jsx(Input, { id: "careInstructions", ...register("careInstructions"), placeholder: "Machine wash cold, Tumble dry low" })] }), _jsxs("div", { className: "col-span-2 border-2 border-dashed border-pink-200 rounded p-4 bg-white", children: [_jsx(Label, { children: "Size Chart (Upload Image/PDF)" }), _jsxs("div", { className: "mt-2 text-center py-4 text-pink-400", children: ["Tap to upload Size Guide", _jsx("input", { type: "hidden", ...register("sizeChartUrl"), value: "" })] })] })] })] }), _jsx("div", { className: "flex justify-end", children: _jsx(Button, { type: "submit", disabled: isSubmitting, className: "bg-pink-600 hover:bg-pink-700 text-white", children: isSubmitting ? "Saving..." : "Save Fashion Item" }) })] }));
}
