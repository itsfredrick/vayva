'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell , GlassPanel , Button , Icon } from '@vayva/ui';
import { RequirementChecklist } from '@/components/requirement-checklist';

export default function MarketplaceOptInPage() {
    const router = useRouter();
    const [acceptedPolicy, setAcceptedPolicy] = useState(false);
    const [isEnabling, setIsEnabling] = useState(false);

    const handleEnable = () => {
        setIsEnabling(true);
        // Simulate API call
        setTimeout(() => {
            router.push('/admin/marketplace/listings');
        }, 1500);
    };

    return (
        <AppShell sidebar={<></>} header={<></>}>
            <div className="max-w-3xl mx-auto flex flex-col gap-6 py-10 px-4">
                {/* Intro Panel */}
                <GlassPanel className="p-8 text-center bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border-indigo-500/20">
                    <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mx-auto mb-6 text-indigo-400">
                        <Icon name={"Store" as any} size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-4">Sell on Vayva Market</h1>
                    <p className="text-text-secondary text-lg mb-8 max-w-xl mx-auto">
                        Instantly list your products to millions of shoppers across Nigeria.
                        Get more orders without spending on ads or building traffic.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-left">
                        {[
                            { icon: 'Globe', title: 'Nationwide Reach', text: 'Access customers in every state.' },
                            { icon: 'CreditCard', title: 'Secure Payments', text: 'Vayva handles trust and escrow.' },
                            { icon: 'LayoutDashboard', title: 'Unified Control', text: 'Manage everything in one place.' },
                        ].map((feat, i) => (
                            <div key={i} className="flex flex-col gap-2 p-4 rounded-xl bg-white/5 border border-white/5">
                                <Icon name={feat.icon as any} className="text-indigo-400" />
                                <h3 className="font-bold text-white">{feat.title}</h3>
                                <p className="text-xs text-text-secondary">{feat.text}</p>
                            </div>
                        ))}
                    </div>
                </GlassPanel>

                {/* Requirements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h3 className="font-bold text-white ml-1">Requirements</h3>
                        <RequirementChecklist items={[
                            { label: 'Store details complete', met: true },
                            { label: 'At least 3 active products', met: true },
                            { label: 'Delivery settings configured', met: true },
                            { label: 'Payments connected', met: true },
                            { label: 'Verified business ID', met: false, link: '/admin/settings/id' },
                        ]} />
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-bold text-white ml-1">Marketplace Policies</h3>
                        <GlassPanel className="p-6 h-full flex flex-col justify-between">
                            <ul className="space-y-3 text-sm text-text-secondary list-disc pl-4 mb-6">
                                <li>You must fulfill orders within 48 hours.</li>
                                <li>Products must accurately match descriptions.</li>
                                <li>Prohibited items (weapons, drugs) are banned.</li>
                                <li>Vayva charges a 5% commission on sales.</li>
                            </ul>
                            <div>
                                <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg border border-white/10 hover:bg-white/5 transition-colors">
                                    <input type="checkbox" className="checkbox checkbox-primary checkbox-sm" checked={acceptedPolicy} onChange={(e) => setAcceptedPolicy(e.target.checked)} />
                                    <span className="text-sm font-bold text-white">I agree to Marketplace policies</span>
                                </label>
                            </div>
                        </GlassPanel>
                    </div>
                </div>

                {/* Action Bar */}
                <GlassPanel className="p-4 sticky bottom-6 flex items-center justify-between">
                    <span className="text-xs text-text-secondary">By enabling, your eligible products will be reviewed.</span>
                    <Button
                        disabled={!acceptedPolicy || isEnabling}
                        onClick={handleEnable}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white border-none min-w-[200px]"
                    >
                        {isEnabling ? 'Enabling...' : 'Enable Marketplace'}
                    </Button>
                </GlassPanel>
            </div>
        </AppShell>
    );
}
