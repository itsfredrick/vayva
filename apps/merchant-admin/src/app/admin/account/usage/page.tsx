'use client';

import React, { useEffect, useState } from 'react';
import { GlassPanel, Button, Icon } from '@vayva/ui';
import { BillingService } from '@/services/billing.service';
import { UsageStats } from '@/types/billing';
import { Spinner } from '@/components/Spinner';

function UsageBar({ label, current, limit, unit }: { label: string, current: number, limit: number, unit: string }) {
    const isUnlimited = limit === -1;
    const percentage = isUnlimited ? 0 : Math.min((current / limit) * 100, 100);
    const displayLimit = isUnlimited ? 'Unlimited' : limit;

    return (
        <div className="space-y-2">
            <div className="flex justify-between text-sm">
                <span className="text-text-secondary font-medium">{label}</span>
                <span className="text-white font-bold">{current} <span className="text-text-secondary font-normal">/ {displayLimit} {unit}</span></span>
            </div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${isUnlimited ? 'bg-primary w-full opacity-50' : 'bg-primary'}`}
                    style={{ width: isUnlimited ? '100%' : `${percentage}%` }}
                />
            </div>
        </div>
    );
}

export default function UsagePage() {
    const [usage, setUsage] = useState<UsageStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await BillingService.getUsage();
            setUsage(data);
            setIsLoading(false);
        };
        load();
    }, []);

    if (isLoading) return <div className="text-text-secondary flex items-center gap-2"><Spinner size="sm" /> Loading usage...</div>;
    if (!usage) return null;

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassPanel className="p-6 space-y-6">
                    <h3 className="text-lg font-bold text-white mb-4">Store Limits</h3>

                    <UsageBar
                        label="Products"
                        current={usage.productsCount}
                        limit={usage.productsLimit}
                        unit="products"
                    />

                    <UsageBar
                        label="Staff Accounts"
                        current={usage.staffCount}
                        limit={usage.staffLimit}
                        unit="users"
                    />
                </GlassPanel>

                <GlassPanel className="p-6 space-y-6">
                    <h3 className="text-lg font-bold text-white mb-4">Features</h3>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-green-500/10 text-green-500">
                                <Icon name={"MessageSquare" as any} size={16} />
                            </div>
                            <div>
                                <h4 className="font-medium text-white">WhatsApp AI</h4>
                                <p className="text-xs text-text-secondary">
                                    {usage.waTrialEndsAt
                                        ? `Trial ends ${new Date(usage.waTrialEndsAt).toLocaleDateString()}`
                                        : 'Active'}
                                </p>
                            </div>
                        </div>
                        <span className="text-sm font-medium text-white">{usage.waConversationsCount} chats</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${usage.marketplaceListed ? 'bg-blue-500/10 text-blue-500' : 'bg-white/10 text-text-secondary'}`}>
                                <Icon name={"Store" as any} size={16} />
                            </div>
                            <div>
                                <h4 className="font-medium text-white">Marketplace Listing</h4>
                                <p className="text-xs text-text-secondary">
                                    {usage.marketplaceListed ? 'Active' : 'Upgrade to list on Vayva Market'}
                                </p>
                            </div>
                        </div>
                        {!usage.marketplaceListed && <Icon name={"Lock" as any} size={14} className="text-text-secondary" />}
                    </div>
                </GlassPanel>
            </div>
        </div>
    );
}
