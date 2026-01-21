"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button, Icon, cn } from "@vayva/ui";
import { useToast } from "@/components/ui/use-toast";
import styles from "./ChecklistSystem.module.css";
export function ChecklistEngine({ startProductFlow, startWhatsAppFlow, }) {
    const { toast } = useToast();
    const [collapsed, setCollapsed] = useState(false);
    const [dismissed, setDismissed] = useState(false);
    const [items, setItems] = useState([
        {
            id: "setup",
            title: "Complete Business Setup",
            description: "Your basic onboarding is done.",
            status: "completed",
            priority: 10,
            actionLabel: "Review",
            onClick: () => { },
        },
        {
            id: "product",
            title: "Add your first product",
            description: "Create a product to start selling.",
            status: "pending",
            priority: 9,
            actionLabel: "Create Product",
            onClick: startProductFlow,
        },
        {
            id: "whatsapp",
            title: "Set up WhatsApp Messages",
            description: "Automate order updates.",
            status: "pending", // Would be dynamic based on connected state
            priority: 8,
            actionLabel: "Configure",
            onClick: startWhatsAppFlow,
        },
        {
            id: "order",
            title: "Create your first order",
            description: "Test the end-to-end flow manually.",
            status: "pending",
            priority: 7,
            actionLabel: "Create Order",
            onClick: () => {
                toast({
                    title: "Create Order",
                    description: "Use the Point of Sale or Storefront to create your first order.",
                });
            },
        },
    ]);
    const pendingCount = items.filter((i) => i.status === "pending").length;
    const progress = Math.round(((items.length - pendingCount) / items.length) * 100);
    const progressBucket = Math.max(0, Math.min(100, Math.round(progress / 5) * 5));
    const progressClass = styles[`w${progressBucket}`] || styles.w0;
    if (dismissed && pendingCount === 0)
        return null; // Fully hidden if done and dismissed
    if (collapsed || dismissed) {
        return (_jsx("div", { className: "fixed bottom-6 right-6 z-40", children: _jsxs(Button, { onClick: () => {
                    setCollapsed(false);
                    setDismissed(false);
                }, "aria-label": "Toggle Checklist", className: "bg-black text-white h-12 w-12 rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform relative p-0", children: [_jsx(Icon, { name: "ListChecks", size: 20 }), pendingCount > 0 && (_jsx("div", { className: "absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white", children: pendingCount }))] }) }));
    }
    return (_jsx("div", { className: "fixed bottom-6 right-6 z-40 w-full max-w-sm animate-in slide-in-from-bottom-4 duration-300", children: _jsxs("div", { className: "bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden", children: [_jsxs("div", { className: "bg-black text-white p-4 flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-bold text-sm", children: "Setup Guide" }), _jsxs("p", { className: "text-[10px] text-gray-400", children: [progress, "% Complete"] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Button, { variant: "ghost", size: "icon", onClick: () => setCollapsed(true), "aria-label": "Minimize", className: "hover:bg-white/20 p-1 rounded transition-colors text-white hover:text-white", children: _jsx(Icon, { name: "Minimize2", size: 14 }) }), _jsx(Button, { variant: "ghost", size: "icon", onClick: () => setDismissed(true), "aria-label": "Close", className: "hover:bg-white/20 p-1 rounded transition-colors text-white hover:text-white", children: _jsx(Icon, { name: "X", size: 14 }) })] })] }), _jsx("div", { className: "h-1 w-full bg-gray-100", children: _jsx("div", { className: cn("h-full", styles.progressBar, progressClass) }) }), _jsx("div", { className: "max-h-[300px] overflow-y-auto", children: items
                        .sort((a, b) => b.priority - a.priority)
                        .map((item) => (_jsxs("div", { className: cn("p-4 border-b border-gray-100 last:border-0 flex gap-3 transition-colors", item.status === "completed"
                            ? "bg-gray-50 opacity-60"
                            : "bg-white hover:bg-gray-50"), children: [_jsx("div", { className: cn("w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5", item.status === "completed"
                                    ? "bg-green-500 border-green-500 text-white"
                                    : "border-gray-300 text-transparent"), children: _jsx(Icon, { name: "Check", size: 10 }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h4", { className: cn("text-sm font-bold text-gray-900", item.status === "completed" &&
                                            "line-through text-gray-500"), children: item.title }), _jsx("p", { className: "text-xs text-gray-500 mb-2", children: item.description }), item.status === "pending" && (_jsx(Button, { size: "sm", variant: "outline", className: "h-7 text-xs px-3", onClick: item.onClick, children: item.actionLabel }))] })] }, item.id))) })] }) }));
}
