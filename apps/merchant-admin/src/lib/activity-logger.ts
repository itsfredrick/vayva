import { prisma } from "@vayva/db";

interface LogActivityParams {
    storeId: string;
    actorUserId: string;
    action: string;
    targetType: string;
    targetId: string;
    before?: Record<string, any> | null;
    after?: Record<string, any> | null;
    reason?: string;
}

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
        let diffBefore = null;
        let diffAfter = null;

        if (before && after) {
            diffBefore = {} as Record<string, any>;
            diffAfter = {} as Record<string, any>;

            const allKeys = new Set([...Object.keys(before), ...Object.keys(after)]);

            allKeys.forEach(key => {
                const valBefore = before[key];
                const valAfter = after[key];

                // Simple equality check (works for primitives, need recursion for deep objects if robust diff needed)
                if (valBefore !== valAfter) {
                    diffBefore![key] = valBefore;
                    diffAfter![key] = valAfter;
                }
            });

            // If no changes, maybe don't log? Or log action without diff.
            if (Object.keys(diffBefore).length === 0) {
                // No functional change
                return;
            }
        } else {
            // One-sided log (Creation or Deletion)
            diffBefore = before;
            diffAfter = after;
        }

        await prisma.adminAuditLog.create({
            data: {
                storeId,
                actorUserId,
                action,
                targetType,
                targetId,
                reason,
                before: diffBefore ? diffBefore as any : undefined,
                after: diffAfter ? diffAfter as any : undefined,
            }
        });

    } catch (error) {
        // Fail silent? detailed logs shouldn't break the app flow
        console.error("Failed to log activity:", error);
    }
}
