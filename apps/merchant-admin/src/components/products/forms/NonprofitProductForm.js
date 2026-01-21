"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from "react-hook-form";
import { Button, Input, Label, Textarea } from "@vayva/ui";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
export function NonprofitProductForm({ productId, initialData }) {
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
    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const payload = {
                title: data.title,
                description: data.impactDescription, // Mapping impact desc to main description
                price: 0, // Donations usually act as open price or varying, setting 0 as base
                trackInventory: false,
                metadata: {
                    type: "nonprofit",
                    goalAmount: Number(data.goalAmount),
                    suggestedAmounts: data.suggestedAmounts.split(",").map((s) => Number(s.trim())).filter(Boolean),
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
            if (!res.ok)
                throw new Error("Failed to save campaign");
            toast.success(productId ? "Campaign updated" : "Campaign created");
            router.push("/dashboard/products");
        }
        catch (e) {
            toast.error("Something went wrong");
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-8 max-w-4xl mx-auto", children: [_jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-xl font-semibold border-b pb-2", children: "Campaign Details" }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "title", children: "Campaign Name" }), _jsx(Input, { id: "title", ...register("title", { required: "Campaign name is required" }), placeholder: "e.g. Clean Water project" }), errors.title && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.title.message })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "goalAmount", children: "Goal Amount" }), _jsx(Input, { id: "goalAmount", type: "number", ...register("goalAmount", { min: 0 }), prefix: "\u20A6", placeholder: "Target fundraising amount" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "impactDescription", children: "Impact Description" }), _jsx(Textarea, { id: "impactDescription", ...register("impactDescription", { required: true }), placeholder: "Tell donors what their money will achieve. E.g. $10 buys 5 books.", rows: 5 })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-xl font-semibold border-b pb-2", children: "Donation Options" }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "suggestedAmounts", children: "Suggested Donation Amounts" }), _jsx(Input, { id: "suggestedAmounts", ...register("suggestedAmounts"), placeholder: "10, 25, 50, 100" }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Comma separated list of amounts to show as buttons." })] }), _jsxs("div", { className: "flex items-center gap-2 mt-4", children: [_jsx("input", { type: "checkbox", id: "allowRecurring", className: "w-4 h-4", ...register("allowRecurring") }), _jsx(Label, { htmlFor: "allowRecurring", className: "mb-0", children: "Enable Recurring Monthly Giving option" })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-xl font-semibold border-b pb-2", children: "Media" }), _jsxs("div", { className: "border-2 border-dashed border-gray-200 rounded-lg p-8 text-center", children: [_jsx("p", { className: "text-gray-600 mb-2", children: "Upload Campaign Hero Image" }), _jsx(Button, { type: "button", variant: "outline", disabled: true, children: "Choose Image" })] })] }), _jsx("div", { className: "pt-4 flex justify-end", children: _jsx(Button, { type: "submit", disabled: isSubmitting, className: "min-w-[150px]", children: isSubmitting ? "Saving..." : productId ? "Update Campaign" : "Create Campaign" }) })] }));
}
