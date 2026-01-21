"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Send, AlertCircle, LifeBuoy, Loader2 } from "lucide-react";
import { Button } from "@vayva/ui";
export default function CreateTicketPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        subject: "",
        category: "TECHNICAL", // Default
        priority: "MEDIUM",
        description: ""
    });
    const categories = [
        { value: "TECHNICAL", label: "Technical Issue" },
        { value: "BILLING", label: "Billing & Subscription" },
        { value: "ACCOUNT", label: "Account Management" },
        { value: "FEATURE", label: "Feature Request" },
        { value: "OTHER", label: "Other Inquiry" }
    ];
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch("/api/support/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.error || "Failed to create ticket");
            toast.success("Ticket created successfully! We sent you a confirmation email.");
            setFormData({ subject: "", category: "TECHNICAL", priority: "MEDIUM", description: "" });
            // Redirect to list page if it existed, for now stay here or redirect to dashboard
            // router.push("/dashboard/support"); 
        }
        catch (error) {
            toast.error(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsxs("div", { className: "max-w-3xl mx-auto p-6 space-y-8", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-3 bg-indigo-50 rounded-xl text-indigo-600", children: _jsx(LifeBuoy, { size: 32 }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Contact Support" }), _jsx("p", { className: "text-gray-500", children: "We're here to help. Tell us what's wrong." })] })] }), _jsxs("form", { onSubmit: handleSubmit, className: "bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-semibold text-gray-700", children: "Category" }), _jsx("select", { title: "Category", value: formData.category, onChange: (e) => setFormData({ ...formData, category: e.target.value }), className: "w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 outline-none transition-all", children: categories.map(c => _jsx("option", { value: c.value, children: c.label }, c.value)) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-semibold text-gray-700", children: "Priority" }), _jsxs("select", { title: "Priority", value: formData.priority, onChange: (e) => setFormData({ ...formData, priority: e.target.value }), className: "w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 outline-none transition-all", children: [_jsx("option", { value: "LOW", children: "Low - General Question" }), _jsx("option", { value: "MEDIUM", children: "Medium - Feature Issue" }), _jsx("option", { value: "HIGH", children: "High - Urgent Problem" })] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-semibold text-gray-700", children: "Subject" }), _jsx("input", { type: "text", placeholder: "e.g. Cannot process payments", required: true, value: formData.subject, onChange: (e) => setFormData({ ...formData, subject: e.target.value }), className: "w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-100 outline-none transition-all" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-semibold text-gray-700", children: "Description" }), _jsx("textarea", { rows: 6, placeholder: "Please describe the issue in detail...", required: true, value: formData.description, onChange: (e) => setFormData({ ...formData, description: e.target.value }), className: "w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-y" }), _jsxs("p", { className: "text-xs text-gray-400 flex items-center gap-1", children: [_jsx(AlertCircle, { size: 10 }), "Provide as much context as possible for faster resolution."] })] }), _jsx("div", { className: "pt-4 border-t border-gray-100 flex justify-end", children: _jsx(Button, { type: "submit", disabled: isLoading, className: "bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold shadow-sm", children: isLoading ? (_jsx(Loader2, { className: "h-5 w-5 animate-spin" })) : (_jsxs(_Fragment, { children: [_jsx(Send, { className: "h-4 w-4 mr-2" }), "Submit Ticket"] })) }) })] })] }));
}
