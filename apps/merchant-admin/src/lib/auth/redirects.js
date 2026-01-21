import { OnboardingStatus } from "@vayva/shared";
/**
 * Determines the correct redirect path based on user and merchant state.
 *
 * Priority:
 * 1. Email Verification (User.isEmailVerified)
 * 2. Onboarding Completion (Merchant.onboardingStatus)
 * 3. Dashboard
 */
export const getAuthRedirect = (user, merchant) => {
    // 1. Email Verification
    if (!user.emailVerified) {
        return `/verify?email=${encodeURIComponent(user.email)}`;
    }
    // 2. Onboarding Status
    // If no merchant context exists, they likely haven't created a store or are in a bad state.
    // We send them to onboarding start.
    if (!merchant) {
        return "/onboarding";
    }
    const { onboardingStatus } = merchant;
    // 3. Complete -> Dashboard
    if (onboardingStatus === OnboardingStatus.COMPLETE) {
        return "/dashboard";
    }
    // 4. Incomplete -> Resume Onboarding
    return "/onboarding/resume";
};
