"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm, useFieldArray } from "react-hook-form";
import { Button, Input, Label, Textarea } from "@vayva/ui";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";
export function EventsProductForm({ productId, initialData }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const defaultValues = initialData || {
        title: "",
        description: "",
        venue: "",
        isOnline: false,
        startDate: "",
        endDate: "",
        doorTime: "",
        isDigitalTicket: true,
        ticketTiers: [
            { name: "General Admission", price: 0, quantity: 100 }
        ]
    };
    const { register, control, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: "ticketTiers"
    });
    const isOnline = watch("isOnline");
    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            // Map form data to backend schema
            // We use the 'price' field for the lowest ticket price for display purposes
            const lowestPrice = Math.min(...data.ticketTiers.map((t) => Number(t.price) || 0));
            const payload = {
                title: data.title,
                description: data.description,
                price: lowestPrice, // Base price for listing
                trackInventory: true, // Events usually have limited tickets
                stockQuantity: data.ticketTiers.reduce((acc, t) => acc + (Number(t.quantity) || 0), 0),
                metadata: {
                    type: "event",
                    venue: data.isOnline ? "Online" : data.venue,
                    isOnline: data.isOnline,
                    startDate: data.startDate,
                    endDate: data.endDate,
                    doorTime: data.doorTime,
                    isDigitalTicket: data.isDigitalTicket,
                    ticketTiers: data.ticketTiers
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
                throw new Error("Failed to save event");
            toast.success(productId ? "Event updated" : "Event created");
            router.push("/dashboard/products");
        }
        catch (e) {
            toast.error("Something went wrong");
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-8 max-w-4xl mx-auto", children: [_jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-xl font-semibold border-b pb-2", children: "Event Details" }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "title", children: "Event Name" }), _jsx(Input, { id: "title", ...register("title", { required: "Event name is required" }), placeholder: "e.g. Summer Music Festival" }), errors.title && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.title.message })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "description", children: "Description" }), _jsx(Textarea, { id: "description", ...register("description"), placeholder: "Describe your event line-up, special guests, etc.", rows: 4 })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx("input", { type: "checkbox", id: "isOnline", className: "w-4 h-4", ...register("isOnline") }), _jsx(Label, { htmlFor: "isOnline", className: "mb-0", children: "This is an Online Event" })] }), !isOnline && (_jsxs("div", { children: [_jsx(Label, { htmlFor: "venue", children: "Venue Location" }), _jsx(Input, { id: "venue", ...register("venue", { required: !isOnline }), placeholder: "e.g. Madison Square Garden" })] }))] }), _jsxs("div", { className: "flex items-center gap-2 mt-8", children: [_jsx("input", { type: "checkbox", id: "isDigitalTicket", className: "w-4 h-4", ...register("isDigitalTicket") }), _jsx(Label, { htmlFor: "isDigitalTicket", className: "mb-0", children: "Generate Digital Tickets (QR Code)" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "startDate", children: "Start Date & Time" }), _jsx(Input, { id: "startDate", type: "datetime-local", ...register("startDate", { required: true }) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "endDate", children: "End Date & Time" }), _jsx(Input, { id: "endDate", type: "datetime-local", ...register("endDate", { required: true }) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "doorTime", children: "Doors Open" }), _jsx(Input, { id: "doorTime", type: "time", ...register("doorTime") })] })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex justify-between items-center border-b pb-2", children: [_jsx("h3", { className: "text-xl font-semibold", children: "Ticket Tiers" }), _jsxs(Button, { type: "button", variant: "outline", size: "sm", onClick: () => append({ name: "", price: 0, quantity: 0 }), children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), " Add Tier"] })] }), _jsxs("div", { className: "space-y-4", children: [fields.map((field, index) => (_jsxs("div", { className: "flex gap-4 items-end bg-gray-50 p-4 rounded-lg border", children: [_jsxs("div", { className: "flex-1", children: [_jsx(Label, { children: "Tier Name" }), _jsx(Input, { ...register(`ticketTiers.${index}.name`, { required: true }), placeholder: "e.g. VIP, Early Bird" })] }), _jsxs("div", { className: "w-32", children: [_jsx(Label, { children: "Price" }), _jsx(Input, { type: "number", step: "0.01", ...register(`ticketTiers.${index}.price`, { required: true, min: 0 }), prefix: "\u20A6" })] }), _jsxs("div", { className: "w-32", children: [_jsx(Label, { children: "Quantity" }), _jsx(Input, { type: "number", ...register(`ticketTiers.${index}.quantity`, { required: true, min: 0 }) })] }), _jsx(Button, { type: "button", variant: "destructive", size: "icon", onClick: () => remove(index), children: _jsx(Trash2, { className: "w-4 h-4" }) })] }, field.id))), fields.length === 0 && (_jsx("p", { className: "text-gray-500 text-center py-4", children: "No ticket tiers added. Please add at least one." }))] })] }), _jsx("div", { className: "pt-4 flex justify-end", children: _jsx(Button, { type: "submit", disabled: isSubmitting, className: "min-w-[150px]", children: isSubmitting ? "Saving..." : productId ? "Update Event" : "Create Event" }) })] }));
}
