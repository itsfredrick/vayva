import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

export const GlassPanel = ({ children, className, ...props }: GlassPanelProps) => {
    return (
        <div
            className={cn(
                "bg-[rgba(20,34,16,0.70)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.08)] rounded-2xl",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};
