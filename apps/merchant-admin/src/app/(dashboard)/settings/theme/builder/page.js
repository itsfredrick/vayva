"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Puck } from "@measured/puck";
import { puckConfig } from "@/lib/theme/puck.config";
import { Button, Icon } from "@vayva/ui";
import { useState } from "react";
import { toast } from "sonner";
import "@measured/puck/dist/index.css";
const initialData = {
    content: [],
    root: {},
};
export default function ThemeBuilderPage() {
    const [data, setData] = useState(initialData);
    const handleSave = async (newData) => {
        setData(newData);
        try {
            const res = await fetch("/api/storefront/draft", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ themeConfig: newData }),
            });
            if (!res.ok)
                throw new Error("Failed to save draft");
            toast.success("Theme draft saved successfully!");
        }
        catch (error) {
            toast.error("Error saving theme draft");
        }
    };
    const handlePublish = async () => {
        try {
            const res = await fetch("/api/storefront/publish", {
                method: "POST",
            });
            if (!res.ok)
                throw new Error("Failed to publish");
            toast.success("Theme published to storefront! 🚀");
        }
        catch (error) {
            toast.error("Error publishing theme");
        }
    };
    return (_jsxs("div", { className: "h-screen flex flex-col bg-white", children: [_jsxs("div", { className: "h-16 border-b border-gray-100 px-6 flex items-center justify-between bg-white z-50", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: () => window.history.back(), children: _jsx(Icon, { name: "ChevronLeft", size: 16 }) }), _jsxs("div", { className: "flex flex-col", children: [_jsx("h1", { className: "text-sm font-black uppercase tracking-widest text-gray-900", children: "Vayva Studio" }), _jsx("span", { className: "text-[10px] text-gray-400 font-bold uppercase", children: "Storefront Editor v1.0" })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "text-xs font-bold text-gray-400 mr-4", children: "Draft Saved: Just Now" }), _jsx(Button, { variant: "outline", size: "sm", className: "h-9 px-6 rounded-full font-bold", children: "Preview" }), _jsx(Button, { size: "sm", onClick: handlePublish, className: "h-9 px-8 rounded-full font-black shadow-lg shadow-primary/20", children: "Publish Changes" })] })] }), _jsx("div", { className: "flex-1 overflow-hidden", children: _jsx(Puck, { config: puckConfig, data: data, onPublish: handleSave, headerPath: "/" }) })] }));
}
