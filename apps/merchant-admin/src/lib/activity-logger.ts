import { prisma, Prisma } from "@vayva/db";

export interface ActivityLogEntry {
    userId: string;
    storeId: string;
    action: string;
    target: string;
    targetId: string;
    before?: Record<string, unknown> | null;
    after?: Record<string, unknown> | null;
    timestamp: Date;
}

interface LogActivityParams {
    storeId: string;
    actorUserId: string;
    action: string;
    targetType: string;
    targetId: string;
    before?: Record<string, unknown> | null;
    after?: Record<string, unknown> | null;
    reason?: string;
}

type DiffData = Record<string, unknown>;

export async function logActivity({
    storeId,
    actorUserId,
    action,
    targetType,
    targetId,
    before,
    after,
    reason
}: LogActivityParams) {
    try {
        // Calculate minimal diff if both states provided
        let diffBefore: DiffData | null = null;
        let diffAfter: DiffData | null = null;

        if (before && after) {
            const tempBefore: DiffData = {};
            const tempAfter: DiffData = {};

            const allKeys = new Set([...Object.keys(before), ...Object.keys(after)]);

            allKeys.forEach(key => {
                const valBefore = before[key];
                const valAfter = after[key];

                // Simple equality check (works for primitives, need recursion for deep objects if robust diff needed)
                if (valBefore !== valAfter) {
                    tempBefore[key] = valBefore;
                    tempAfter[key] = valAfter;
                }
            });

            // If no changes, maybe don't log? Or log action without diff.
            if (Object.keys(tempBefore).length === 0) {
                // No functional change
                return;
            }

            diffBefore = tempBefore;
            diffAfter = tempAfter;
        } else {
            // One-sided log (Creation or Deletion)
            diffBefore = before || null;
            diffAfter = after || null;
        }

        await prisma.adminAuditLog.create({
            data: {
                storeId,
                actorUserId,
                action,
                targetType,
                targetId,
                reason,
                before: (diffBefore as Prisma.InputJsonValue) ?? Prisma.JsonNull,
                after: (diffAfter as Prisma.InputJsonValue) ?? Prisma.JsonNull,
            }
        });

    } catch (error) {
        // Fail silent? detailed logs shouldn't break the app flow
        console.error("Failed to log activity:", error);
    }
}
