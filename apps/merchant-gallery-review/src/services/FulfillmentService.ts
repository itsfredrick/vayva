import { prisma } from "@vayva/db";

interface CreateShipmentInput {
  storeId: string;
  orderId: string;
  deliveryOptionType: "KWIK" | "SELF_DISPATCH" | "PICKUP";
  trackingCode?: string;
  trackingUrl?: string;
  recipientName?: string;
  recipientPhone?: string;
  addressLine1?: string;
  addressCity?: string;
}

export class FulfillmentService {
  /**
   * Create a Shipment for an Order
   */
  static async createShipment(input: CreateShipmentInput) {
    return await prisma.$transaction(async (tx: any) => {
      // 1. Validate Order
      const order = await tx.order.findUnique({
        where: { id: input.orderId },
      });

      if (!order) {
        throw new Error("Order not found");
      }

      if (order.status === "SHIPPED" || order.status === "DELIVERED") {
        // Idempotencyish check
        throw new Error("Order already fulfilled");
      }

      // 2. Create Shipment
      const shipment = await tx.shipment.create({
        data: {
          storeId: input.storeId,
          orderId: input.orderId,
          deliveryOptionType: input.deliveryOptionType,
          status: "PENDING", // Start as PENDING (or PACKED)
          trackingCode: input.trackingCode,
          trackingUrl: input.trackingUrl,
          recipientName: input.recipientName,
          recipientPhone: input.recipientPhone,
          addressLine1: input.addressLine1,
          addressCity: input.addressCity,
        },
      });

      // 3. Update Order Status
      // If Shipment is created, we can mark Order as PROCESSING or FULFILLING
      // Let's assume creating a shipment means we are working on it.
      await tx.order.update({
        where: { id: input.orderId },
        data: {
          status: "FULFILLING",
          fulfillmentStatus: "PROCESSING",
        },
      });

      return shipment;
    });
  }

  /**
   * Update Shipment Status
   */
  static async updateShipmentStatus(shipmentId: string, status: string) {
    return await prisma.$transaction(async (tx: any) => {
      const shipment = await tx.shipment.update({
        where: { id: shipmentId },
        data: { status },
      });

      // Sync with Order Status
      // OrderStatus: DRAFT, PENDING_PAYMENT, PAID, PROCESSING, FULFILLING, OUT_FOR_DELIVERY,
      // SHIPPED, DELIVERED, CANCELLED, REFUNDED, DISPUTED
      let orderStatus: any = undefined; // Use any to bypass TS strict check if needed, or map strictly

      if (status === "DISPATCHED" || status === "IN_TRANSIT") {
        orderStatus = "SHIPPED";
      } else if (status === "DELIVERED") {
        orderStatus = "DELIVERED";
      }

      if (orderStatus) {
        await tx.order.update({
          where: { id: shipment.orderId },
          data: { status: orderStatus },
        });
      }

      return shipment;
    });
  }
}
