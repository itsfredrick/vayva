'use client';

import React, { useState, useEffect } from 'react';
import { GlassPanel, cn } from '@vayva/ui';
import { Button, Icon } from '@vayva/ui';
import { useOnboarding } from '@/context/OnboardingContext';
import { useAuth } from '@/context/AuthContext';

export default function WelcomePage() {
    const { state, updateState, goToStep } = useOnboarding();
    const { user } = useAuth();
    const [selectedGoals, setSelectedGoals] = useState<string[]>(['storefront']);

    useEffect(() => {
        if (state?.enabledChannels) {
            const goals = [];
            if (state.enabledChannels.storefront) goals.push('storefront');
            if (state.enabledChannels.whatsappAi) goals.push('whatsapp_ai');
            if (state.enabledChannels.market) goals.push('market');
            if (goals.length > 0) setSelectedGoals(goals);
        }
    }, [state]);

    const isStarter = (user as any)?.plan === 'starter';

    const toggleGoal = (id: string) => {
        if (id === 'storefront') return; // Required

        // Gating Check
        if (id === 'market' && isStarter) {
            // In a real app, this would show an upgrade modal
            alert("Vayva Market is available on Growth and Pro plans. Please upgrade to access millions of buyers.");
            return;
        }

        if (selectedGoals.includes(id)) {
            setSelectedGoals(selectedGoals.filter(g => g !== id));
        } else {
            setSelectedGoals([...selectedGoals, id]);
        }
    };

    const handleContinue = async () => {
        await updateState({
            enabledChannels: {
                storefront: true, // Always true
                whatsappAi: selectedGoals.includes('whatsapp_ai'),
                market: selectedGoals.includes('market')
            }
        });
        await goToStep('identity');
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Header Section */}
            <div>
                <h1 className="text-2xl font-bold text-black mb-2">Welcome, {user?.firstName || 'Partner'}!</h1>
                <p className="text-gray-600">Let’s customize your setup based on your goals.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left: Goal Selection */}
                <div className="md:col-span-2 flex flex-col gap-4">
                    {/* Goal 1: Storefront (Required) */}
                    <button
                        onClick={() => toggleGoal('storefront')}
                        className={cn(
                            "flex items-start gap-4 p-4 rounded-xl text-left transition-all border relative overflow-hidden",
                            selectedGoals.includes('storefront')
                                ? "bg-black/5 border-black/20"
                                : "bg-white border-gray-200"
                        )}
                    >
                        <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors",
                            selectedGoals.includes('storefront') ? "bg-black text-white" : "bg-gray-100 text-gray-400"
                        )}>
                            <Icon name="Store" size={20} />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-black">Online Storefront</h3>
                                <span className="text-[10px] font-bold bg-black text-white px-2 py-0.5 rounded-full">REQUIRED</span>
                            </div>
                            <p className="text-sm text-gray-500">Your own branded website to showcase products and accept payments.</p>
                        </div>
                        <div className="w-6 h-6 flex items-center justify-center">
                            {selectedGoals.includes('storefront') && <Icon name={"CheckCircle" as any} className="text-black" size={20} />}
                        </div>
                    </button>

                    {/* Goal 2: Vayva Market (Gated) */}
                    <button
                        onClick={() => toggleGoal('market')}
                        className={cn(
                            "flex items-start gap-4 p-4 rounded-xl text-left transition-all border relative",
                            selectedGoals.includes('market')
                                ? "bg-purple-50 border-purple-200"
                                : "bg-white border-gray-200",
                            isStarter && "opacity-75 bg-gray-50 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')]"
                        )}
                    >
                        <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors",
                            selectedGoals.includes('market') ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-400"
                        )}>
                            <Icon name="ShoppingBag" size={20} />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-black">Vayva Market</h3>
                                {isStarter && (
                                    <span className="text-[10px] font-bold bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <Icon name="Lock" size={10} /> GROWTH+
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-500">List your products on our centralized marketplace to reach millions.</p>
                        </div>
                        <div className="w-6 h-6 flex items-center justify-center">
                            {selectedGoals.includes('market') && <Icon name={"CheckCircle" as any} className="text-purple-600" size={20} />}
                            {isStarter && !selectedGoals.includes('market') && <Icon name="Lock" className="text-gray-400" size={16} />}
                        </div>
                    </button>

                    {/* Goal 3: WhatsApp AI */}
                    <button
                        onClick={() => toggleGoal('whatsapp_ai')}
                        className={cn(
                            "flex items-start gap-4 p-4 rounded-xl text-left transition-all border",
                            selectedGoals.includes('whatsapp_ai')
                                ? "bg-green-50 border-green-200"
                                : "bg-white border-gray-200"
                        )}
                    >
                        <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors",
                            selectedGoals.includes('whatsapp_ai') ? "bg-green-600 text-white" : "bg-gray-100 text-gray-400"
                        )}>
                            <Icon name="MessageSquare" size={20} />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-black">WhatsApp AI Agent</h3>
                                <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">RECOMMENDED</span>
                            </div>
                            <p className="text-sm text-gray-500">Automate customer support and sales recovery on WhatsApp.</p>
                        </div>
                        <div className="w-6 h-6 flex items-center justify-center">
                            {selectedGoals.includes('whatsapp_ai') && <Icon name={"CheckCircle" as any} className="text-green-600" size={20} />}
                        </div>
                    </button>
                </div>

                {/* Right: Summary */}
                <div className="flex flex-col gap-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
                        <h3 className="font-bold text-black mb-4 text-sm uppercase tracking-wide">Your Setup Path</h3>
                        <div className="relative pl-4 border-l-2 border-gray-100 space-y-6">
                            {/* Standard Steps */}
                            <div className="relative">
                                <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-black ring-4 ring-white" />
                                <p className="text-sm font-bold text-black">Basic Setup</p>
                                <p className="text-xs text-gray-500">Store details & branding</p>
                            </div>
                            <div className="relative">
                                <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-gray-300 ring-4 ring-white" />
                                <p className="text-sm font-bold text-gray-600">Product Catalog</p>
                                <p className="text-xs text-gray-400">Add first products</p>
                            </div>

                            {/* Dynamic Steps */}
                            {selectedGoals.includes('market') && (
                                <div className="relative animate-fade-in-up">
                                    <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-purple-500 ring-4 ring-white" />
                                    <p className="text-sm font-bold text-gray-600">Marketplace</p>
                                    <p className="text-xs text-gray-400">Listing configuration</p>
                                </div>
                            )}

                            {selectedGoals.includes('whatsapp_ai') && (
                                <div className="relative animate-fade-in-up">
                                    <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-green-500 ring-4 ring-white" />
                                    <p className="text-sm font-bold text-gray-600">WhatsApp</p>
                                    <p className="text-xs text-gray-400"> AI configuration</p>
                                </div>
                            )}

                            <div className="relative">
                                <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-gray-300 ring-4 ring-white" />
                                <p className="text-sm font-bold text-gray-600">Launch</p>
                                <p className="text-xs text-gray-400">Get your store link</p>
                            </div>
                        </div>
                    </div>

                    <Button onClick={handleContinue} data-testid="onboarding-welcome-continue" className="w-full !bg-black text-white rounded-xl h-12 text-base shadow-lg hover:shadow-xl hover:translate-y-[-1px] transition-all">
                        Continue Setup
                        <Icon name="ArrowRight" className="ml-2 w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
