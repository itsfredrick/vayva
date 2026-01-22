export type PlanType = "free" | "growth" | "pro";

export type OnboardingStepId =
  | "welcome" // 1. Welcome
  | "identity" // 2. Account Identity (New)
  | "business" // 3. Business Basics (Store Name, Category, Country)
  | "url" // 4. Store URL (New)
  | "branding" // 5. Branding (Renamed from Visuals?) - kept as 'visuals' in db or new 'branding'? 
  // User said "Rename/Alias". Safest is to keep 'visuals' for DB compatibility or add 'branding'.
  // Let's add 'branding' and map it. But wait, OnboardingState uses these keys.
  // If I change keys, I break existing data.
  // I will KEEP 'visuals' as the underlying ID if possible, OR add 'branding' and migrate.
  // But strictly following the plan: "Rename/Alias Visuals to Branding".
  // Let's us 'visuals' key but label it Branding in UI, OR adding 'branding'.
  // Adding 'branding' allows clean start. 'visuals' can remain deprecated.
  | "visuals" // Keeping this for now to avoid breaking existing state? 
  // Actually, I should probably stick to the 10-step plan IDs.
  // "branding" matches "Step 5".
  | "inventory" // 6. Products
  | "finance" // 7. Payments
  | "logistics" // 8. Shipping
  | "kyc" // 9. Verification
  | "review" // 10. Review
  | "complete";

export interface InventoryProduct {
  name: string;
  price: number;
  description?: string;
  sku?: string;
  stock?: number;
  images?: string[];
  attributes?: Record<string, unknown>;
  segment?: string;
}

export interface OnboardingState {
  schemaVersion?: number;
  isComplete: boolean;
  requiredComplete?: boolean;
  isEditingMode?: boolean;
  currentStep: OnboardingStepId;
  lastUpdatedAt: string;
  completedSteps?: string[];
  skippedSteps?: OnboardingStepId[];
  requiredSteps?: OnboardingStepId[];
  templateSelected?: boolean;

  // Global / Cross-cutting
  referralCode?: string;
  plan: PlanType;
  industrySlug?: string; // REQUIRED

  // Step 1: Welcome & Intent
  intent?: {
    segment: string;
    hasDelivery?: boolean;
  };

  // Step 1b: Setup Path
  setupPath?: "guided" | "blank";

  // Step 2: Business Basics
  business?: {
    name: string; // "My Store"
    storeName: string; // PUBLIC name
    slug: string; // UNIQUE slug
    description?: string;

    // Location
    country: string; // Default "NG"
    state: string;
    city: string;

    // Contact
    phone: string;
    email: string;

    // Registration
    businessRegistrationType: "registered" | "non_registered" | "individual"; // Enforce strict type
    cacNumber?: string; // Required if registered
    cacDocumentUrl?: string; // Optional

    // Legacy mapping (can remain for compatibility if needed, else remove)
    type?: "individual" | "registered";
    category?: string;
    legalName?: string;
  };

  // Meta Settings
  storeDetails?: {
    slug?: string; // Deprecated, use business.slug
    domainPreference?: "subdomain" | "custom";
    publishStatus?: "draft" | "published";
  };

  // Step 3: Communication
  whatsappConnected?: boolean;
  whatsapp?: {
    number?: string;
  };
  supportEmail?: string;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
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
    brandColor?: string;
    logoUrl?: string; // REQUIRED
    coverUrl?: string;
  };

  // Step 5: Finance (Required if module 'finance' active)
  finance?: {
    bankName: string;
    accountNumber: string;
    accountName: string; // Resolved name
    bankCode?: string;
    bvn?: string; // Required for payout verification
    nin?: string;
    methods: {
      bankTransfer: boolean;
      cash: boolean;
      pos: boolean;
    };
    currency?: string;
    payoutScheduleAcknowledged?: boolean;
  };

  // Step 6: Logistics (Required if module 'fulfillment' active)
  logistics?: {
    deliveryMode: "pickup" | "delivery" | "both";
    pickupAddress?: string; // Required if pickup/both
    pickupContact?: {
      name: string;
      phone: string;
    };
    providers?: {
      manual: boolean;
      kwik: boolean;
      gokada: boolean;
    };
  };

  // Step 7: Inventory
  inventory?: InventoryProduct[];

  // Step 8: KYC
  kycStatus?: "not_started" | "pending" | "verified" | "failed";
  identity?: {
    fullName: string;
    bvn?: string;
    nin?: string;
    address?: string;
    phone?: string;
  };

  // Clean up legacy keys if necessary
  kyc?: undefined;
}
