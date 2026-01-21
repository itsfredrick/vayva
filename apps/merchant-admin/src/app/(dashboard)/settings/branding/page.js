"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, Input } from "@vayva/ui";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
export default function BrandingPage() {
    const handleSave = () => {
        toast.success("Branding settings saved successfully!");
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold tracking-tight", children: "Branding" }), _jsx("p", { className: "text-muted-foreground", children: "Customize your store's visual identity." })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Logo & Colors" }), _jsx(CardDescription, { children: "Update your brand logo and primary accents." })] }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "store-name", children: "Store Name" }), _jsx(Input, { id: "store-name", placeholder: "Enter your store name" })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "primary-color", children: "Primary Color" }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Input, { id: "primary-color", type: "color", className: "w-12 p-1 h-10", defaultValue: "#000000" }), _jsx(Input, { placeholder: "#000000", className: "flex-1", defaultValue: "#000000" })] })] }), _jsx("div", { className: "pt-4", children: _jsx(Button, { onClick: handleSave, children: "Save Changes" }) })] })] })] }));
}
