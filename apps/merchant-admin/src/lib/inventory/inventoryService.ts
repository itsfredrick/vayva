import { prisma } from "@vayva/db";

export class InventoryService {
  /**
   * Set absolute stock level.
   */
  static async setStock(
    merchantId: string,
    productId: string,
    variantId: string | null,
    newOnHand: number,
    actor: { type: string; id?: string; label: string },
  ) {
    return prisma.$transaction(async (tx) => {
      // Find existing or create
      let item = await tx.inventory_item.findFirst({
        where: {
          merchantId,
          productId,
          variantId: variantId || null,
        },
      });

      if (!item) {
        item = await tx.inventory_item.create({
          data: {
            merchantId,
            productId,
            variantId: variantId || null,
            onHand: 0,
            reserved: 0,
          },
        });
      }

      const diff = newOnHand - item.onHand;
      if (diff === 0) return item;

      const oldOnHand = item.onHand;
      const updated = await tx.inventory_item.update({
        where: { id: item.id },
        data: { onHand: newOnHand },
      });

      // Stock Movement
      await tx.stock_movement.create({
        data: {
          merchantId,
          productId,
          variantId: variantId || null,
          type: "adjust",
          quantity: diff,
          beforeOnHand: oldOnHand,
          afterOnHand: newOnHand,
          beforeReserved: item.reserved,
          afterReserved: item.reserved,
          referenceId: "manual",
          actorType: actor.type,
          actorLabel: actor.label,
          correlationId: `adj_${Date.now()}`,
        },
      });

      return updated;
    });
  }

  /**
   * Reserve stock for checkout.
   */
  static async reserveStock(
    merchantId: string,
    orderDraftId: string,
    items: { productId: string; variantId?: string | null; quantity: number }[],
  ) {
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await prisma.$transaction(async (tx) => {
      for (const item of items) {
        const inventory = await tx.inventory_item.findFirst({
          where: {
            merchantId,
            productId: item.productId,
            variantId: item.variantId || null,
          },
        });

        if (!inventory)
          throw new Error(`Product ${item.productId} not found in inventory`);

        // Check availability
        const available = inventory.onHand - inventory.reserved;
        if (available < item.quantity) {
          throw new Error(`Out of stock for product ${item.productId}`);
        }

        const oldReserved = inventory.reserved;
        const newReserved = inventory.reserved + item.quantity;

        // Increment Reserved
        await tx.inventory_item.update({
          where: { id: inventory.id },
          data: { reserved: newReserved },
        });

        // Create Reservation Record
        await tx.stock_reservation.create({
          data: {
            merchantId,
            orderDraftId,
            productId: item.productId,
            variantId: item.variantId || null,
            quantity: item.quantity,
            expiresAt,
            status: "active",
          },
        });

        // Log Movement
        await tx.stock_movement.create({
          data: {
            merchantId,
            productId: item.productId,
            variantId: item.variantId || null,
            type: "reserve",
            quantity: item.quantity,
            beforeOnHand: inventory.onHand,
            afterOnHand: inventory.onHand,
            beforeReserved: oldReserved,
            afterReserved: newReserved,
            referenceId: orderDraftId,
            actorType: "system",
            actorLabel: "Checkout Reservation",
            correlationId: `res_${orderDraftId}_${item.productId}`,
          },
        });
      }
    });
  }

  /**
   * Confirm reservation (Convert to Sale)
   */
  static async confirmReservation(
    merchantId: string,
    orderDraftId: string,
    orderId: string,
  ) {
    const reservations = await prisma.stock_reservation.findMany({
      where: { orderDraftId, status: "active" },
    });

    if (reservations.length === 0) return;

    await prisma.$transaction(async (tx) => {
      for (const res of reservations) {
        const inventory = await tx.inventory_item.findFirst({
          where: {
            merchantId,
            productId: res.productId,
            variantId: res.variantId || null,
          },
        });

        if (!inventory) continue;

        const oldOnHand = inventory.onHand;
        const oldReserved = inventory.reserved;
        const newOnHand = inventory.onHand - res.quantity;
        const newReserved = inventory.reserved - res.quantity;

        // Decrement OnHand AND Reserved
        await tx.inventory_item.update({
          where: { id: inventory.id },
          data: {
            onHand: newOnHand,
            reserved: newReserved,
          },
        });

        // Update Reservation Status
        await tx.stock_reservation.update({
          where: { id: res.id },
          data: { status: "confirmed" },
        });

        // Log Movement (Sale)
        await tx.stock_movement.create({
          data: {
            merchantId,
            productId: res.productId,
            variantId: res.variantId || null,
            type: "sale",
            quantity: res.quantity * -1,
            beforeOnHand: oldOnHand,
            afterOnHand: newOnHand,
            beforeReserved: oldReserved,
            afterReserved: newReserved,
            referenceId: orderId,
            actorType: "system",
            actorLabel: "Order Confirmation",
            correlationId: `sale_${orderId}_${res.id}`,
          },
        });
      }
    });
  }

  /**
   * Release reservation
   */
  static async releaseReservation(merchantId: string, orderDraftId: string) {
    const reservations = await prisma.stock_reservation.findMany({
      where: { orderDraftId, status: "active" },
    });

    await prisma.$transaction(async (tx) => {
      for (const res of reservations) {
        const inventory = await tx.inventory_item.findFirst({
          where: {
            merchantId,
            productId: res.productId,
            variantId: res.variantId || null,
          },
        });
        if (!inventory) continue;

        const oldReserved = inventory.reserved;
        const newReserved = inventory.reserved - res.quantity;

        // Decrement Reserved Only
        await tx.inventory_item.update({
          where: { id: inventory.id },
          data: { reserved: newReserved },
        });

        await tx.stock_reservation.update({
          where: { id: res.id },
          data: { status: "released" },
        });

        await tx.stock_movement.create({
          data: {
            merchantId,
            productId: res.productId,
            variantId: res.variantId || null,
            type: "release",
            quantity: 0,
            beforeOnHand: inventory.onHand,
            afterOnHand: inventory.onHand,
            beforeReserved: oldReserved,
            afterReserved: newReserved,
            referenceId: orderDraftId,
            actorType: "system",
            actorLabel: "Reservation Release",
            correlationId: `rel_${orderDraftId}_${res.id}`,
          },
        });
      }
    });
  }
}
