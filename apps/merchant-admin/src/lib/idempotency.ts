import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

const IDEMPOTENCY_HEADER = "x-idempotency-key";
const EXPIRY_SECONDS = 60 * 60 * 24; // 24 hours

export interface IdempotencyResponse<T> {
  status: number;
  body: T | null;
  headers: Record<string, string> | null;
}

export async function getIdempotencyResponse<T>(
  key: string,
): Promise<IdempotencyResponse<T> | null> {
  const compositeKey = `idempotency:${key}`;
  const data = await redis.get(compositeKey);

  if (data) {
    const record: IdempotencyResponse<T> = JSON.parse(data);
    return record;
  }
  return null;
}

export async function verifyIdempotency(
  req: NextRequest
): Promise<{ cached: NextResponse | null; key: string | null }> {
  const key = req.headers.get(IDEMPOTENCY_HEADER);
  if (!key) return { cached: null, key: null };

  const compositeKey = `idempotency:${key}`;
  const data = await redis.get(compositeKey);

  if (data) {
    const record: IdempotencyResponse<unknown> = JSON.parse(data);
    return {
      cached: NextResponse.json(record.body, {
        status: record.status,
        headers: {
          ...(record.headers || {}),
          "x-idempotency-hit": "true"
        },
      }),
      key,
    };
  }

  // Set a "Processing" lock? 
  // For simplicity, we assume we process and save at end.
  // Ideally we use SETNX with short TTL to block concurrent.

  return { cached: null, key: compositeKey };
}

export async function saveIdempotencyResponse<T>(
  key: string,
  status: number,
  body: T,
  headers: Record<string, string>,
): Promise<void> {
  const compositeKey = `idempotency:${key}`;
  const record: IdempotencyResponse<T> = {
    status,
    body,
    headers
  };

  await redis.set(compositeKey, JSON.stringify(record), "EX", EXPIRY_SECONDS);
}
