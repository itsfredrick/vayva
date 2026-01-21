"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button, Input, Textarea, Label } from "@vayva/ui";
import { useRouter } from "next/navigation";
export default function SourcingRequestForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [images, setImages] = useState([]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget);
        try {
            const res = await fetch("/api/sourcing/request", {
                method: "POST",
                body: JSON.stringify({
                    productName: formData.get("productName"),
                    description: formData.get("description"),
                    quantity: Number(formData.get("quantity")),
                    targetPrice: Number(formData.get("targetPrice")),
                    referenceUrl: formData.get("referenceUrl"),
                    images
                }),
                headers: { "Content-Type": "application/json" }
            });
            if (!res.ok)
                throw new Error("Failed to submit request");
            // Redirect to success / orders page
            router.push("/orders?tab=requests");
            router.refresh();
        }
        catch (error) {
            console.error(error);
            alert("Something went wrong. Please try again.");
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold mb-2", children: "Request a Product" }), _jsx("p", { className: "text-muted-foreground text-sm", children: "Can't find what you're looking for? Tell us, and our team in China will source it for you." })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "productName", children: "Product Name" }), _jsx(Input, { id: "productName", name: "productName", required: true, placeholder: "e.g. Wireless Noise Cancelling Headphones" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "description", children: "Detailed Description" }), _jsx(Textarea, { id: "description", name: "description", required: true, placeholder: "Describe the material, color, size, functions, etc.", className: "min-h-[120px]" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "quantity", children: "Quantity Needed" }), _jsx(Input, { id: "quantity", name: "quantity", type: "number", min: "1", required: true, placeholder: "e.g. 50" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "targetPrice", children: "Target Price (NGN)" }), _jsx(Input, { id: "targetPrice", name: "targetPrice", type: "number", min: "0", placeholder: "Optional" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "referenceUrl", children: "Reference Link (Optional)" }), _jsx(Input, { id: "referenceUrl", name: "referenceUrl", type: "url", placeholder: "https://alibaba.com/..." })] }), _jsx("div", { className: "p-4 bg-gray-50 rounded-lg border border-dashed text-center text-sm text-muted-foreground", children: "Image upload coming soon. For now, please provide a reference link." }), _jsx(Button, { type: "submit", className: "w-full h-12 text-lg", disabled: isLoading, children: isLoading ? "Submitting..." : "Submit Request" })] }));
}
