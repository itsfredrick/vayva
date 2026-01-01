import { OnboardingState, OnboardingStepId } from "@/types/onboarding";

const STORAGE_KEY = "vayva_onboarding_state";

const defaultState: OnboardingState = {
  isComplete: false,
  currentStep: "welcome",
  lastUpdatedAt: new Date().toISOString(),
  whatsappConnected: false,
  templateSelected: false,
  kycStatus: "not_started",
  plan: "free",
};

export const OnboardingService = {
  getState: async (): Promise<OnboardingState> => {
    try {
      // Fetch from backend API
      const response = await fetch("/api/merchant/onboarding/state", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        return {
          isComplete: [
            "COMPLETE",
            "REQUIRED_COMPLETE",
            "OPTIONAL_INCOMPLETE",
          ].includes(data.onboardingStatus),
          currentStep: data.currentStep || "welcome",
          lastUpdatedAt: new Date().toISOString(),
          whatsappConnected: data.data?.whatsappConnected || false,
          templateSelected: data.data?.templateSelected || false,
          kycStatus: data.data?.kycStatus || "not_started",
          plan: data.data?.plan || "free",
          ...data.data,
        };
      }

      // Fallback to localStorage if API fails
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          return JSON.parse(stored);
        }
      }
    } catch (error) {
      console.error("Error reading onboarding state:", error);

      // Try localStorage fallback
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          return JSON.parse(stored);
        }
      }
    }
    return defaultState;
  },

  saveStep: async (
    stepId: OnboardingStepId,
    data: Partial<OnboardingState>,
  ): Promise<void> => {
    try {
      // Save to backend API
      const response = await fetch("/api/merchant/onboarding/state", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          currentStep: stepId,
          data: data,
          completedSteps: data.completedSteps || [],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save to backend");
      }

      console.log(`Saved step ${stepId} to backend`);

      // Also save to localStorage as backup
      if (typeof window !== "undefined") {
        const currentState = await OnboardingService.getState();
        const newState = {
          ...currentState,
          ...data,
          currentStep: stepId,
          lastUpdatedAt: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      }
    } catch (error) {
      console.error("Error saving onboarding step:", error);

      // Fallback to localStorage only
      if (typeof window !== "undefined") {
        const currentState = await OnboardingService.getState();
        const newState = {
          ...currentState,
          ...data,
          currentStep: stepId,
          lastUpdatedAt: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      }
    }
  },

  complete: async (): Promise<void> => {
    try {
      // Mark as complete via API
      const response = await fetch("/api/merchant/onboarding/complete", {
        method: "PUT",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to complete onboarding");
      }

      // Clear localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.error("Error completing onboarding:", error);
      // Still try to save locally
      await OnboardingService.saveStep("review", { isComplete: true });
    }
  },

  reset: async (): Promise<void> => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  },
};
