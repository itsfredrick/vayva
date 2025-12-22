'use client';

import React, { useState, useEffect } from 'react';
import { Button, Icon } from '@vayva/ui';
import { useOnboarding } from '@/context/OnboardingContext';
import { useAuth } from '@/context/AuthContext';
import { TEMPLATES } from '@/lib/templates-registry';

export default function TemplatesPage() {
    const { state, updateState, goToStep } = useOnboarding();
    const { user } = useAuth();

    // Default to Vayya Storefront
    const [selectedId, setSelectedId] = useState('vayya-storefront');
    const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);

    const isStarter = (user as any)?.plan === 'starter';

    useEffect(() => {
        if (state?.template?.selectedTemplateId) {
            setSelectedId(state.template.selectedTemplateId);
        }
    }, [state]);

    const handleSelect = (id: string, isPremium: boolean) => {
        if (isPremium && isStarter) {
            alert("This premium template is available on Growth and Pro plans.");
            return;
        }
        setSelectedId(id);
    };

    const handleSubmit = async () => {
        await updateState({
            template: {
                selectedTemplateId: selectedId
            }
        });
        await goToStep('products');
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-black mb-2">Choose your theme</h1>
                    <p className="text-gray-600">Select a design for your online store. You can switch anytime.</p>
                </div>
                <div className="text-right hidden md:block">
                    <p className="text-sm font-bold text-black">Current Plan: <span className="uppercase text-primary-600">{(user as any)?.plan || 'Starter'}</span></p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {TEMPLATES.map(template => {
                    const isLocked = template.isPremium && isStarter;
                    const isSelected = selectedId === template.id;

                    return (
                        <div
                            key={template.id}
                            className={`
                                group relative bg-white border rounded-2xl overflow-hidden transition-all duration-200
                                ${isSelected ? 'border-black ring-1 ring-black shadow-lg' : 'border-gray-200 hover:border-gray-300'}
                                ${isLocked ? 'opacity-75' : ''}
                            `}
                            data-testid={`template-card-${template.id}`}
                        >
                            {/* Thumbnail */}
                            <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                                <img
                                    src={template.thumbnailUrl}
                                    alt={template.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                {isLocked && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                                        <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                                            <Icon name="Lock" size={12} className="text-black" />
                                            <span className="text-xs font-bold text-black">GROWTH+</span>
                                        </div>
                                    </div>
                                )}
                                {!isLocked && (
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="bg-white text-black shadow-xl"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setPreviewTemplate(template.id);
                                            }}
                                        >
                                            <Icon name="Eye" size={14} className="mr-2" />
                                            Preview
                                        </Button>
                                    </div>
                                )}
                                {isSelected && (
                                    <div className="absolute top-3 right-3 bg-black text-white p-1.5 rounded-full shadow-lg">
                                        <Icon name="Check" size={12} />
                                    </div>
                                )}
                            </div>

                            {/* Details */}
                            <div className="p-4 cursor-pointer" onClick={() => handleSelect(template.id, template.isPremium)}>
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-black text-sm">{template.name}</h3>
                                    {template.tags.includes('Default') && (
                                        <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded">DEFAULT</span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 line-clamp-2 mb-3">{template.description}</p>
                                <div className="flex flex-wrap gap-1">
                                    {template.tags.slice(0, 2).map(tag => (
                                        <span key={tag} className="text-[10px] text-gray-400 border border-gray-100 px-1.5 py-0.5 rounded">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-between items-center py-6 border-t border-gray-200">
                <Button variant="ghost" onClick={() => goToStep('delivery')}>Back</Button>
                <div className="flex gap-4">
                    <Button type="button" variant="secondary" onClick={() => setPreviewTemplate(selectedId)}>
                        Preview Selection
                    </Button>
                    <Button onClick={handleSubmit} className="!bg-black !text-white px-8 rounded-xl h-12" data-testid="onboarding-template-submit">
                        Continue with {TEMPLATES.find(t => t.id === selectedId)?.name}
                    </Button>
                </div>
            </div>

            {/* Preview Modal */}
            {previewTemplate && (
                <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 md:p-8 animate-fade-in">
                    <div className="bg-white w-full h-full max-w-6xl rounded-2xl overflow-hidden flex flex-col shadow-2xl">
                        <div className="h-14 border-b border-gray-200 flex items-center justify-between px-6 bg-white shrink-0">
                            <div className="flex items-center gap-4">
                                <h3 className="font-bold text-black">Preview: {TEMPLATES.find(t => t.id === previewTemplate)?.name}</h3>
                                <div className="hidden md:flex gap-2">
                                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-black">
                                        <Icon name="Smartphone" size={18} />
                                    </button>
                                    <button className="p-2 hover:bg-gray-100 rounded-lg text-black bg-gray-100">
                                        <Icon name="Monitor" size={18} />
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={() => setPreviewTemplate(null)}
                                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                            >
                                <Icon name="X" size={16} />
                            </button>
                        </div>
                        <div className="flex-1 bg-gray-100 p-4 overflow-hidden relative">
                            {/* Live Preview Iframe Simulation */}
                            <div className="w-full h-full bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center">
                                <div className="text-center p-8">
                                    <div
                                        className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold"
                                        style={{ backgroundColor: state?.branding?.brandColor || '#000' }}
                                    >
                                        {state?.storeDetails?.storeName?.charAt(0) || 'S'}
                                    </div>
                                    <h1 className="text-3xl font-bold text-black mb-2">{state?.storeDetails?.storeName || 'Your Store Name'}</h1>
                                    <p className="text-gray-500">Live preview of your store branding</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 w-full max-w-lg mt-8 opacity-50 pointer-events-none">
                                    {[1, 2].map(i => (
                                        <div key={i} className="aspect-square bg-gray-50 rounded-lg"></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-200 flex justify-end gap-3 bg-white shrink-0">
                            <Button variant="ghost" onClick={() => setPreviewTemplate(null)}>Close</Button>
                            <Button
                                className="!bg-black !text-white"
                                onClick={() => {
                                    handleSelect(previewTemplate, TEMPLATES.find(t => t.id === previewTemplate)?.isPremium || false);
                                    setPreviewTemplate(null);
                                }}
                            >
                                Select this Theme
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
