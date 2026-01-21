"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@vayva/ui";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Clock } from "lucide-react";
export default function NewServicePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
    });
    const [metadata, setMetadata] = useState({
        durationMinutes: 60,
        bufferTimeMinutes: 0,
        location: "IN_STORE",
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/services", {
                method: "POST",
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    metadata
                }),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to create service");
            }
            toast.success("Service created!");
            router.push("/dashboard/services");
        }
        catch (error) {
            toast.error(error.message);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "max-w-2xl mx-auto space-y-6 pb-10", children: [_jsxs(Button, { variant: "ghost", onClick: () => router.back(), className: "mb-4", children: [_jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }), " Back to Services"] }), _jsxs("div", { className: "space-y-1", children: [_jsx("h2", { className: "text-3xl font-bold tracking-tight", children: "Add Service" }), _jsx("p", { className: "text-muted-foreground", children: "Define a service that customers can book." })] }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Service Details" }), _jsx(CardDescription, { children: "Name, price, and description." })] }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "name", children: "Service Name" }), _jsx(Input, { id: "name", required: true, value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }), placeholder: "e.g. Premium Haircut" })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "price", children: "Price (NGN)" }), _jsx(Input, { id: "price", type: "number", required: true, value: formData.price, onChange: (e) => setFormData({ ...formData, price: e.target.value }), placeholder: "0.00" })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "description", children: "Description" }), _jsx(Textarea, { id: "description", value: formData.description, onChange: (e) => setFormData({ ...formData, description: e.target.value }), placeholder: "Describe the service..." })] })] })] }), _jsxs(Card, { className: "mt-6", children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Scheduling" }), _jsx(CardDescription, { children: "Duration and location settings." })] }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "duration", children: "Duration (Minutes)" }), _jsxs("div", { className: "relative", children: [_jsx(Clock, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }), _jsx(Input, { id: "duration", type: "number", className: "pl-9", value: metadata.durationMinutes, onChange: (e) => setMetadata({ ...metadata, durationMinutes: parseInt(e.target.value) }) })] })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "buffer", children: "Buffer Time (Minutes)" }), _jsx(Input, { id: "buffer", type: "number", value: metadata.bufferTimeMinutes, onChange: (e) => setMetadata({ ...metadata, bufferTimeMinutes: parseInt(e.target.value) }), placeholder: "Gap between appts" })] })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { children: "Location" }), _jsxs(Select, { value: metadata.location, onValueChange: (val) => setMetadata({ ...metadata, location: val }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select location" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "IN_STORE", children: "In Store / Clinic" }), _jsx(SelectItem, { value: "HOME_SERVICE", children: "Home Service" }), _jsx(SelectItem, { value: "VIRTUAL", children: "Virtual / Online" })] })] })] })] }), _jsx(CardFooter, { className: "flex justify-end", children: _jsxs(Button, { type: "submit", disabled: loading, children: [loading && _jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), "Create Service"] }) })] })] })] }));
}
