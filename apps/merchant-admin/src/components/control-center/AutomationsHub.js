import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Icon, cn, Button } from "@vayva/ui";
export const AutomationsHub = () => {
    // Test state for now
    const [automations, setAutomations] = useState([
        {
            id: "1",
            name: "Order Confirmation",
            description: "Send WhatsApp message when order is placed.",
            enabled: true,
            type: "whatsapp",
        },
        {
            id: "2",
            name: "Abandoned Checkout",
            description: "Remind customers after 1 hour of inactivity.",
            enabled: false,
            type: "whatsapp",
        },
        {
            id: "3",
            name: "Payment Receipt",
            description: "Email receipt after successful payment.",
            enabled: true,
            type: "email",
        },
        {
            id: "4",
            name: "Order Ready",
            description: "Notify customer when order is ready for pickup.",
            enabled: true,
            type: "whatsapp",
        },
    ]);
    const toggleAutomation = (id) => {
        setAutomations((prev) => prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)));
        // In real app, call API here
    };
    return (_jsxs("section", { className: "space-y-4", children: [_jsx("div", { className: "flex justify-between items-center", children: _jsxs("h3", { className: "text-lg font-bold text-gray-900 flex items-center gap-2", children: [_jsx(Icon, { name: "Zap", size: 20 }), " Automations"] }) }), _jsx("div", { className: "bg-white border border-gray-200 rounded-2xl overflow-hidden", children: automations.map((item, i) => (_jsxs("div", { className: cn("p-4 flex items-center justify-between hover:bg-gray-50 transition-colors", i !== automations.length - 1 && "border-b border-gray-100"), children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: cn("w-10 h-10 rounded-full flex items-center justify-center", item.type === "whatsapp"
                                        ? "bg-green-50 text-green-600"
                                        : "bg-blue-50 text-blue-600"), children: _jsx(Icon, { name: item.type === "whatsapp" ? "MessageCircle" : "Mail", size: 18 }) }), _jsxs("div", { children: [_jsx("h4", { className: "font-bold text-gray-900 text-sm", children: item.name }), _jsx("p", { className: "text-xs text-gray-500", children: item.description })] })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx(Button, { size: "sm", className: "text-gray-400 hover:text-black", children: "Edit Logic" }), _jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [_jsx("input", { type: "checkbox", className: "sr-only peer", checked: item.enabled, onChange: () => toggleAutomation(item.id) }), _jsx("div", { className: "w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-black" })] })] })] }, item.id))) })] }));
};
