"use client";

import { useForm } from "react-hook-form";
import { Button, Input, Label, Select, Textarea } from "@vayva/ui";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

interface BookingFormProps {
    onSuccess: () => void;
    services: { id: string; name: string }[];
    customers: { id: string; name: string }[];
    initialData?: unknown;
}

interface BookingFormValues {
    serviceId: string;
    customerId: string;
    startsAt: string; // datetime-local
    endsAt: string; // datetime-local
    notes?: string;
}

export function BookingForm({ services: unknown, customers: unknown, onSuccess: unknown, initialData }: BookingFormProps) { // Updated props
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false); // Changed isSubmitting to isLoading
    const { register, handleSubmit, watch, formState: { errors } } = useForm<BookingFormValues>({ // Changed BookingFormValues to BookingFormData
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

    const onSubmit = async (data: BookingFormValues) => { // Changed BookingFormValues to BookingFormData
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
        } catch (error) { // Updated error handling
            console.error(error);
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="serviceId">Service</Label>
                    <select id="serviceId" {...register("serviceId", { required: true })} defaultValue="" className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1">
                        <option value="" disabled>Select service</option>
                        {services.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="customerId">Customer</Label>
                    <select id="customerId" {...register("customerId", { required: true })} defaultValue="" className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1">
                        <option value="" disabled>Select customer</option>
                        {customers.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="startsAt">Start Time</Label>
                    <Input
                        id="startsAt"
                        type="datetime-local"
                        {...register("startsAt", { required: true })}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="endsAt">End Time</Label>
                    <Input
                        id="endsAt"
                        type="datetime-local"
                        {...register("endsAt", { required: true })}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                    id="notes"
                    placeholder="Any special requests or details..."
                    {...register("notes")}
                />
            </div>

            <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={onSuccess}>Cancel</Button>
                <Button type="submit" className="w-full" isLoading={isLoading}>
                    {initialData ? "Update Booking" : "Create Booking"}
                </Button>
            </div>
        </form>
    );
}
