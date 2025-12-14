'use client';

import React from 'react';
import { cn } from './glass-panel';
import { Icon } from './icon';

interface StepperProps {
    currentStep: number;
    totalSteps?: number;
    className?: string;
}

export const Stepper = ({ currentStep, totalSteps = 8, className }: StepperProps) => {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            {Array.from({ length: totalSteps }).map((_, i) => {
                const step = i + 1;
                const isActive = step === currentStep;
                const isCompleted = step < currentStep;

                return (
                    <div key={i} className="flex items-center">
                        <div
                            className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all border",
                                isActive
                                    ? "bg-primary text-background-dark border-primary shadow-glow"
                                    : isCompleted
                                        ? "bg-primary/20 text-primary border-primary/20"
                                        : "bg-white/5 text-white/30 border-white/5"
                            )}
                        >
                            {isCompleted ? <Icon name="check" size={16} /> : step}
                        </div>
                        {step < totalSteps && (
                            <div className={cn(
                                "w-4 h-[2px] mx-1 rounded-full",
                                step < currentStep ? "bg-primary/30" : "bg-white/5"
                            )} />
                        )}
                    </div>
                );
            })}
        </div>
    );
};
