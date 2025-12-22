'use client';

import { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { Button, Icon } from '@vayva/ui';
import { useOnboarding } from '@/context/OnboardingContext';
import { OnboardingStepId } from '@/types/onboarding';
import Link from 'next/link';

interface StepDef {
    id: OnboardingStepId;
    path: string;
    label: string;
}

const STEPS: StepDef[] = [
    { id: 'welcome', path: '/onboarding/welcome', label: 'Welcome' },
    { id: 'identity', path: '/onboarding/identity', label: 'Identity' },
    { id: 'store-details', path: '/onboarding/store-details', label: 'Store Details' },
    { id: 'brand', path: '/onboarding/brand', label: 'Branding' },
    { id: 'delivery', path: '/onboarding/delivery', label: 'Pickup Location' },
    { id: 'templates', path: '/onboarding/templates', label: 'Template' },
    { id: 'products', path: '/onboarding/products', label: 'Products' },
    { id: 'payments', path: '/onboarding/payments', label: 'Payments' },
    { id: 'whatsapp', path: '/onboarding/whatsapp', label: 'WhatsApp' },
    { id: 'kyc', path: '/onboarding/kyc', label: 'KYC' },
    { id: 'review', path: '/onboarding/review', label: 'Review' },
];

export function OnboardingClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { loading, completeOnboarding } = useOnboarding();

    // Find current step index
    // Fallback to -1 if we are on root /onboarding (which should redirect, but handling safe render)
    const currentStepIndex = STEPS.findIndex(s => pathname.startsWith(s.path));

    const handleSaveExit = () => {
        // In reality, state is auto-saved on change/next. 
        // We can just redirect to dashboard directly or via "complete" if valid.
        // For "Save & Exit" usually implies incomplete, so we just go to dashboard.
        window.location.href = '/admin';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center animate-pulse">
                        <span className="text-white font-bold text-xl">V</span>
                    </div>
                    <p className="text-gray-500 font-medium">Loading setup...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F5F5F7] flex flex-col">
            {/* Header */}
            <header className="h-16 px-6 lg:px-8 bg-white border-b border-gray-200 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#46EC13] rounded-lg flex items-center justify-center">
                        <span className="font-bold text-black">V</span>
                    </div>
                    <span className="font-heading font-bold text-black text-lg">Setup Guide</span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex flex-col items-end mr-4">
                        <span className="text-xs font-bold text-black uppercase tracking-wider">
                            Step {currentStepIndex + 1} of {STEPS.length}
                        </span>
                        <div className="w-32 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                            <div
                                className="h-full bg-[#46EC13] transition-all duration-500 ease-out"
                                style={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }}
                            />
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSaveExit}
                        className="text-gray-500 hover:text-black hover:bg-gray-100"
                    >
                        Save & Exit
                    </Button>
                </div>
            </header>

            <main className="flex-1 flex max-w-[1440px] mx-auto w-full">
                {/* Sidebar Stepper - Hidden on mobile */}
                <aside className="hidden lg:block w-72 py-8 px-6 border-r border-gray-200 h-[calc(100vh-64px)] overflow-y-auto sticky top-16 bg-white/50 backdrop-blur-sm">
                    <div className="space-y-1">
                        {STEPS.map((step, index) => {
                            const isActive = index === currentStepIndex;
                            const isCompleted = index < currentStepIndex;
                            const isPending = index > currentStepIndex;

                            return (
                                <div
                                    key={step.id}
                                    className={`
                                        flex items-center gap-3 p-2.5 rounded-lg transition-all duration-200
                                        ${isActive ? 'bg-white shadow-sm ring-1 ring-black/5' : 'hover:bg-black/5'}
                                        ${isPending ? 'opacity-50' : 'opacity-100'}
                                    `}
                                >
                                    <div className={`
                                        w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors
                                        ${isCompleted ? 'bg-black text-white' : isActive ? 'bg-[#46EC13] text-black' : 'bg-gray-200 text-gray-500'}
                                    `}>
                                        {isCompleted ? <Icon name="Check" size={12} /> : index + 1}
                                    </div>
                                    <span className={`text-sm font-medium ${isActive ? 'text-black' : 'text-gray-600'}`}>
                                        {step.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </aside>

                {/* Content Area */}
                <div className="flex-1 min-w-0 bg-[#F5F5F7]">
                    <div className="max-w-3xl mx-auto p-6 md:p-12 pb-32">
                        <Suspense fallback={
                            <div className="h-64 flex items-center justify-center">
                                <Icon name={"Loader2" as any} className="w-8 h-8 animate-spin text-gray-400" />
                            </div>
                        }>
                            {children}
                        </Suspense>
                    </div>
                </div>
            </main>
        </div>
    );
}
