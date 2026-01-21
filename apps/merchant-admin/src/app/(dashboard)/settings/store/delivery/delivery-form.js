"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@vayva/ui";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
// Schema matching Prisma model
const formSchema = z.object({
    isEnabled: z.boolean(),
    deliveryRadiusKm: z.coerce.number().min(1),
    baseDeliveryFee: z.coerce.number().min(0),
    deliveryFeeType: z.enum(["FLAT", "DISTANCE"]),
    allowSelfPickup: z.boolean(),
    selfDeliveryEnabled: z.boolean(),
});
export function DeliveryForm() {
    const [isLoading, setIsLoading] = useState(true);
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            isEnabled: true,
            deliveryRadiusKm: 10,
            baseDeliveryFee: 1000,
            deliveryFeeType: "FLAT",
            allowSelfPickup: false,
            selfDeliveryEnabled: false,
        },
    });
    // Fetch initial data
    useEffect(() => {
        fetch("/api/settings/delivery")
            .then((res) => res.json())
            .then((data) => {
            if (data) {
                form.reset({
                    ...data,
                    baseDeliveryFee: Number(data.baseDeliveryFee), // Ensure number
                });
            }
        })
            .catch((err) => console.error(err))
            .finally(() => setIsLoading(false));
    }, [form]);
    async function onSubmit(data) {
        try {
            const res = await fetch("/api/settings/delivery", {
                method: "POST", // Upsert
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok)
                throw new Error("Failed to save");
            toast.success("Delivery settings saved successfully");
        }
        catch (error) {
            toast.error("Failed to save settings");
        }
    }
    if (isLoading) {
        return _jsx("div", { className: "flex h-32 items-center justify-center", children: _jsx(Loader2, { className: "animate-spin h-6 w-6 text-muted-foreground" }) });
    }
    return (_jsx(Form, { ...form, children: _jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-8 max-w-lg bg-card p-6 rounded-lg border", children: [_jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-lg font-medium", children: "General Capabilities" }), _jsx(FormField, { control: form.control, name: "isEnabled", render: ({ field }) => (_jsxs(FormItem, { className: "flex flex-row items-center justify-between rounded-lg border p-4", children: [_jsxs("div", { className: "space-y-0.5", children: [_jsx(FormLabel, { className: "text-base", children: "Enable Delivery" }), _jsx(FormDescription, { children: "Offer delivery options to customers." })] }), _jsx(FormControl, { children: _jsx(Switch, { checked: field.value, onCheckedChange: field.onChange }) })] })) }), _jsx(FormField, { control: form.control, name: "allowSelfPickup", render: ({ field }) => (_jsxs(FormItem, { className: "flex flex-row items-center justify-between rounded-lg border p-4", children: [_jsxs("div", { className: "space-y-0.5", children: [_jsx(FormLabel, { className: "text-base", children: "Allow Pickup" }), _jsx(FormDescription, { children: "Customers can pick up orders from your locations." })] }), _jsx(FormControl, { children: _jsx(Switch, { checked: field.value, onCheckedChange: field.onChange }) })] })) })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-lg font-medium", children: "Delivery Configuration" }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx(FormField, { control: form.control, name: "deliveryRadiusKm", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Radius (km)" }), _jsx(FormControl, { children: _jsx(Input, { type: "number", ...field }) }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: form.control, name: "baseDeliveryFee", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Base Fee (\u20A6)" }), _jsx(FormControl, { children: _jsx(Input, { type: "number", ...field }) }), _jsx(FormMessage, {})] })) })] }), _jsx(FormField, { control: form.control, name: "deliveryFeeType", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Fee Calculation" }), _jsxs(Select, { onValueChange: field.onChange, defaultValue: field.value, children: [_jsx(FormControl, { children: _jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select a fee type" }) }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "FLAT", children: "Flat Rate" }), _jsx(SelectItem, { value: "DISTANCE", children: "Distance Based" })] })] }), _jsx(FormDescription, { children: field.value === "FLAT" ? "Standard fee for all deliveries." : "Fee increases with distance." }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: form.control, name: "selfDeliveryEnabled", render: ({ field }) => (_jsxs(FormItem, { className: "flex flex-row items-center justify-between rounded-lg border p-4", children: [_jsxs("div", { className: "space-y-0.5", children: [_jsx(FormLabel, { className: "text-base", children: "Use Own Fleet" }), _jsx(FormDescription, { children: "You handle last-mile delivery yourself." })] }), _jsx(FormControl, { children: _jsx(Switch, { checked: field.value, onCheckedChange: field.onChange }) })] })) })] }), _jsxs(Button, { type: "submit", disabled: form.formState.isSubmitting, children: [form.formState.isSubmitting ? _jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }) : null, "Save Changes"] })] }) }));
}
