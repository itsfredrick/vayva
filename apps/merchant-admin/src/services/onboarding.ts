import { logger } from "@/lib/logger";
const STORAGE_KEY = "vayva_onboarding_state"; // nosecret
const defaultState = {
    isComplete: false,
    currentStep: "welcome", // Start at Industry Selection
    lastUpdatedAt: new Date().toISOString(),
    whatsappConnected: false,
    templateSelected: false,
    kycStatus: "not_started",
    plan: "free",
};
export const OnboardingService = {
    getState: async () => {
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
        }
        catch (error) {
            logger.error("Error reading onboarding state", error);
            // Try localStorage fallback
            if (typeof window !== "undefined") {
                const stored = localStorage.getItem(STORAGE_KEY);
                if (stored) {
                    logger.warn("Recovered state from localStorage");
                    return JSON.parse(stored);
                }
            }
        }
        logger.warn("Returning default onboarding state.");
        return defaultState;
    },
    saveStep: async (stepId: unknown, data: unknown) => {
        try {
            // Save to backend API
            const response = await fetch("/api/onboarding/save-progress", {
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
            logger.info(`Saved step ${stepId} to backend`);
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
        }
        catch (error) {
            logger.error("Error saving onboarding step", error);
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
    complete: async () => {
        try {
            // Mark as complete via API
            const response = await fetch("/api/merchant/onboarding/complete", {
                method: "POST",
                credentials: "include",
            });
            if (!response.ok) {
                const raw = await response.text();
                let message = raw;
                try {
                    const parsed = JSON.parse(raw);
                    message = parsed?.error || parsed?.message || raw;
                }
                catch {
                    // ignore parse errors
                }
                throw new Error(message || "Failed to complete onboarding");
            }
            // Clear localStorage
            if (typeof window !== "undefined") {
                localStorage.removeItem(STORAGE_KEY);
            }
        }
        catch (error) {
            logger.error("Error completing onboarding", error);
            // Still try to save locally
            await OnboardingService.saveStep("review", { isComplete: true });
            throw error;
        }
    },
    reset: async () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem(STORAGE_KEY);
        }
    },
};
