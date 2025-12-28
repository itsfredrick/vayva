
import { CanonicalTemplateId, CanonicalCategorySlug } from '@/types/templates';
import { OnboardingState } from '@/types/onboarding';
import { TEMPLATE_CATEGORIES } from '@/lib/templates-registry';

interface RecommendationResult {
    recommendedTemplate: CanonicalTemplateId;
    category: CanonicalCategorySlug;
    reason: string;
}

export function recommendTemplate(state: Partial<OnboardingState>): RecommendationResult | null {
    if (!state.business) return null;

    // 1. Direct Category Match (if industry mapping exists)
    // Map granular onboarding industry strings to canonical categories
    const industryMap: Record<string, CanonicalCategorySlug> = {
        'fashion': 'fashion-clothing',
        'clothing': 'fashion-clothing',
        'electronics': 'electronics-gadgets',
        'gadgets': 'electronics-gadgets',
        'beauty': 'beauty-wellness-home',
        'wellness': 'beauty-wellness-home',
        'home': 'beauty-wellness-home',
        'services': 'services-appointments',
        'consulting': 'services-appointments',
        'salon': 'services-appointments',
        'food': 'food-restaurant',
        'restaurant': 'food-restaurant',
        'digital': 'digital-products',
        'software': 'digital-products',
        'events': 'events-ticketing',
        'education': 'education-courses',
        'wholesale': 'wholesale-b2b',
        'b2b': 'wholesale-b2b',
        'marketplace': 'marketplace',
        'properties': 'real-estate',
        'real_estate': 'real-estate',
        'non_profit': 'donations-fundraising'
    };

    // Normalize industry input
    const industryKey = state.business.category?.toLowerCase() || '';
    let matchedCategorySlug: CanonicalCategorySlug | undefined;

    // Try direct map
    if (industryMap[industryKey]) {
        matchedCategorySlug = industryMap[industryKey];
    }
    // Try simple subset match
    else if (industryKey.includes('food') || industryKey.includes('kitchen')) matchedCategorySlug = 'food-restaurant';
    else if (industryKey.includes('fashion') || industryKey.includes('wear')) matchedCategorySlug = 'fashion-clothing';
    else if (industryKey.includes('tech') || industryKey.includes('phone')) matchedCategorySlug = 'electronics-gadgets';
    else if (industryKey.includes('service')) matchedCategorySlug = 'services-appointments';

    // Default Fallback: Fashion (or could return null to show gallery)
    // Prompt says: "If no category match -> show Template Gallery" (implied return null or generic)
    // But for this function let's return a safe bet if we can't match, or undefined.

    if (!matchedCategorySlug) {
        return null;
    }

    // Lookup Category Config
    const categoryConfig = TEMPLATE_CATEGORIES.find(c => c.slug === matchedCategorySlug);
    if (!categoryConfig) return null;

    // Get Primary Template
    // Prompt: "One template may belong to only one primary category"
    // "Return: Primary recommended template"
    const primaryTemplateId = categoryConfig.recommendedTemplates[0] as CanonicalTemplateId;

    return {
        recommendedTemplate: primaryTemplateId,
        category: matchedCategorySlug,
        reason: `Best fit for ${categoryConfig.displayName} businesses.`
    };
}
