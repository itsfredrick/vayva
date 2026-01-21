import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { DiscountForm } from "@/components/marketing/DiscountForm";
import { Button } from "@vayva/ui";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
export default function EditDiscountPage({ params }) {
    return (_jsxs("div", { className: "max-w-4xl mx-auto p-6", children: [_jsxs("div", { className: "mb-6 flex items-center gap-4", children: [_jsx(Link, { href: "/dashboard/marketing/discounts", children: _jsx(Button, { variant: "ghost", size: "icon", children: _jsx(ArrowLeft, { className: "w-5 h-5" }) }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Edit Discount" }), _jsx("p", { className: "text-gray-500 text-sm", children: "Update your discount rule or coupon settings." })] })] }), _jsx(DiscountForm, { id: params.id })] }));
}
