"use client";

import { useForm } from "react-hook-form";
import { Badge, Button, Icon, Input, Label, Textarea } from "@vayva/ui";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { X, Plus, Trash2 } from "lucide-react";
import { useVariantManager, GeneratedVariant, ProductOption } from "./hooks/useVariantManager";


interface RetailProductFormValues {
    title: string;
    description: string;
    price: number | string;
    sku: string;
    trackInventory: boolean;
    stockQuantity: number;
    vehicle?: {
        year?: number;
        make?: string;
        model?: string;
        vin?: string;
        mileage?: number;
        fuelType?: string;
        transmission?: string;
    };
    accommodation?: {
        type?: string;
        maxGuests?: number;
        bedCount?: number;
        bathrooms?: number;
        totalUnits?: number;
    };
}

interface RetailProductFormProps {
    productId?: string;
    initialData?: Partial<RetailProductFormValues>;
    storeCategory?: string;
}


export function RetailProductForm({ productId, initialData, storeCategory }: RetailProductFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Variant Logic extracted to hook
    const {
        options,
        variants,
        addOption,
        removeOption,
        updateOptionName,
        addValueToOption,
        removeValueFromOption,
        updateVariantField
    } = useVariantManager();

    const { register, handleSubmit, getValues, formState: { errors } } = useForm<RetailProductFormValues>({
        defaultValues: (initialData as any) || {
            title: "",
            description: "",
            price: 0,
            sku: "",
            trackInventory: true,
            stockQuantity: 0,
        }
    });

    const onSubmit = async (data: RetailProductFormValues) => {
        setIsSubmitting(true);
        try {
            const endpoint = productId
                ? `/api/products/${productId}`
                : "/api/products/create";

            const method = productId ? "PATCH" : "POST";

            // Payload Construction
            const payload: any = {
                ...data,
                // If variants exist, we send them. 
                // Note: The API must handle this.
                variants: variants.length > 0 ? variants : undefined
            };

            const res = await fetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to save product");

            toast.success(productId ? "Product updated" : "Product created");
            router.push("/dashboard/products");
        } catch (e: any) {
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Helper for generating SKU
    const generateBaseSku = () => {
        return variants.map((v, i) => updateVariantField(i, 'sku', `${getValues('sku')}-${i + 1}`));
    }


    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Details */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Basic Info</h3>
                <div className="grid gap-4">
                    <div>
                        <Label htmlFor="title">Product Title</Label>
                        <Input
                            id="title"
                            {...register("title", { required: "Title is required" })}
                            placeholder="e.g. Classic White T-Shirt"
                        />
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message as string}</p>}
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            {...register("description")}
                            placeholder="Describe your product..."
                            rows={4}
                        />
                    </div>
                </div>
            </div>

            {/* Automotive Fields */}
            {storeCategory === "Automotive" && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
                    <h3 className="text-lg font-semibold border-b pb-2 text-blue-700">Vehicle Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <Label htmlFor="year">Year</Label>
                            <Input
                                id="year"
                                type="number"
                                {...register("vehicle.year", { valueAsNumber: true })}
                                placeholder="2024"
                            />
                        </div>
                        <div>
                            <Label htmlFor="make">Make</Label>
                            <Input
                                id="make"
                                {...register("vehicle.make")}
                                placeholder="Toyota"
                            />
                        </div>
                        <div>
                            <Label htmlFor="model">Model</Label>
                            <Input
                                id="model"
                                {...register("vehicle.model")}
                                placeholder="Camry"
                            />
                        </div>
                        <div>
                            <Label htmlFor="vin">VIN (Optional)</Label>
                            <Input
                                id="vin"
                                {...register("vehicle.vin")}
                                placeholder="17-char VIN"
                            />
                        </div>
                        <div>
                            <Label htmlFor="mileage">Mileage</Label>
                            <Input
                                id="mileage"
                                type="number"
                                {...register("vehicle.mileage", { valueAsNumber: true })}
                                placeholder="0"
                            />
                        </div>
                        <div>
                            <Label htmlFor="fuelType">Fuel Type</Label>
                            <select
                                id="fuelType"
                                {...register("vehicle.fuelType")}
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="PETROL">Petrol</option>
                                <option value="DIESEL">Diesel</option>
                                <option value="ELECTRIC">Electric</option>
                                <option value="HYBRID">Hybrid</option>
                            </select>
                        </div>
                        <div>
                            <Label htmlFor="transmission">Transmission</Label>
                            <select
                                id="transmission"
                                {...register("vehicle.transmission")}
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="AUTOMATIC">Automatic</option>
                                <option value="MANUAL">Manual</option>
                                <option value="CVT">CVT</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Travel Fields */}
            {storeCategory === "Travel" && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
                    <h3 className="text-lg font-semibold border-b pb-2 text-indigo-700">Accommodation Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <Label htmlFor="type">Room Type</Label>
                            <select
                                id="type"
                                {...register("accommodation.type")}
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="ROOM">Room</option>
                                <option value="SUITE">Suite</option>
                                <option value="VILLA">Villa</option>
                                <option value="APARTMENT">Apartment</option>
                                <option value="HOSTEL_BED">Hostel Bed</option>
                                <option value="CAMP_SITE">Camp Site</option>
                            </select>
                        </div>
                        <div>
                            <Label htmlFor="maxGuests">Max Guests</Label>
                            <Input
                                id="maxGuests"
                                type="number"
                                {...register("accommodation.maxGuests", { valueAsNumber: true })}
                                placeholder="2"
                            />
                        </div>
                        <div>
                            <Label htmlFor="bedCount">Bed Count</Label>
                            <Input
                                id="bedCount"
                                type="number"
                                {...register("accommodation.bedCount", { valueAsNumber: true })}
                                placeholder="1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="bathrooms">Bathrooms</Label>
                            <Input
                                id="bathrooms"
                                type="number"
                                {...register("accommodation.bathrooms", { valueAsNumber: true })}
                                placeholder="1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="totalUnits">Total Units (Inventory)</Label>
                            <Input
                                id="totalUnits"
                                type="number"
                                {...register("accommodation.totalUnits", { valueAsNumber: true })}
                                placeholder="1"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Pricing & Inventory */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Pricing & Inventory</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <Label htmlFor="price">Base Price</Label>
                        <Input
                            id="price"
                            type="number"
                            step="0.01"
                            {...register("price", { required: true, min: 0 })}
                            prefix="₦"
                        />
                    </div>
                    <div>
                        <Label htmlFor="sku">SKU (Stock Keeping Unit)</Label>
                        <Input
                            id="sku"
                            {...register("sku")}
                            placeholder="TSH-001"
                        />
                    </div>
                    <div>
                        <Label htmlFor="stockQuantity">Stock Quantity</Label>
                        <Input
                            id="stockQuantity"
                            type="number"
                            {...register("stockQuantity", { min: 0 })}
                            disabled={variants.length > 0} // Disable main stock if variants exist
                        />
                        {variants.length > 0 && <p className="text-xs text-gray-500 mt-1">Managed via variants</p>}
                    </div>
                </div>
            </div>

            {/* VARIANTS SECTION */}
            <div className="space-y-6 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Product Options</h3>
                    <Button type="button" variant="outline" size="sm" onClick={addOption} className="gap-2">
                        <Plus size={16} /> Add Option
                    </Button>
                </div>

                {options.length === 0 && (
                    <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg border border-dashed border-gray-200">
                        Does this product have variants like Color or Size? Click "Add Option" to configure.
                    </div>
                )}

                {/* Option Configurator */}
                <div className="space-y-4">
                    {options.map((option, idx) => (
                        <div key={option.id} className="bg-white border rounded-xl p-4 shadow-sm relative group">
                            <Button
                                type="button"
                                onClick={() => removeOption(idx)}
                                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Remove Option"
                                aria-label="Remove Option"
                            >
                                <X size={16} />
                            </Button>

                            <div className="grid md:grid-cols-[200px_1fr] gap-6">
                                <div>
                                    <Label className="mb-2 block text-xs uppercase tracking-wider text-gray-500">Option Name</Label>
                                    <Input
                                        value={(option.name as any)}
                                        onChange={(e: any) => updateOptionName(idx, e.target.value)}
                                        placeholder="e.g. Color"
                                        className="h-9"
                                    />
                                </div>
                                <div>
                                    <Label className="mb-2 block text-xs uppercase tracking-wider text-gray-500">Option Values</Label>
                                    <div className="flex flex-wrap gap-2 items-center">
                                        {option.values.map((val, vIdx) => (
                                            <Badge key={vIdx} variant="default" className="bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors py-1.5 px-3">
                                                {val}
                                                <Button
                                                    type="button"
                                                    onClick={() => removeValueFromOption(idx, vIdx)}
                                                    className="ml-2 hover:text-red-500"
                                                    title="Remove Value"
                                                    aria-label="Remove Value"
                                                >
                                                    <X size={12} />
                                                </Button>
                                            </Badge>
                                        ))}
                                        <div className="relative">
                                            <Input
                                                placeholder="Add value..."
                                                className="h-9 w-[120px] bg-transparent border-dashed"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        addValueToOption(idx, e.currentTarget.value);
                                                        e.currentTarget.value = "";
                                                    }
                                                }}
                                                onBlur={(e) => {
                                                    if (e.target.value) {
                                                        addValueToOption(idx, e.target.value);
                                                        e.target.value = "";
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Generated Variants Table */}
                {variants.length > 0 && (
                    <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500">Preview ({variants.length} Variants)</h4>
                        </div>
                        <div className="border rounded-xl bg-white overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-4 py-3 font-medium text-gray-700">Variant</th>
                                            <th className="px-4 py-3 font-medium text-gray-700 w-[120px]">Price</th>
                                            <th className="px-4 py-3 font-medium text-gray-700 w-[100px]">Stock</th>
                                            <th className="px-4 py-3 font-medium text-gray-700 w-[150px]">SKU</th>
                                            <th className="px-4 py-3 font-medium text-gray-700 w-[50px]"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {variants.map((variant, i) => (
                                            <tr key={variant.id} className="group hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-3 font-medium text-gray-900">{variant.title}</td>
                                                <td className="px-4 py-2">
                                                    <Input
                                                        type="number"
                                                        value={(variant.price as any)}
                                                        onChange={(e: any) => updateVariantField(i, 'price', parseFloat(e.target.value))}
                                                        className="h-9"
                                                        prefix="₦"
                                                    />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <Input
                                                        type="number"
                                                        value={(variant.stock as any)}
                                                        onChange={(e: any) => updateVariantField(i, 'stock', parseInt(e.target.value))}
                                                        className="h-9"
                                                    />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <Input
                                                        value={(variant.sku as any)}
                                                        onChange={(e: any) => updateVariantField(i, 'sku', e.target.value)}
                                                        className="h-9"
                                                        placeholder="SKU"
                                                    />
                                                </td>
                                                <td className="px-4 py-2 text-right">
                                                    {/* Actions if needed */}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Images - Placeholder for now */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Gallery</h3>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center text-gray-500">
                    <p>Image upload component would go here.</p>
                    <p className="text-xs mt-2">(Using placeholders for MVP)</p>
                </div>
            </div>

            <div className="pt-4 flex justify-end">
                <Button type="submit" disabled={isSubmitting} className="min-w-[150px]">
                    {isSubmitting ? "Saving..." : productId ? "Update Product" : "Create Product"}
                </Button>
            </div>
        </form>
    );
}
