import { TemplatePlanTier } from '@/lib/templates-registry';
// import { PublicStore } from '@/types/storefront'; 

// NOTE: In a real implementation, this would fetch from the backend or decode a session token.
// Since 'storefront' is largely public-facing or consumer-facing, the concept of "User Plan" 
// often usually applies to the MERCHANT (admin side). 
// However, if the storefront needs to know the merchant's plan to gate features (e.g. remove branding),
// it would come from the `Store` object.

interface PlanResolution {
    tier: TemplatePlanTier;
    source: 'mock' | 'db' | 'store';
}

/**
 * Resolves the PLAN TIER for the current context.
 * 
 * @param store - Optional store object if we are in a storefront context context.
 * @param mockOverride - Optional override for testing/demos.
 */
export async function getUserPlan(store?: any, mockOverride?: TemplatePlanTier): Promise<PlanResolution> {
    // 1. Dev/Demo Override
    if (mockOverride) {
        return { tier: mockOverride, source: 'mock' };
    }

    // 2. Store Context (Runtime)
    // If the store object has a 'plan' field, use it.
    if (store && store.plan) {
        // Map string to enum if necessary
        const tier = Object.values(TemplatePlanTier).find(t => t === store.plan) || TemplatePlanTier.FREE;
        return { tier, source: 'store' };
    }

    // 3. Fallback / Default
    // Most demos are free unless explicitly set otherwise in our mocks.
    // We can eventually wire this to a real DB call if we have a direct DB connection here, 
    // but Storefront app usually acts as a client.

    return { tier: TemplatePlanTier.FREE, source: 'mock' };
}
