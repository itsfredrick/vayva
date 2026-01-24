"use client";

import { useForm } from "react-hook-form";
import { Button, Input, Label, Textarea } from "@vayva/ui";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function RealEstateProductForm({ productId }: { productId?: string }) {
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

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            const payload: any = {
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
            if (!res.ok) throw new Error("Failed to save property");
            toast.success(productId ? "Property updated" : "Property created");
            router.push("/dashboard/products");
        } catch (e: any) {
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto">
            <div className="space-y-4">
                <h3 className="text-xl font-semibold border-b pb-2">Property Info</h3>

                <div>
                    <Label htmlFor="title">Property Title</Label>
                    <Input id="title" {...register("title", { required: true })} placeholder="Luxury Apartment in Lekki" />
                </div>
                <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" {...register("description")} rows={4} />
                </div>
                <div>
                    <Label htmlFor="virtualTourUrl">Virtual Tour Video URL</Label>
                    <Input id="virtualTourUrl" {...register("virtualTourUrl")} placeholder="https://youtube.com/..." />
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-xl font-semibold border-b pb-2">Pricing</h3>
                <div className="flex items-center gap-2 mb-2">
                    <input type="checkbox" id="contactForPrice" className="w-4 h-4" {...register("contactForPrice")} />
                    <Label htmlFor="contactForPrice" className="mb-0">Contact for Price / Negotiable</Label>
                </div>
                {!contactForPrice && (
                    <div>
                        <Label htmlFor="price">Price (NGN)</Label>
                        <Input type="number" id="price" {...register("price", { min: 0 })} />
                    </div>
                )}
            </div>

            <div className="space-y-4">
                <h3 className="text-xl font-semibold border-b pb-2">Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div><Label>Bedrooms</Label><Input type="number" {...register("bedrooms")} /></div>
                    <div><Label>Bathrooms</Label><Input type="number" {...register("bathrooms")} /></div>
                    <div><Label>Parking Spaces</Label><Input type="number" {...register("parkingSpaces")} /></div>
                </div>

                <div>
                    <Label className="mb-2 block">Amenities</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {amenitiesList.map(item => (
                            <div key={item} className="flex items-center gap-2">
                                <input type="checkbox" value={(item as any)} {...register("amenities")} className="w-4 h-4" />
                                <span className="text-sm">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="pt-4 flex justify-end">
                <Button type="submit" disabled={isSubmitting} className="min-w-[150px]">
                    {isSubmitting ? "Saving..." : productId ? "Update Property" : "Create Property"}
                </Button>
            </div>
        </form>
    );
}
