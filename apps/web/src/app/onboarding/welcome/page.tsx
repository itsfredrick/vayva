'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminShell } from '@/components/admin-shell';
import { GlassPanel, cn } from '@/components/ui/glass-panel';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Stepper } from '@/components/ui/stepper';

export default function WelcomePage() {
    const router = useRouter();
    const [selectedGoals, setSelectedGoals] = useState<string[]>(['sell_online']);

    const toggleGoal = (id: string) => {
        if (id === 'sell_online') return; // Required
        if (selectedGoals.includes(id)) {
            setSelectedGoals(selectedGoals.filter(g => g !== id));
        } else {
            setSelectedGoals([...selectedGoals, id]);
        }
    };

    const handleContinue = () => {
        router.push('/onboarding/store');
    };

    return (
        <AdminShell mode="onboarding" breadcrumb="Onboarding / Welcome">
            <div className="flex flex-col gap-6 max-w-5xl mx-auto">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Welcome to Vayva</h1>
                        <p className="text-text-secondary">Let’s get your store set up in just a few steps.</p>
                    </div>
                    <Stepper currentStep={1} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[500px]">
                    {/* Left: Goal Selection */}
                    <GlassPanel className="md:col-span-2 p-8 flex flex-col gap-6">
                        <h2 className="text-lg font-bold text-white">What do you want to do first?</h2>

                        <div className="flex flex-col gap-4">
                            {/* Goal 1 */}
                            <button
                                onClick={() => toggleGoal('sell_online')}
                                className={cn(
                                    "flex items-start gap-4 p-4 rounded-xl text-left transition-all border",
                                    selectedGoals.includes('sell_online')
                                        ? "bg-primary/10 border-primary/50"
                                        : "bg-white/5 border-white/10 hover:bg-white/10"
                                )}
                            >
                                <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                                    selectedGoals.includes('sell_online') ? "bg-primary text-background-dark" : "bg-white/10 text-white"
                                )}>
                                    <Icon name="storefront" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-white">Sell online</h3>
                                        <span className="text-[10px] font-bold bg-primary/20 text-primary px-2 py-0.5 rounded pill">REQUIRED</span>
                                    </div>
                                    <p className="text-sm text-text-secondary">Create a beautiful storefront and accept payments securely.</p>
                                </div>
                                {selectedGoals.includes('sell_online') && <Icon name="check_circle" className="text-primary" />}
                            </button>

                            {/* Goal 2 */}
                            <button
                                onClick={() => toggleGoal('marketplace')}
                                className={cn(
                                    "flex items-start gap-4 p-4 rounded-xl text-left transition-all border",
                                    selectedGoals.includes('marketplace')
                                        ? "bg-primary/10 border-primary/50"
                                        : "bg-white/5 border-white/10 hover:bg-white/10"
                                )}
                            >
                                <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                                    selectedGoals.includes('marketplace') ? "bg-primary text-background-dark" : "bg-white/10 text-white"
                                )}>
                                    <Icon name="store" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-white mb-1">List on Vayva Market</h3>
                                    <p className="text-sm text-text-secondary">Reach millions of shoppers by listing your products on our marketplace.</p>
                                </div>
                                {selectedGoals.includes('marketplace') && <Icon name="check_circle" className="text-primary" />}
                            </button>

                            {/* Goal 3 */}
                            <button
                                onClick={() => toggleGoal('whatsapp_ai')}
                                className={cn(
                                    "flex items-start gap-4 p-4 rounded-xl text-left transition-all border",
                                    selectedGoals.includes('whatsapp_ai')
                                        ? "bg-primary/10 border-primary/50"
                                        : "bg-white/5 border-white/10 hover:bg-white/10"
                                )}
                            >
                                <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                                    selectedGoals.includes('whatsapp_ai') ? "bg-primary text-background-dark" : "bg-white/10 text-white"
                                )}>
                                    <Icon name="smart_toy" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-white">WhatsApp AI Agent</h3>
                                        <span className="text-[10px] font-bold bg-white/10 text-white px-2 py-0.5 rounded pill">RECOMMENDED</span>
                                    </div>
                                    <p className="text-sm text-text-secondary">Automate customer support and sales on WhatsApp.</p>
                                </div>
                                {selectedGoals.includes('whatsapp_ai') && <Icon name="check_circle" className="text-primary" />}
                            </button>
                        </div>
                    </GlassPanel>

                    {/* Right: Summary */}
                    <div className="flex flex-col gap-6">
                        <GlassPanel className="flex-1 p-8 flex flex-col">
                            <h3 className="font-bold text-white mb-4">Recommended Path</h3>
                            <div className="flex-1 relative pl-4 border-l border-white/10 space-y-6">
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-primary" />
                                    <p className="text-sm font-bold text-white">Create Store</p>
                                    <p className="text-xs text-text-secondary">Basic details & branding</p>
                                </div>
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-primary" />
                                    <p className="text-sm font-bold text-white">Add Products</p>
                                    <p className="text-xs text-text-secondary">At least one product</p>
                                </div>
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-primary" />
                                    <p className="text-sm font-bold text-white">Setup Payments</p>
                                    <p className="text-xs text-text-secondary">Connect Paystack</p>
                                </div>
                                {selectedGoals.includes('whatsapp_ai') && (
                                    <div className="relative animate-fade-in">
                                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-primary" />
                                        <p className="text-sm font-bold text-white">Connect WhatsApp</p>
                                        <p className="text-xs text-text-secondary">AI setup wizard</p>
                                    </div>
                                )}
                            </div>
                        </GlassPanel>

                        <div className="flex flex-col gap-3">
                            <Button onClick={handleContinue} className="w-full">
                                Continue
                            </Button>
                            <Button variant="ghost" className="w-full text-xs text-text-secondary">
                                Skip onboarding (Not recommended)
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminShell>
    );
}
