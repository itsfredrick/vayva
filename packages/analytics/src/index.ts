export interface AnalyticsEvent {
    eventName: string;
    properties?: Record<string, any>;
    userId?: string;
    storeId?: string;
}

export const AnalyticsProvider = {
    track: (event: AnalyticsEvent) => {
        if (typeof window !== 'undefined') {
            console.log(`[Analytics] ${event.eventName}`, event);
            // Todo: Send to backend / Mixpanel / PostHog
        }
    },

    identify: (userId: string, traits?: any) => {
        console.log(`[Analytics] Identify ${userId}`, traits);
    }
};
