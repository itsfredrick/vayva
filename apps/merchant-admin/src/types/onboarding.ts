export type PlanType = "free" | "growth" | "pro";

export type OnboardingStepId =
  | "welcome" // 1. Industry & Path
  | "business" // 2. Business Profile
  | "communication" // 3. Communication & Team
  | "visuals" // 4. Visual Storefront
  | "finance" // 5. Finance & Payments
  | "logistics" // 6. Logistics
  | "inventory" // 7. Product Entry
  | "kyc" // 8. Verification (New)
  | "review" // 9. Final Review
  | "complete";

export interface InventoryProduct {
  name: string;
  price: number;
  description?: string;
  image?: string;
  segment?: string;
  attributes?: Record<string, any>;
}

export interface OnboardingState {
  schemaVersion?: number;
  isComplete: boolean;
  requiredComplete?: boolean;
  isEditingMode?: boolean; // New Edit Loop flag
  currentStep: OnboardingStepId;
  lastUpdatedAt: string; // ISO date
  completedSteps?: string[]; // Track completed steps
  skippedSteps?: OnboardingStepId[]; // Steps skipped due to template fast path
  requiredSteps?: OnboardingStepId[]; // Steps strictly required by template
  templateSelected?: boolean; // Legacy/Compat check

  // Global / Cross-cutting
  referralCode?: string;
  plan: PlanType;

  // Step 1: Welcome & Intent
  intent?: {
    segment:
    | "retail"
    | "food"
    | "services"
    | "digital"
    | "wholesale"
    | "real-estate"
    | "events"
    | "education"
    | "non-profit"
    | "other";
    hasDelivery?: boolean; // Derived from segment
  };

  // Step 1b: Setup Path
  setupPath?: "guided" | "blank";

  // Step 2: Business Basics
  business?: {
    name: string; // Legal Name
    storeName?: string; // Public name
    slug?: string; // Store URL slug
    type?: "individual" | "registered";
    email: string; // Pre-filled where possible
    description?: string;
    location?: {
      city: string;
      state: string;
      country: string;
    };
    category?: string; // Legacy/Compat
    legalName?: string; // Alias for name
  };

  // Meta Settings
  storeDetails?: {
    slug?: string;
    domainPreference?: "subdomain" | "custom";
    publishStatus?: "draft" | "published";
    storeName?: string;
  };

  // Step 3: Communication
  whatsappConnected?: boolean;
  whatsapp?: {
    number?: string;
  };
  team?: {
    type: "solo" | "small" | "large";
    invites: { email: string; role: "viewer" | "staff" | "admin" }[];
    skipped?: boolean;
  };

  // Step 4: Visuals
  template?: {
    id: string;
    name: string;
  };
  branding?: {
    colors?: { primary: string; secondary: string };
    brandColor?: string; // Legacy/Simple
    logoUrl?: string;
    coverUrl?: string;
  };



  // Step 5: Finance
  finance?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    bankCode?: string; // Audit Fix: Added strict type
    methods: {
      bankTransfer: boolean;
      cash: boolean;
      pos: boolean;
    };
    currency?: string;
    payoutScheduleAcknowledged?: boolean;
    settlementBank?: { // Legacy/Compat for onboaring-sync
      bankName: string;
      accountNumber: string;
      accountName: string;
    };
  };

  // Step 6: Logistics
  logistics?: {
    policy: "pickup" | "delivery" | "both";
    providers?: {
      manual: boolean;
      kwik: boolean;
      gokada: boolean;
    };
    pickupAddress?: string;
    defaultProvider?: string;
  };

  // Step 7: Inventory
  inventory?: InventoryProduct[];

  // Step 8: KYC
  // Step 8: KYC
  kycStatus?: "not_started" | "pending" | "verified" | "failed";
  identity?: {
    fullName: string;
    bvn?: string;
    nin?: string;
    cacNumber?: string;
    dob?: string;
    address?: string;
    phone?: string;
  };
  kyc?: { // Legacy / specific step data container if needed, but identity is better
    fullName?: string;
    dob?: string;
    address?: string;
    nin?: string;
    cacNumber?: string;
    status?: "verified" | "pending" | "failed";
  };
}
