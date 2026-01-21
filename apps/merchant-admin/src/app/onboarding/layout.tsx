"use client";

import { OnboardingProvider } from "@/components/onboarding/OnboardingContext";
import { Toaster } from "sonner";

export default function OnboardingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <OnboardingProvider>
            <div className="min-h-screen bg-gray-50 flex flex-col">
                {/* Simple Header */}
                <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-2">
                        <div className="bg-black text-white p-1 rounded font-bold text-lg tracking-tighter">
                            V.
                        </div>
                        <span className="font-semibold text-gray-900">Vayva</span>
                    </div>
                    <div className="text-sm text-gray-500">
                        Store Setup
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
                    <div className="w-full max-w-2xl">
                        {children}
                    </div>
                </main>

                <Toaster position="bottom-right" />
            </div>
        </OnboardingProvider>
    );
}
