
import React, { useState } from 'react';
import { Template } from '@/types/templates';
import { TEMPLATE_CATEGORIES, getTemplatesByCategory } from '@/lib/templates-registry';
import { TemplateCard } from './TemplateCard';
import { UpgradePlanModal } from '@/components/billing/UpgradePlanModal';
import { Icon, Button, Badge } from '@vayva/ui';

interface TemplateGalleryProps {
    templates?: Template[]; // Make optional, default to canonical
    currentPlan: 'free' | 'growth' | 'pro'; // Aligned with merchant-admin legacy types
    onUseTemplate: (template: Template) => void;
    recommendedTemplateId?: string;
    recommendationReason?: string;
}

export const TemplateGallery = ({ templates, currentPlan, onUseTemplate, recommendedTemplateId, recommendationReason }: TemplateGalleryProps) => {

    const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
    const [targetPlan, setTargetPlan] = useState('');

    const handleUnlock = (template: Template) => {
        setTargetPlan(template.tier); // e.g. 'Pro', 'Growth'
        setUpgradeModalOpen(true);
    };

    return (
        <section className="mb-12 space-y-12">
            <UpgradePlanModal
                isOpen={upgradeModalOpen}
                onClose={() => setUpgradeModalOpen(false)}
                currentPlan={currentPlan}
                requiredPlan={targetPlan}
            />

            <div className="flex items-center justify-between mb-2">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Template Gallery</h2>
                    <p className="text-gray-500">Explore professionally designed templates for your business.</p>
                </div>
            </div>

            {TEMPLATE_CATEGORIES.filter(c => c.isActive).map(category => {
                const categoryTemplates = getTemplatesByCategory(category.slug as any).map((t: any) => ({
                    id: t.id,
                    name: t.name,
                    slug: t.slug,
                    category: t.category,
                    tier: t.requiredPlan,
                    description: t.description,
                    previewImageDesktop: t.previewImageDesktop,
                    previewImageMobile: t.previewImageMobile,
                    previewRoute: t.previewRoute,
                    features: t.features || [],
                    tags: [], // registry does not have tags in normalized shape yet, or they are in features
                    isActive: t.status === 'active' || t.status === 'implemented',
                    isLocked: false,
                    demand: 'popular',
                    setupTime: "5 mins",
                    checkoutMode: 'website'
                }) as any);
                if (categoryTemplates.length === 0) return null;

                return (
                    <div key={category.slug} className="scroll-mt-24" id={`cat-${category.slug}`}>
                        <div className="flex items-center gap-3 mb-6">
                            <h3 className="text-lg font-bold text-gray-900">{category.displayName}</h3>
                            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">{categoryTemplates.length}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categoryTemplates.map(template => (
                                <TemplateCard
                                    key={template.id}
                                    template={template}
                                    userPlan={currentPlan}
                                    onPreview={() => window.open((template as any).previewRoute, '_blank')}
                                    onUse={onUseTemplate}
                                    onUnlock={handleUnlock}
                                    recommendation={template.id === recommendedTemplateId ? {
                                        reason: recommendationReason || "Recommended for your business",
                                        expectedImpact: "Best Match"
                                    } as any : undefined}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}
        </section>
    );
};
