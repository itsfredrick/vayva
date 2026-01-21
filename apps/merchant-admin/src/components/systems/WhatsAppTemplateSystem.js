"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button, Icon, cn } from "@vayva/ui";
import { Switch } from "@/components/ui/switch";
const DEFAULT_TEMPLATES = [];
export function WhatsAppTemplateSystem() {
    const [selectedId, setSelectedId] = useState(DEFAULT_TEMPLATES[0].id);
    const [templates, setTemplates] = useState(DEFAULT_TEMPLATES);
    const activeTemplate = templates.find((t) => t.id === selectedId);
    const updateTemplate = (updates) => {
        setTemplates(templates.map((t) => (t.id === selectedId ? { ...t, ...updates } : t)));
    };
    const insertVariable = (variable) => {
        updateTemplate({
            defaultMessage: activeTemplate.defaultMessage + ` {{${variable}}}`,
        });
    };
    return (_jsxs("div", { className: "flex flex-col lg:flex-row gap-8 h-[600px]", children: [_jsxs("div", { className: "w-full lg:w-64 border-r border-gray-100 pr-4 space-y-2", children: [_jsx("h3", { className: "text-xs font-bold text-gray-400 uppercase mb-4", children: "Order States" }), templates.map((t) => (_jsxs(Button, { variant: "ghost", onClick: () => setSelectedId(t.id), className: cn("w-full justify-between h-auto py-3 px-3 rounded-xl transition-all font-normal", selectedId === t.id
                            ? "bg-black text-white hover:bg-black/90 hover:text-white"
                            : "hover:bg-gray-50 text-gray-600"), children: [_jsx("span", { className: "font-medium", children: t.stateName }), t.autoSend && (_jsx(Icon, { name: "Zap", size: 12, className: selectedId === t.id ? "text-yellow-400" : "text-gray-400" }))] }, t.id)))] }), _jsxs("div", { className: "flex-1 flex flex-col", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsxs("div", { children: [_jsxs("h2", { className: "text-xl font-bold text-gray-900", children: [activeTemplate.stateName, " Template"] }), _jsx("p", { className: "text-xs text-gray-500", children: "Sent when order moves to this status" })] }), _jsxs("div", { className: "flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-200", children: [_jsx("span", { className: "text-xs font-bold text-gray-600", children: "Auto-send" }), _jsx(Switch, { checked: activeTemplate.autoSend, onCheckedChange: (c) => updateTemplate({ autoSend: c }), className: "scale-90" })] })] }), _jsxs("div", { className: "flex-1 bg-gray-50 rounded-2xl border border-gray-200 p-4 mb-4 relative", children: [_jsx("textarea", { className: "w-full h-full bg-transparent border-none outline-none resize-none text-sm leading-relaxed p-2", value: activeTemplate.defaultMessage, onChange: (e) => updateTemplate({ defaultMessage: e.target.value }), "aria-label": "Template message content" }), _jsx("div", { className: "absolute bottom-4 left-4 flex gap-2", children: activeTemplate.variables.map((v) => (_jsx(Button, { variant: "outline", size: "sm", onClick: () => insertVariable(v), className: "text-[10px] bg-white border-gray-200 px-2 py-1 h-auto rounded-full shadow-sm hover:border-black transition-colors", children: `{{${v}}}` }, v))) })] }), _jsxs("div", { className: "bg-green-50 text-green-800 p-4 rounded-xl text-xs flex gap-3 border border-green-100", children: [_jsx(Icon, { name: "Info", size: 16, className: "shrink-0" }), _jsx("p", { children: "Vayva ensures messages are sent instantly. Customers can reply directly to your WhatsApp number." })] })] }), _jsx("div", { className: "w-[300px] hidden lg:block relative", children: _jsxs("div", { className: "absolute inset-0 bg-gray-900 rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden", children: [_jsx("div", { className: "h-6 bg-black w-full" }), _jsxs("div", { className: "bg-[#075E54] text-white p-4 flex items-center gap-3", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-white/20 flex items-center justify-center", children: "V" }), _jsxs("div", { children: [_jsx("h4", { className: "font-bold text-sm", children: "Your Business" }), _jsx("p", { className: "text-[10px] opacity-80", children: "Business Account" })] })] }), _jsx("div", { className: "bg-[#E5DDD5] h-full p-4 relative", children: _jsxs("div", { className: "bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-[85%] text-xs leading-relaxed text-gray-800 relative", children: [activeTemplate.defaultMessage.replace(/{{.*?}}/g, (match) => {
                                        // Replace variables with fake data for preview
                                        const key = match.replace(/{{|}}/g, "");
                                        const tests = {
                                            customer_name: "John",
                                            order_id: "1024",
                                            total_amount: "₦15,000",
                                            rider_phone: "08012345678",
                                        };
                                        return tests[key] || match;
                                    }), _jsx("span", { className: "text-[9px] text-gray-400 absolute bottom-1 right-2", children: "10:42 AM" })] }) })] }) })] }));
}
