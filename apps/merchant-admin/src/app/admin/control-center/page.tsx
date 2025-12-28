
"use client";

import React, { useState, useEffect } from 'react';
import { ControlCenterState, SubscriptionPlan } from '@vayva/shared';
import { Template } from '@/types/templates';
import { getNormalizedTemplates } from '@/lib/templates-registry';
import { ControlCenterHeader } from '@/components/control-center/ControlCenterHeader';
import { TemplateGallery } from '@/components/control-center/TemplateGallery';
import { DomainSettings } from '@/components/control-center/DomainSettings';
import { SalesChannels } from '@/components/control-center/SalesChannels';
import { IntegrationsList } from '@/components/control-center/IntegrationsList';
import { UsageAndSystem } from '@/components/control-center/UsageAndSystem';

// Local override to use canonical Template type
interface LocalControlCenterState extends Omit<ControlCenterState, 'templates'> {
    templates: Template[];
}

export default function ControlCenterPage() {
    const [state, setState] = useState<LocalControlCenterState | null>(null);
    const [loading, setLoading] = useState(true);
    // Mock user plan - in real app would come from useAuth/useMerchant
    const currentPlan: 'free' | 'growth' | 'pro' = 'growth';

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [domains, integrations, channels, usage] = await Promise.all([
                    fetch('/api/control-center/domains').then(r => r.json()),
                    fetch('/api/control-center/integrations').then(r => r.json()),
                    fetch('/api/control-center/channels').then(r => r.json()),
                    fetch('/api/control-center/usage').then(r => r.json())
                ]);

                // Construct initial system status
                // In a real app, backend would aggregate this. Here we self-diagnose for demo.
                const issues = [];
                const webChannel = channels.find((c: any) => c.type === 'website');
                const domainsActive = domains.some((d: any) => d.status === 'active');

                if (webChannel?.status === 'enabled' && !domainsActive) {
                    issues.push({
                        id: 'iss_1',
                        message: 'Website is enabled but no domain is active.',
                        severity: 'warning' as const,
                        actionUrl: '#domains'
                    });
                }

                setState({
                    templates: getNormalizedTemplates().map((t: any) => ({
                        id: t.id,
                        name: t.name,
                        slug: t.slug,
                        category: t.category,
                        tier: t.requiredPlan,
                        description: t.description,
                        previewImageDesktop: t.previewImageDesktop,
                        previewImageMobile: t.previewImageMobile,
                        previewRoute: t.previewRoute,
                        // Legacy/Compat
                        previewImages: {
                            cover: t.previewImageDesktop,
                            desktop: t.previewImageDesktop,
                            mobile: t.previewImageMobile
                        },
                        features: t.compare?.bullets || [],
                        tags: t.compare?.bestFor || [],
                        isActive: t.status === 'implemented',
                        isLocked: false,
                        author: "Vayva",
                        currentVersion: "1.0.0",
                        versions: [],
                        installCount: 100,
                        rating: 5,
                        price: 0,
                        currency: "NGN",
                        isPurchased: true,
                        revenueShare: 0,
                        demand: 'popular',
                        setupTime: "5 mins",
                        stockModel: 'inventory',
                        checkoutMode: 'website',
                        modules: { walletSettlement: true }
                    }) as any),
                    domains,
                    integrations,
                    channels,
                    usage: {
                        orders: usage.orders,
                        products: usage.products,
                        templates: usage.templates
                    },
                    systemStatus: {
                        healthy: issues.length === 0,
                        issues
                    }
                });

            } catch (err) {
                console.error("Failed to load control center", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, []);

    const handleUseTemplate = async (template: Template) => {
        // Optimistic update or reload
        // In real app, call API
        console.log("Use template", template.id);
    };

    const handleAddDomain = () => {
        console.log("Add domain");
    };

    if (loading || !state) {
        return (
            <div className="animate-pulse space-y-8 max-w-7xl mx-auto pb-20">
                <div className="h-20 bg-gray-100 rounded-xl w-full"></div>
                <div className="h-64 bg-gray-100 rounded-xl w-full"></div>
                <div className="h-40 bg-gray-100 rounded-xl w-full"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ControlCenterHeader healthy={state.systemStatus.healthy} />

            <TemplateGallery
                templates={state.templates}
                currentPlan={currentPlan}
                onUseTemplate={handleUseTemplate}
            />

            <hr className="my-12 border-gray-100" />

            <DomainSettings
                domains={state.domains}
                onAddDomain={handleAddDomain}
            />

            <SalesChannels channels={state.channels} />

            <hr className="my-12 border-gray-100" />

            <IntegrationsList integrations={state.integrations} />

            <hr className="my-12 border-gray-100" />

            <UsageAndSystem
                usage={state.usage}
                systemStatus={state.systemStatus}
            />
        </div>
    );
}
