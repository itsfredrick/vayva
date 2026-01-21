import { prisma, FulfillmentStatus, OrderStatus } from "@vayva/db";
import { ResendEmailService } from "@/lib/email/resend";
import { logAuditEvent, AuditEventType } from "@/lib/audit";

export class OrderStateService {

    /**
     * Transition Order Status
     */
    static async transition(orderId: string, toStatus: FulfillmentStatus, actorId: string | undefined, storeId: string) {

        // 1. Fetch current order
        const order = await prisma.order.findUnique({
            where: { id: orderId, storeId },
            include: { customer: true, store: true, shipment: true }
        });

        if (!order) throw new Error("Order not found");

        const fromStatus = order.fulfillmentStatus;

        // 2. Validate Transition (Simple State Machine)
        // Allowed: UNFULFILLED -> PROCESSING -> SHIPPED -> DELIVERED
        // Allowing loose transitions for MVP flexibility, but logging them.

        if (toStatus === fromStatus) return order;

        // 3. Update Status
        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: {
                fulfillmentStatus: toStatus,
                status: toStatus === FulfillmentStatus.DELIVERED ? OrderStatus.DELIVERED : order.status
            }
        });

        // 4. Side Effects (Notifications)
        // Trigger "Shipped" email when status moves to OUT_FOR_DELIVERY (carrier has it)
        if (toStatus === FulfillmentStatus.OUT_FOR_DELIVERY) {
            if (order.customerEmail) {
                // Async fire and forget
                ResendEmailService.sendOrderShippedEmail(
                    order.customerEmail,
                    order.orderNumber,
                    order.shipment?.trackingUrl ?? undefined,
                    order.store.name
                ).catch(e => console.error("Failed to send shipped email", e));
            }
        }

        // 5. Audit Log
        if (actorId) {
            await logAuditEvent(
                storeId,
                actorId,
                AuditEventType.ORDER_STATUS_CHANGED,
                {
                    targetType: "ORDER",
                    targetId: orderId,
                    meta: { from: fromStatus, to: toStatus }
                }
            );
        }

        return updatedOrder;
    }
}
