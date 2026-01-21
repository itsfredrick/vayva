"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm, useFieldArray } from "react-hook-form";
import { Button, Input, Label, Textarea } from "@vayva/ui";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2, Plus, Upload } from "lucide-react";
export function WholesaleProductForm({ productId, initialData }) {
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
    const onSubmit = async (data) => {
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
                    pricingTiers: data.pricingTiers.map((t) => ({
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
            if (!res.ok)
                throw new Error("Failed to save product");
            toast.success(productId ? "Product updated" : "Product created");
            router.push("/dashboard/products");
        }
        catch (e) {
            toast.error("Something went wrong");
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-8 max-w-4xl mx-auto", children: [_jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-xl font-semibold border-b pb-2", children: "Product Details" }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "title", children: "Product Name" }), _jsx(Input, { id: "title", ...register("title", { required: "Product name is required" }), placeholder: "e.g. Industrial Steel bolts" }), errors.title && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.title.message })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "description", children: "Description" }), _jsx(Textarea, { id: "description", ...register("description"), placeholder: "Technical specifications...", rows: 4 })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "moq", children: "Minimum Order Quantity (MOQ)" }), _jsx(Input, { id: "moq", type: "number", ...register("moq", { required: true, min: 1 }), placeholder: "1" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "unitOfMeasure", children: "Unit of Measure" }), _jsx(Input, { id: "unitOfMeasure", ...register("unitOfMeasure", { required: true }), placeholder: "e.g. kg, box, pallet, container" })] })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex justify-between items-center border-b pb-2", children: [_jsx("h3", { className: "text-xl font-semibold", children: "Tiered Pricing" }), _jsxs(Button, { type: "button", variant: "outline", size: "sm", onClick: () => append({ minQty: 0, maxQty: 0, price: 0 }), children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), " Add Tier"] })] }), _jsx("p", { className: "text-sm text-gray-500", children: "Define price breaks based on quantity ordered." }), _jsx("div", { className: "space-y-4", children: fields.map((field, index) => (_jsxs("div", { className: "flex gap-4 items-end bg-gray-50 p-4 rounded-lg border", children: [_jsxs("div", { className: "flex-1", children: [_jsx(Label, { children: "Min Qty" }), _jsx(Input, { type: "number", ...register(`pricingTiers.${index}.minQty`, { required: true, min: 0 }) })] }), _jsxs("div", { className: "flex-1", children: [_jsx(Label, { children: "Max Qty (leave 0 for \u221E)" }), _jsx(Input, { type: "number", ...register(`pricingTiers.${index}.maxQty`) })] }), _jsxs("div", { className: "w-32", children: [_jsx(Label, { children: "Unit Price" }), _jsx(Input, { type: "number", step: "0.01", ...register(`pricingTiers.${index}.price`, { required: true, min: 0 }), prefix: "\u20A6" })] }), _jsx(Button, { type: "button", variant: "destructive", size: "icon", onClick: () => remove(index), children: _jsx(Trash2, { className: "w-4 h-4" }) })] }, field.id))) })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-xl font-semibold border-b pb-2", children: "Catalog & Resources" }), _jsxs("div", { className: "border-2 border-dashed border-gray-200 rounded-lg p-8 text-center", children: [_jsx(Upload, { className: "w-8 h-8 text-gray-400 mx-auto mb-2" }), _jsx("p", { className: "text-gray-600 mb-2", children: "Upload Product Catalog or Spec Sheet (PDF)" }), _jsx(Button, { type: "button", variant: "outline", disabled: true, children: "Choose File" }), _jsx("p", { className: "text-xs text-gray-400 mt-2", children: "(File upload implementation pending)" })] })] }), _jsx("div", { className: "pt-4 flex justify-end", children: _jsx(Button, { type: "submit", disabled: isSubmitting, className: "min-w-[150px]", children: isSubmitting ? "Saving..." : productId ? "Update Product" : "Create Product" }) })] }));
}
