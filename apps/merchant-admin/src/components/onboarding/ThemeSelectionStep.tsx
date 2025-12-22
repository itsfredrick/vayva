'use client';

import React, { useState } from 'react';
import { Button, GlassPanel, Icon } from '@vayva/ui';
import { StepShell } from './StepShell';
import { TEMPLATES, TemplateDefinition } from '@/lib/templates-registry';
import { useAuth } from '@/context/AuthContext';

interface ThemeSelectionStepProps {
    value: string;
    onChange: (value: string) => void;
    onNext: () => void;
    onBack: () => void;
    isSubmitting?: boolean;
}

export function ThemeSelectionStep({ value, onChange, onNext, onBack, isSubmitting }: ThemeSelectionStepProps) {
    const { store } = useAuth() as any;
    const [previewTemplate, setPreviewTemplate] = useState<TemplateDefinition | null>(null);

    return (
        <StepShell
            title="Choose your storefront"
            description="Select a template structure. You can customize colors and branding later."
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {TEMPLATES.map((theme) => {
                    const isSelected = value === theme.id;
                    return (
                        <div
                            key={theme.id}
                            className={`group relative rounded-2xl border transition-all overflow-hidden flex flex-col
                                ${isSelected
                                    ? 'border-[#46EC13] ring-2 ring-[#46EC13] ring-offset-2 ring-offset-[#09090b]'
                                    : 'border-white/10 hover:border-white/20'
                                }`}
                        >
                            {/* Theme Preview Card */}
                            <div
                                className="aspect-video w-full p-4 relative"
                                style={{ backgroundColor: theme.colors.background }}
                            >
                                <div className="absolute top-2 right-2">
                                    {theme.tags[0] && (
                                        <span className="bg-black/80 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-md uppercase tracking-wide font-bold">
                                            {theme.tags[0]}
                                        </span>
                                    )}
                                </div>

                                {/* Mock UI */}
                                <div className="w-full h-full flex flex-col gap-2 opacity-50 pointer-events-none select-none">
                                    <div className="w-1/3 h-2 rounded bg-current opacity-20" style={{ color: theme.colors.text }} />
                                    <div className="w-full h-24 rounded bg-current opacity-10" style={{ color: theme.colors.text }} />
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="h-12 rounded bg-current opacity-10" style={{ color: theme.colors.text }} />
                                        <div className="h-12 rounded bg-current opacity-10" style={{ color: theme.colors.text }} />
                                    </div>
                                </div>

                                {/* Hover Actions */}
                                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setPreviewTemplate(theme);
                                        }}
                                        className="h-9 px-4 rounded-full bg-white text-black hover:bg-gray-100"
                                    >
                                        <Icon name="Eye" className="w-4 h-4 mr-2" />
                                        Preview
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={() => onChange(theme.id)}
                                        className={`h-9 px-4 rounded-full ${isSelected ? 'bg-green-500 text-black' : 'bg-black text-white border border-white/20'}`}
                                    >
                                        {isSelected ? 'Selected' : 'Use Template'}
                                    </Button>
                                </div>
                            </div>

                            {/* Info Footer */}
                            <div className="p-4 bg-white/5 backdrop-blur-sm border-t border-white/5 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-bold text-white">{theme.name}</h3>
                                    {isSelected && <Icon name="Check" className="w-5 h-5 text-[#46EC13]" />}
                                </div>
                                <p className="text-sm text-text-secondary line-clamp-2">{theme.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex gap-3">
                <Button variant="outline" onClick={onBack} className="flex-1 h-12 rounded-xl" disabled={isSubmitting}>
                    Back
                </Button>
                <Button
                    onClick={onNext}
                    disabled={!value || isSubmitting}
                    className="flex-[2] h-12 bg-[#1d1d1f] hover:bg-[#1d1d1f]/90 text-white font-bold rounded-xl border border-white/10"
                >
                    {isSubmitting ? 'Setting up store...' : 'Launch Store 🚀'}
                </Button>
            </div>

            {/* Preview Modal Overlay */}
            {previewTemplate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="w-full max-w-5xl h-[85vh] bg-background-dark border border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-2xl relative">
                        {/* Preview Header */}
                        <div className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-black/40">
                            <div className="flex items-center gap-4">
                                <h3 className="text-white font-bold">Preview: {previewTemplate.name}</h3>
                                <span className="text-xs text-text-secondary hidden md:inline-block">
                                    Live mock with your data
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button
                                    size="sm"
                                    onClick={() => {
                                        onChange(previewTemplate.id);
                                        setPreviewTemplate(null);
                                    }}
                                    className="bg-white text-black hover:bg-gray-100"
                                >
                                    Use Template
                                </Button>
                                <button
                                    onClick={() => setPreviewTemplate(null)}
                                    className="p-2 hover:bg-white/10 rounded-full text-text-secondary hover:text-white transition-colors"
                                >
                                    <Icon name="X" className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Preview Content (Mock Storefront) */}
                        <div className="flex-1 overflow-y-auto bg-gray-50 relative">
                            {/* Mock Navigation */}
                            <div className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-md px-6 h-16 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded bg-gray-200" /> {/* Logo placeholder */}
                                    {/* Live Data Binding */}
                                    <span className="font-bold text-xl text-black">
                                        {store?.name || "Your Store"}
                                    </span>
                                </div>
                                <div className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
                                    <span>Home</span>
                                    <span>Products</span>
                                    <span>About</span>
                                    <span>Contact</span>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-100" />
                                    <div className="w-8 h-8 rounded-full bg-gray-100" />
                                </div>
                            </div>

                            {/* Hero Section */}
                            <div className="h-[400px] bg-gray-100 flex items-center justify-center text-center px-4">
                                <div className="max-w-2xl space-y-4">
                                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                                        Welcome to {store?.name || "Your Store"}
                                    </h1>
                                    <p className="text-lg text-gray-500">
                                        Discover our amazing collection of products.
                                    </p>
                                    <div className="pt-4">
                                        <button className="px-8 py-3 bg-black text-white rounded-full font-medium">
                                            Shop Now
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Product Grid Mock */}
                            <div className="max-w-6xl mx-auto py-16 px-6">
                                <h2 className="text-2xl font-bold mb-8 text-gray-900">Featured Products</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="space-y-3">
                                            <div className="aspect-square bg-gray-200 rounded-xl" />
                                            <div className="h-4 w-2/3 bg-gray-200 rounded" />
                                            <div className="h-4 w-1/3 bg-gray-200 rounded" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </StepShell>
    );
}
