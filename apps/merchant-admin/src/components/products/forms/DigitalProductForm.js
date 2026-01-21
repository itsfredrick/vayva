"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from "react-hook-form";
import { Button, Input, Label } from "@vayva/ui";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
export function DigitalProductForm({ productId }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit } = useForm();
    const onSubmit = async (data) => {
        setIsSubmitting(true);
        const payload = {
            title: data.assetName,
            description: data.description,
            price: data.price,
            productType: "digital",
            trackInventory: false, // Unlimited copies logic usually
            metadata: {
                fileUrl: data.fileUrl, // S3 link would be here
                fileFormat: data.fileFormat,
                licenseType: data.licenseType, // Personal vs Commercial
                fileSize: "10MB" // Mock
            }
        };
        toast.success("Digital asset published");
        router.push("/dashboard/products");
        setIsSubmitting(false);
    };
    return (_jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-8", children: [_jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-lg font-semibold border-b pb-2 text-blue-500", children: "Digital Asset" }), _jsxs("div", { className: "grid gap-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "Asset Name" }), _jsx(Input, { ...register("assetName", { required: true }), placeholder: "e.g. 3D Model Pack" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "File Format" }), _jsx(Input, { ...register("fileFormat"), placeholder: ".OB, .FBX, .PDF" })] }), _jsxs("div", { children: [_jsx(Label, { children: "Price (\u20A6)" }), _jsx(Input, { type: "number", ...register("price", { required: true }) })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "License Type" }), _jsxs("select", { className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", ...register("licenseType"), children: [_jsx("option", { value: "personal", children: "Personal Use Only" }), _jsx("option", { value: "commercial", children: "Commercial License" })] })] }), _jsxs("div", { className: "border-2 border-dashed border-blue-200 rounded p-8 bg-blue-50 text-center", children: [_jsx("p", { className: "text-blue-600 font-bold", children: "Upload Source File" }), _jsx("p", { className: "text-xs text-gray-500", children: "Secure bucket upload" })] })] })] }), _jsx("div", { className: "flex justify-end", children: _jsx(Button, { type: "submit", className: "bg-blue-600 hover:bg-blue-700", children: "Publish Asset" }) })] }));
}
