import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Fallback GlassCard since it doesn't exist
const GlassCard = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-white/80 backdrop-blur-md border border-white/20 rounded-2xl shadow-sm ${className}`}>
        {children}
    </div>
);

interface SubscriptionCardProps {
    plan: string;
    status: 'active' | 'inactive' | 'past_due' | 'canceled' | 'trialing';
    amount: number;
    interval: string;
    nextBillingDate?: string;
    onUpgrade?: () => void;
}

export const SubscriptionCard = ({
    plan,
    status,
    amount,
    interval,
    nextBillingDate,
    onUpgrade
}: SubscriptionCardProps) => {

    return (
        <GlassCard className="p-8 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50" />

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-xl font-bold text-gray-900">{plan}</h2>
                        <Badge
                            variant={status === 'active' || status === 'trialing' ? 'default' : 'destructive'}
                        >
                            {status.replace('_', ' ')}
                        </Badge>
                    </div>
                    <div className="text-3xl font-extrabold text-gray-900 mb-1">
                        {amount === 0 ? 'Free' : `₦${amount.toLocaleString()}`}
                        <span className="text-base font-normal text-gray-500">/{interval}</span>
                    </div>
                    {nextBillingDate && (
                        <p className="text-sm text-gray-500">
                            Renews on {new Date(nextBillingDate).toLocaleDateString()}
                        </p>
                    )}
                </div>

                <Button
                    onClick={onUpgrade}
                    className="bg-black text-white px-6 py-2 rounded-xl shadow-lg hover:scale-105 transition-transform"
                >
                    Upgrade Plan
                </Button>
            </div>
        </GlassCard>
    );
};
