
import type { Redis } from "ioredis";
import { getRedis } from "@vayva/redis";

const globalForRedis = global as unknown as { redis: Redis };

export async function getRedisClient(): Promise<Redis> {
    if (globalForRedis.redis) return globalForRedis.redis;

    const client = await getRedis();

    if (process.env.NODE_ENV !== "production") {
        globalForRedis.redis = client;
    }
    return client;
}
