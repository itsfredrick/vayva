'use client';

import React from 'react';
import { Button } from '@vayva/ui';
import { Template, PlanTier, isTierAccessible } from '@/lib/templates';
import Link from 'next/link';

interface TemplatePreviewModalProps {
    template: Template;
    userTier: PlanTier;
    onClose: () => void;
    onApply: (template: Template) => void;
}

export const TemplatePreviewModal = ({ template, userTier, onClose, onApply }: TemplatePreviewModalProps) => {
    const isAccessible = isTierAccessible(userTier, template.tier);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 overflow-y-auto" onClick={onClose}>
            <div className="bg-white rounded-2xl max-w-5xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
                <div className="flex flex-col lg:flex-row">
                    {/* Left: Preview Image & Created Items */}
                    <div className="lg:w-1/2 bg-gray-50 p-8 border-r border-gray-100">
                        <div className="aspect-video bg-gray-200 rounded-xl mb-8 flex items-center justify-center overflow-hidden border border-gray-200 shadow-inner">
                            {/* Placeholder for template screenshot */}
                            <div className="text-center p-6">
                                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-sm text-gray-500 font-medium">{template.name} Interface Preview</p>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">What it creates</h4>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Pages & Sections</p>
                                    <ul className="space-y-1">
                                        {[...template.creates.pages, ...template.creates.sections].map(item => (
                                            <li key={item} className="text-sm text-gray-600 flex items-center gap-2">
                                                <span className="w-1 h-1 rounded-full bg-green-500" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Data Objects</p>
                                    <ul className="space-y-1">
                                        {template.creates.objects.map(item => (
                                            <li key={item} className="text-sm text-gray-600 flex items-center gap-2">
                                                <span className="w-1 h-1 rounded-full bg-blue-500" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Content & CTA */}
                    <div className="lg:w-1/2 p-10 flex flex-col">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${template.tier === 'pro' ? 'bg-purple-100 text-purple-700' :
                                    template.tier === 'growth' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    {template.tier === 'pro' ? '₦40,000' : template.tier === 'growth' ? '₦25,000' : 'Free'} Plan
                                </span>
                                <h2 className="text-3xl font-bold text-gray-900 mt-2">{template.name}</h2>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l18 18" />
                                </svg>
                            </button>
                        </div>

                        <p className="text-gray-600 leading-relaxed mb-8">
                            {template.description}
                        </p>

                        <div className="space-y-6 mb-10 flex-grow">
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Setup logic</h4>
                                <ul className="space-y-2">
                                    {template.configures.slice(0, 3).map(item => (
                                        <li key={item} className="text-sm text-gray-700 flex items-start gap-3">
                                            <svg className="w-4 h-4 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100">
                            {isAccessible ? (
                                <Button
                                    onClick={() => onApply(template)}
                                    className="w-full py-6 text-lg font-bold bg-[#22C55E] hover:bg-[#16A34A] text-white rounded-xl shadow-lg shadow-green-100 transition-all"
                                >
                                    Apply Template
                                </Button>
                            ) : (
                                <div className="space-y-4">
                                    <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl flex items-start gap-3">
                                        <svg className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        <p className="text-sm text-orange-800">
                                            This template requires the <strong>{template.tier === 'pro' ? '₦40,000' : template.tier === 'growth' ? '₦25,000' : 'Free'}</strong> plan. Your current plan doesn't support these advanced workflows.
                                        </p>
                                    </div>
                                    <Link href="/pricing" className="block">
                                        <Button className="w-full py-6 text-lg font-bold bg-gray-900 hover:bg-black text-white rounded-xl shadow-lg transition-all">
                                            View Plans & Upgrade
                                        </Button>
                                    </Link>
                                </div>
                            )}
                            <p className="text-center text-xs text-gray-400 mt-4 italic">
                                estimated setup time: {template.setupTime}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
