export type PlanType = 'free' | 'growth' | 'pro';

export type OnboardingStepId =
    | 'welcome'
    | 'setup-path'
    | 'identity'
    | 'business'
    | 'whatsapp'
    | 'templates'
    | 'products'
    | 'store-details'
    | 'brand'
    | 'order-flow'
    | 'payments'
    | 'delivery'
    | 'team'
    | 'kyc'
    | 'review'
    | 'resume'
    | 'store'
    | 'storefront'
    | 'complete';

export interface OnboardingState {
    schemaVersion?: number; // Guardrail for schema evolution
    isComplete: boolean;
    requiredComplete?: boolean;
    currentStep: OnboardingStepId;
    lastUpdatedAt: string; // ISO date
    completedSteps?: string[]; // Track completed steps
    skippedSteps?: OnboardingStepId[]; // Steps skipped due to template fast path
    requiredSteps?: OnboardingStepId[]; // Steps strictly required by template

    // Master Prompt Global State
    whatsappConnected: boolean;
    templateSelected: boolean;
    kycStatus: 'not_started' | 'pending' | 'verified' | 'failed';
    referralCode?: string;
    plan: PlanType;

    // Step 1: Welcome & Intent
    intent?: {
        segment: 'retail' | 'food' | 'services' | 'mixed';
    };

    // Step 2: Setup Path
    setupPath?: 'guided' | 'blank';

    // Step 3: Business Basics
    business?: {
        name: string;
        legalName?: string;
        type?: 'individual' | 'registered';
        email: string; // Pre-filled where possible
        category: string;
        logo?: string; // Base64 or URL
        location: {
            city: string;
            state: string;
            country: string;
        };
        description?: string;
    };

    // Step 4: WhatsApp (See whatsappConnected flag)
    whatsapp?: {
        number?: string;
    };

    // Step 5: Template (Only if setupPath === 'guided')
    template?: {
        id: string;
        name: string;
    };

    // Step 5.5: Products
    products?: {
        hasAddedProducts: boolean;
        count: number;
    };

    // Step 6: Order Flow
    orderFlow?: {
        statuses: string[]; // e.g. ['New', 'Confirmed', 'Paid', ...]
    };

    // Step 7: Payments
    payments?: {
        method: 'transfer' | 'cash' | 'pos' | 'mixed';
        details?: {
            bankName?: string;
            accountNumber?: string;
            accountName?: string;
        };
        proofRequired: boolean; // "Attach proof"
        currency?: string;
        settlementBank?: {
            bankName: string;
            accountNumber: string;
            accountName: string;
        };
        payoutScheduleAcknowledged?: boolean;
    };

    // Step 8: Delivery
    delivery?: {
        policy: 'required' | 'sometimes' | 'pickup_only';
        stages: string[]; // e.g. ['Preparing', 'Out for delivery', 'Delivered']
        proofRequired: boolean;
        pickupAddress?: string;
        defaultProvider?: string;
        slaExpectation?: string;
    };

    // Step 9: Team
    team?: {
        type: 'solo' | 'small' | 'large';
        invites?: Array<{ email: string; role: 'viewer' | 'staff' | 'admin' }>;
        skipped?: boolean;
    };

    // Step 10: KYC (See kycStatus flag)
    kyc?: {
        method?: 'bvn' | 'nin' | 'govt_id';
        data?: Record<string, any>;
    };

    // Branding
    branding?: {
        logo?: string;
        logoUrl?: string; // Legacy support
        coverUrl?: string; // Legacy support
        brandColor?: string; // Legacy support
        colors?: {
            primary: string;
            secondary: string;
        };
    };

    // Store Details (Legacy/Parallel)
    storeDetails?: {
        storeName: string;
        category: string;
        state: string;
        city: string;
        slug: string;
        domainPreference?: 'subdomain' | 'custom';
        publishStatus?: 'draft' | 'published';
    };

    // Identity
    identity?: {
        fullName?: string;
        email?: string;
        phone?: string;
        role?: 'owner' | 'admin';
        authMethod?: 'email' | 'google';
        dob?: string;
        bvn?: string;
        nin?: string;
        idType?: string;
        idNumber?: string;
        idImage?: string;
    };
}
