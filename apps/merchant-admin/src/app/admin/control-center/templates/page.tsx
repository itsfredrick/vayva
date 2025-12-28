'use client';

import React, { useEffect, useState } from 'react';
import { GlassPanel, Button, Icon } from '@vayva/ui';
import { Spinner } from '@/components/Spinner';
import { ControlCenterService } from '@/services/control-center.service';
import { StoreTemplate, StoreConfig } from '@/types/control-center';
import { TemplateCard } from '@/components/control-center/TemplateCard';
import Link from 'next/link';
import { UpsellModal } from '@/components/control-center/UpsellModal';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function TemplatesPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [templates, setTemplates] = useState<StoreTemplate[]>([]);
    const [config, setConfig] = useState<StoreConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [applyingId, setApplyingId] = useState<string | null>(null);
    const [upsellData, setUpsellData] = useState<{ isOpen: boolean; templateName: string; requiredTier: string } | null>(null);

    // Map DB plan to template levels
    const userPlan = (user as any)?.plan?.toLowerCase() || 'free';

    useEffect(() => {
        const loadData = async () => {
            const [t, c] = await Promise.all([
                ControlCenterService.getTemplates(),
                ControlCenterService.getStoreConfig()
            ]);
            setTemplates(t);
            setConfig(c);
            setLoading(false);
        };
        loadData();
    }, []);

    const categories = ['all', 'minimal', 'editorial', 'catalog', 'enterprise'];

    const filteredTemplates = selectedCategory === 'all'
        ? templates
        : templates.filter(t => t.category === selectedCategory);

    const handleSelectTemplate = async (id: string) => {
        setApplyingId(id);

        // Persist selection (Service call)
        try {
            // In real app: await ControlCenterService.updateTemplate(id);
            // For now, we simulate persistence success
            await new Promise(r => setTimeout(r, 800));
        } catch (e) {
            console.error(e);
        }

        setApplyingId(null);
        // Redirect to Store Builder
        router.push('/dashboard/store-builder');
    };

    const handlePreview = (template: StoreTemplate) => {
        // Open preview in new tab or modal
        window.open(`/admin/control-center/preview?template=${template.id}`, '_blank');
    };

    const handleUnlock = (template: any) => {
        setUpsellData({
            isOpen: true,
            templateName: template.name,
            requiredTier: template.tier || 'Growth'
        });
    };

    const handleUpgrade = () => {
        router.push('/admin/settings/billing');
        setUpsellData(null);
    };

    if (loading || !config) {
        return <div className="flex h-96 items-center justify-center"><Spinner /></div>;
    }

    return (
        <div className="flex h-[calc(100vh-100px)] -m-6">
            {/* Left Rail - Categories */}
            <div className="w-64 border-r border-white/10 bg-black/20 p-6 flex flex-col gap-2">
                <Link href="/admin/control-center" className="mb-6 flex items-center text-sm text-text-secondary hover:text-white">
                    <Icon name={"ArrowLeft" as any} size={16} className="mr-2" />
                    Back
                </Link>
                <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">Categories</h2>
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all ${selectedCategory === cat
                            ? 'bg-white/10 text-white'
                            : 'text-text-secondary hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                ))}
            </div>

            {/* Main Grid */}
            <div className="flex-1 overflow-y-auto p-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white">Template Gallery</h1>
                    <p className="text-text-secondary">Select a look for your store.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredTemplates.map((template) => {
                        return (
                            <TemplateCard
                                key={template.id}
                                template={{
                                    ...template,
                                    // Map normalized fields to what TemplateCard expects if it hasn't been updated yet
                                    thumbnailUrl: template.previewImageDesktop,
                                    isPremium: !template.isFree
                                } as any}
                                onPreview={() => window.open(template.previewRoute, '_blank')}
                                onUse={() => handleSelectTemplate(template.id)}
                                onUnlock={() => handleUnlock(template)}
                                userPlan={userPlan as any}
                            />
                        );
                    })}
                </div>
            </div>
            {applyingId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="flex flex-col items-center">
                        <Spinner size="lg" />
                        <p className="mt-4 font-medium text-white">Applying Template...</p>
                    </div>
                </div>
            )}

            {upsellData && (
                <UpsellModal
                    isOpen={upsellData.isOpen}
                    onClose={() => setUpsellData(null)}
                    onUpgrade={handleUpgrade}
                    templateName={upsellData.templateName}
                    requiredTier={upsellData.requiredTier}
                />
            )}
        </div>
    );
}
