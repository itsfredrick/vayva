"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from "react-hook-form";
import { Button, Input, Label, Textarea } from "@vayva/ui";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
export function RealEstateProductForm({ productId }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: {
            title: "",
            description: "",
            price: 0,
            contactForPrice: false,
            bedrooms: 0,
            bathrooms: 0,
            parkingSpaces: 0,
            virtualTourUrl: "",
            amenities: []
        }
    });
    const contactForPrice = watch("contactForPrice");
    const amenitiesList = ["WiFi", "Pool", "Gym", "Security", "Parking", "Air Conditioning", "Furnished"];
    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const payload = {
                title: data.title,
                description: data.description,
                price: contactForPrice ? 0 : Number(data.price),
                attributes: {
                    property_type: "Apartment", // Default or add selector
                    bedrooms: Number(data.bedrooms),
                    bathrooms: Number(data.bathrooms),
                    parking_spaces: Number(data.parkingSpaces),
                    virtual_tour_url: data.virtualTourUrl || undefined,
                    amenities: data.amenities
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
                throw new Error("Failed to save property");
            toast.success(productId ? "Property updated" : "Property created");
            router.push("/dashboard/products");
        }
        catch (e) {
            toast.error("Something went wrong");
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-8 max-w-4xl mx-auto", children: [_jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-xl font-semibold border-b pb-2", children: "Property Info" }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "title", children: "Property Title" }), _jsx(Input, { id: "title", ...register("title", { required: true }), placeholder: "Luxury Apartment in Lekki" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "description", children: "Description" }), _jsx(Textarea, { id: "description", ...register("description"), rows: 4 })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "virtualTourUrl", children: "Virtual Tour Video URL" }), _jsx(Input, { id: "virtualTourUrl", ...register("virtualTourUrl"), placeholder: "https://youtube.com/..." })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-xl font-semibold border-b pb-2", children: "Pricing" }), _jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx("input", { type: "checkbox", id: "contactForPrice", className: "w-4 h-4", ...register("contactForPrice") }), _jsx(Label, { htmlFor: "contactForPrice", className: "mb-0", children: "Contact for Price / Negotiable" })] }), !contactForPrice && (_jsxs("div", { children: [_jsx(Label, { htmlFor: "price", children: "Price (NGN)" }), _jsx(Input, { type: "number", id: "price", ...register("price", { min: 0 }) })] }))] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-xl font-semibold border-b pb-2", children: "Features" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs("div", { children: [_jsx(Label, { children: "Bedrooms" }), _jsx(Input, { type: "number", ...register("bedrooms") })] }), _jsxs("div", { children: [_jsx(Label, { children: "Bathrooms" }), _jsx(Input, { type: "number", ...register("bathrooms") })] }), _jsxs("div", { children: [_jsx(Label, { children: "Parking Spaces" }), _jsx(Input, { type: "number", ...register("parkingSpaces") })] })] }), _jsxs("div", { children: [_jsx(Label, { className: "mb-2 block", children: "Amenities" }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: amenitiesList.map(item => (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", value: item, ...register("amenities"), className: "w-4 h-4" }), _jsx("span", { className: "text-sm", children: item })] }, item))) })] })] }), _jsx("div", { className: "pt-4 flex justify-end", children: _jsx(Button, { type: "submit", disabled: isSubmitting, className: "min-w-[150px]", children: isSubmitting ? "Saving..." : productId ? "Update Property" : "Create Property" }) })] }));
}
