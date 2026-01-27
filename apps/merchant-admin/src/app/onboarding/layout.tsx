"use client";

import { OnboardingProvider, useOnboarding } from "@/components/onboarding/OnboardingContext";
import { Logo } from "@/components/Logo";
import { Toaster } from "sonner";

function OnboardingProgress() {
    const { currentStep, steps } = useOnboarding();
    const currentIndex = steps.indexOf(currentStep);
    const progress = ((currentIndex + 1) / steps.length) * 100;

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-vayva-green rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <div className="mt-2 text-xs text-gray-400 text-center">
                Step {currentIndex + 1} of {steps.length}
            </div>
        </div>
    );
}

function OnboardingContent({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
            {/* Subtle green glow effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-vayva-green/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-vayva-green/3 rounded-full blur-3xl pointer-events-none" />
            
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <Logo href="/dashboard" size="md" showText={true} />
                <OnboardingProgress />
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative z-10">
                <div className="w-full max-w-lg">
                    {children}
                </div>
            </main>

            {/* Footer */}
            <footer className="py-4 text-center text-xs text-gray-400 relative z-10">
                Powered by Vayva · Secure & Encrypted
            </footer>

            <Toaster position="bottom-right" />
        </div>
    );
}

export default function OnboardingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <OnboardingProvider>
            <OnboardingContent>{children}</OnboardingContent>
        </OnboardingProvider>
    );
}
