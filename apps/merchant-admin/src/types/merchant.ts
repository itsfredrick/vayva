import { OnboardingState, PlanType } from "./onboarding";

export interface MerchantProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string; // derived or stored
  phone?: string;
  role: "owner" | "admin" | "staff";
  plan: PlanType;
}

export interface Store {
  id: string;
  name: string;
  slug: string; // subdomain
  logoUrl?: string;
  category?: string;
  address?: {
    city: string;
    state: string;
    fullAddress?: string;
  };
  status: "draft" | "pending_verification" | "published";
  templateId?: string; // e.g. 'vayya-storefront'
}

export interface VerificationStatus {
  kycStatus: "PENDING" | "VERIFIED" | "REJECTED" | "NOT_STARTED";
  emailVerified: boolean;
}

// Re-export OnboardingState from its dedicated file to avoid duplication
export type { OnboardingState };

export interface FullMerchantContext {
  user: MerchantProfile;
  store: Store | null; // Null if not yet created
  verification: VerificationStatus;
  onboarding: OnboardingState;
  memberships: string[]; // Store IDs
}
