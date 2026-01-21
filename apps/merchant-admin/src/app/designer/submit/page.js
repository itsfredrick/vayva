"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Icon, Button } from "@vayva/ui";
import { useRouter } from "next/navigation";
export default function SubmitTemplatePage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    // Form State
    const [formData, setFormData] = useState({
        name: "",
        category: "retail",
        plan: "growth",
        description: "",
        file: null,
    });
    const handleSubmit = async () => {
        setLoading(true);
        try {
            await fetch("/api/designer/templates/submit", {
                method: "POST",
                body: JSON.stringify(formData),
            });
            // Simulate AI Review Delay
            setTimeout(() => {
                router.push("/designer");
            }, 1000);
        }
        catch (e) {
            console.error(e);
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6", children: _jsxs("div", { className: "w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200", children: [_jsxs("div", { className: "bg-gray-900 p-8 text-white", children: [_jsx("h1", { className: "text-2xl font-bold", children: "Submit New Template" }), _jsxs("p", { className: "text-gray-400 mt-2", children: ["Step ", step, " of 3"] })] }), _jsxs("div", { className: "p-8", children: [step === 1 && (_jsxs("div", { className: "space-y-6 animate-in fade-in slide-in-from-right-4 duration-300", children: [_jsx("h2", { className: "text-lg font-bold text-gray-900 border-b pb-2", children: "Basic Info" }), _jsxs("div", { children: [_jsx("label", { htmlFor: "template-name", className: "block text-sm font-bold text-gray-700 mb-2", children: "Template Name" }), _jsx("input", { id: "template-name", type: "text", value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }), className: "w-full border-gray-300 rounded-lg p-3 text-sm focus:ring-black focus:border-black", placeholder: "Modern Retail V1" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "category", className: "block text-sm font-bold text-gray-700 mb-2", children: "Category" }), _jsxs("select", { id: "category", className: "w-full border-gray-300 rounded-lg p-3 text-sm", value: formData.category, onChange: (e) => setFormData({ ...formData, category: e.target.value }), children: [_jsx("option", { value: "retail", children: "Retail" }), _jsx("option", { value: "food", children: "Food" }), _jsx("option", { value: "services", children: "Services" })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "plan-level", className: "block text-sm font-bold text-gray-700 mb-2", children: "Plan Level" }), _jsxs("select", { id: "plan-level", className: "w-full border-gray-300 rounded-lg p-3 text-sm", value: formData.plan, onChange: (e) => setFormData({ ...formData, plan: e.target.value }), children: [_jsx("option", { value: "starter", children: "Starter" }), _jsx("option", { value: "growth", children: "Growth" }), _jsx("option", { value: "pro", children: "Pro" })] })] })] }), _jsx(Button, { onClick: () => setStep(2), disabled: !formData.name, className: "w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed", children: "Continue" })] })), step === 2 && (_jsxs("div", { className: "space-y-6 animate-in fade-in slide-in-from-right-4 duration-300", children: [_jsx("h2", { className: "text-lg font-bold text-gray-900 border-b pb-2", children: "Upload Bundle" }), _jsxs("div", { className: "border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-black transition-colors cursor-pointer bg-gray-50", children: [_jsx(Icon, { name: "CloudUpload", size: 48, className: "mx-auto text-gray-400 mb-4" }), _jsx("p", { className: "font-bold text-gray-900", children: "Drag & drop your template bundle" }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: ".zip files only (max 50mb)" })] }), _jsxs("div", { className: "bg-yellow-50 p-4 rounded-lg border border-yellow-100 flex gap-3 text-yellow-800 text-sm", children: [_jsx(Icon, { name: "TriangleAlert", size: 20, className: "shrink-0" }), _jsxs("p", { children: ["Our AI will automatically scan your code for security vulnerabilities and performance issues. Make sure to follow the", " ", _jsx("a", { href: "#", className: "underline font-bold", children: "Vayva Theme Guidelines" }), "."] })] }), _jsxs("div", { className: "flex gap-4", children: [_jsx(Button, { onClick: () => setStep(1), className: "flex-1 bg-gray-100 text-gray-900 py-3 rounded-xl font-bold", children: "Back" }), _jsx(Button, { onClick: handleSubmit, className: "flex-1 bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800", children: loading ? "Analyzing..." : "Submit for Review" })] })] }))] })] }) }));
}
