import { GlassPanel } from '@vayva/ui';

export const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <GlassPanel className={className}>{children}</GlassPanel>
);
