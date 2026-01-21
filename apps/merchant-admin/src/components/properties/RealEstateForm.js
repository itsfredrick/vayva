"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from "react-hook-form";
import { Button, Input, Label, Textarea } from "@vayva/ui";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
export function RealEstateForm({ onSuccess, initialData }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: initialData ? {
            title: initialData.product?.name || initialData.title,
            description: initialData.product?.description || initialData.description,
            price: Number(initialData.product?.price || initialData.price),
            type: initialData.type,
            maxGuests: initialData.maxGuests,
            bedCount: initialData.bedCount,
            bathrooms: initialData.bathrooms,
            totalUnits: initialData.totalUnits,
            amenities: Array.isArray(initialData.amenities) ? initialData.amenities.join(", ") : (initialData.amenities || "")
        } : {
            type: "ROOM",
            maxGuests: 2,
            bedCount: 1,
            bathrooms: 1,
            totalUnits: 1
        }
    });
    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const url = initialData ? `/api/properties/${initialData.id}` : "/api/properties";
            const method = initialData ? "PUT" : "POST";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...data,
                    // Parse amenities string to array
                    amenities: data.amenities.split(',').map(s => s.trim()).filter(Boolean)
                }),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to save property");
            }
            toast.success(initialData ? "Property updated" : "Property listed successfully");
            router.refresh();
            onSuccess();
        }
        catch (error) {
            console.error(error);
            toast.error(error.message);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "title", children: "Property Title" }), _jsx(Input, { id: "title", placeholder: "e.g. Ocean View Villa", ...register("title", { required: true }) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "description", children: "Description (Markdown supported)" }), _jsx(Textarea, { id: "description", placeholder: "Describe your property...", ...register("description") })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "price", children: "Price per Night (\u20A6)" }), _jsx(Input, { id: "price", type: "number", ...register("price", { required: true, min: 0 }) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "type", children: "Property Type" }), _jsxs("select", { ...register("type"), className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", children: [_jsx("option", { value: "ROOM", children: "Room" }), _jsx("option", { value: "SUITE", children: "Suite" }), _jsx("option", { value: "VILLA", children: "Villa" }), _jsx("option", { value: "APARTMENT", children: "Apartment" })] })] })] }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "maxGuests", children: "Guests" }), _jsx(Input, { id: "maxGuests", type: "number", ...register("maxGuests", { min: 1 }) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "bedCount", children: "Beds" }), _jsx(Input, { id: "bedCount", type: "number", ...register("bedCount", { min: 1 }) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "bathrooms", children: "Baths" }), _jsx(Input, { id: "bathrooms", type: "number", ...register("bathrooms", { min: 1 }) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "totalUnits", children: "Quantity" }), _jsx(Input, { id: "totalUnits", type: "number", ...register("totalUnits", { min: 1 }) })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "amenities", children: "Amenities (Comma separated)" }), _jsx(Input, { id: "amenities", placeholder: "WiFi, Pool, Gym, Parking", ...register("amenities") })] }), _jsxs("div", { className: "flex justify-end gap-2 pt-4", children: [_jsx(Button, { type: "button", variant: "outline", onClick: onSuccess, children: "Cancel" }), _jsxs(Button, { type: "submit", disabled: isSubmitting, children: [isSubmitting && _jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), initialData ? "Update Property" : "List Property"] })] })] }));
}
