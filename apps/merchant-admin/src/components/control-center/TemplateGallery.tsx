
import React, { useState } from 'react';
import { StoreTemplate, SubscriptionPlan } from '@vayva/shared';
import { Icon, Button, Badge, cn } from '@vayva/ui';
import Image from 'next/image';

interface TemplateGalleryProps {
    templates: StoreTemplate[];
    currentPlan: SubscriptionPlan;
    onUseTemplate: (id: string) => void;
}

export const TemplateGallery = ({ templates, currentPlan, onUseTemplate }: TemplateGalleryProps) => {
    // Mock image placeholder generator if URL fails or for demo
    const getPlaceholder = (name: string, color: string) =>
        `https://placehold.co/600x400/${color}/FFFFFF?text=${encodeURIComponent(name)}`;

    return (
        <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Store Templates</h2>
                    <p className="text-sm text-gray-500">Choose how your store looks and how customers experience it.</p>
                </div>
            </div>

            {/* Active Template Callout */}
            {templates.filter(t => t.isActive).map(activeTemplate => (
                <div key={activeTemplate.id} className="mb-8 bg-gray-900 text-white rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

                    <div className="w-full md:w-48 h-32 relative rounded-lg overflow-hidden border border-white/20 shrink-0">
                        {/* Using a solid color div as placeholder if image fails, or next/image */}
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500 text-xs">
                            Active Preview
                        </div>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                            <span className="bg-green-500/20 text-green-300 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-green-500/30">
                                Live Now
                            </span>
                        </div>
                        <h3 className="text-xl font-bold mb-1">Currently using: {activeTemplate.name}</h3>
                        <p className="text-gray-400 text-sm">{activeTemplate.description}</p>
                    </div>

                    <div className="flex gap-3">
                        <Button variant="outline" className="text-white border-white/20 hover:bg-white/10 hover:text-white">
                            <Icon name="Eye" size={16} className="mr-2" /> Preview Store
                        </Button>
                        <Button variant="secondary" className="bg-white text-gray-900 hover:bg-gray-100">
                            Manage
                        </Button>
                    </div>
                </div>
            ))}

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.filter(t => !t.isActive).map((template) => {
                    const isLocked = template.isLocked; // Assuming logic is pre-calculated or checked here

                    return (
                        <div key={template.id} className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-lg transition-all flex flex-col">
                            {/* Preview Area */}
                            <div className="aspect-[3/2] bg-gray-100 relative overflow-hidden">
                                {isLocked && (
                                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center text-white p-4 text-center">
                                        <Icon name="Lock" size={32} className="mb-2 opacity-80" />
                                        <p className="font-bold">Available on {template.planLevel}</p>
                                        <p className="text-xs text-gray-300 mt-1">Upgrade to unlock this premium template</p>
                                    </div>
                                )}
                                <div className="absolute top-3 left-3 z-20 flex gap-2">
                                    <Badge variant="default" className="bg-white/90 backdrop-blur shadow-sm text-[10px] uppercase font-bold border-none text-gray-900">
                                        {template.category}
                                    </Badge>
                                    <Badge variant="default" className="bg-white/90 backdrop-blur shadow-sm text-[10px] uppercase font-bold border-none text-gray-500">
                                        {template.type}
                                    </Badge>
                                </div>
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                                    {/* Placeholder for real image */}
                                    <Icon name="LayoutDashboard" size={48} className="opacity-20" />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5 flex flex-col flex-1">
                                <div className="mb-4">
                                    <h3 className="font-bold text-gray-900 text-lg">{template.name}</h3>
                                    <p className="text-sm text-gray-500 line-clamp-2 mt-1">{template.description}</p>
                                </div>

                                <div className="mt-auto flex items-center gap-3">
                                    <Button variant="outline" size="sm" className="flex-1">
                                        Preview
                                    </Button>
                                    {isLocked ? (
                                        <Button size="sm" className="flex-1 bg-gray-900 text-white gap-2" disabled>
                                            <Icon name="Lock" size={12} /> Upgrade
                                        </Button>
                                    ) : (
                                        <Button
                                            size="sm"
                                            className="flex-1 bg-black text-white hover:bg-gray-800"
                                            onClick={() => onUseTemplate(template.id)}
                                        >
                                            Use Template
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};
