'use client';

import React, { useEffect, useState } from 'react';
import { GlassPanel, Button, Icon } from '@vayva/ui';
import { BillingService } from '@/services/billing.service';
import { AddOn } from '@/types/billing';
import { Spinner } from '@/components/Spinner';

export default function AddOnsPage() {
    const [addons, setAddons] = useState<AddOn[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isToggling, setIsToggling] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            const data = await BillingService.getAddons();
            setAddons(data);
            setIsLoading(false);
        };
        load();
    }, []);

    const handleToggle = async (id: string) => {
        setIsToggling(id);
        try {
            await BillingService.toggleAddon(id);
            // Refresh data
            const data = await BillingService.getAddons();
            setAddons(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsToggling(null);
        }
    };

    if (isLoading) return <div className="text-text-secondary flex items-center gap-2"><Spinner size="sm" /> Loading add-ons...</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {addons.map((addon) => (
                <GlassPanel key={addon.id} className={`p-6 flex flex-col relative ${addon.isActive ? 'border-primary ring-1 ring-primary/20 bg-primary/5' : ''}`}>
                    {addon.isIncludedInPlan && (
                        <div className="absolute top-4 right-4 text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">
                            INCLUDED
                        </div>
                    )}

                    <div className="mb-4">
                        <h3 className="text-lg font-bold text-white mb-1">{addon.name}</h3>
                        <p className="text-sm text-text-secondary leading-relaxed">{addon.description}</p>
                    </div>

                    <div className="mt-auto pt-4 border-t border-white/5 space-y-4">
                        <div className="flex items-baseline gap-1">
                            <span className={`text-xl font-bold ${addon.isIncludedInPlan ? 'text-text-secondary line-through decoration-white/30' : 'text-white'}`}>
                                {addon.formattedPrice}
                            </span>
                            {addon.isIncludedInPlan && <span className="text-xl font-bold text-green-500 ml-2">Free</span>}
                        </div>

                        {addon.isIncludedInPlan ? (
                            <Button variant="outline" className="w-full" disabled>
                                <Icon name={"Check" as any} size={14} className="mr-2" />
                                Active (Plan Benefit)
                            </Button>
                        ) : (
                            <Button
                                variant={addon.isActive ? 'secondary' : 'primary'}
                                className="w-full"
                                onClick={() => handleToggle(addon.id)}
                                disabled={Boolean(isToggling)}
                            >
                                {isToggling === addon.id && <Spinner size="sm" className="mr-2" />}
                                {addon.isActive ? 'Remove Add-on' : 'Add to Plan'}
                            </Button>
                        )}
                    </div>
                </GlassPanel>
            ))}
        </div>
    );
}
