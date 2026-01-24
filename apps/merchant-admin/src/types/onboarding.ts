import { OnboardingStatus } from "@vayva/shared";

export type OnboardingStepId =
    | "welcome"
    | "identity"
    | "business"
    | "url"
    | "branding"
    | "finance"
    | "review"
    | "complete";

export interface OnboardingState {
    id: string;
    storeId: string;
    status: OnboardingStatus | string;
    currentStepKey: OnboardingStepId | string;
    data: any;
    identity?: {
        fullName?: string;
        phone?: string;
    };
    business?: {
        storeName?: string;
        country?: string;
        industry?: string;
        name?: string;
        slug?: string;
        state?: string;
        city?: string;
        email?: string;
        phone?: string;
        businessRegistrationType?: string;
    };
    finance?: {
        accountNumber?: string;
        bankName?: string;
    };
    completedAt?: Date | null;
    updatedAt: Date;
}

export interface OnboardingUpdatePayload {
    step?: string;
    status?: OnboardingStatus | string;
    data?: any;
    isComplete?: boolean;
}
