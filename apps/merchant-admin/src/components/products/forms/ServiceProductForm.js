"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from "react-hook-form";
import { Button, Input, Label } from "@vayva/ui";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
export function ServiceProductForm({ productId }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit } = useForm();
    const onSubmit = async (data) => {
        setIsSubmitting(true);
        const payload = {
            title: data.serviceName,
            description: data.description,
            price: data.price,
            productType: "service",
            trackInventory: false, // Services don't track physical stock usually
            metadata: {
                durationMinutes: parseInt(data.duration),
                bufferMinutes: parseInt(data.buffer),
                staff: [data.staffId], // simple array for now
                locationType: data.locationType, // Virtual / In-person
            }
        };
        // ... fetch logic (omitted for brevity, assume similar to Retail)
        toast.success("Service created");
        router.push("/dashboard/products");
        setIsSubmitting(false);
    };
    return (_jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-8", children: [_jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-lg font-semibold border-b pb-2 text-purple-600", children: "Service Details" }), _jsxs("div", { className: "grid gap-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "Service Name" }), _jsx(Input, { ...register("serviceName", { required: true }), placeholder: "e.g. 1-on-1 Consultation" })] }), _jsxs("div", { children: [_jsx(Label, { children: "Duration (Minutes)" }), _jsx(Input, { type: "number", ...register("duration", { required: true }), placeholder: "60" })] }), _jsxs("div", { children: [_jsx(Label, { children: "Buffer Time (Minutes)" }), _jsx(Input, { type: "number", ...register("buffer"), placeholder: "15" }), _jsx("p", { className: "text-xs text-gray-500", children: "Time needed between appointments." })] }), _jsxs("div", { children: [_jsx(Label, { children: "Price (\u20A6)" }), _jsx(Input, { type: "number", ...register("price", { required: true }) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Staff Member" }), _jsxs("select", { className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", ...register("staffId"), children: [_jsx("option", { value: "me", children: "Assign to Me" }), _jsx("option", { value: "staff_1", children: "John Doe" }), _jsx("option", { value: "staff_2", children: "Jane Smith" })] })] })] })] }), _jsx("div", { className: "flex justify-end", children: _jsx(Button, { type: "submit", className: "bg-purple-600 hover:bg-purple-700", children: "Save Service" }) })] }));
}
