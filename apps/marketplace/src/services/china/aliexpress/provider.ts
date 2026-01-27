import type {
  AliExpressProvider,
  AliExpressSearchResponse,
} from "@/services/china/aliexpress/types";

function hasValue(value: string | undefined | null): value is string {
  return Boolean(value && value.trim().length > 0);
}

export function createAliExpressProvider(): AliExpressProvider {
  const appKey = process.env.ALIEXPRESS_APP_KEY;
  const appSecret = process.env.ALIEXPRESS_APP_SECRET;
  const trackingId = process.env.ALIEXPRESS_TRACKING_ID;

  return {
    isConfigured() {
      return hasValue(appKey) && hasValue(appSecret) && hasValue(trackingId);
    },

    async search({ query, page, limit }): Promise<AliExpressSearchResponse> {
      if (!query || !query.trim()) {
        return { items: [], page, limit, hasMore: false };
      }

      if (!hasValue(appKey) || !hasValue(appSecret) || !hasValue(trackingId)) {
        return { items: [], page, limit, hasMore: false };
      }

      return { items: [], page, limit, hasMore: false };
    },
  };
}
