"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, Users } from "lucide-react";
import { toast } from "sonner";
import { cn, Button } from "@vayva/ui";
export default function NewCampaignPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: "",
        channel: "EMAIL",
        type: "NEWSLETTER",
        messageBody: "",
        segmentId: "all"
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/ops/growth/campaigns", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    // If we had a real segment selection, we'd pass it here.
                    // For now, it's just a placeholder or manual entry.
                    storeId: "platform-ops" // System wide campaign
                })
            });
            if (!res.ok)
                throw new Error("Failed to create campaign");
            toast.success("Campaign created successfully");
            router.push("/ops/communications/campaigns");
        }
        catch (error) {
            toast.error("Failed to create campaign");
            console.error(error);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "p-8 max-w-3xl mx-auto space-y-6", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx(Button, { onClick: () => router.back(), variant: "ghost", size: "icon", className: "h-10 w-10 text-gray-600 hover:bg-gray-100 rounded-lg", "aria-label": "Go back", children: _jsx(ArrowLeft, { size: 20 }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 flex items-center gap-2", children: "Create New Campaign" }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: "Design a new blast to your merchant or customer base." })] })] }), _jsxs("form", { onSubmit: handleSubmit, className: "bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Campaign Name" }), _jsx("input", { required: true, type: "text", value: form.name, onChange: (e) => setForm({ ...form, name: e.target.value }), placeholder: "e.g. June Merchant Newsletter", className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Campaign Type" }), _jsxs("select", { "aria-label": "Campaign Type", value: form.type, onChange: (e) => setForm({ ...form, type: e.target.value }), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white", children: [_jsx("option", { value: "NEWSLETTER", children: "Newsletter" }), _jsx("option", { value: "ALERT", children: "System Alert" }), _jsx("option", { value: "PROMO", children: "Promotion / Offer" }), _jsx("option", { value: "ONBOARDING", children: "Onboarding Drip" })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Channel" }), _jsx("div", { className: "flex gap-2", children: ["EMAIL", "SMS", "WHATSAPP", "PUSH"].map((c) => (_jsx(Button, { type: "button", onClick: () => setForm({ ...form, channel: c }), className: cn("flex-1 py-2 text-xs font-bold rounded-lg border transition-all h-auto", form.channel === c
                                                ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                                                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"), children: c }, c))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Target Audience" }), _jsxs("div", { className: "relative", children: [_jsx(Users, { size: 16, className: "absolute left-3 top-3 text-gray-400" }), _jsxs("select", { title: "Target Audience", "aria-label": "Target Audience", value: form.segmentId, onChange: (e) => setForm({ ...form, segmentId: e.target.value }), className: "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white appearance-none", children: [_jsx("option", { value: "all", children: "All Active Merchants" }), _jsx("option", { value: "inactive", children: "Inactive Merchants (30d)" }), _jsx("option", { value: "high-value", children: "High Value (Premium)" }), _jsx("option", { value: "waitlist", children: "Waitlist Users" })] })] })] })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: ["Message Content", _jsx("span", { className: "text-xs font-normal text-gray-500 ml-2", children: "(Markdown supported for Email)" })] }), _jsx("textarea", { required: true, value: form.messageBody, onChange: (e) => setForm({ ...form, messageBody: e.target.value }), rows: 8, placeholder: "Write your message here...", className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono text-sm" })] }), _jsxs("div", { className: "flex items-center justify-end gap-3 pt-4 border-t border-gray-100", children: [_jsx(Button, { type: "button", onClick: () => router.back(), variant: "ghost", className: "px-6 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors h-auto", children: "Cancel" }), _jsx(Button, { type: "submit", disabled: loading, className: "px-6 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-lg active:scale-95 flex items-center gap-2 h-auto", children: loading ? "Creating..." : (_jsxs(_Fragment, { children: [_jsx(Clock, { size: 16 }), " Schedule Campaign"] })) })] })] })] }));
}
