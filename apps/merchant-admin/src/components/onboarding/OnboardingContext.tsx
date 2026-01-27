"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { OnboardingState, OnboardingStepId } from "@/types/onboarding";
import useSWR, { mutate } from "swr";

// Define the shape of the Context
interface OnboardingContextType {
    state: Partial<OnboardingState>;
    currentStep: OnboardingStepId;
    isLoading: boolean;
    isSaving: boolean;
    updateData: (data: Partial<OnboardingState>) => void;
    goToStep: (step: OnboardingStepId) => void;
    nextStep: () => void;
    prevStep: () => void;
    completeOnboarding: () => Promise<void>;
    skipOnboarding: () => Promise<void>;
    steps: OnboardingStepId[];
    refresh: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

// Wizard Steps Definition
const STEPS: OnboardingStepId[] = [
    "welcome",
    "identity",
    "business",
    "url",
    "branding",
    "finance",
    // "logistics", // Optional based on module? skipping for MVP/MVP-fix unless required
    "review"
];

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    // Local State
    const [currentStep, setCurrentStep] = useState<OnboardingStepId>("welcome");
    const [formData, setFormData] = useState<Partial<OnboardingState>>({});
    const [isSaving, setIsSaving] = useState(false);

    // load from API
    const { data: serverState, error, isLoading, mutate: reload } = useSWR(
        "/api/onboarding/state",
        fetcher,
        {
            revalidateOnFocus: false,
            onSuccess: (data) => {
                // Hydrate local state
                if (data?.data) {
                    setFormData(data.data as Partial<OnboardingState>);
                }
                if (data?.currentStepKey) {
                    // Validate step exists
                    const stepKey = data.currentStepKey as OnboardingStepId;
                    if (STEPS.includes(stepKey)) {
                        setCurrentStep(stepKey);
                    }
                }
                // If completed, maybe redirect?
                if (data?.status === "COMPLETE") {
                    toast.success("Store setup already completed!");
                    router.push('/dashboard');
                }
            }
        }
    );

    // Persist to Backend
    const saveState = useCallback(async (newState: Partial<OnboardingState>, newStep?: OnboardingStepId, isComplete = false) => {
        setIsSaving(true);
        try {
            const payload: any = {
                data: newState,
                step: newStep,
                isComplete,
                status: isComplete ? "COMPLETE" : "IN_PROGRESS"
            };

            const res = await fetch("/api/onboarding/state", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to save progress");

            // Update SWR cache
            await reload();
        } catch (err: any) {
            console.error(err);
            toast.error("Failed to save progress. Please check your connection.");
        } finally {
            setIsSaving(false);
        }
    }, [reload]);

    // Methods
    const updateData = (newData: Partial<OnboardingState>) => {
        setFormData((prev) => {
            const updated = { ...prev, ...newData };
            // Debounce save or save immediately? 
            // For wizard, we usually save on step transition, but "Auto-save" is nice.
            // For now: Local update only. Persist happens on navigation.
            return updated;
        });
    };

    const validateStep = (step: OnboardingStepId, data: Partial<OnboardingState>): boolean => {
        switch (step) {
            case "identity":
                if (!data.identity?.fullName || !data.identity?.phone) {
                    toast.error("Please fill in your full name and phone number.");
                    return false;
                }
                return true;
            case "business":
                if (!data.business?.storeName || !data.business?.country) {
                    toast.error("Store name and country are required.");
                    return false;
                }
                return true;
            case "url":
                // URL might be optional if auto-generated
                return true;
            case "finance":
                if (!data.finance?.accountNumber || !data.finance?.bankName) {
                    toast.error("Bank details are required.");
                    return false;
                }
                return true;
            default:
                return true;
        }
    };

    const goToStep = async (step: OnboardingStepId) => {
        setCurrentStep(step);
        // Persist current step
        await saveState(formData, step);
    };

    const nextStep = async () => {
        const idx = STEPS.indexOf(currentStep);

        // Validate current step before proceeding
        if (!validateStep(currentStep, formData)) {
            return;
        }

        if (idx < STEPS.length - 1) {
            const next = STEPS[idx + 1];
            setCurrentStep(next);
            await saveState(formData, next);
        } else {
            // Last step?
        }
    };

    const prevStep = () => {
        const idx = STEPS.indexOf(currentStep);
        if (idx > 0) {
            const prev = STEPS[idx - 1];
            setCurrentStep(prev);
            // Optional: save on back? strict wizard usually saves on forward only.
            // We'll just update view.
        }
    };

    const completeOnboarding = async () => {
        await saveState(formData, "review", true);
        toast.success("Welcome to Vayva! Your store is ready.");
        router.refresh(); // Refresh auth session to pick up storeId/onboardingCompleted claim?
    };

    const skipOnboarding = async () => {
        setIsSaving(true);
        try {
            // Save status as TRIAL_MODE
            const payload: any = {
                data: formData,
                status: "TRIAL_MODE"
            };

            const res = await fetch("/api/onboarding/state", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to enter trial mode");

            await reload();
            toast.success("Entering Trial Mode - Explore the demo store!");
            router.push("/dashboard");
            router.refresh();
        } catch (error: any) {
            console.error(error);
            toast.error("Failed to start trial.");
        } finally {
            setIsSaving(false);
        }
    };

    const value = {
        state: formData,
        currentStep,
        isLoading,
        isSaving,
        updateData,
        goToStep,
        nextStep,
        prevStep,
        completeOnboarding,
        skipOnboarding,
        steps: STEPS,
        refresh: reload
    };

    return (
        <OnboardingContext.Provider value={(value as any)}>
            {children}
        </OnboardingContext.Provider>
    );
}

export const useOnboarding = () => {
    const context = useContext(OnboardingContext);
    if (!context) throw new Error("useOnboarding must be used within OnboardingProvider");
    return context;
};
