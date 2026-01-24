import { redis } from "@/lib/redis";
export enum QuotaType {
    EXPORT_GENERATION = "EXPORT_GENERATION",
    BULK_IMPORT = "BULK_IMPORT",
    WHATSAPP_MESSAGE = "WHATSAPP_MESSAGE",
    AI_GENERATION = "AI_GENERATION",
}
const QUOTA_DEFAULTS = {
    [QuotaType.EXPORT_GENERATION]: 10, // 10 per day
    [QuotaType.BULK_IMPORT]: 5, // 5 per day
    [QuotaType.WHATSAPP_MESSAGE]: 100, // 100 per day (Free tier)
    [QuotaType.AI_GENERATION]: 20, // 20 per day
};
/**
 * Checks if a store has exceeded their quota for a specific action.
 * Returns { allowed: boolean, remaining: number, resetAt: Date }
 */
export async function checkQuota(storeId: string, type: QuotaType) {
    if (!redis) {
        console.warn("Redis not available for quota check. allowing.");
        return { allowed: true, remaining: 999, limit: 999, resetInSeconds: 0 };
    }
    const dateKey = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const key = `quota:${storeId}:${type}:${dateKey}`;
    const limit = QUOTA_DEFAULTS[type as keyof typeof QUOTA_DEFAULTS];
    const currentUsageStr = await redis.get(key);
    const currentUsage = currentUsageStr ? parseInt(currentUsageStr) : 0;
    if (currentUsage >= limit) {
        // Check allowlist or plan overrides here if needed
        return { allowed: false, remaining: 0, limit, resetInSeconds: 86400 };
    }
    return {
        allowed: true,
        remaining: limit - currentUsage,
        limit,
        resetInSeconds: 86400 // Rough approx, logic could be cleaner
    };
}
/**
 * Increments the quota usage for a store.
 */
export async function incrementQuota(storeId: any, type: any) {
    if (!redis)
        return;
    const dateKey = new Date().toISOString().split("T")[0];
    const key = `quota:${storeId}:${type}:${dateKey}`;
    await redis.incr(key);
    await redis.expire(key, 86400); // Expire in 24 hours
}
