'use client';

import React from 'react';
import Link from 'next/link';
import { Icon, cn } from '@vayva/ui';

interface ChecklistItem {
    id: string;
    label: string;
    description: string;
    cta: string;
    href: string;
    isCompleted: boolean;
}

interface LaunchChecklistProps {
    items: ChecklistItem[];
}

export const LaunchChecklist = ({ items }: LaunchChecklistProps) => {
    // Interactive progress
    const completedCount = items.filter(i => i.isCompleted).length;
    const progress = Math.round((completedCount / items.length) * 100);

    return (
        <div className="bg-[#142210] border border-primary/20 rounded-2xl p-6 mb-8 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

            <div className="flex items-start justify-between mb-6 relative z-10">
                <div>
                    <h3 className="text-xl font-bold text-white mb-1">Let's get your store ready for launch 🚀</h3>
                    <p className="text-text-secondary text-sm">Complete these steps to start accepting real orders.</p>
                </div>
                <div className="flex items-center gap-3 bg-black/20 p-2 rounded-lg border border-white/5">
                    <div className="text-right">
                        <p className="text-xs text-text-secondary">Progress</p>
                        <p className="text-sm font-bold text-white">{progress}% Ready</p>
                    </div>
                    {/* Ring Chart (simplified) */}
                    <div className="w-10 h-10 relative flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                            <path
                                className="text-white/10"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="text-primary transition-all duration-1000 ease-out"
                                strokeDasharray={`${progress}, 100`}
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="grid gap-3 relative z-10">
                {items.map((item, idx) => (
                    <div
                        key={item.id}
                        className={cn(
                            "flex items-center justify-between p-4 rounded-xl border transition-all",
                            item.isCompleted
                                ? "bg-primary/5 border-primary/20 opacity-60 hover:opacity-100"
                                : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
                        )}
                    >
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "w-6 h-6 rounded-full flex items-center justify-center border transition-colors",
                                item.isCompleted ? "bg-primary border-primary text-black" : "border-white/30 text-transparent"
                            )}>
                                <Icon name="Check" size={14} strokeWidth={4} />
                            </div>
                            <div>
                                <h4 className={cn("font-medium text-sm", item.isCompleted ? "text-primary line-through decoration-primary/50" : "text-white")}>
                                    {item.label}
                                </h4>
                                {!item.isCompleted && <p className="text-xs text-text-secondary mt-0.5">{item.description}</p>}
                            </div>
                        </div>

                        {!item.isCompleted && (
                            <Link href={item.href}>
                                <button className="h-8 px-4 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors flex items-center gap-2">
                                    {item.cta}
                                    <Icon name="ArrowRight" size={12} />
                                </button>
                            </Link>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
