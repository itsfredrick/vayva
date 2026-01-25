import { getRedis } from "@vayva/redis";

const globalForRedis = global;
export const redis = globalForRedis.redis || getRedis();

if (process.env.NODE_ENV !== "production")
    globalForRedis.redis = redis;
