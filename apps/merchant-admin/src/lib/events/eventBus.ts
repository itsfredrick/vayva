import { prisma } from '@vayva/db';
import { EVENT_CATALOG } from './catalog';
import { BaseEventPayload, EventDefinition } from './types';

export class EventBus {
    /**
     * Publishes an event to the system.
     * Automatically creates Notifications and AuditLogs based on the Catalog definition.
     * Wraps writes in a transaction if possible, or executes them safely.
     */
    static async publish(event: BaseEventPayload): Promise<void> {
        const def: EventDefinition | undefined = EVENT_CATALOG[event.type];

        if (!def) {
            // Event not in catalog - ignore or just log debug
            console.warn(`[EventBus] Unregistered event type: ${event.type}`);
            return;
        }

        const { merchantId, type, entityType, entityId, payload = {}, dedupeKey, ctx } = event;
        const ops = [];

        // 1. Audit Log handling
        if (def.audit) {
            ops.push(
                prisma.auditLog.create({
                    data: {
                        store: { connect: { id: merchantId } },
                        actorType: ctx.actorType,
                        actorId: ctx.actorId,
                        actorLabel: ctx.actorLabel,
                        ipAddress: ctx.ipAddress,
                        userAgent: ctx.userAgent,
                        correlationId: ctx.correlationId,
                        action: def.audit.action,
                        entityType,
                        entityId,
                        beforeState: def.audit.beforeState ? def.audit.beforeState(payload) : undefined,
                        afterState: def.audit.afterState ? def.audit.afterState(payload) : undefined,
                    }
                })
            );
        }

        // 2. Notification handling
        if (def.notification) {
            const title = typeof def.notification.title === 'function'
                ? def.notification.title(payload)
                : def.notification.title;

            const body = typeof def.notification.body === 'function'
                ? def.notification.body(payload)
                : def.notification.body;

            const actionUrl = def.notification.actionUrl
                ? (typeof def.notification.actionUrl === 'function' ? def.notification.actionUrl(payload, entityId) : def.notification.actionUrl)
                : null;

            // Handle deduplication if key provided
            if (dedupeKey) {
                ops.push(
                    prisma.notification.upsert({
                        where: { dedupeKey },
                        create: {
                            store: { connect: { id: merchantId } },
                            userId: ctx.actorId, // If notification is for the actor? usually notifications are for the merchant (all users) or specific user.
                            // For V1, let's assign None (null) to mean "All Store Admins" unless specified.
                            // But our schema has userId. If we want it to be global for store, we leave userId null or handle logic.
                            // Let's assume system notifications go to the dashboard feed (null userId = visible to all with access).
                            // EXCEPT if we want to target specific user. For now, null.
                            type,
                            title,
                            body,
                            severity: def.notification.severity,
                            actionUrl,
                            entityType,
                            entityId,
                            dedupeKey,
                            metadata: payload
                        },
                        update: {
                            // If it already exists, maybe bump timestamp or just ignore?
                            // Usually we ignore duplicates.
                        }
                    })
                );
            } else {
                ops.push(
                    prisma.notification.create({
                        data: {
                            store: { connect: { id: merchantId } },
                            userId: null, // Broadcast to store
                            type,
                            title,
                            body,
                            severity: def.notification.severity,
                            actionUrl,
                            entityType,
                            entityId,
                            dedupeKey, // null
                            metadata: payload
                        }
                    })
                );
            }
        }

        if (ops.length > 0) {
            try {
                await prisma.$transaction(ops);
            } catch (error) {
                console.error(`[EventBus] Failed to process event ${event.type}:`, error);
                // Don't throw, to avoid breaking the main business logic flow if this was awaited
            }
        }
    }
}
