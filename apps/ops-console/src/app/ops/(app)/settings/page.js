"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Settings, Shield, Zap, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@vayva/ui";
export default function GlobalSettingsPage() {
    const [settings, setSettings] = useState({
        aiEnabled: true,
        evolutionApiEnabled: true,
        maintenanceMode: false
    });
    const handleToggle = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };
    const handleSave = async () => {
        const confirmSave = confirm("Are you sure you want to update global system settings?");
        if (!confirmSave)
            return;
        try {
            // Mock API call to save config (Redis/DB)
            // await fetch("/api/ops/config/global", { method: "POST", body: JSON.stringify(settings) });
            toast.promise(new Promise(r => setTimeout(r, 1000)), {
                loading: "Applying changes across cluster...",
                success: "System configuration updated.",
                error: "Failed to update configuration"
            });
        }
        catch (e) {
            toast.error("Error saving settings");
        }
    };
    return (_jsxs("div", { className: "p-8 space-y-8 max-w-4xl mx-auto", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-3xl font-bold text-gray-900 flex items-center gap-3", children: [_jsx(Settings, { className: "w-8 h-8 text-gray-700" }), "System Settings"] }), _jsx("p", { className: "text-gray-500 mt-1", children: "Global controls and emergency switches." })] }), _jsxs(Button, { variant: "primary", onClick: handleSave, className: "flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors h-auto", "aria-label": "Save global system settings", children: [_jsx(Save, { size: 18 }), " Save Changes"] })] }), _jsxs("div", { className: "grid gap-6", children: [_jsxs("section", { className: "bg-white p-6 rounded-xl border border-gray-200 shadow-sm", children: [_jsxs("h2", { className: "text-xl font-bold text-gray-900 mb-6 flex items-center gap-2", children: [_jsx(Zap, { className: "h-5 w-5 text-amber-500" }), "AI & Automation"] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "font-semibold text-gray-900", children: "Global AI Agent" }), _jsx("p", { className: "text-sm text-gray-500", children: "Master switch for all automated AI responses (Groq/OpenAI)." })] }), _jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [_jsx("input", { type: "checkbox", className: "sr-only peer", checked: settings.aiEnabled, onChange: () => handleToggle("aiEnabled"), "aria-label": "Toggle Global AI Agent" }), _jsx("div", { className: "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" })] })] }), _jsxs("div", { className: "border-t border-gray-100 pt-6 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "font-semibold text-gray-900", children: "Evolution API Integration" }), _jsx("p", { className: "text-sm text-gray-500", children: "Enable/Disable WhatsApp message sending and receiving." })] }), _jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [_jsx("input", { type: "checkbox", className: "sr-only peer", checked: settings.evolutionApiEnabled, onChange: () => handleToggle("evolutionApiEnabled"), "aria-label": "Toggle Evolution API Integration" }), _jsx("div", { className: "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600" })] })] })] })] }), _jsxs("section", { className: "bg-red-50 p-6 rounded-xl border border-red-100", children: [_jsxs("h2", { className: "text-xl font-bold text-red-900 mb-6 flex items-center gap-2", children: [_jsx(Shield, { className: "h-5 w-5 text-red-600" }), "Emergency Controls"] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "font-semibold text-red-900", children: "Maintenance Mode" }), _jsx("p", { className: "text-sm text-red-700", children: "Deny access to Merchant Dashboard for all users (Emergency only)." })] }), _jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [_jsx("input", { type: "checkbox", className: "sr-only peer", checked: settings.maintenanceMode, onChange: () => handleToggle("maintenanceMode"), "aria-label": "Toggle Maintenance Mode" }), _jsx("div", { className: "w-11 h-6 bg-red-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600" })] })] })] })] })] }));
}
