// Simple In-Memory Rate Limiter for V1
// In production, swap `counts` Map for Redis.

const counts = new Map<string, { count: number; resetsAt: number }>();

export class RateLimiter {
  /**
   * limit: max requests
   * window: in seconds
   */
  static check(
    identifier: string,
    limit: number,
    windowSeconds: number,
  ): { allowed: boolean; remaining: number; resetAt: number } {
    const now = Date.now();
    const key = identifier;

    let record = counts.get(key);

    if (!record || now > record.resetsAt) {
      record = { count: 0, resetsAt: now + windowSeconds * 1000 };
      counts.set(key, record);
    }

    if (record.count >= limit) {
      return { allowed: false, remaining: 0, resetAt: record.resetsAt };
    }

    record.count += 1;
    return {
      allowed: true,
      remaining: limit - record.count,
      resetAt: record.resetsAt,
    };
  }
}
