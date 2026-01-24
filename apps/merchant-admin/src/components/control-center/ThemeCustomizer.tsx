
"use client";

import React, { useState, useEffect } from "react";
import { Button, Icon } from "@vayva/ui";
import { toast } from "sonner";

interface SchemaField {
    id: string;
    label: string;
    type: "color" | "text" | "number" | "image" | "font";
    default?: any;
    placeholder?: string;
}

interface ThemeCustomizerProps {
    draft: any;
    onUpdate: (data: any) => void;
    onReset: () => void;
}

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

/**
 * ThemeCustomizer
 * Renders a form to edit theme settings and a reorderable list of sections.
 */
export const ThemeCustomizer = ({ draft, onUpdate, onReset }: ThemeCustomizerProps) => {
    const [config, setConfig] = useState<any>(draft.themeConfig || {});
    const [activeTab, setActiveTab] = useState<"settings" | "sections">("settings");
    const template = draft.template;

    // Default sections if none exist
    const [sections, setSections] = useState<any[]>(config.sections || [
        { id: "hero", label: "Hero Banner", enabled: true },
        { id: "featured", label: "Featured Products", enabled: true },
        { id: "categories", label: "Category Grid", enabled: true },
        { id: "newsletter", label: "Newsletters", enabled: true },
        { id: "footer", label: "Footer", enabled: true },
    ]);

    // Derived schema - in a real app this comes from the TemplateManifest
    const schema: SchemaField[] = (template?.configSchema as any)?.settings || [
        { id: "primaryColor", label: "Primary Color", type: "color", default: "#000000" },
        { id: "backgroundColor", label: "Background", type: "color", default: "#ffffff" },
        { id: "fontFamily", label: "Typography", type: "font", default: "Inter" },
        { id: "logoWidth", label: "Logo Width (px)", type: "number", default: 120 },
        { id: "announcementText", label: "Announcement Bar", type: "text", default: "" },
    ];

    const handleChange = (id: string, value: any) => {
        const newConfig = { ...config, [id]: value };
        setConfig(newConfig);
        onUpdate(newConfig);
    };

    const onDragEnd = (result: any) => {
        if (!result.destination) return;
        const items = Array.from(sections);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setSections(items);
        handleChange("sections", items);
    };

    return (
        <div className="w-80 border-r border-gray-200 h-full overflow-y-auto bg-white flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveTab("settings")}
                        className={`text-[10px] uppercase font-bold px-3 ${activeTab === "settings" ? "bg-white shadow-sm" : "text-gray-400"}`}
                    >
                        Settings
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveTab("sections")}
                        className={`text-[10px] uppercase font-bold px-3 ${activeTab === "sections" ? "bg-white shadow-sm" : "text-gray-400"}`}
                    >
                        Sections
                    </Button>
                </div>
                <Button variant="ghost" size="sm" onClick={onReset} className="h-auto p-1 text-gray-400">
                    <Icon name="RefreshCcw" size={14} />
                </Button>
            </div>

            <div className="p-6 space-y-8 flex-1">
                {activeTab === "settings" ? (
                    schema.map((field: any) => (
                        <div key={field.id} className="space-y-2">
                            <label className="text-xs font-bold text-gray-700 block">{field.label}</label>

                            {field.type === "color" && (
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={config[field.id] || field.default}
                                        onChange={(e: any) => handleChange(field.id, e.target.value)}
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
                                    onChange={(e: any) => handleChange(field.id, e.target.value)}
                                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-black outline-none"
                                    title={field.label}
                                />
                            )}

                            {field.type === "number" && (
                                <input
                                    type="number"
                                    value={config[field.id] || ""}
                                    onChange={(e: any) => handleChange(field.id, e.target.value)}
                                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-black outline-none"
                                    title={field.label}
                                    placeholder="0"
                                />
                            )}

                            {field.type === "font" && (
                                <select
                                    value={config[field.id] || field.default}
                                    onChange={(e: any) => handleChange(field.id, e.target.value)}
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
                    ))
                ) : (
                    <div className="space-y-4">
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Homepage Layout</p>
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="sections">
                                {(provided: any) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                        {sections.map((section, index) => (
                                            <Draggable key={section.id} draggableId={section.id} index={index}>
                                                {(provided: any) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="bg-white border border-gray-200 rounded-xl p-3 flex items-center gap-3 shadow-sm hover:border-black transition-colors"
                                                    >
                                                        <Icon name="GripVertical" size={14} className="text-gray-300" />
                                                        <span className="text-xs font-medium">{section.label}</span>
                                                        <input
                                                            type="checkbox"
                                                            checked={section.enabled}
                                                            onChange={(e) => {
                                                                const newSections = [...sections];
                                                                newSections[index].enabled = e.target.checked;
                                                                setSections(newSections);
                                                                handleChange("sections", newSections);
                                                            }}
                                                            className="ml-auto"
                                                        />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                        <Button variant="outline" size="sm" className="w-full text-[10px]">
                            <Icon name="Plus" size={12} className="mr-1" /> Add Section
                        </Button>
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50">
                <p className="text-[10px] text-gray-400 leading-tight">
                    {activeTab === "sections" ? "Drag sections to reorder how they appear on your homepage." : "Tip: Changes are saved to draft automatically and visible in the preview window."}
                </p>
            </div>
        </div>
    );
};
