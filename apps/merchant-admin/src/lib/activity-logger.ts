import { prisma } from "@vayva/db";
export async function logActivity({ storeId, actorUserId, action, targetType, targetId, before, after, reason }: { storeId: any; actorUserId: any; action: string; targetType: string; targetId: string; before?: any; after?: any; reason?: any }) {
    try {
        // Calculate minimal diff if both states provided
        let diffBefore: any= null;
        let diffAfter: any= null;
        if (before && after) {
            diffBefore = {};
            diffAfter = {};
            const allKeys = new Set([...Object.keys(before), ...Object.keys(after)]);
            allKeys.forEach((key: any) => {
                const valBefore = before[key];
                const valAfter = after[key];
                // Simple equality check (works for primitives, need recursion for deep objects if robust diff needed)
                if (valBefore !== valAfter) {
                    diffBefore[key] = valBefore;
                    diffAfter[key] = valAfter;
                }
            });
            // If no changes, maybe don't log? Or log action without diff.
            if (Object.keys(diffBefore).length === 0) {
                // No functional change
                return;
            }
        }
        else {
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
                before: diffBefore ? diffBefore : undefined,
                after: diffAfter ? diffAfter : undefined,
            }
        });
    }
    catch (error: any) {
        // Fail silent? detailed logs shouldn't break the app flow
        console.error("Failed to log activity:", error);
    }
}
