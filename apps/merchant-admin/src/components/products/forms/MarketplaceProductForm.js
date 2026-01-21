"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from "react-hook-form";
import { Button, Input, Label, Select, Textarea } from "@vayva/ui";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
export function MarketplaceProductForm({ productId, initialData }) {
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
    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const payload = {
                title: data.title,
                description: data.description,
                price: Number(data.price),
                tags: data.categoryTags.split(",").map((t) => t.trim()).filter(Boolean),
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
    return (_jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-8 max-w-4xl mx-auto", children: [_jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-xl font-semibold border-b pb-2", children: "Product Info" }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "title", children: "Product Name" }), _jsx(Input, { id: "title", ...register("title", { required: "Name is required" }) }), errors.title && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.title.message })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "description", children: "Description" }), _jsx(Textarea, { id: "description", ...register("description"), rows: 4 })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "price", children: "Price" }), _jsx(Input, { id: "price", type: "number", step: "0.01", ...register("price", { required: true, min: 0 }), prefix: "\u20A6" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "categoryTags", children: "Category Tags (Comma separated)" }), _jsx(Input, { id: "categoryTags", ...register("categoryTags"), placeholder: "electronics, used, refurbished" })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-xl font-semibold border-b pb-2", children: "Vendor Details" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "vendorName", children: "Vendor Name" }), _jsx(Input, { id: "vendorName", ...register("vendorName", { required: true }), placeholder: "Seller's Brand Name" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "vendorId", children: "Vendor ID / Reference" }), _jsx(Input, { id: "vendorId", ...register("vendorId"), placeholder: "Optional internal ID" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "commissionRate", children: "Commission Rate (%)" }), _jsx(Input, { id: "commissionRate", type: "number", step: "0.1", ...register("commissionRate", { min: 0, max: 100 }) }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Percentage taken by platform per sale." })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "approvalStatus", children: "Approval Status" }), _jsxs(Select, { id: "approvalStatus", ...register("approvalStatus"), children: [_jsx("option", { value: "PENDING", children: "Pending Review" }), _jsx("option", { value: "APPROVED", children: "Approved" }), _jsx("option", { value: "REJECTED", children: "Rejected" })] })] })] })] }), _jsx("div", { className: "pt-4 flex justify-end", children: _jsx(Button, { type: "submit", disabled: isSubmitting, className: "min-w-[150px]", children: isSubmitting ? "Saving..." : productId ? "Update Product" : "Create Product" }) })] }));
}
