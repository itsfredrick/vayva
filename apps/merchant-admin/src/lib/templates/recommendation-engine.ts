import { TEMPLATE_REGISTRY } from "@/lib/templates-registry";
export function recommendTemplate(state: any) {
    if (!state.business)
        return null;
    // 1. Direct Category Match (if industry mapping exists)
    // Map granular onboarding industry strings to canonical categories
    const industryMap = {
        fashion: "fashion-clothing",
        clothing: "fashion-clothing",
        electronics: "electronics-gadgets",
        gadgets: "electronics-gadgets",
        beauty: "beauty-wellness-home",
        wellness: "beauty-wellness-home",
        home: "beauty-wellness-home",
        services: "services-appointments",
        consulting: "services-appointments",
        salon: "services-appointments",
        food: "food-restaurant",
        restaurant: "food-restaurant",
        digital: "digital-products",
        software: "digital-products",
        events: "events-ticketing",
        education: "education-courses",
        wholesale: "wholesale-b2b",
        b2b: "wholesale-b2b",
        marketplace: "marketplace",
        properties: "real-estate",
        real_estate: "real-estate",
        non_profit: "donations-fundraising",
    };
    // Normalize industry input
    const industryKey = state.business.category?.toLowerCase() || "";
    let matchedCategorySlug;
    // Try direct map
    if ((industryMap as any)[industryKey]) {
        matchedCategorySlug = (industryMap as any)[industryKey];
    }
    // Try simple subset match
    else if (industryKey.includes("food") || industryKey.includes("kitchen"))
        matchedCategorySlug = "food-restaurant";
    else if (industryKey.includes("fashion") || industryKey.includes("wear"))
        matchedCategorySlug = "fashion-clothing";
    else if (industryKey.includes("tech") || industryKey.includes("phone"))
        matchedCategorySlug = "electronics-gadgets";
    else if (industryKey.includes("service"))
        matchedCategorySlug = "services-appointments";
    // Default Fallback: Fashion (or could return null to show gallery)
    // Prompt says: "If no category match -> show Template Gallery" (implied return null or generic)
    // But for this function let's return a safe bet if we can't match, or undefined.
    if (!matchedCategorySlug) {
        return null;
    }
    // Verify it exists in enum
    // (c: any) => c === matchedCategorySlug,
    // );
    // Temporary fix: If we can't look up config, just return null or basic result
    if (!matchedCategorySlug)
        return null;
    /*
    // Logic removed as TEMPLATE_CATEGORIES is deprecated
    */
    // Just return the first template for that category from registry
    const firstTemplate = Object.values(TEMPLATE_REGISTRY).find(t => t.industry === matchedCategorySlug);
    if (!firstTemplate)
        return null;
    return {
        recommendedTemplate: firstTemplate.templateId,
        category: matchedCategorySlug,
        reason: `Best fit for ${matchedCategorySlug} businesses.`,
    };
}
