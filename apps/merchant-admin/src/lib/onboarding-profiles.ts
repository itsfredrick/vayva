import { TEMPLATE_REGISTRY, OnboardingProfile } from './templates-registry';

export const TEMPLATE_CONFIGS: Record<string, OnboardingProfile> = Object.values(TEMPLATE_REGISTRY).reduce((acc, t) => {
    if (t.onboardingProfile) {
        acc[t.slug] = t.onboardingProfile;
    }
    return acc;
}, {} as Record<string, OnboardingProfile>);

export const ONBOARDING_PROFILES = TEMPLATE_CONFIGS;
