import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { productSchema } from "@/lib/product-schema";
import { ProductServiceType, ProductServiceStatus, } from "@vayva/shared";
import { Button, Drawer, Icon, Input, Label, Textarea, Select, Switch } from "@vayva/ui";
// Image Uploader Component
const ImageUploader = ({ images, onChange, }) => {
    const fileInputRef = React.useRef(null);
    const { data: session } = useSession();
    const [isProcessing, setIsProcessing] = useState(null);
    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsProcessing(-1); // Use -1 to indicate general upload processing
            const formData = new FormData();
            formData.append("file", file);
            try {
                const res = await fetch("/api/storage/upload", {
                    method: "POST",
                    body: formData,
                });
                if (!res.ok) {
                    const error = await res.json();
                    throw new Error(error.message || "Upload failed");
                }
                const data = await res.json();
                onChange([...images, data.url]);
                toast.success("Image uploaded successfully");
            }
            catch (error) {
                toast.error("Upload failed", {
                    description: error.message,
                });
            }
            finally {
                setIsProcessing(null);
            }
        }
    };
    const removeImage = (index) => {
        onChange(images.filter((_, i) => i !== index));
    };
    const handleRemoveBackground = async (index) => {
        const plan = session?.user?.plan || "FREE";
        if (plan !== "PRO") {
            toast.info("Pro Feature", {
                description: "Upgrade to Pro to use Vayva Cut Pro and get studio-quality product photos in one click!",
                action: {
                    label: "Upgrade",
                    onClick: () => window.location.href = "/dashboard/billing"
                }
            });
            return;
        }
        setIsProcessing(index);
        try {
            // Mock background removal
            await new Promise(resolve => setTimeout(resolve, 2000));
            toast.success("Background removed successfully!");
            // In a real app, we'd call an API and update the URL
        }
        catch (error) {
            toast.error("Failed to remove background");
        }
        finally {
            setIsProcessing(null);
        }
    };
    return (_jsxs("div", { className: "space-y-3", children: [_jsx(Label, { className: "text-xs font-bold text-gray-700 uppercase tracking-wide", children: "Product Images" }), _jsxs("div", { className: "flex flex-wrap gap-3", children: [images.map((url, i) => (_jsxs("div", { className: "relative w-24 h-24 rounded-lg border border-gray-200 overflow-hidden group bg-gray-50", children: [_jsx("img", { src: url, alt: `Product ${i + 1}`, className: "w-full h-full object-cover" }), _jsxs("div", { className: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1", children: [_jsx(Button, { type: "button", onClick: () => handleRemoveBackground(i), variant: "ghost", disabled: isProcessing === i, className: "w-full h-7 bg-white/90 hover:bg-white text-[10px] font-bold uppercase rounded flex items-center justify-center gap-1 text-black", children: isProcessing === i ? ("Processing...") : (_jsxs(_Fragment, { children: [_jsx(Icon, { name: "Sparkles", size: 12 }), "Cut Pro"] })) }), _jsxs(Button, { type: "button", onClick: () => removeImage(i), variant: "destructive", className: "w-full h-7 bg-red-500/90 hover:bg-red-500 text-[10px] font-bold uppercase rounded flex items-center justify-center gap-1 text-white", children: [_jsx(Icon, { name: "Trash2", size: 12 }), "Delete"] })] })] }, i))), _jsxs(Button, { type: "button", onClick: () => fileInputRef.current?.click(), variant: "ghost", disabled: isProcessing === -1, className: "w-24 h-24 rounded-lg border-2 border-dashed border-gray-200 hover:border-vayva-green hover:bg-gray-50 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer", children: [isProcessing === -1 ? (_jsx("div", { className: "animate-spin rounded-full h-5 w-5 border-b-2 border-vayva-green" })) : (_jsx(Icon, { name: "Upload", size: 20, className: "text-gray-400" })), _jsx("span", { className: "text-[10px] uppercase font-bold text-gray-400", children: isProcessing === -1 ? "Uploading..." : "Add Image" })] }), _jsx("input", { ref: fileInputRef, id: "product-image-upload", type: "file", accept: "image/*", className: "hidden", onChange: handleFileChange, "aria-label": "Upload product image" })] })] }));
};
export const ProductDrawer = ({ isOpen, onClose, onSubmit, initialData, isLoading, }) => {
    const { register, handleSubmit, watch, setValue, reset, formState: { errors, isSubmitting }, } = useForm({
        resolver: zodResolver(productSchema),
        defaultValues: {
            type: ProductServiceType.RETAIL,
            status: ProductServiceStatus.ACTIVE,
            inventory: { enabled: true, quantity: 0 },
            availability: {
                days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
                timeRange: "09:00 - 17:00",
            },
            images: [],
        },
    });
    const selectedType = watch("type");
    const inventoryEnabled = watch("inventory.enabled");
    const currentImages = watch("images") || [];
    useEffect(() => {
        if (isOpen && initialData) {
            // Map types manually to ensure compatibility if necessary
            reset({
                ...initialData,
                title: initialData.name, // Map Shared 'name' to Schema 'title'
                // Ensure nested optional objects are initialized if missing in data but needed for form
                inventory: initialData.inventory || { enabled: true, quantity: 0 },
                availability: initialData.availability || {
                    days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
                    timeRange: "09:00 - 17:00",
                },
                images: initialData.images || [],
            });
        }
        else if (isOpen) {
            reset({
                type: ProductServiceType.RETAIL,
                status: ProductServiceStatus.ACTIVE,
                inventory: { enabled: true, quantity: 0 },
                availability: {
                    days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
                    timeRange: "09:00 - 17:00",
                },
                images: [],
            });
        }
    }, [isOpen, initialData, reset]);
    const handleFormSubmit = async (data) => {
        await onSubmit(data);
    };
    return (_jsx(Drawer, { isOpen: isOpen, onClose: onClose, title: initialData ? "Edit Product" : "New Product", children: _jsxs("form", { onSubmit: handleSubmit(handleFormSubmit), className: "space-y-8 pb-20", children: [_jsxs("section", { className: "space-y-4", children: [_jsx("h3", { className: "text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-2", children: "Basic Info" }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "col-span-2 space-y-1.5", children: [_jsx(Label, { htmlFor: "product-title", className: "text-xs font-bold text-gray-700 uppercase tracking-wide", children: "Product Title" }), _jsx(Input, { id: "product-title", ...register("title"), placeholder: "e.g. Vintage Cotton Shirt", error: !!errors.title, helperText: errors.title?.message })] }), _jsxs("div", { className: "col-span-2 space-y-1.5", children: [_jsx(Label, { htmlFor: "product-description", className: "text-xs font-bold text-gray-700 uppercase tracking-wide", children: "Description" }), _jsx(Textarea, { id: "product-description", ...register("description"), placeholder: "Describe your product...", rows: 3, error: !!errors.description }), errors.description && (_jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.description.message }))] }), _jsx("div", { className: "col-span-2", children: _jsx(ImageUploader, { images: currentImages, onChange: (imgs) => setValue("images", imgs, { shouldValidate: true }) }) }), _jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "product-type", className: "text-xs font-bold text-gray-700 uppercase tracking-wide", children: "Type" }), _jsxs(Select, { id: "product-type", ...register("type"), children: [_jsx("option", { value: ProductServiceType.RETAIL, children: "Physical Product" }), _jsx("option", { value: ProductServiceType.FOOD, children: "Food / Menu" }), _jsx("option", { value: ProductServiceType.SERVICE, children: "Service / Booking" }), _jsx("option", { value: ProductServiceType.DIGITAL, children: "Digital Asset" }), _jsx("option", { value: ProductServiceType.REAL_ESTATE, children: "Real Estate / Property" }), _jsx("option", { value: ProductServiceType.AUTO, children: "Automotive / Vehicle" }), _jsx("option", { value: ProductServiceType.HOTEL, children: "Hotel / Stay" }), _jsx("option", { value: ProductServiceType.EVENT, children: "Event / Ticket" })] })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "product-category", className: "text-xs font-bold text-gray-700 uppercase tracking-wide", children: "Category (Optional)" }), _jsx(Input, { id: "product-category", ...register("category"), placeholder: "e.g. Summer Collection" })] })] })] }), _jsxs("section", { className: "space-y-4", children: [_jsx("h3", { className: "text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-2", children: selectedType === ProductServiceType.SERVICE ||
                                selectedType === ProductServiceType.HOTEL ||
                                selectedType === ProductServiceType.EVENT
                                ? "Booking Details"
                                : "Pricing & Inventory" }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "product-price", className: "text-xs font-bold text-gray-700 uppercase tracking-wide", children: "Price (\u20A6)" }), _jsx(Input, { id: "product-price", type: "number", ...register("price", { valueAsNumber: true }), placeholder: "0.00", error: !!errors.price, helperText: errors.price?.message })] }), selectedType === ProductServiceType.RETAIL && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "col-span-2 flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100", children: [_jsxs("div", { className: "text-sm", children: [_jsx(Label, { htmlFor: "track-inventory", className: "font-bold text-gray-900 cursor-pointer mb-0", children: "Track Inventory" }), _jsx("div", { className: "text-gray-500 text-xs", children: "Auto-update stock on new orders" })] }), _jsx(Switch, { id: "track-inventory", checked: inventoryEnabled || false, onCheckedChange: (c) => setValue("inventory.enabled", c) })] }), inventoryEnabled && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "inventory-quantity", className: "text-xs font-bold text-gray-700 uppercase tracking-wide", children: "Quantity Available" }), _jsx(Input, { id: "inventory-quantity", type: "number", ...register("inventory.quantity", { valueAsNumber: true }), placeholder: "0" })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "low-stock-threshold", className: "text-xs font-bold text-gray-700 uppercase tracking-wide", children: "Low Stock Alert" }), _jsx(Input, { id: "low-stock-threshold", type: "number", ...register("inventory.lowStockThreshold", { valueAsNumber: true }), placeholder: "5" })] })] }))] })), selectedType === ProductServiceType.FOOD && (_jsxs("div", { className: "col-span-2 flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-100", children: [_jsxs("div", { className: "text-sm", children: [_jsx(Label, { htmlFor: "todays-special", className: "font-bold text-orange-900 cursor-pointer mb-0", children: "Today's Special" }), _jsx("div", { className: "text-orange-700 text-xs", children: "Highlight this item on your menu" })] }), _jsx(Switch, { id: "todays-special", checked: watch("isTodaysSpecial") || false, onCheckedChange: (c) => setValue("isTodaysSpecial", c) })] })), selectedType === ProductServiceType.SERVICE && (_jsxs("div", { className: "col-span-2 space-y-4", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "availability-days", className: "text-xs font-bold text-gray-700 uppercase tracking-wide", children: "Availability (Days)" }), _jsx(Input, { id: "availability-days", ...register("availability.days"), placeholder: "Mon, Tue, Wed..." })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "time-range", className: "text-xs font-bold text-gray-700 uppercase tracking-wide", children: "Time Range" }), _jsx(Input, { id: "time-range", ...register("availability.timeRange"), placeholder: "09:00 - 17:00" })] })] })), selectedType === ProductServiceType.DIGITAL && (_jsxs("div", { className: "col-span-2 space-y-4", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "digital-file-url", className: "text-xs font-bold text-gray-700 uppercase tracking-wide", children: "File URL / Download Link" }), _jsx(Input, { id: "digital-file-url", ...register("digital.fileUrl"), placeholder: "https://..." })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "license-type", className: "text-xs font-bold text-gray-700 uppercase tracking-wide", children: "License Type" }), _jsxs(Select, { id: "license-type", ...register("digital.licenseType"), children: [_jsx("option", { value: "Personal", children: "Personal Use" }), _jsx("option", { value: "Commercial", children: "Commercial Use" })] })] })] })), selectedType === ProductServiceType.REAL_ESTATE && (_jsxs("div", { className: "col-span-2 grid grid-cols-3 gap-4", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "bedrooms", className: "text-xs font-bold text-gray-700 uppercase tracking-wide", children: "Bedrooms" }), _jsx(Input, { id: "bedrooms", type: "number", ...register("realEstate.bedrooms"), placeholder: "3" })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "bathrooms", className: "text-xs font-bold text-gray-700 uppercase tracking-wide", children: "Bathrooms" }), _jsx(Input, { id: "bathrooms", type: "number", ...register("realEstate.bathrooms"), placeholder: "2" })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "sqft", className: "text-xs font-bold text-gray-700 uppercase tracking-wide", children: "Sqft" }), _jsx(Input, { id: "sqft", type: "number", ...register("realEstate.sqft"), placeholder: "1200" })] }), _jsxs("div", { className: "col-span-3 space-y-1.5", children: [_jsx(Label, { htmlFor: "property-type", className: "text-xs font-bold text-gray-700 uppercase tracking-wide", children: "Property Type" }), _jsxs(Select, { id: "property-type", ...register("realEstate.propertyType"), children: [_jsx("option", { value: "Apartment", children: "Apartment" }), _jsx("option", { value: "House", children: "Self-contain / House" }), _jsx("option", { value: "Land", children: "Land / Plot" }), _jsx("option", { value: "Office", children: "Office / Shop" })] })] })] })), selectedType === ProductServiceType.AUTO && (_jsxs("div", { className: "col-span-2 grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "auto-make", className: "text-xs font-bold text-gray-700 uppercase tracking-wide", children: "Make" }), _jsx(Input, { id: "auto-make", ...register("automotive.make"), placeholder: "Toyota" })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "auto-model", className: "text-xs font-bold text-gray-700 uppercase tracking-wide", children: "Model" }), _jsx(Input, { id: "auto-model", ...register("automotive.model"), placeholder: "Camry" })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "auto-year", className: "text-xs font-bold text-gray-700 uppercase tracking-wide", children: "Year" }), _jsx(Input, { id: "auto-year", type: "number", ...register("automotive.year"), placeholder: "2022" })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "auto-mileage", className: "text-xs font-bold text-gray-700 uppercase tracking-wide", children: "Mileage" }), _jsx(Input, { id: "auto-mileage", type: "number", ...register("automotive.mileage"), placeholder: "5000" })] }), _jsxs("div", { className: "col-span-2 space-y-1.5", children: [_jsx(Label, { htmlFor: "auto-vin", className: "text-xs font-bold text-gray-700 uppercase tracking-wide", children: "VIN (Optional)" }), _jsx(Input, { id: "auto-vin", ...register("automotive.vin"), placeholder: "VIN Number" })] })] })), selectedType === ProductServiceType.HOTEL && (_jsxs("div", { className: "col-span-2 grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "max-guests", className: "text-xs font-bold text-gray-700 uppercase tracking-wide", children: "Max Guests" }), _jsx(Input, { id: "max-guests", type: "number", ...register("stay.maxGuests"), placeholder: "2" })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "room-type", className: "text-xs font-bold text-gray-700 uppercase tracking-wide", children: "Room Type" }), _jsxs(Select, { id: "room-type", ...register("stay.roomType"), children: [_jsx("option", { value: "Standard", children: "Standard" }), _jsx("option", { value: "Deluxe", children: "Deluxe" }), _jsx("option", { value: "Suite", children: "Suite" })] })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "check-in", className: "text-xs font-bold text-gray-700 uppercase tracking-wide", children: "Check-in" }), _jsx(Input, { id: "check-in", ...register("stay.checkInTime"), placeholder: "14:00" })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "check-out", className: "text-xs font-bold text-gray-700 uppercase tracking-wide", children: "Check-out" }), _jsx(Input, { id: "check-out", ...register("stay.checkOutTime"), placeholder: "11:00" })] })] })), selectedType === ProductServiceType.EVENT && (_jsxs("div", { className: "col-span-2 space-y-4", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "event-date", className: "text-xs font-bold text-gray-700 uppercase tracking-wide", children: "Event Date & Time" }), _jsx(Input, { id: "event-date", ...register("event.date"), placeholder: "2024-12-25 18:00" })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "event-venue", className: "text-xs font-bold text-gray-700 uppercase tracking-wide", children: "Venue / Location" }), _jsx(Input, { id: "event-venue", ...register("event.venue"), placeholder: "Main Hall or Zoom" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Switch, { id: "event-is-virtual", checked: watch("event.isVirtual") || false, onCheckedChange: (c) => setValue("event.isVirtual", c) }), _jsx(Label, { htmlFor: "event-is-virtual", className: "text-xs font-bold text-gray-700 uppercase tracking-wide", children: "Virtual Event" })] })] }))] })] }), _jsxs("div", { className: "fixed bottom-0 right-0 w-full sm:w-[500px] p-4 bg-white border-t border-gray-200 flex items-center justify-end gap-3 z-10", children: [_jsx(Button, { type: "button", variant: "outline", onClick: onClose, children: "Cancel" }), _jsx(Button, { type: "submit", isLoading: isSubmitting || isLoading, className: "bg-vayva-green text-white hover:bg-vayva-green/90 shadow-lg shadow-green-500/20", children: initialData ? "Update Item" : "Create Item" })] })] }) }));
};
