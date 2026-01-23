import { TEMPLATE_REGISTRY } from "./templates-registry";
export const TEMPLATE_CONFIGS = Object.values(TEMPLATE_REGISTRY).reduce((acc, t) => {
    if (t.onboardingProfile) {
        acc[t.slug] = t.onboardingProfile;
    }
    return acc;
}, {});
export const ONBOARDING_PROFILES = TEMPLATE_CONFIGS;
