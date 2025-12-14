import React, { forwardRef } from 'react';
import { cn } from './glass-panel';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', isLoading, children, disabled, ...props }, ref) => {
        const baseStyles = "h-[48px] px-8 rounded-full font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 outline-none disabled:opacity-50 disabled:cursor-not-allowed";

        const variants = {
            primary: "bg-primary text-background-dark hover:bg-primary-hover shadow-glow border border-transparent",
            secondary: "bg-white/10 text-white hover:bg-white/20 border border-white/5",
            outline: "bg-transparent border border-white/20 text-white hover:border-white/40",
            ghost: "bg-transparent text-text-secondary hover:text-white"
        };

        return (
            <button
                ref={ref}
                className={cn(baseStyles, variants[variant], className)}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                )}
                {children}
            </button>
        );
    }
);
Button.displayName = 'Button';
