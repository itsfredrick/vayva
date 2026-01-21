"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@vayva/ui";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
export function DiscountForm({ id }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(!!id);
    // State
    const [method, setMethod] = useState("CODE");
    const [type, setType] = useState("PERCENTAGE");
    const [formData, setFormData] = useState({
        title: "",
        code: "",
        value: "",
        minOrder: "",
        startsAt: new Date().toISOString().slice(0, 16),
        endsAt: "",
        usageLimit: ""
    });
    useEffect(() => {
        if (id) {
            fetch(`/api/marketing/discounts/${id}`)
                .then(res => res.json())
                .then(data => {
                setFormData({
                    title: data.name || "",
                    code: data.code || "",
                    value: (data.valuePercent || data.valueAmount || "").toString(),
                    minOrder: (data.minOrderAmount || "").toString(),
                    startsAt: data.startsAt ? new Date(data.startsAt).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
                    endsAt: data.endsAt ? new Date(data.endsAt).toISOString().slice(0, 16) : "",
                    usageLimit: (data.usageLimitTotal || "").toString()
                });
                setMethod(data.requiresCoupon ? "CODE" : "AUTOMATIC");
                setType(data.type || "PERCENTAGE");
            })
                .catch(err => toast.error("Failed to load discount"))
                .finally(() => setFetching(false));
        }
    }, [id]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (method === "CODE" && !formData.code)
                throw new Error("Code is required");
            if (!formData.title)
                throw new Error("Title is required");
            if (!formData.value)
                throw new Error("Discount value is required");
            const payload = {
                name: formData.title,
                code: method === "CODE" ? formData.code.toUpperCase() : undefined,
                type,
                valuePercent: type === "PERCENTAGE" ? formData.value : undefined,
                valueAmount: type === "FIXED_AMOUNT" ? formData.value : undefined,
                minOrderAmount: formData.minOrder || undefined,
                startsAt: formData.startsAt,
                endsAt: formData.endsAt || undefined,
                usageLimitTotal: formData.usageLimit ? parseInt(formData.usageLimit) : undefined
            };
            const res = await fetch(id ? `/api/marketing/discounts/${id}` : "/api/marketing/discounts", {
                method: id ? "PATCH" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const json = await res.json();
            if (!res.ok)
                throw new Error(json.error || `Failed to ${id ? "update" : "create"} discount`);
            toast.success(`Discount ${id ? "updated" : "created"} successfully`);
            router.push("/dashboard/marketing/discounts");
        }
        catch (err) {
            toast.error(err.message);
        }
        finally {
            setLoading(false);
        }
    };
    if (fetching) {
        return (_jsx("div", { className: "flex items-center justify-center p-12", children: _jsx(Loader2, { className: "h-8 w-8 animate-spin text-muted-foreground" }) }));
    }
    return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-8 max-w-2xl mx-auto", children: [_jsx(Card, { children: _jsxs(CardContent, { className: "pt-6 space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4 mb-4", children: [_jsx(Button, { type: "button", variant: method === "CODE" ? undefined : "outline", onClick: () => setMethod("CODE"), children: "Discount Code" }), _jsx(Button, { type: "button", variant: method === "AUTOMATIC" ? undefined : "outline", onClick: () => setMethod("AUTOMATIC"), children: "Automatic Discount" })] }), method === "CODE" ? (_jsxs("div", { children: [_jsx(Label, { children: "Discount Code" }), _jsx(Input, { value: formData.code, onChange: (e) => setFormData({ ...formData, code: e.target.value.toUpperCase() }), placeholder: "SUMMER2024", className: "font-mono uppercase text-lg" }), _jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Customers will enter this code at checkout." })] })) : (_jsxs("div", { children: [_jsx(Label, { children: "Title" }), _jsx(Input, { value: formData.title, onChange: (e) => setFormData({ ...formData, title: e.target.value }), placeholder: "Summer Sale" }), _jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Customers will see this in their cart." })] })), method === "CODE" && (_jsxs("div", { children: [_jsx(Label, { children: "Internal Name (Optional)" }), _jsx(Input, { value: formData.title, onChange: (e) => setFormData({ ...formData, title: e.target.value }), placeholder: "Summer Sale Campaign" })] }))] }) }), _jsx(Card, { children: _jsx(CardContent, { className: "pt-6 space-y-4", children: _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "Type" }), _jsxs(Select, { value: type, onValueChange: (v) => setType(v), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "PERCENTAGE", children: "Percentage (%)" }), _jsx(SelectItem, { value: "FIXED_AMOUNT", children: "Fixed Amount (\u20A6)" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Value" }), _jsx(Input, { type: "number", value: formData.value, onChange: (e) => setFormData({ ...formData, value: e.target.value }), placeholder: type === "PERCENTAGE" ? "20" : "1000" })] })] }) }) }), _jsx(Card, { children: _jsxs(CardContent, { className: "pt-6 space-y-4", children: [_jsx("h3", { className: "font-medium text-sm text-gray-900 border-b pb-2", children: "Requirements" }), _jsxs("div", { children: [_jsx(Label, { children: "Minimum Order Amount (Optional)" }), _jsx(Input, { type: "number", value: formData.minOrder, onChange: (e) => setFormData({ ...formData, minOrder: e.target.value }), placeholder: "0.00" })] }), _jsxs("div", { children: [_jsx(Label, { children: "Usage Limit (Total)" }), _jsx(Input, { type: "number", value: formData.usageLimit, onChange: (e) => setFormData({ ...formData, usageLimit: e.target.value }), placeholder: "No limit" }), _jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Total number of times this discount can be used." })] })] }) }), _jsx(Card, { children: _jsxs(CardContent, { className: "pt-6 space-y-4", children: [_jsx("h3", { className: "font-medium text-sm text-gray-900 border-b pb-2", children: "Active Dates" }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "Start Date" }), _jsx(Input, { type: "datetime-local", value: formData.startsAt, onChange: (e) => setFormData({ ...formData, startsAt: e.target.value }) })] }), _jsxs("div", { children: [_jsx(Label, { children: "End Date (Optional)" }), _jsx(Input, { type: "datetime-local", value: formData.endsAt, onChange: (e) => setFormData({ ...formData, endsAt: e.target.value }) })] })] })] }) }), _jsxs("div", { className: "flex justify-end gap-4", children: [_jsx(Button, { variant: "outline", type: "button", onClick: () => router.back(), children: "Cancel" }), _jsxs(Button, { type: "submit", disabled: loading, children: [loading && _jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), id ? "Update Discount" : "Save Discount"] })] })] }));
}
