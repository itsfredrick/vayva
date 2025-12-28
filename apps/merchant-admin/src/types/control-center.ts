export interface StoreTemplate {
    id: string;
    slug: string;
    name: string;
    description: string;

    // Normalized Preview Fields (Never Null)
    previewImageDesktop: string;
    previewImageMobile: string;
    previewRoute: string;

    features: string[];
    isFree: boolean;
    status: string;

    // Legacy/Transitional
    category?: string;
    thumbnailUrl?: string;
    isPremium?: boolean;
    isLegacy?: boolean;
}

export interface StoreBranding {
    logoUrl?: string;
    storeName: string;
    accentColor: string;
    fontHeading: string;
    fontBody: string;
}

export interface StorePage {
    id: string;
    title: string;
    slug: string;
    isPublished: boolean;
    content?: string; // Simple JSON or HTML string for now
    updatedAt: Date;
}

export interface StorePolicy {
    type: 'returns' | 'shipping' | 'privacy' | 'contact';
    title: string;
    content: string;
    isEnabled: boolean;
}

export interface NavigationItem {
    id: string;
    label: string;
    path: string;
    type: 'page' | 'external' | 'collection';
}

export interface StoreNavigation {
    header: NavigationItem[];
    footer: NavigationItem[];
}

export interface StoreDomain {
    subdomain: string; // e.g. store.vayva.com
    customDomain?: string; // e.g. mystore.com
    status: 'active' | 'pending' | 'failed';
}

export interface StoreConfig {
    templateId: string;
    branding: StoreBranding;
    pages: StorePage[];
    navigation: StoreNavigation;
    policies: StorePolicy[];
    domains: StoreDomain;
    isPublished: boolean;
}
