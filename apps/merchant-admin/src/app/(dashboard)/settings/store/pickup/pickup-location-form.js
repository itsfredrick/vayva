"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@vayva/ui";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
const formSchema = z.object({
    name: z.string().min(2),
    address: z.string().min(5),
    city: z.string().min(2),
    state: z.string().min(2),
    isPickupPoint: z.boolean(),
    isDefault: z.boolean().optional(),
});
export function PickupLocationForm({ initialData, onSubmit, isSubmitting }) {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            address: "",
            city: "",
            state: "",
            isPickupPoint: true,
            isDefault: false,
        },
    });
    useEffect(() => {
        if (initialData) {
            form.reset(initialData);
        }
    }, [initialData, form]);
    return (_jsx(Form, { ...form, children: _jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-4", children: [_jsx(FormField, { control: form.control, name: "name", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Location Name" }), _jsx(FormControl, { children: _jsx(Input, { placeholder: "e.g. Main Branch", ...field }) }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: form.control, name: "address", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Address" }), _jsx(FormControl, { children: _jsx(Input, { placeholder: "123 Market St", ...field }) }), _jsx(FormMessage, {})] })) }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx(FormField, { control: form.control, name: "city", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "City" }), _jsx(FormControl, { children: _jsx(Input, { placeholder: "Lagos", ...field }) }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: form.control, name: "state", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "State" }), _jsx(FormControl, { children: _jsx(Input, { placeholder: "Lagos State", ...field }) }), _jsx(FormMessage, {})] })) })] }), _jsxs(Button, { type: "submit", disabled: isSubmitting, children: [isSubmitting && _jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), initialData ? "Update Location" : "Create Location"] })] }) }));
}
