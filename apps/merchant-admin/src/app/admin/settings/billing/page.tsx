'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { SubscriptionCard } from '@/components/billing/SubscriptionCard';
import { PaymentMethodCard } from '@/components/billing/PaymentMethodCard';
import { PlanSelectionModal } from '@/components/billing/PlanSelectionModal';
import { toast } from 'sonner';

// Fallback GlassCard
const GlassCard = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-white/80 backdrop-blur-md border border-white/20 rounded-2xl shadow-sm ${className}`}>
        {children}
    </div>
);

export default function BillingSettingsPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [subscription, setSubscription] = useState<any>(null);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBilling = async () => {
            try {
                const res = await fetch('/api/account/billing');
                if (!res.ok) throw new Error('Failed to load billing details');
                const data = await res.json();
                setSubscription(data.subscription);
            } catch (err: any) {
                setError(err.message);
                toast.error('Failed to load subscription details');
            } finally {
                setLoading(false);
            }
        };
        fetchBilling();
    }, []);

    const handleSelectPlan = async (plan: string) => {
        setProcessing(true);
        try {
            const res = await fetch('/api/billing/subscription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newPlan: plan })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Upgrade failed');
            }

            if (data.paymentUrl) {
                window.location.href = data.paymentUrl;
            } else if (data.success) {
                toast.success(data.message || 'Plan updated successfully');
                setShowUpgradeModal(false);
                // Refresh
                const refreshRes = await fetch('/api/account/billing');
                if (refreshRes.ok) {
                    const refreshData = await refreshRes.json();
                    setSubscription(refreshData.subscription);
                }
            }
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6 max-w-4xl animate-pulse">
                <div className="h-8 w-48 bg-gray-200 rounded mb-4" />
                <div className="h-64 bg-gray-100 rounded-2xl" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-red-50 text-red-600 rounded-lg">
                <h3 className="font-bold">Error Loading Billing</h3>
                <p>{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-white border border-red-200 rounded hover:bg-red-50"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Subscription & Billing</h1>
                <p className="text-muted-foreground">Manage your plan, payment methods, and invoices.</p>
            </div>

            <SubscriptionCard
                plan={subscription?.plan}
                status={subscription?.status}
                amount={subscription?.amount || 0}
                interval={subscription?.interval || 'monthly'}
                nextBillingDate={subscription?.renewalDate}
                onUpgrade={() => setShowUpgradeModal(true)}
            />

            <PaymentMethodCard
                last4={subscription?.paymentMethod?.last4}
                expiry={subscription?.paymentMethod?.expiry}
                onAdd={() => setShowUpgradeModal(true)}
                onRemove={() => { }} // Not implemented yet, explicitly empty
            />

            <GlassCard className="p-6 opacity-60">
                <h3 className="text-lg font-semibold mb-4">Billing History</h3>
                <p className="text-sm text-gray-500">No invoices generated yet.</p>
            </GlassCard>

            <PlanSelectionModal
                isOpen={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
                onSelectPlan={handleSelectPlan}
                currentPlan={subscription?.plan}
                processing={processing}
            />
        </div>
    );
}
