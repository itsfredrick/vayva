import { prisma } from "@vayva/db";
import { EVENT_CATALOG } from "./catalog";
export class EventBus {
    /**
     * Publishes an event to the system.
     * Automatically creates Notifications and AuditLogs based on the Catalog definition.
     * Wraps writes in a transaction if possible, or executes them safely.
     */
    static async publish(event: any) {
        const def = EVENT_CATALOG[event.type as keyof typeof EVENT_CATALOG];
        if (!def) {
            // Event not in catalog - ignore or just log debug
            console.warn(`[EventBus] Unregistered event type: ${event.type}`);
            return;
        }
        const { merchantId, type, entityType, entityId, payload = {}, dedupeKey, ctx, } = event;
        const ops: any[] = [];
        if ('audit' in def && def.audit) {
            const auditDef = def.audit as any; // Cast to bypass strict union property check
            ops.push(prisma.auditLog.create({
                data: {
                    storeId: merchantId,
                    actorType: ctx.actorType,
                    actorId: ctx.actorId,
                    actorLabel: ctx.actorLabel,
                    ipAddress: ctx.ipAddress,
                    userAgent: ctx.userAgent,
                    correlationId: ctx.correlationId,
                    action: auditDef.action,
                    entityType,
                    entityId,
                    beforeState: auditDef.beforeState
                        ? auditDef.beforeState(payload)
                        : undefined,
                    afterState: auditDef.afterState
                        ? auditDef.afterState(payload)
                        : undefined,
                },
            }));
        }
        if ('notification' in def && def.notification) {
            const notifDef = def.notification as any; // Cast to bypass strict union check
            const title = typeof notifDef.title === "function"
                ? notifDef.title(payload)
                : notifDef.title;
            const body = typeof notifDef.body === "function"
                ? notifDef.body(payload)
                : notifDef.body;
            const actionUrl = notifDef.actionUrl
                ? typeof notifDef.actionUrl === "function"
                    ? notifDef.actionUrl(payload, entityId)
                    : notifDef.actionUrl
                : null;
            // Handle deduplication if key provided
            if (dedupeKey) {
                ops.push(prisma.notification.upsert({
                    where: { dedupeKey },
                    create: {
                        storeId: merchantId,
                        userId: ctx.actorId, // If notification is for the actor? usually notifications are for the merchant (all users) or specific user.
                        // For V1, let's assign None (null) to mean "All Store Admins" unless specified.
                        // But our schema has userId. If we want it to be global for store, we leave userId null or handle logic.
                        // Let's assume system notifications go to the dashboard feed (null userId = visible to all with access).
                        // EXCEPT if we want to target specific user. For now, null.
                        type,
                        title,
                        body,
                        severity: notifDef.severity,
                        actionUrl,
                        entityType,
                        entityId,
                        dedupeKey,
                        metadata: payload,
                    },
                    update: {
                        // If it already exists, maybe bump timestamp or just ignore?
                        // Usually we ignore duplicates.
                    },
                }));
            }
            else {
                ops.push(prisma.notification.create({
                    data: {
                        storeId: merchantId,
                        userId: null, // Broadcast to store
                        type,
                        title,
                        body,
                        severity: notifDef.severity,
                        actionUrl,
                        entityType,
                        entityId,
                        dedupeKey, // null
                        metadata: payload,
                    },
                }));
            }
        }
        if (ops.length > 0) {
            try {
                await prisma.$transaction(ops);
            }
            catch (error: any) {
                console.error(`[EventBus] Failed to process event ${event.type}:`, error);
                // Don't throw, to avoid breaking the main business logic flow if this was awaited
            }
        }
    }
}
