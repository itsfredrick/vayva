
"use client";

import React, { useState, useEffect } from "react";
import { Button, Icon } from "@vayva/ui";
import { toast } from "sonner";

interface SchemaField {
    id: string;
    label: string;
    type: "color" | "text" | "number" | "image" | "font";
    default?: unknown;
    placeholder?: string;
}

interface ThemeCustomizerProps {
    draft: unknown;
    onUpdate: (data: unknown) => void;
    onReset: () => void;
}

/**
 * ThemeCustomizer
 * Renders a form to edit theme settings based on the template's configSchema.
 */
export const ThemeCustomizer = ({ draft, onUpdate, onReset }: ThemeCustomizerProps) => {
    const [config, setConfig] = useState<unknown>(draft.themeConfig || {});
    const template = draft.template;

    // Derived schema - in a real app this comes from the TemplateManifest
    const schema: SchemaField[] = (template?.configSchema as unknown)?.settings || [
        { id: "primaryColor", label: "Primary Color", type: "color", default: "#000000" },
        { id: "backgroundColor", label: "Background", type: "color", default: "#ffffff" },
        { id: "fontFamily", label: "Typography", type: "font", default: "Inter" },
        { id: "logoWidth", label: "Logo Width (px)", type: "number", default: 120 },
        { id: "announcementText", label: "Announcement Bar", type: "text", default: "" },
    ];

    const handleChange = (id: string, value: unknown) => {
        const newConfig = { ...config, [id]: value };
        setConfig(newConfig);
        onUpdate(newConfig);
    };

    return (
        <div className="w-80 border-r border-gray-200 h-full overflow-y-auto bg-white flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-bold text-sm uppercase tracking-wider text-gray-500">Theme Settings</h2>
                <Button variant="ghost" size="sm" onClick={onReset} className="h-auto p-1 text-gray-400">
                    <Icon name="RefreshCcw" size={14} />
                </Button>
            </div>

            <div className="p-6 space-y-8 flex-1">
                {schema.map((field) => (
                    <div key={field.id} className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 block">{field.label}</label>

                        {field.type === "color" && (
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    value={config[field.id] || field.default}
                                    onChange={(e) => handleChange(field.id, e.target.value)}
                                    className="w-10 h-10 rounded-lg cursor-pointer border-none p-0"
                                    title={field.label}
                                />
                                <span className="text-xs font-mono text-gray-400 uppercase">{config[field.id] || field.default}</span>
                            </div>
                        )}

                        {field.type === "text" && (
                            <input
                                type="text"
                                value={config[field.id] || ""}
                                placeholder={field.placeholder || "Enter text..."}
                                onChange={(e) => handleChange(field.id, e.target.value)}
                                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-black outline-none"
                                title={field.label}
                            />
                        )}

                        {field.type === "number" && (
                            <input
                                type="number"
                                value={config[field.id] || ""}
                                onChange={(e) => handleChange(field.id, e.target.value)}
                                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-black outline-none"
                                title={field.label}
                                placeholder="0"
                            />
                        )}

                        {field.type === "font" && (
                            <select
                                value={config[field.id] || field.default}
                                onChange={(e) => handleChange(field.id, e.target.value)}
                                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-black outline-none bg-white"
                                title={field.label}
                            >
                                <option value="Inter">Inter (Sans)</option>
                                <option value="Playfair Display">Playfair (Serif)</option>
                                <option value="Montserrat">Montserrat (Geometric)</option>
                                <option value="Roboto Mono">Roboto Mono (Mono)</option>
                            </select>
                        )}
                    </div>
                ))}
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50">
                <p className="text-[10px] text-gray-400 leading-tight">
                    Tip: Changes are saved to draft automatically and visible in the preview window.
                </p>
            </div>
        </div>
    );
};
