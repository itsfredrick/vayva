"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button, Icon } from "@vayva/ui";
/**
 * ThemeCustomizer
 * Renders a form to edit theme settings based on the template's configSchema.
 */
export const ThemeCustomizer = ({ draft, onUpdate, onReset }) => {
    const [config, setConfig] = useState(draft.themeConfig || {});
    const template = draft.template;
    // Derived schema - in a real app this comes from the TemplateManifest
    const schema = template?.configSchema?.settings || [
        { id: "primaryColor", label: "Primary Color", type: "color", default: "#000000" },
        { id: "backgroundColor", label: "Background", type: "color", default: "#ffffff" },
        { id: "fontFamily", label: "Typography", type: "font", default: "Inter" },
        { id: "logoWidth", label: "Logo Width (px)", type: "number", default: 120 },
        { id: "announcementText", label: "Announcement Bar", type: "text", default: "" },
    ];
    const handleChange = (id, value) => {
        const newConfig = { ...config, [id]: value };
        setConfig(newConfig);
        onUpdate(newConfig);
    };
    return (_jsxs("div", { className: "w-80 border-r border-gray-200 h-full overflow-y-auto bg-white flex flex-col", children: [_jsxs("div", { className: "p-4 border-b border-gray-100 flex items-center justify-between", children: [_jsx("h2", { className: "font-bold text-sm uppercase tracking-wider text-gray-500", children: "Theme Settings" }), _jsx(Button, { variant: "ghost", size: "sm", onClick: onReset, className: "h-auto p-1 text-gray-400", children: _jsx(Icon, { name: "RefreshCcw", size: 14 }) })] }), _jsx("div", { className: "p-6 space-y-8 flex-1", children: schema.map((field) => (_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-xs font-bold text-gray-700 block", children: field.label }), field.type === "color" && (_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("input", { type: "color", value: config[field.id] || field.default, onChange: (e) => handleChange(field.id, e.target.value), className: "w-10 h-10 rounded-lg cursor-pointer border-none p-0", title: field.label }), _jsx("span", { className: "text-xs font-mono text-gray-400 uppercase", children: config[field.id] || field.default })] })), field.type === "text" && (_jsx("input", { type: "text", value: config[field.id] || "", placeholder: field.placeholder || "Enter text...", onChange: (e) => handleChange(field.id, e.target.value), className: "w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-black outline-none", title: field.label })), field.type === "number" && (_jsx("input", { type: "number", value: config[field.id] || "", onChange: (e) => handleChange(field.id, e.target.value), className: "w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-black outline-none", title: field.label, placeholder: "0" })), field.type === "font" && (_jsxs("select", { value: config[field.id] || field.default, onChange: (e) => handleChange(field.id, e.target.value), className: "w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-black outline-none bg-white", title: field.label, children: [_jsx("option", { value: "Inter", children: "Inter (Sans)" }), _jsx("option", { value: "Playfair Display", children: "Playfair (Serif)" }), _jsx("option", { value: "Montserrat", children: "Montserrat (Geometric)" }), _jsx("option", { value: "Roboto Mono", children: "Roboto Mono (Mono)" })] }))] }, field.id))) }), _jsx("div", { className: "p-4 border-t border-gray-100 bg-gray-50", children: _jsx("p", { className: "text-[10px] text-gray-400 leading-tight", children: "Tip: Changes are saved to draft automatically and visible in the preview window." }) })] }));
};
