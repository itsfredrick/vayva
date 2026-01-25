import { prisma } from "@vayva/db";

export async function checkIdempotency(_key: string, _tenantId: string) {
  // Pending implementation
  // Check Redis or DB for existing processed event
  return false;
}

export async function recordIdempotency(
  _key: string,
  _tenantId: string,
  _result: unknown,
) {
  // Pending implementation
}
