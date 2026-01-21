"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from "react-hook-form";
import { Badge, Button, Input, Label, Textarea } from "@vayva/ui";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { X, Plus } from "lucide-react";
export function RetailProductForm({ productId, initialData, storeCategory }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Variant State
    const [options, setOptions] = useState([]);
    const [variants, setVariants] = useState([]);
    // Helper to add a new empty option
    const addOption = () => {
        setOptions([...options, { id: crypto.randomUUID(), name: "", values: [] }]);
    };
    // Helper to remove an option
    const removeOption = (index) => {
        const newOptions = [...options];
        newOptions.splice(index, 1);
        setOptions(newOptions);
    };
    // Helper to update option name
    const updateOptionName = (index, name) => {
        const newOptions = [...options];
        newOptions[index].name = name;
        setOptions(newOptions);
    };
    // Helper to add a value to an option
    const addValueToOption = (index, value) => {
        if (!value.trim())
            return;
        const newOptions = [...options];
        if (!newOptions[index].values.includes(value)) {
            newOptions[index].values.push(value);
            setOptions(newOptions);
        }
    };
    // Helper to remove a value
    const removeValueFromOption = (optionIndex, valueIndex) => {
        const newOptions = [...options];
        newOptions[optionIndex].values.splice(valueIndex, 1);
        setOptions(newOptions);
    };
    // Cartesian Product Generator
    useEffect(() => {
        if (options.length === 0) {
            setVariants([]);
            return;
        }
        // Filter out incomplete options
        const validOptions = options.filter(o => o.name && o.values.length > 0);
        if (validOptions.length === 0) {
            setVariants([]);
            return;
        }
        const cartesian = (args) => {
            const r = [];
            const max = args.length - 1;
            function helper(arr, i) {
                for (let j = 0, l = args[i].values.length; j < l; j++) {
                    const a = arr.slice(0); // clone arr
                    a.push({ [args[i].name]: args[i].values[j] });
                    if (i === max)
                        r.push(a);
                    else
                        helper(a, i + 1);
                }
            }
            helper([], 0);
            return r;
        };
        const combinations = cartesian(validOptions);
        // Map combinations to flat variant objects
        const newVariants = combinations.map((combo) => {
            // Merge array of objects into single object: [{Color: Red}, {Size: L}] -> {Color: Red, Size: L}
            const optionsMap = combo.reduce((acc, curr) => ({ ...acc, ...curr }), {});
            const title = Object.values(optionsMap).join(" / ");
            // Try to preserve existing variant data (sku/stock) if title matches
            // This is a naive heuristic; ideally use ID but these are dynamically generated
            const existing = variants.find(v => v.title === title);
            return {
                id: existing?.id || crypto.randomUUID(),
                title,
                options: optionsMap,
                price: Number(existing?.price || getValues("price") || 0),
                sku: existing?.sku || "",
                stock: existing?.stock || 0
            };
        });
        setVariants(newVariants);
    }, [options]); // Depend only on options structure changing
    const { register, handleSubmit, getValues, formState: { errors } } = useForm({
        defaultValues: initialData || {
            title: "",
            description: "",
            price: 0,
            sku: "",
            trackInventory: true,
            stockQuantity: 0,
        }
    });
    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const endpoint = productId
                ? `/api/products/${productId}`
                : "/api/products/create";
            const method = productId ? "PATCH" : "POST";
            // Payload Construction
            const payload = {
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
            if (!res.ok)
                throw new Error("Failed to save product");
            toast.success(productId ? "Product updated" : "Product created");
            router.push("/dashboard/products");
        }
        catch (e) {
            toast.error("Something went wrong");
        }
        finally {
            setIsSubmitting(false);
        }
    };
    // Helper for generating SKU
    const generateBaseSku = () => {
        return variants.map((v, i) => updateVariantField(i, 'sku', `${getValues('sku')}-${i + 1}`));
    };
    const updateVariantField = (index, field, value) => {
        const newVariants = [...variants];
        if (field === 'options' || field === 'id' || field === 'title')
            return; // protect readonly/structural fields
        newVariants[index] = { ...newVariants[index], [field]: value };
        setVariants(newVariants);
    };
    return (_jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-8", children: [_jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-lg font-semibold border-b pb-2", children: "Basic Info" }), _jsxs("div", { className: "grid gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "title", children: "Product Title" }), _jsx(Input, { id: "title", ...register("title", { required: "Title is required" }), placeholder: "e.g. Classic White T-Shirt" }), errors.title && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.title.message })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "description", children: "Description" }), _jsx(Textarea, { id: "description", ...register("description"), placeholder: "Describe your product...", rows: 4 })] })] })] }), storeCategory === "Automotive" && (_jsxs("div", { className: "space-y-4 animate-in fade-in slide-in-from-top-4", children: [_jsx("h3", { className: "text-lg font-semibold border-b pb-2 text-blue-700", children: "Vehicle Details" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "year", children: "Year" }), _jsx(Input, { id: "year", type: "number", ...register("vehicle.year", { valueAsNumber: true }), placeholder: "2024" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "make", children: "Make" }), _jsx(Input, { id: "make", ...register("vehicle.make"), placeholder: "Toyota" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "model", children: "Model" }), _jsx(Input, { id: "model", ...register("vehicle.model"), placeholder: "Camry" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "vin", children: "VIN (Optional)" }), _jsx(Input, { id: "vin", ...register("vehicle.vin"), placeholder: "17-char VIN" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "mileage", children: "Mileage" }), _jsx(Input, { id: "mileage", type: "number", ...register("vehicle.mileage", { valueAsNumber: true }), placeholder: "0" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "fuelType", children: "Fuel Type" }), _jsxs("select", { id: "fuelType", ...register("vehicle.fuelType"), className: "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", children: [_jsx("option", { value: "PETROL", children: "Petrol" }), _jsx("option", { value: "DIESEL", children: "Diesel" }), _jsx("option", { value: "ELECTRIC", children: "Electric" }), _jsx("option", { value: "HYBRID", children: "Hybrid" })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "transmission", children: "Transmission" }), _jsxs("select", { id: "transmission", ...register("vehicle.transmission"), className: "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", children: [_jsx("option", { value: "AUTOMATIC", children: "Automatic" }), _jsx("option", { value: "MANUAL", children: "Manual" }), _jsx("option", { value: "CVT", children: "CVT" })] })] })] })] })), storeCategory === "Travel" && (_jsxs("div", { className: "space-y-4 animate-in fade-in slide-in-from-top-4", children: [_jsx("h3", { className: "text-lg font-semibold border-b pb-2 text-indigo-700", children: "Accommodation Details" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "type", children: "Room Type" }), _jsxs("select", { id: "type", ...register("accommodation.type"), className: "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", children: [_jsx("option", { value: "ROOM", children: "Room" }), _jsx("option", { value: "SUITE", children: "Suite" }), _jsx("option", { value: "VILLA", children: "Villa" }), _jsx("option", { value: "APARTMENT", children: "Apartment" }), _jsx("option", { value: "HOSTEL_BED", children: "Hostel Bed" }), _jsx("option", { value: "CAMP_SITE", children: "Camp Site" })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "maxGuests", children: "Max Guests" }), _jsx(Input, { id: "maxGuests", type: "number", ...register("accommodation.maxGuests", { valueAsNumber: true }), placeholder: "2" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "bedCount", children: "Bed Count" }), _jsx(Input, { id: "bedCount", type: "number", ...register("accommodation.bedCount", { valueAsNumber: true }), placeholder: "1" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "bathrooms", children: "Bathrooms" }), _jsx(Input, { id: "bathrooms", type: "number", ...register("accommodation.bathrooms", { valueAsNumber: true }), placeholder: "1" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "totalUnits", children: "Total Units (Inventory)" }), _jsx(Input, { id: "totalUnits", type: "number", ...register("accommodation.totalUnits", { valueAsNumber: true }), placeholder: "1" })] })] })] })), _jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-lg font-semibold border-b pb-2", children: "Pricing & Inventory" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "price", children: "Base Price" }), _jsx(Input, { id: "price", type: "number", step: "0.01", ...register("price", { required: true, min: 0 }), prefix: "\u20A6" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "sku", children: "SKU (Stock Keeping Unit)" }), _jsx(Input, { id: "sku", ...register("sku"), placeholder: "TSH-001" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "stockQuantity", children: "Stock Quantity" }), _jsx(Input, { id: "stockQuantity", type: "number", ...register("stockQuantity", { min: 0 }), disabled: variants.length > 0 }), variants.length > 0 && _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Managed via variants" })] })] })] }), _jsxs("div", { className: "space-y-6 pt-4 border-t border-gray-100", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Product Options" }), _jsxs(Button, { type: "button", variant: "outline", size: "sm", onClick: addOption, className: "gap-2", children: [_jsx(Plus, { size: 16 }), " Add Option"] })] }), options.length === 0 && (_jsx("div", { className: "text-sm text-gray-500 bg-gray-50 p-4 rounded-lg border border-dashed border-gray-200", children: "Does this product have variants like Color or Size? Click \"Add Option\" to configure." })), _jsx("div", { className: "space-y-4", children: options.map((option, idx) => (_jsxs("div", { className: "bg-white border rounded-xl p-4 shadow-sm relative group", children: [_jsx(Button, { type: "button", onClick: () => removeOption(idx), className: "absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity", title: "Remove Option", "aria-label": "Remove Option", children: _jsx(X, { size: 16 }) }), _jsxs("div", { className: "grid md:grid-cols-[200px_1fr] gap-6", children: [_jsxs("div", { children: [_jsx(Label, { className: "mb-2 block text-xs uppercase tracking-wider text-gray-500", children: "Option Name" }), _jsx(Input, { value: option.name, onChange: (e) => updateOptionName(idx, e.target.value), placeholder: "e.g. Color", className: "h-9" })] }), _jsxs("div", { children: [_jsx(Label, { className: "mb-2 block text-xs uppercase tracking-wider text-gray-500", children: "Option Values" }), _jsxs("div", { className: "flex flex-wrap gap-2 items-center", children: [option.values.map((val, vIdx) => (_jsxs(Badge, { variant: "default", className: "bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors py-1.5 px-3", children: [val, _jsx(Button, { type: "button", onClick: () => removeValueFromOption(idx, vIdx), className: "ml-2 hover:text-red-500", title: "Remove Value", "aria-label": "Remove Value", children: _jsx(X, { size: 12 }) })] }, vIdx))), _jsx("div", { className: "relative", children: _jsx(Input, { placeholder: "Add value...", className: "h-9 w-[120px] bg-transparent border-dashed", onKeyDown: (e) => {
                                                                    if (e.key === 'Enter') {
                                                                        e.preventDefault();
                                                                        addValueToOption(idx, e.currentTarget.value);
                                                                        e.currentTarget.value = "";
                                                                    }
                                                                }, onBlur: (e) => {
                                                                    if (e.target.value) {
                                                                        addValueToOption(idx, e.target.value);
                                                                        e.target.value = "";
                                                                    }
                                                                } }) })] })] })] })] }, option.id))) }), variants.length > 0 && (_jsxs("div", { className: "animate-in fade-in slide-in-from-top-4 duration-500", children: [_jsx("div", { className: "flex items-center justify-between mb-4", children: _jsxs("h4", { className: "text-sm font-bold uppercase tracking-wider text-gray-500", children: ["Preview (", variants.length, " Variants)"] }) }), _jsx("div", { className: "border rounded-xl bg-white overflow-hidden shadow-sm", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm text-left", children: [_jsx("thead", { className: "bg-gray-50 border-b", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-3 font-medium text-gray-700", children: "Variant" }), _jsx("th", { className: "px-4 py-3 font-medium text-gray-700 w-[120px]", children: "Price" }), _jsx("th", { className: "px-4 py-3 font-medium text-gray-700 w-[100px]", children: "Stock" }), _jsx("th", { className: "px-4 py-3 font-medium text-gray-700 w-[150px]", children: "SKU" }), _jsx("th", { className: "px-4 py-3 font-medium text-gray-700 w-[50px]" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-100", children: variants.map((variant, i) => (_jsxs("tr", { className: "group hover:bg-gray-50 transition-colors", children: [_jsx("td", { className: "px-4 py-3 font-medium text-gray-900", children: variant.title }), _jsx("td", { className: "px-4 py-2", children: _jsx(Input, { type: "number", value: variant.price, onChange: (e) => updateVariantField(i, 'price', parseFloat(e.target.value)), className: "h-9", prefix: "\u20A6" }) }), _jsx("td", { className: "px-4 py-2", children: _jsx(Input, { type: "number", value: variant.stock, onChange: (e) => updateVariantField(i, 'stock', parseInt(e.target.value)), className: "h-9" }) }), _jsx("td", { className: "px-4 py-2", children: _jsx(Input, { value: variant.sku, onChange: (e) => updateVariantField(i, 'sku', e.target.value), className: "h-9", placeholder: "SKU" }) }), _jsx("td", { className: "px-4 py-2 text-right" })] }, variant.id))) })] }) }) })] }))] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-lg font-semibold border-b pb-2", children: "Gallery" }), _jsxs("div", { className: "border-2 border-dashed border-gray-200 rounded-lg p-8 text-center text-gray-500", children: [_jsx("p", { children: "Image upload component would go here." }), _jsx("p", { className: "text-xs mt-2", children: "(Using placeholders for MVP)" })] })] }), _jsx("div", { className: "pt-4 flex justify-end", children: _jsx(Button, { type: "submit", disabled: isSubmitting, className: "min-w-[150px]", children: isSubmitting ? "Saving..." : productId ? "Update Product" : "Create Product" }) })] }));
}
