// ... imports
import React from 'react';
import { Icon, cn } from '@vayva/ui';
import { Template } from '@/types/templates';
import { Recommendation } from '@/types/designer';

interface TemplateCardProps {
    template: Template;
    onPreview: (template: Template) => void;
    onUse: (template: Template) => void;
    onUnlock?: (template: Template) => void;
    userPlan: 'free' | 'growth' | 'pro';
    recommendation?: Recommendation;
}

export const TemplateCard = ({ template, onPreview, onUse, onUnlock, userPlan, recommendation }: TemplateCardProps) => {
    // Determine if locked based on plan
    const planLevels = ['free', 'growth', 'pro'];
    const userLevelIndex = planLevels.indexOf(userPlan);
    const requiredLevelIndex = planLevels.indexOf(template.tier);
    const isPlanLocked = requiredLevelIndex > userLevelIndex;
    const isLocked = template.isLocked || isPlanLocked;

    return (
        <div className={cn(
            "group bg-white border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full",
            recommendation ? "border-purple-200 ring-2 ring-purple-100" : "border-gray-200"
        )}>
            {/* Recommendation Header */}
            {recommendation && (
                <div className="bg-purple-50 px-4 py-2 flex items-center gap-2 border-b border-purple-100">
                    <Icon name="Sparkles" size={14} className="text-purple-600" />
                    <span className="text-xs font-bold text-purple-900 line-clamp-1">{recommendation.reason}</span>
                    <span className="ml-auto text-[10px] font-bold bg-white text-purple-700 px-2 py-0.5 rounded-full border border-purple-200">
                        {recommendation.expectedImpact}
                    </span>
                </div>
            )}

            {/* Image Area */}
            <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden cursor-pointer" onClick={() => onPreview(template)}>
                <img
                    src={(template as any).previewImageDesktop || (template as any).previewImages?.cover || '/images/template-previews/default-desktop.png'}
                    alt={template.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/template-previews/default-desktop.png';
                    }}
                />

                {/* Overlays */}
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {template.isActive && (
                        <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide shadow-sm">
                            Active
                        </span>
                    )}
                    {isLocked && (
                        <span className="bg-gray-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide shadow-sm flex items-center gap-1">
                            <Icon name="Lock" size={10} /> {template.tier} Plan
                        </span>
                    )}
                </div>

                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                    <button
                        onClick={(e) => { e.stopPropagation(); onPreview(template); }}
                        className="bg-white text-black px-4 py-2 rounded-xl text-xs font-bold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 hover:bg-gray-50 flex items-center gap-2"
                    >
                        <Icon name="Eye" size={14} /> Preview
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            {template.demand === 'popular' && (
                                <span className="text-[9px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100 flex items-center gap-1">
                                    <Icon name="Flame" size={8} /> Popular
                                </span>
                            )}
                            {template.demand === 'high_demand' && (
                                <span className="text-[9px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                                    High Demand
                                </span>
                            )}
                            <span className="text-[9px] font-medium text-gray-400 flex items-center gap-1">
                                <Icon name="Clock" size={8} /> {template.setupTime}
                            </span>
                        </div>
                        <h3 className="font-heading font-bold text-lg text-gray-900 leading-tight">{template.name}</h3>
                        {template.tagline && (
                            <p className="text-xs font-medium text-purple-600 mt-0.5">{template.tagline}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{template.description}</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                    {template.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] bg-gray-50 text-gray-500 px-2 py-1 rounded-md border border-gray-100 font-medium">
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 space-y-3">
                    {/* Meta Row */}
                    <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                            <span className={cn(
                                "px-1.5 py-0.5 rounded text-[10px] uppercase font-bold border",
                                template.tier === 'free' ? "bg-gray-50 text-gray-600 border-gray-200" :
                                    template.tier === 'growth' ? "bg-blue-50 text-blue-600 border-blue-200" :
                                        "bg-purple-50 text-purple-600 border-purple-200"
                            )}>
                                {template.tier}
                            </span>
                            <span className="text-gray-300">|</span>
                            <span className="text-gray-500 font-medium capitalize flex items-center gap-1">
                                {template.checkoutMode === 'whatsapp' && <Icon name="MessageCircle" size={10} />}
                                {template.checkoutMode === 'website' && <Icon name="Globe" size={10} />}
                                {template.checkoutMode === 'hybrid' && <Icon name="Shuffle" size={10} />}
                                {template.checkoutMode}
                            </span>
                        </div>

                        {template.price > 0 && !template.isPurchased && !template.isActive ? (
                            <span className="font-bold text-gray-900">₦{template.price.toLocaleString()}</span>
                        ) : null}
                    </div>

                    {template.isActive ? (
                        <button className="w-full py-2.5 bg-gray-100 text-gray-400 rounded-xl text-sm font-bold cursor-default flex items-center justify-center gap-2">
                            <Icon name="Check" size={16} /> Active on Store
                        </button>
                    ) : isLocked ? (
                        <button
                            onClick={() => onUnlock?.(template)}
                            className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                        >
                            <Icon name="Lock" size={14} /> Unlock with {template.tier}
                        </button>
                    ) : template.price > 0 && !template.isPurchased ? (
                        <button
                            onClick={() => onUse(template)}
                            className="w-full py-2.5 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors shadow-sm group-hover:shadow-md flex items-center justify-center gap-2"
                        >
                            <Icon name="CreditCard" size={14} /> Buy Template
                        </button>
                    ) : (
                        <button
                            onClick={() => onUse(template)}
                            className="w-full py-2.5 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors shadow-sm group-hover:shadow-md"
                        >
                            Use Template
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
