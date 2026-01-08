"use client";

import React, { useState } from "react";
import { Button, Input, Icon } from "@vayva/ui";
import { useOnboarding } from "@/context/OnboardingContext";

export default function InventoryPage() {
    const { state, updateState, goToStep, startEditing } = useOnboarding();
    const segment = (state?.intent?.segment || "retail") as any;

    const [product, setProduct] = useState({
        name: "",
        price: "",
        description: "",
        attributes: {} as Record<string, any>
    });

    const [image, setImage] = useState<string | null>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleAttributeChange = (key: string, value: any) => {
        setProduct(prev => ({
            ...prev,
            attributes: { ...prev.attributes, [key]: value }
        }));
    };

    const handleContinue = async () => {
        const finalProduct = {
            name: product.name,
            price: parseFloat(product.price),
            description: product.description,
            image,
            segment,
            attributes: product.attributes
        };

        // Save to state/API (OnboardingService.saveStep calls /api/onboarding/save-progress)
        await updateState({
            inventory: [finalProduct]
        });

        // Edit Loop Logic
        if (state?.isEditingMode) {
            // If editing, we return to review. 
            // Note: updateState logic in Context might auto-redirect if we used goToStep("review").
            // But startEditing sets isEditingMode=true. 
            // goToStep("next") handles redirect to review if isEditingMode is true.
            await goToStep("review"); // Explicitly go to review as requested
        } else {
            await goToStep("kyc");
        }
    };

    // Dynamic Field Configs
    const renderDynamicFields = () => {
        switch (segment) {
            case "retail":
            case "fashion": // Treat fashion as retail variant
            case "wholesale": // Wholesale shares some similar traits or we can separate. Prompt has separate schema.
                if (segment === "wholesale") {
                    return (
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="MOQ" type="number" onChange={(e) => handleAttributeChange("moq", parseInt(e.target.value))} />
                            <Input label="Lead Time (Days)" type="number" onChange={(e) => handleAttributeChange("lead_time_days", parseInt(e.target.value))} />
                        </div>
                    )
                }
                return (
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Sizes (comma sep)" placeholder="S, M, L" onChange={(e) => handleAttributeChange("sizes", e.target.value.split(",").map(s => s.trim()))} />
                        <Input label="Colors (comma sep)" placeholder="Red, Blue" onChange={(e) => handleAttributeChange("colors", e.target.value.split(",").map(s => s.trim()))} />
                        <Input label="Material" onChange={(e) => handleAttributeChange("material", e.target.value)} />
                        <Input label="Weight (kg)" type="number" onChange={(e) => handleAttributeChange("weight_kg", parseFloat(e.target.value))} />
                    </div>
                );
            case "food":
                return (
                    <div className="space-y-3">
                        <Input label="Prep Time (mins)" type="number" onChange={(e) => handleAttributeChange("prep_time_mins", parseInt(e.target.value))} />
                        <textarea
                            className="w-full border rounded-lg p-2 text-sm"
                            placeholder="Ingredients (comma separated)"
                            onChange={(e) => handleAttributeChange("ingredients", e.target.value.split(",").map(s => s.trim()))}
                        />
                        <textarea
                            className="w-full border rounded-lg p-2 text-sm"
                            placeholder="Allergens (comma separated)"
                            onChange={(e) => handleAttributeChange("allergens", e.target.value.split(",").map(s => s.trim()))}
                        />
                    </div>
                );
            case "services":
                return (
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Duration (mins)" type="number" onChange={(e) => handleAttributeChange("duration_minutes", parseInt(e.target.value))} />
                        <Input label="Buffer (mins)" type="number" onChange={(e) => handleAttributeChange("buffer_time", parseInt(e.target.value))} />
                        <Input label="Meeting Link" placeholder="https://zoom.us/..." onChange={(e) => handleAttributeChange("meeting_link", e.target.value)} />
                        <select className="border rounded-lg px-3" onChange={(e) => handleAttributeChange("location_type", e.target.value)}>
                            <option value="Physical">Physical</option>
                            <option value="Virtual">Virtual</option>
                        </select>
                    </div>
                );
            case "real-estate":
                return (
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Bedrooms" type="number" onChange={(e) => handleAttributeChange("bedrooms", parseInt(e.target.value))} />
                        <Input label="Bathrooms" type="number" onChange={(e) => handleAttributeChange("bathrooms", parseInt(e.target.value))} />
                        <Input label="Sqft" type="number" onChange={(e) => handleAttributeChange("sqft", parseInt(e.target.value))} />
                        <select className="border rounded-lg px-3" onChange={(e) => handleAttributeChange("property_type", e.target.value)}>
                            <option value="Apartment">Apartment</option>
                            <option value="House">House</option>
                            <option value="Land">Land</option>
                            <option value="Office">Office</option>
                        </select>
                        <Input label="Amenities (comma sep)" className="col-span-2" onChange={(e) => handleAttributeChange("amenities", e.target.value.split(",").map(s => s.trim()))} />
                    </div>
                );
            case "digital":
                return (
                    <div className="space-y-3">
                        <Input label="File URL" placeholder="https://..." onChange={(e) => handleAttributeChange("file_url", e.target.value)} />
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="File Size" placeholder="10MB" onChange={(e) => handleAttributeChange("file_size", e.target.value)} />
                            <select className="border rounded-lg px-3" onChange={(e) => handleAttributeChange("license_type", e.target.value)}>
                                <option value="Personal">Personal</option>
                                <option value="Commercial">Commercial</option>
                            </select>
                        </div>
                    </div>
                );
            case "events":
                return (
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Event Date" type="datetime-local" onChange={(e) => handleAttributeChange("event_date", new Date(e.target.value).toISOString())} />
                        <Input label="Venue Address" onChange={(e) => handleAttributeChange("venue_address", e.target.value)} />
                        {/* Virtual toggle could require customized Checkbox */}
                    </div>
                );
            case "education":
                return (
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Total Hours" type="number" onChange={(e) => handleAttributeChange("total_hours", parseFloat(e.target.value))} />
                        <div className="flex items-center gap-2 border rounded-lg px-3">
                            <input type="checkbox" onChange={(e) => handleAttributeChange("certificate_included", e.target.checked)} />
                            <span className="text-sm">Certificate Included</span>
                        </div>
                    </div>
                );
            case "non-profit":
                return (
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Goal Amount" type="number" onChange={(e) => handleAttributeChange("goal_amount", parseFloat(e.target.value))} />
                        <div className="flex items-center gap-2 border rounded-lg px-3">
                            <input type="checkbox" onChange={(e) => handleAttributeChange("is_recurring", e.target.checked)} />
                            <span className="text-sm">Recurring Donation</span>
                        </div>
                    </div>
                );
            default:
                return <p className="text-sm text-gray-500 italic">Basic product details only.</p>;
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-8">
            <div className="mb-8 relative">
                {/* Motivation Banner */}
                <div className="absolute -top-12 left-0 w-full animate-in slide-in-from-top-4 fade-in duration-700 delay-100">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center justify-between text-sm font-medium">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">🚀</span>
                            <span>You’re over 50% done! Your store identity is saved. Let’s add your first product.</span>
                        </div>
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2 mt-12">
                    {state?.isEditingMode ? "Update Product" : "Add your first product"}
                </h1>
                <p className="text-gray-500">
                    Let's populate your store. You can add more later.
                </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-8">
                {/* Image Upload */}
                <div className="w-full md:w-1/3">
                    <label className="block w-full aspect-square rounded-2xl border-2 border-dashed border-gray-200 hover:border-black hover:bg-gray-50 transition-all cursor-pointer flex flex-col items-center justify-center relative overflow-hidden group">
                        {image ? (
                            <img src={image} className="w-full h-full object-cover" alt="Product" />
                        ) : (
                            <>
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-white group-hover:shadow-md">
                                    <Icon name="Image" className="text-gray-400 group-hover:text-black" size={24} />
                                </div>
                                <span className="text-xs font-bold text-gray-500 group-hover:text-black">Upload Image</span>
                            </>
                        )}
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                </div>

                {/* Product Details Form */}
                <div className="flex-1 space-y-4">
                    <Input
                        label="Product Name"
                        placeholder="e.g. Vintage T-Shirt"
                        value={product.name}
                        onChange={(e) => setProduct({ ...product, name: e.target.value })}
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Price (₦)"
                            placeholder="0.00"
                            type="number"
                            value={product.price}
                            onChange={(e) => setProduct({ ...product, price: e.target.value })}
                            required
                        />
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                            {segment} specific details
                        </h4>
                        {renderDynamicFields()}
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            className="w-full rounded-xl border border-gray-200 p-3 min-h-[100px] outline-none focus:border-black"
                            placeholder="Tell customers about this item..."
                            value={product.description}
                            onChange={(e) => setProduct({ ...product, description: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-8">
                <Button
                    onClick={handleContinue}
                    disabled={!product.name || !product.price || !image}
                    className="!bg-black text-white px-10 rounded-xl h-12 shadow-lg hover:shadow-xl transition-all"
                >
                    {state?.isEditingMode ? "Save & Return to Review" : "Save & Continue"}
                    <Icon name="ArrowRight" className="ml-2 w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
