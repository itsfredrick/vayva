"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { Button, Input, Textarea, Label, Select } from "@vayva/ui";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";

interface EventsProductFormProps {
    productId?: string;
    initialData?: any;
}

export function EventsProductForm({ productId, initialData }: EventsProductFormProps) {
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

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            // Map form data to backend schema
            // We use the 'price' field for the lowest ticket price for display purposes
            const lowestPrice = Math.min(...data.ticketTiers.map((t: any) => Number(t.price) || 0));

            const payload = {
                title: data.title,
                description: data.description,
                price: lowestPrice, // Base price for listing
                trackInventory: true, // Events usually have limited tickets
                stockQuantity: data.ticketTiers.reduce((acc: number, t: any) => acc + (Number(t.quantity) || 0), 0),
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

            if (!res.ok) throw new Error("Failed to save event");

            toast.success(productId ? "Event updated" : "Event created");
            router.push("/dashboard/products");
        } catch (e) {
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto">
            <div className="space-y-4">
                <h3 className="text-xl font-semibold border-b pb-2">Event Details</h3>

                <div>
                    <Label htmlFor="title">Event Name</Label>
                    <Input
                        id="title"
                        {...register("title", { required: "Event name is required" })}
                        placeholder="e.g. Summer Music Festival"
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message as string}</p>}
                </div>

                <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        {...register("description")}
                        placeholder="Describe your event line-up, special guests, etc."
                        rows={4}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <input
                                type="checkbox"
                                id="isOnline"
                                className="w-4 h-4"
                                {...register("isOnline")}
                            />
                            <Label htmlFor="isOnline" className="mb-0">This is an Online Event</Label>
                        </div>

                        {!isOnline && (
                            <div>
                                <Label htmlFor="venue">Venue Location</Label>
                                <Input
                                    id="venue"
                                    {...register("venue", { required: !isOnline })}
                                    placeholder="e.g. Madison Square Garden"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 mt-8">
                        <input
                            type="checkbox"
                            id="isDigitalTicket"
                            className="w-4 h-4"
                            {...register("isDigitalTicket")}
                        />
                        <Label htmlFor="isDigitalTicket" className="mb-0">Generate Digital Tickets (QR Code)</Label>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <Label htmlFor="startDate">Start Date & Time</Label>
                        <Input
                            id="startDate"
                            type="datetime-local"
                            {...register("startDate", { required: true })}
                        />
                    </div>
                    <div>
                        <Label htmlFor="endDate">End Date & Time</Label>
                        <Input
                            id="endDate"
                            type="datetime-local"
                            {...register("endDate", { required: true })}
                        />
                    </div>
                    <div>
                        <Label htmlFor="doorTime">Doors Open</Label>
                        <Input
                            id="doorTime"
                            type="time"
                            {...register("doorTime")}
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="text-xl font-semibold">Ticket Tiers</h3>
                    <Button type="button" variant="outline" size="sm" onClick={() => append({ name: "", price: 0, quantity: 0 })}>
                        <Plus className="w-4 h-4 mr-2" /> Add Tier
                    </Button>
                </div>

                <div className="space-y-4">
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex gap-4 items-end bg-gray-50 p-4 rounded-lg border">
                            <div className="flex-1">
                                <Label>Tier Name</Label>
                                <Input
                                    {...register(`ticketTiers.${index}.name` as const, { required: true })}
                                    placeholder="e.g. VIP, Early Bird"
                                />
                            </div>
                            <div className="w-32">
                                <Label>Price</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    {...register(`ticketTiers.${index}.price` as const, { required: true, min: 0 })}
                                    prefix="₦"
                                />
                            </div>
                            <div className="w-32">
                                <Label>Quantity</Label>
                                <Input
                                    type="number"
                                    {...register(`ticketTiers.${index}.quantity` as const, { required: true, min: 0 })}
                                />
                            </div>
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => remove(index)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                    {fields.length === 0 && (
                        <p className="text-gray-500 text-center py-4">No ticket tiers added. Please add at least one.</p>
                    )}
                </div>
            </div>

            <div className="pt-4 flex justify-end">
                <Button type="submit" disabled={isSubmitting} className="min-w-[150px]">
                    {isSubmitting ? "Saving..." : productId ? "Update Event" : "Create Event"}
                </Button>
            </div>
        </form>
    );
}
