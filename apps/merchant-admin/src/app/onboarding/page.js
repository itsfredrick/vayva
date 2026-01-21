"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useOnboarding } from "@/components/onboarding/OnboardingContext";
import { Loader2 } from "lucide-react";
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
        return (_jsxs("div", { className: "flex flex-col items-center justify-center py-20", children: [_jsx(Loader2, { className: "h-8 w-8 animate-spin text-gray-400" }), _jsx("p", { className: "mt-4 text-gray-500", children: "Loading your progress..." })] }));
    }
    // Render Step
    switch (currentStep) {
        case "welcome":
            return _jsx(WelcomeStep, {});
        case "identity":
            return _jsx(IdentityStep, {});
        case "business":
            return _jsx(BusinessStep, {});
        case "url":
            return _jsx(UrlStep, {});
        case "branding":
            return _jsx(BrandingStep, {}); // Mapped to 'visuals' in types? Need to verify type compatibility
        case "finance":
            return _jsx(PaymentStep, {});
        case "review":
            return _jsx(ReviewStep, {});
        default:
            return _jsx(WelcomeStep, {});
    }
}
