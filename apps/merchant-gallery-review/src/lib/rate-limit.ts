import { prisma } from "@vayva/db";
import { logAuditEvent, AuditEventType } from "@/lib/audit";

interface RateLimitConfig {
  key: string;
  points: number;
  duration: number; // seconds
}

export class RateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RateLimitError";
  }
}

/**
 * Checks if the action is rate limited using the database.
 * Throws RateLimitError if limit exceeded.
 */
export async function checkRateLimit(
  userId: string,
  routeKey: string,
  limit: number,
  durationSeconds: number,
  storeId?: string,
): Promise<void> {
  const key = `rl:${routeKey}:${userId}`;
  const now = new Date();

  // 1. Clean expired (optional, but keeps DB clean)
  // We do this by trying to delete if expired before upserting.
  // However, atomic deleteMany is safe.
  await prisma.rateLimit.deleteMany({
    where: {
      key,
      expireAt: { lt: now },
    },
  });

  // 2. Upsert
  // If exists, increment points. If new, create with points=1.
  const expiresAt = new Date(now.getTime() + durationSeconds * 1000);

  const record = await prisma.rateLimit.upsert({
    where: { key },
    create: {
      key,
      points: 1,
      expireAt: expiresAt,
    },
    update: {
      points: { increment: 1 },
    },
  });

  if (record.points > limit) {
    // Log blocked attempt (maybe only once per block to avoid spamming audit logs?)
    // For security, logging every blocked sensitive action is okay, or sample it.
    // We will log it.
    if (storeId) {
      await logAuditEvent(
        storeId,
        userId,
        AuditEventType.SECURITY_RATE_LIMIT_BLOCKED,
        { routeKey, limit, points: record.points },
      );
    }

    throw new RateLimitError(
      `Rate limit exceeded. Try again in ${Math.ceil((record.expireAt.getTime() - now.getTime()) / 1000)} seconds.`,
    );
  }
}
