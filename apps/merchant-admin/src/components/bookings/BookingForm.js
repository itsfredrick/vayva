"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from "react-hook-form";
import { Button, Input, Label, Textarea } from "@vayva/ui";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { format } from "date-fns";
export function BookingForm({ services, customers, onSuccess, initialData }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false); // Changed isSubmitting to isLoading
    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: initialData ? {
            serviceId: initialData.serviceId,
            customerId: initialData.customerId,
            startsAt: format(new Date(initialData.startsAt), "yyyy-MM-dd'T'HH:mm"),
            endsAt: format(new Date(initialData.endsAt), "yyyy-MM-dd'T'HH:mm"), // Added endsAt formatting
            notes: initialData.notes || "",
            // Assume customerName/Email logic mainly for new bookings, but if editing, we might want to show them?
            // For now, edit mode usually assumes existing customer or service.
        } : undefined
    });
    const isExistingCustomer = !!watch("customerId"); // Added this line
    const onSubmit = async (data) => {
        setIsLoading(true); // Changed setIsSubmitting to setIsLoading
        try {
            const url = initialData ? `/api/bookings/${initialData.id}` : "/api/bookings";
            const method = initialData ? "PUT" : "POST";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...data,
                    startsAt: new Date(data.startsAt).toISOString(),
                    endsAt: new Date(data.endsAt).toISOString(),
                    // If creating new customer (no ID selected)
                    // If editing, existing IDs are used
                }),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to save booking");
            }
            toast.success(initialData ? "Booking updated" : "Booking created successfully"); // Updated toast message
            router.refresh(); // Refresh server data
            onSuccess();
        }
        catch (error) { // Updated error handling
            console.error(error);
            toast.error(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "serviceId", children: "Service" }), _jsxs("select", { id: "serviceId", ...register("serviceId", { required: true }), defaultValue: "", className: "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", children: [_jsx("option", { value: "", disabled: true, children: "Select service" }), services.map(s => (_jsx("option", { value: s.id, children: s.name }, s.id)))] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "customerId", children: "Customer" }), _jsxs("select", { id: "customerId", ...register("customerId", { required: true }), defaultValue: "", className: "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", children: [_jsx("option", { value: "", disabled: true, children: "Select customer" }), customers.map(c => (_jsx("option", { value: c.id, children: c.name }, c.id)))] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "startsAt", children: "Start Time" }), _jsx(Input, { id: "startsAt", type: "datetime-local", ...register("startsAt", { required: true }) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "endsAt", children: "End Time" }), _jsx(Input, { id: "endsAt", type: "datetime-local", ...register("endsAt", { required: true }) })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "notes", children: "Notes" }), _jsx(Textarea, { id: "notes", placeholder: "Any special requests or details...", ...register("notes") })] }), _jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [_jsx(Button, { type: "button", variant: "outline", onClick: onSuccess, children: "Cancel" }), _jsx(Button, { type: "submit", className: "w-full", isLoading: isLoading, children: initialData ? "Update Booking" : "Create Booking" })] })] }));
}
