"use client";

import { useForm } from "react-hook-form";
import { Button, Input, Label, Textarea } from "@vayva/ui";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface RealEstateFormProps {
    onSuccess: () => void;
}

interface RealEstateFormValues {
    title: string;
    description: string;
    price: number;
    type: string;
    maxGuests: number;
    bedCount: number;
    bathrooms: number;
    totalUnits: number;
    amenities: string; // Comma separated for MVP
}

export function RealEstateForm({ onSuccess, initialData }: RealEstateFormProps & { initialData?: any }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<RealEstateFormValues>({
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

    const onSubmit = async (data: RealEstateFormValues) => {
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
        } catch (error: any) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Same fields... */}
            <div className="space-y-2">
                <Label htmlFor="title">Property Title</Label>
                <Input
                    id="title"
                    placeholder="e.g. Ocean View Villa"
                    {...register("title", { required: true })}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description (Markdown supported)</Label>
                <Textarea
                    id="description"
                    placeholder="Describe your property..."
                    {...register("description")}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="price">Price per Night (₦)</Label>
                    <Input
                        id="price"
                        type="number"
                        {...register("price", { required: true, min: 0 })}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="type">Property Type</Label>
                    <select {...register("type")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                        <option value="ROOM">Room</option>
                        <option value="SUITE">Suite</option>
                        <option value="VILLA">Villa</option>
                        <option value="APARTMENT">Apartment</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="maxGuests">Guests</Label>
                    <Input id="maxGuests" type="number" {...register("maxGuests", { min: 1 })} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="bedCount">Beds</Label>
                    <Input id="bedCount" type="number" {...register("bedCount", { min: 1 })} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="bathrooms">Baths</Label>
                    <Input id="bathrooms" type="number" {...register("bathrooms", { min: 1 })} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="totalUnits">Quantity</Label>
                    <Input id="totalUnits" type="number" {...register("totalUnits", { min: 1 })} />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="amenities">Amenities (Comma separated)</Label>
                <Input
                    id="amenities"
                    placeholder="WiFi, Pool, Gym, Parking"
                    {...register("amenities")}
                />
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onSuccess}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData ? "Update Property" : "List Property"}
                </Button>
            </div>
        </form>
    );
}
