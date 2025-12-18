import { StatusChip } from '@vayva/ui';

export const Badge = ({ children, variant = "default" }: { children: React.ReactNode, variant?: "default" | "secondary" | "destructive" | "outline" }) => {
    // Map variants to StatusChip status
    let status: 'success' | 'warning' | 'error' | 'info' | 'neutral' = 'neutral';
    if (variant === 'default') status = 'success';
    if (variant === 'destructive') status = 'error';

    return <StatusChip status={status}>{children}</StatusChip>;
};
