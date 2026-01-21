"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ProductFormFactory } from "@/components/products/ProductFormFactory";
import { Button } from "@vayva/ui";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
export default function NewProductPage() {
    return (_jsxs("div", { className: "max-w-4xl mx-auto p-6", children: [_jsxs("div", { className: "mb-6 flex items-center gap-4", children: [_jsx(Link, { href: "/dashboard/products", children: _jsx(Button, { variant: "ghost", size: "icon", children: _jsx(ArrowLeft, { className: "w-5 h-5" }) }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Add New Product" }), _jsx("p", { className: "text-gray-500 text-sm", children: "Fill in the details for your new item." })] })] }), _jsx("div", { className: "bg-white rounded-xl shadow-sm border border-gray-100 p-6", children: _jsx(ProductFormFactory, {}) })] }));
}
