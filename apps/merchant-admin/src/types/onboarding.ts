import { OnboardingStatus } from "@vayva/shared";

export interface OnboardingState {
    id: string;
    storeId: string;
    status: OnboardingStatus | string;
    currentStepKey: string;
    data: unknown;
    completedAt?: Date | null;
    updatedAt: Date;
}

export interface OnboardingUpdatePayload {
    step?: string;
    status?: OnboardingStatus | string;
    data?: unknown;
    isComplete?: boolean;
}
