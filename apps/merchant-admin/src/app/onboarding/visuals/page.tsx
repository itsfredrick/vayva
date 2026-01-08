"use client";

import React, { useState } from "react";
import { Button, Icon, cn } from "@vayva/ui";
import { useOnboarding } from "@/context/OnboardingContext";

import { TEMPLATES, TEMPLATE_CATEGORIES, TemplateCategory } from "@/lib/templates-registry";
import { TemplateCard } from "@/components/control-center/TemplateCard";
import { Template } from "@/types/templates";

const BRAND_COLORS = [
    "#000000", // Black
    "#2563EB", // Blue
    "#DC2626", // Red
    "#16A34A", // Green
    "#9333EA", // Purple
    "#EA580C", // Orange
    "#DB2777", // Pink
    "#4F46E5", // Indigo
];

export default function VisualsPage() {
    const { state, updateState, goToStep } = useOnboarding();
    const isGuided = state?.setupPath === "guided";

    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(
        state?.template?.id || null
    );
    const [brandColor, setBrandColor] = useState<string>(
        state?.branding?.colors?.primary || "#000000"
    );

    const filteredTemplates = TEMPLATES.filter(t =>
        selectedCategory === "All" || t.category === selectedCategory
    );

    const handleContinue = async () => {
        const template = TEMPLATES.find(t => t.id === selectedTemplate);

        await updateState({
            template: isGuided && template ? {
                id: template.id,
                name: template.name
            } : undefined,
            branding: {
                colors: { primary: brandColor, secondary: "#ffffff" },
                brandColor // Legacy support
            }
        });

        await goToStep("finance");
    };


    return (
        <div className="max-w-5xl mx-auto py-8">
            <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {isGuided ? "Choose a Template" : "Brand Your Store"}
                </h1>
                <p className="text-gray-500">
                    {isGuided
                        ? "Select a starting point for your store's design."
                        : "Pick a primary color to start building your unique look."}
                </p>
            </div>

            {isGuided ? (
                <>
                    <div className="flex flex-wrap justify-center gap-2 mb-8">
                        <button
                            onClick={() => setSelectedCategory("All")}
                            className={cn(
                                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                                selectedCategory === "All"
                                    ? "bg-black text-white shadow-md"
                                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                            )}
                        >
                            All Templates
                        </button>
                        {TEMPLATE_CATEGORIES.map((cat) => (
                            <button
                                key={cat.slug}
                                onClick={() => setSelectedCategory(cat.slug)}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-medium transition-all",
                                    selectedCategory === cat.slug
                                        ? "bg-black text-white shadow-md"
                                        : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                                )}
                            >
                                {cat.displayName}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {filteredTemplates.map((t) => (
                            <div key={t.id} onClick={() => setSelectedTemplate(t.id)} className="cursor-pointer">
                                <TemplateCard
                                    template={t as any}
                                    userPlan={state?.plan || "free"}
                                    onPreview={(temp) => window.open((temp as any).previewRoute, "_blank")}
                                    onUse={(temp) => setSelectedTemplate(temp.id)}
                                    recommendation={
                                        t.category?.toLowerCase().includes(state?.intent?.segment?.toLowerCase() || "")
                                            ? { reason: "Perfect for your segment", expectedImpact: "High" } as any
                                            : undefined
                                    }
                                />
                                {selectedTemplate === t.id && (
                                    <div className="mt-2 text-center text-xs font-bold text-black flex items-center justify-center gap-1">
                                        <Icon name="CheckCircle" size={14} /> Selected
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {filteredTemplates.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            No templates found in this category.
                        </div>
                    )}
                </>
            ) : (

                <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-gray-200 shadow-sm text-center">
                    <h3 className="font-bold text-gray-900 mb-6">Select Primary Color</h3>
                    <div className="grid grid-cols-4 gap-4 justify-items-center mb-8">
                        {BRAND_COLORS.map((color) => (
                            <button
                                key={color}
                                onClick={() => setBrandColor(color)}
                                className={cn(
                                    "w-12 h-12 rounded-full shadow-sm transition-all relative",
                                    brandColor === color ? "ring-2 ring-offset-2 ring-black scale-110" : "hover:scale-105"
                                )}
                                style={{ backgroundColor: color }}
                            >
                                {brandColor === color && (
                                    <Icon name="Check" className="text-white absolute inset-0 m-auto" size={20} />
                                )}
                            </button>
                        ))}
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold" style={{ backgroundColor: brandColor }}>
                                V
                            </div>
                            <div className="text-left flex-1">
                                <div className="h-2 w-20 bg-gray-200 rounded mb-1.5" />
                                <div className="h-2 w-12 bg-gray-200 rounded" />
                            </div>
                            <button className="px-3 py-1 rounded text-xs font-bold text-white" style={{ backgroundColor: brandColor }}>
                                Button
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-center pt-8">
                <Button
                    onClick={handleContinue}
                    disabled={isGuided && !selectedTemplate}
                    className="!bg-black text-white px-10 rounded-xl h-12 shadow-lg hover:shadow-xl transition-all"
                >
                    Continue to Finance
                    <Icon name="ArrowRight" className="ml-2 w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
