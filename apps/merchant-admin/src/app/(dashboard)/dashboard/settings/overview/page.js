"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button, Input, Label } from "@vayva/ui";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
export default function SettingsPage() {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [category, setCategory] = useState("retail");
    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/settings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    supportEmail: email,
                    businessCategory: category
                })
            });
            if (!res.ok)
                throw new Error("Failed to save");
            // toast.success("Settings saved");
        }
        catch (error) {
            console.error(error);
            // toast.error("Failed to save");
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "max-w-4xl mx-auto space-y-8 py-8 px-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold tracking-tight", children: "Settings" }), _jsx("p", { className: "text-muted-foreground mt-2", children: "Manage your store preferences and account details." })] }), _jsxs("div", { className: "flex border-b border-gray-200 overflow-x-auto", children: [_jsx(Button, { variant: "ghost", className: "px-4 py-2 border-b-2 border-black font-medium text-sm rounded-none h-auto hover:bg-transparent hover:text-black", children: "General" }), _jsx(Link, { href: "/dashboard/settings/team", children: _jsx(Button, { variant: "ghost", className: "px-4 py-2 border-b-2 border-transparent text-gray-500 hover:text-black font-medium text-sm whitespace-nowrap rounded-none h-auto", children: "Team" }) }), _jsx(Link, { href: "/dashboard/settings/seo", children: _jsx(Button, { variant: "ghost", className: "px-4 py-2 border-b-2 border-transparent text-gray-500 hover:text-black font-medium text-sm whitespace-nowrap rounded-none h-auto", children: "SEO" }) }), _jsx(Link, { href: "/dashboard/settings/store-policies", children: _jsx(Button, { variant: "ghost", className: "px-4 py-2 border-b-2 border-transparent text-gray-500 hover:text-black font-medium text-sm whitespace-nowrap rounded-none h-auto", children: "Policies" }) })] }), _jsxs("div", { className: "space-y-8 bg-white p-6 rounded-xl border border-gray-100 shadow-sm", children: [_jsxs("div", { className: "grid gap-6", children: [_jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "store-name", children: "Store Name" }), _jsx(Input, { id: "store-name", placeholder: "Enter your store name", value: name, onChange: (e) => setName(e.target.value) }), _jsx("p", { className: "text-xs text-gray-500", children: "This is visible to your customers." })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "support-email", children: "Support Email" }), _jsx(Input, { id: "support-email", placeholder: "support@yourstore.com", value: email, onChange: (e) => setEmail(e.target.value) }), _jsx("p", { className: "text-xs text-gray-500", children: "Where customers can reach you." })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "category", children: "Business Category" }), _jsxs("select", { id: "category", className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", value: category, onChange: (e) => setCategory(e.target.value), "aria-label": "Select Business Category", children: [_jsx("option", { value: "retail", children: "Retail" }), _jsx("option", { value: "fashion", children: "Fashion" }), _jsx("option", { value: "food", children: "Food & Beverage" }), _jsx("option", { value: "services", children: "Services" }), _jsx("option", { value: "digital", children: "Digital Products" })] }), _jsx("p", { className: "text-xs text-gray-500", children: "Helps us tailor your experience." })] }), _jsxs("div", { className: "flex items-center justify-between p-4 bg-gray-50 rounded-lg", children: [_jsxs("div", { className: "space-y-0.5", children: [_jsx(Label, { className: "text-base", children: "Store Status" }), _jsx("p", { className: "text-sm text-gray-500", children: "Turn your store on or off." })] }), _jsx(Switch, { checked: true, onCheckedChange: () => { }, disabled: true })] })] }), _jsx("div", { className: "flex justify-end", children: _jsx(Button, { onClick: handleSave, disabled: loading, children: loading ? "Saving..." : "Save Changes" }) })] })] }));
}
