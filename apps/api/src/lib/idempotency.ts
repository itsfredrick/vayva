import { prisma } from '@vayva/db';

export async function checkIdempotency(key: string, tenantId: string) {
    // Stub implementation
    // Check Redis or DB for existing processed event
    return false;
}

export async function recordIdempotency(key: string, tenantId: string, result: any) {
    // Stub implementation
}
