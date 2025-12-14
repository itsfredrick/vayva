import React, { forwardRef } from 'react';
import { cn } from './glass-panel';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, error, label, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="text-xs uppercase tracking-widest text-[rgba(255,255,255,0.65)] font-bold mb-2 block">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <input
                        className={cn(
                            "w-full h-[48px] px-6 rounded-full bg-[rgba(20,34,16,0.6)] border border-[rgba(255,255,255,0.08)]",
                            "text-white placeholder-[rgba(255,255,255,0.3)] transition-all outline-none",
                            "focus:border-primary focus:ring-1 focus:ring-primary",
                            error && "border-state-danger focus:border-state-danger focus:ring-state-danger",
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                </div>
                {error && <p className="mt-1 text-xs text-state-danger">{error}</p>}
            </div>
        );
    }
);
Input.displayName = 'Input';
