/**
 * BRAND CONFIGURATION - SINGLE SOURCE OF TRUTH
 * 
 * All domain and email references MUST use these constants.
 * DO NOT hardcode vayva.ng or vayva.com anywhere else.
 */

export const BRAND = {
    domain: "vayva.ng",
    baseUrl: "https://vayva.ng",
    supportEmail: "support@vayva.ng",
    helloEmail: "hello@vayva.ng",
    careersEmail: "careers@vayva.ng",
    legalEmail: "legal@vayva.ng",
    engineeringEmail: "engineering@vayva.ng",
} as const;

// Type-safe access
export type BrandConfig = typeof BRAND;
