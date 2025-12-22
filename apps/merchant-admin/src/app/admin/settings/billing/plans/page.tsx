'use client';

import React from 'react';
import { AppShell , GlassPanel , Button , Icon } from '@vayva/ui';

const PLANS = [
    {
        name: 'Starter',
        price: '₦ 0',
        period: '/ month',
        description: 'For hobbyists and testing the waters.',
        features: ['50 Products', '1 Staff Account', '100 WhatsApp Msgs', 'Basic Analytics'],
        current: false,
    },
    {
        name: 'Growth',
        price: '₦ 15,000',
        period: '/ month',
        description: 'For growing businesses needing more power.',
        features: ['500 Products', '5 Staff Accounts', '1,500 WhatsApp Msgs', 'Advanced Analytics', 'Priority Support'],
        current: true,
        recommended: true,
    },
    {
        name: 'Pro',
        price: '₦ 50,000',
        period: '/ month',
        description: 'For high-volume sellers scaling up.',
        features: ['Unlimited Products', 'Unlimited Staff', '10,000 WhatsApp Msgs', 'Custom Domains', 'Dedicated Account Manager'],
        current: false,
    },
];

export default function PlanSelectionPage() {
    return (
        <AppShell sidebar={<></>} header={<></>}>
            <div className="max-w-6xl mx-auto py-10">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-white mb-2">Choose the plan that fits your growth</h1>
                    <p className="text-text-secondary">Upgrade or downgrade at any time. No hidden fees.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {PLANS.map((plan) => (
                        <GlassPanel key={plan.name} className={`p-8 flex flex-col relative ${plan.recommended ? 'border-primary/50 bg-primary/5' : ''}`}>
                            {plan.recommended && (
                                <div className="absolute top-0 right-0 left-0 bg-primary text-black text-center text-[10px] font-bold uppercase py-1">Recommended</div>
                            )}

                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                                <p className="text-xs text-text-secondary h-8">{plan.description}</p>
                            </div>

                            <div className="mb-6">
                                <span className="text-3xl font-bold text-white">{plan.price}</span>
                                <span className="text-sm text-text-secondary">{plan.period}</span>
                            </div>

                            <div className="flex-1 space-y-4 mb-8">
                                {plan.features.map((feat, i) => (
                                    <div key={i} className="flex items-center gap-3 text-sm text-white">
                                        <Icon name={"Check" as any} className="text-state-success shrink-0" size={16} />
                                        {feat}
                                    </div>
                                ))}
                            </div>

                            <Button
                                className={`w-full ${plan.current ? 'bg-white/10 text-white cursor-default' : 'bg-primary text-black hover:bg-primary/90'}`}
                                disabled={plan.current}
                            >
                                {plan.current ? 'Current Plan' : 'Select Plan'}
                            </Button>
                        </GlassPanel>
                    ))}
                </div>
            </div>
        </AppShell>
    );
}
