'use client';

import React, { useEffect, useState } from 'react';
import { PlanCard } from '@/components/billing/PlanCard';
import { BillingService } from '@/services/billing.service';
import { PlanDetails, PlanTier } from '@/types/billing';
import { GlassPanel, Icon } from '@vayva/ui';

export default function SubscriptionPage() {
    const [currentPlanId, setCurrentPlanId] = useState<PlanTier>('STARTER');
    const [plans, setPlans] = useState<PlanDetails[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        const load = async () => {
            const [fetchedPlans, subscription] = await Promise.all([
                BillingService.getPlans(),
                BillingService.getSubscription()
            ]);
            setPlans(fetchedPlans);
            setCurrentPlanId(subscription.planId);
            setIsLoading(false);
        };
        load();
    }, []);

    const handlePlanChange = async (planId: PlanTier) => {
        if (confirm(`Are you sure you want to change your plan to ${planId}?`)) {
            setIsUpdating(true);
            try {
                await BillingService.changePlan(planId);
                setCurrentPlanId(planId);
                // In a real app, we'd show a success toast here
            } catch (error) {
                console.error("Failed to change plan", error);
            } finally {
                setIsUpdating(false);
            }
        }
    };

    if (isLoading) return <div className="text-text-secondary">Loading plans...</div>;

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <PlanCard
                        key={plan.id}
                        plan={plan}
                        currentPlanId={currentPlanId}
                        onSelect={handlePlanChange}
                        isLoading={isUpdating}
                    />
                ))}
            </div>

            {/* Additional Info / Security Badge for Payments placeholder */}
            <div className="flex items-center justify-center gap-2 text-text-secondary text-sm">
                <Icon name={"Lock" as any} size={14} />
                <span>Payments processed securely by Paystack</span>
            </div>
        </div>
    );
}
