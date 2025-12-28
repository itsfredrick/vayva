
export interface TemplateVersion {
    version: string;
    releasedAt: string;
    changelog: string[];
}


export type CanonicalCategorySlug =
    | 'fashion-clothing'
    | 'electronics-gadgets'
    | 'beauty-wellness-home'
    | 'services-appointments'
    | 'food-restaurant'
    | 'digital-products'
    | 'events-ticketing'
    | 'education-courses'
    | 'wholesale-b2b'
    | 'marketplace'
    | 'donations-fundraising'
    | 'real-estate';

export type CanonicalTemplateId =
    | 'vayva-aa-fashion'
    | 'vayva-gizmo-tech'
    | 'vayva-bloome-home'
    | 'vayva-bookly-pro'
    | 'vayva-chopnow'
    | 'vayva-filevault'
    | 'vayva-ticketly'
    | 'vayva-eduflow'
    | 'vayva-bulktrade'
    | 'vayva-markethub'
    | 'vayva-giveflow'
    | 'vayva-homelist';

export interface TemplateModules {
    commerceRetail?: boolean;
    bookings?: boolean;
    foodOrdering?: boolean;
    digitalDownloads?: boolean;
    ticketing?: boolean;
    courses?: boolean;
    rfqInvoicing?: boolean;
    marketplaceMultiVendor?: boolean;
    donations?: boolean;
    realEstateLeads?: boolean;
    walletSettlement: boolean; // Always true
}

export interface Template {
    id: CanonicalTemplateId | string;
    name: string;
    slug: string; // This is often the same as ID for canonical ones
    category: CanonicalCategorySlug | string;
    tier: 'free' | 'growth' | 'pro';

    // Display Props
    description: string;
    tagline?: string;
    previewImages: {
        desktop: string;
        mobile: string;
        cover: string;
    };
    // Master Spec Fields
    previewThumbnailUrl?: string; // High performance thumbnail
    previewGalleryUrls?: string[]; // Detail page carousel
    demoStoreUrl?: string; // Live interactive demo

    modules: TemplateModules;

    features: string[];
    tags: string[];

    // Metadata
    isActive: boolean;
    isLocked: boolean;
    author: string;
    currentVersion: string;
    versions: TemplateVersion[];
    installCount: number;
    rating: number;

    // Monetization
    price: number;
    currency: string;
    isPurchased: boolean;
    revenueShare: number;

    // Onboarding / Recommendation Hints
    demand: 'popular' | 'high_demand' | 'niche' | 'regulated';
    setupTime: string;
    stockModel: 'inventory' | 'availability' | 'inquiry';
    checkoutMode: 'whatsapp' | 'website' | 'hybrid';

    // Additional mappings from legacy interface if needed for UI compatibility
    bestFor?: string;
    workflows?: string[];
    volume?: 'low' | 'medium' | 'high' | 'any';
    teamSize?: 'solo' | 'small' | 'multi' | 'any';
    configures?: string[];
    customizable?: string[];
    creates?: {
        pages: string[];
        sections: string[];
        objects: string[];
    };
}
