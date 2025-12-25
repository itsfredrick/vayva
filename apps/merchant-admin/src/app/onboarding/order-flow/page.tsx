'use client';

import React, { useState, useEffect } from 'react';
import { Button, Icon, cn, Input } from '@vayva/ui'; // Check switch usage
import { Switch } from '@/components/ui/Switch';
import { useOnboarding } from '@/context/OnboardingContext';

// Master Prompt Step 6: Order Flow (Expanded)
// Intelligence: Rename, Reorder, Toggle Active/Internal
// Automation Hooks: Notify Customer/Staff (Preview)
// Kanban: Animated preview
// Validation: "Must have completion state"

interface OrderStatus {
    id: string;
    label: string;
    isTerminal: boolean; // Completed/Cancelled state
    isInternal: boolean; // Not visible to customer
    isActive: boolean;
    notifyCustomer: boolean; // Automation hook
}

export default function OrderFlowPage() {
    const { state, updateState, goToStep } = useOnboarding();

    // Default statuses with expanded props
    const [statuses, setStatuses] = useState<OrderStatus[]>([
        { id: 'new', label: 'New Order', isTerminal: false, isInternal: true, isActive: true, notifyCustomer: true },
        { id: 'processing', label: 'Processing', isTerminal: false, isInternal: true, isActive: true, notifyCustomer: false },
        { id: 'shipped', label: 'Shipped', isTerminal: false, isInternal: false, isActive: true, notifyCustomer: true },
        { id: 'delivered', label: 'Delivered', isTerminal: true, isInternal: false, isActive: true, notifyCustomer: true },
        { id: 'cancelled', label: 'Cancelled', isTerminal: true, isInternal: false, isActive: true, notifyCustomer: false },
    ]);

    const moveStatus = (index: number, direction: 'up' | 'down') => {
        const newStatuses = [...statuses];
        if (direction === 'up' && index > 0) {
            [newStatuses[index], newStatuses[index - 1]] = [newStatuses[index - 1], newStatuses[index]];
        } else if (direction === 'down' && index < newStatuses.length - 1) {
            [newStatuses[index], newStatuses[index + 1]] = [newStatuses[index + 1], newStatuses[index]];
        }
        setStatuses(newStatuses);
    };

    const updateStatus = (index: number, updates: Partial<OrderStatus>) => {
        const newStatuses = [...statuses];
        newStatuses[index] = { ...newStatuses[index], ...updates };
        setStatuses(newStatuses);
    };

    const hasTerminal = statuses.some(s => s.isActive && s.isTerminal);

    const handleContinue = async () => {
        if (!hasTerminal) return;

        await updateState({
            orderFlow: {
                statuses: statuses.filter(s => s.isActive).map(s => s.label)
            }
        });
        await goToStep('payments');
    };

    return (
        <div className="flex flex-col lg:flex-row h-full gap-8 max-w-6xl mx-auto items-start">
            {/* Left Column: Configuration */}
            <div className="flex-1 w-full max-w-xl lg:pt-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Define your order flow</h1>
                    <p className="text-gray-500">Customize how orders move from start to finish. Set automation rules.</p>
                </div>

                <div className="space-y-4">
                    {statuses.map((status, index) => (
                        <div
                            key={status.id}
                            className={cn(
                                "bg-white border rounded-xl p-4 shadow-sm transition-all group",
                                status.isActive ? "border-gray-200" : "border-gray-100 opacity-60 bg-gray-50"
                            )}
                        >
                            <div className="flex items-start gap-3">
                                <div className="flex flex-col gap-1 text-gray-300 pt-2">
                                    <button
                                        onClick={() => moveStatus(index, 'up')}
                                        disabled={index === 0}
                                        className="hover:text-black disabled:opacity-0 cursor-pointer"
                                    >
                                        <Icon name="ChevronUp" size={14} />
                                    </button>
                                    <button
                                        onClick={() => moveStatus(index, 'down')}
                                        disabled={index === statuses.length - 1}
                                        className="hover:text-black disabled:opacity-0 cursor-pointer"
                                    >
                                        <Icon name="ChevronDown" size={14} />
                                    </button>
                                </div>

                                <div className="flex-1 space-y-3">
                                    {/* Top Row: Label & Toggles */}
                                    <div className="flex items-center gap-4">
                                        <input
                                            value={status.label}
                                            onChange={(e) => updateStatus(index, { label: e.target.value })}
                                            disabled={!status.isActive}
                                            className="font-bold text-gray-900 outline-none placeholder:text-gray-300 bg-transparent text-base flex-1 focus:underline decoration-gray-300 underline-offset-4"
                                            placeholder="Status Name"
                                        />

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => updateStatus(index, { isActive: !status.isActive })}
                                                className={cn(
                                                    "text-xs px-2 py-1 rounded-md font-medium transition-colors border",
                                                    status.isActive
                                                        ? "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                                                        : "bg-gray-100 text-gray-400 border-gray-200"
                                                )}
                                            >
                                                {status.isActive ? 'Active' : 'Inactive'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Bottom Row: Automation Hooks (Preview) */}
                                    {status.isActive && (
                                        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                                            <button
                                                onClick={() => updateStatus(index, { notifyCustomer: !status.notifyCustomer })}
                                                className={cn(
                                                    "text-[10px] flex items-center gap-1.5 px-2 py-1 rounded-full border transition-colors",
                                                    status.notifyCustomer
                                                        ? "bg-green-50 border-green-200 text-green-700"
                                                        : "bg-white border-gray-200 text-gray-400 hover:border-gray-300"
                                                )}
                                            >
                                                <Icon name={status.notifyCustomer ? "BellRing" : "BellOff"} size={10} />
                                                Notify Customer
                                            </button>

                                            <button
                                                onClick={() => updateStatus(index, { isTerminal: !status.isTerminal })}
                                                className={cn(
                                                    "text-[10px] flex items-center gap-1.5 px-2 py-1 rounded-full border transition-colors",
                                                    status.isTerminal
                                                        ? "bg-blue-50 border-blue-200 text-blue-700"
                                                        : "bg-white border-gray-200 text-gray-400 hover:border-gray-300"
                                                )}
                                            >
                                                <Icon name="CircleCheck" size={10} />
                                                Marks Complete
                                            </button>

                                            {!status.isInternal && (
                                                <span className="text-[10px] px-2 py-1 bg-gray-50 text-gray-400 rounded-full flex items-center gap-1">
                                                    <Icon name="Eye" size={10} /> Visible to Customer
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {!hasTerminal && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex items-center gap-3 animate-pulse">
                        <Icon name="TriangleAlert" size={18} />
                        <div>
                            <span className="font-bold block">Invalid Flow</span>
                            Every order must have a final completion state (e.g. Delivered).
                        </div>
                    </div>
                )}

                <div className="mt-8 flex justify-end">
                    <Button
                        onClick={handleContinue}
                        disabled={!hasTerminal}
                        className="!bg-black text-white h-12 px-8 rounded-xl text-base shadow-lg hover:shadow-xl transition-all"
                    >
                        Continue
                    </Button>
                </div>
            </div>

            {/* Right Column: Live Kanban Board */}
            <div className="hidden lg:block flex-1 w-full sticky top-24">
                <div className="bg-gray-100 rounded-3xl p-6 border border-gray-200 relative min-h-[600px] flex flex-col">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Kanban Preview</h3>
                        <div className="flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-400" />
                            <div className="w-2 h-2 rounded-full bg-yellow-400" />
                            <div className="w-2 h-2 rounded-full bg-green-400" />
                        </div>
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-4 flex-1 pr-12 scrollbar-hide snap-x snap-mandatory">
                        {statuses.filter(s => s.isActive).map((status) => (
                            <div key={status.id} className="w-44 flex-shrink-0 flex flex-col gap-3 transition-all duration-300 snap-start">
                                <div className={cn(
                                    "h-1 rounded-full w-full mb-1 transition-colors",
                                    status.isTerminal ? "bg-green-500" : "bg-gray-300"
                                )} />
                                <h4 className="font-bold text-gray-700 text-sm truncate">{status.label}</h4>

                                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 space-y-2 group hover:scale-[1.02] transition-transform cursor-grab active:cursor-grabbing">
                                    <div className="flex justify-between items-start">
                                        <div className="h-2 w-16 bg-gray-100 rounded" />
                                        <div className="w-4 h-4 rounded-full bg-gray-50" />
                                    </div>
                                    <div className="h-8 w-full bg-gray-50 rounded border border-gray-50" />
                                    <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                        {status.notifyCustomer && <Icon name="Bell" size={10} className="text-green-500" />}
                                        <span>#1024</span>
                                    </div>
                                </div>

                                {/* Placeholder card for 'New' to show volume */}
                                {status.id === 'new' && (
                                    <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 space-y-2 opacity-50">
                                        <div className="h-2 w-10 bg-gray-100 rounded" />
                                        <div className="h-6 w-full bg-gray-50 rounded" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Educational Note */}
                    <div className="mt-auto bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-gray-200 text-xs text-gray-500">
                        <p className="flex items-center gap-2 mb-1 font-bold text-gray-700">
                            <Icon name="Zap" size={12} className="text-yellow-500" />
                            Automation Tip
                        </p>
                        When an order moves to <span className="font-bold">Delivered</span>, we can automatically ask the customer for a review on WhatsApp.
                    </div>
                </div>
            </div>
        </div>
    );
}
