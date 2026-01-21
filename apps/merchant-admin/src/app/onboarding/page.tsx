"use client";

import { useOnboarding } from "@/components/onboarding/OnboardingContext";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

// Step Components (Imports - we will create these next)
import WelcomeStep from "@/components/onboarding/steps/WelcomeStep";
import IdentityStep from "@/components/onboarding/steps/IdentityStep";
import BusinessStep from "@/components/onboarding/steps/BusinessStep";
import UrlStep from "@/components/onboarding/steps/UrlStep";
import BrandingStep from "@/components/onboarding/steps/BrandingStep";
import PaymentStep from "@/components/onboarding/steps/PaymentStep";
import ReviewStep from "@/components/onboarding/steps/ReviewStep";

export default function OnboardingPage() {
    const { currentStep, isLoading } = useOnboarding();

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                <p className="mt-4 text-gray-500">Loading your progress...</p>
            </div>
        );
    }

    // Render Step
    switch (currentStep) {
        case "welcome":
            return <WelcomeStep />;
        case "identity":
            return <IdentityStep />;
        case "business":
            return <BusinessStep />;
        case "url":
            return <UrlStep />;
        case "branding":
            return <BrandingStep />; // Mapped to 'visuals' in types? Need to verify type compatibility
        case "finance":
            return <PaymentStep />;
        case "review":
            return <ReviewStep />;
        default:
            return <WelcomeStep />;
    }
}
