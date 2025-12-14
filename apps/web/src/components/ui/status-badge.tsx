import React from 'react';
import { cn } from './glass-panel';

export type StatusValue =
    | 'paid' | 'pending' | 'failed' | 'refunded'
    | 'delivered' | 'processing' | 'out_for_delivery' | 'cancelled' | 'approval';

interface StatusBadgeProps {
    status: StatusValue | string;
    type?: 'payment' | 'fulfillment' | 'neutral';
    className?: string;
}

export const StatusBadge = ({ status, type = 'neutral', className }: StatusBadgeProps) => {
    const normalizedStatus = status.toLowerCase();

    let styles = "bg-white/10 text-white";

    // Payment Logic
    if (['paid', 'verified'].includes(normalizedStatus)) styles = "bg-state-success/10 text-state-success";
    if (['pending'].includes(normalizedStatus)) styles = "bg-state-warning/10 text-state-warning";
    if (['failed', 'refunded'].includes(normalizedStatus)) styles = "bg-state-danger/10 text-state-danger";

    // Fulfillment Logic (if strictly separated, otherwise mixed is fine for robustness)
    if (['delivered'].includes(normalizedStatus)) styles = "bg-state-success/10 text-state-success";
    if (['out_for_delivery', 'processing'].includes(normalizedStatus)) styles = "bg-primary/10 text-primary";
    if (['cancelled'].includes(normalizedStatus)) styles = "bg-state-danger/10 text-state-danger";

    // Specific override
    if (normalizedStatus === 'approval') styles = "bg-primary/10 text-primary";

    return (
        <span className={cn(
            "px-2.5 py-1 rounded-[6px] text-[10px] font-bold uppercase tracking-wider whitespace-nowrap",
            styles,
            className
        )}>
            {status.replace(/_/g, ' ')}
        </span>
    );
};
