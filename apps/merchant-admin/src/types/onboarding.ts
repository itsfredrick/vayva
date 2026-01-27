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
        legalName?: string;
        registeredAddress?: {
            addressLine1?: string;
            addressLine2?: string;
            city?: string;
            state?: string;
            landmark?: string;
        };
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
    logistics?: {
        pickupAddress?: string;
        pickupAddressObj?: {
            addressLine1?: string;
            addressLine2?: string;
            city?: string;
            state?: string;
            landmark?: string;
        };
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
