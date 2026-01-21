"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingState, OnboardingStepId } from "@/types/onboarding";
import { OnboardingService } from "@/services/onboarding";
import { INDUSTRY_CONFIG } from "@/config/industry";

interface OnboardingContextType {
  state: OnboardingState | null;
  loading: boolean;
  updateState: (data: Partial<OnboardingState>) => Promise<void>;
  goToStep: (step: OnboardingStepId) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  handleSaveExit: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined,
);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<OnboardingState | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadState();
  }, []);

  const loadState = async () => {
    setLoading(true);
    try {
      const data = await OnboardingService.getState();
      const profiled = applyIndustryProfile(data);
      setState(profiled);
    } catch (error) {
      console.error("[Onboarding] failed to load state", error);
      setState({
        isComplete: false,
        currentStep: "welcome",
        lastUpdatedAt: new Date().toISOString(),
        whatsappConnected: false,
        plan: "free",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateState = async (data: Partial<OnboardingState>) => {
    if (!state) return;
    const nextState = applyIndustryProfile({ ...state, ...data });
    setState(nextState);
    try {
      await OnboardingService.saveStep(nextState.currentStep, nextState);
    } catch (error) {
      console.error("[Onboarding] save step failed", error);
    }
  };

  const goToStep = async (step: OnboardingStepId) => {
    if (!state) return;
    await updateState({ currentStep: step });
    router.push(`/onboarding/${step}`);
  };

  const completeOnboarding = async () => {
    try {
      await OnboardingService.complete();
      await loadState();
      router.push("/onboarding/complete");
    } catch (error) {
      console.error("[Onboarding] complete error", error);
      throw error;
    }
  };

  const handleSaveExit = async () => {
    if (state) {
      try {
        await OnboardingService.saveStep(state.currentStep, state);
      } catch (error) {
        console.error("[Onboarding] save & exit failed", error);
      }
    }
    await fetch("/api/auth/merchant/logout", {
      method: "POST",
      credentials: "include",
    });
    router.push("/signin");
  };

  return (
    <OnboardingContext.Provider
      value={{
        state,
        loading,
        updateState,
        goToStep,
        completeOnboarding,
        handleSaveExit,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

function applyIndustryProfile(state: OnboardingState): OnboardingState {
  const segment = (state.intent?.segment || state.industrySlug) as string | undefined;
  if (!segment) return state;

  const industrySlug =
    segment === "wholesale"
      ? "b2b"
      : segment === "real-estate"
        ? "real_estate"
        : segment === "non-profit"
          ? "nonprofit"
          : segment;

  const profile = (INDUSTRY_CONFIG as any)[industrySlug];
  if (!profile) {
    return { ...state, industrySlug };
  }

  const requiredSteps: OnboardingStepId[] = ["business", "visuals", "finance", "kyc", "review"];
  const skippedSteps: OnboardingStepId[] = [];

  const needsInventory = ["product", "menu_item", "service", "digital_asset", "listing", "course", "event"].includes(
    profile.primaryObject,
  );
  if (needsInventory) requiredSteps.unshift("inventory");

  if (segment === "services" || segment === "digital") {
    skippedSteps.push("logistics");
  }

  if (segment !== "services" && segment !== "digital" && segment !== "education" && segment !== "blog_media") {
    requiredSteps.push("logistics");
  }

  return {
    ...state,
    industrySlug,
    requiredSteps,
    skippedSteps,
  };
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}
