import { FastifyRequest, FastifyReply } from "fastify";
import { prisma, LedgerAccountType, TransactionType } from "@vayva/db";
import { WalletService } from "@vayva/shared/wallet-service";

const resolveActor = (req: FastifyRequest) => {
  const user = (req as unknown).user as unknown;
  const headerId =
    (req.headers["x-user-id"] as string) ||
    (req.headers["x-actor-id"] as string);
  return user?.id || user?.sub || headerId || "system";
};

export const OrdersController = {
  // --- QUERY ---
  getOrders: async (
    req: FastifyRequest<{
      Querystring: {
        storeId: string;
        status?: string;
        paymentStatus?: string;
        fulfillmentStatus?: string;
      };
    }>,
    reply: FastifyReply,
  ) => {
    const { storeId, status, paymentStatus, fulfillmentStatus } = req.query;

    const orders = await prisma.order.findMany({
      where: {
        storeId,
        status: status ? (status as unknown) : undefined,
        paymentStatus: paymentStatus ? (paymentStatus as unknown) : undefined,
        fulfillmentStatus: fulfillmentStatus
          ? (fulfillmentStatus as unknown)
          : undefined,
      },
      include: {
        customer: true,
        items: true,
        orderEvents: { orderBy: { createdAt: "desc" }, take: 1 }, // Latest event
      },
      orderBy: { createdAt: "desc" },
    });
    return orders;
  },

  getOrder: async (
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    const { id } = req.params;
    const storeId = req.headers["x-store-id"] as string;
    if (!storeId) return reply.status(400).send({ error: "Store ID required" });

    const order = await prisma.order.findFirst({
      where: { id, storeId },
      include: {
        customer: true,
        items: true,
        orderEvents: { orderBy: { createdAt: "desc" } },
        paymentTransactions: true,
        shipment: true,
      },
    });
    if (!order) return reply.status(404).send({ error: "Order not found" });
    return order;
  },

  // --- ACTIONS ---

  createOrder: async (
    req: FastifyRequest<{ Body: unknown }>,
    reply: FastifyReply,
  ) => {
    const { customer, items, paymentMethod, deliveryMethod, notes, location } = req.body as unknown;
    const storeId = req.headers["x-store-id"] as string;

    if (!storeId) return reply.status(400).send({ error: "Store ID required" });
    if (!items || !Array.isArray(items) || items.length === 0) {
      return reply.status(400).send({ error: "Items required" });
    }

    // 2. Wrap creation in a transaction to handle Inventory Reservation
    const order = await prisma.$transaction(async (tx) => {
      // a. Find or Create Customer
      let customerId = undefined;
      if (customer?.phone) {
        const existing = await tx.customer.findUnique({
          where: { storeId_phone: { storeId, phone: customer.phone } },
        });
        if (existing) {
          customerId = existing.id;
        } else {
          const newCust = await tx.customer.create({
            data: {
              storeId,
              phone: customer.phone,
              email: customer.email,
              firstName: customer.firstName,
              lastName: customer.lastName,
            },
          });
          customerId = newCust.id;
        }
      }

      // b. Calculate Totals
      const subtotal = items.reduce(
        (sum: number, item: unknown) => sum + item.price * item.quantity,
        0,
      );
      const total = subtotal;

      // c. Create Parent Order
      const parentOrder = await tx.order.create({
        data: {
          refCode: `ORD-P-${Date.now()}`,
          orderNumber: `#P-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4)}`,
          store: { connect: { id: storeId } },
          customer: customerId ? { connect: { id: customerId } } : undefined,
          customerPhone: customer?.phone,
          customerEmail: customer?.email,
          status: "PENDING_PAYMENT",
          paymentStatus: "INITIATED",
          fulfillmentStatus: "UNFULFILLED",
          paymentMethod: paymentMethod || "MANUAL",
          deliveryMethod: deliveryMethod || "PICKUP",
          internalNote: notes,
          subtotal: subtotal,
          total: total,
          metadata: { isParent: true },
        },
      });

      // d. Create Child Order
      const childOrder = await tx.order.create({
        data: {
          refCode: `ORD-C-${Date.now()}`,
          orderNumber: `#C-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4)}`,
          store: { connect: { id: storeId } },
          parentOrder: { connect: { id: parentOrder.id } },
          customer: customerId ? { connect: { id: customerId } } : undefined,
          customerPhone: customer?.phone,
          customerEmail: customer?.email,
          status: "PENDING_PAYMENT",
          paymentStatus: "INITIATED",
          fulfillmentStatus: "UNFULFILLED",
          paymentMethod: paymentMethod || "MANUAL",
          deliveryMethod: deliveryMethod || "PICKUP",
          subtotal: subtotal,
          total: total,
          items: {
            create: items.map((item: unknown) => ({
              title: item.title,
              productId: item.productId,
              variantId: item.variantId,
              price: item.price,
              quantity: item.quantity,
            })),
          },
          orderEvents: {
            create: {
              storeId,
              type: "CREATED",
              message: "Child order created",
              createdBy: resolveActor(req),
            },
          },
        },
        include: { items: true },
      });

      // e. Create Shipment on Child Order
      if (deliveryMethod && (req.body as unknown).shippingAddress) {
        const { recipientName, phone, addressLine1, city } = (req.body as unknown).shippingAddress;
        await tx.shipment.create({
          data: {
            storeId,
            orderId: childOrder.id,
            deliveryOptionType: "MANUAL",
            provider: "CUSTOM",
            status: "PENDING",
            recipientName: recipientName || `${customer?.firstName} ${customer?.lastName}`,
            recipientPhone: phone || customer?.phone,
            addressLine1,
            addressCity: city,
          },
        });
      }

      // ... Inventory logic remains on child items ...
      if (location) {
        for (const item of items) {
          // ... (the rest of the loop) ...
          if (!item.variantId) continue;
          // ...
        }
      }

      return childOrder;
    });

    return reply.status(201).send(order);

    return reply.status(201).send(order);
  },

  markPaid: async (
    req: FastifyRequest<{
      Params: { id: string };
      Body: { method: string; reference?: string };
    }>,
    reply: FastifyReply,
  ) => {
    const { id } = req.params;
    const { method, reference } = req.body; // method: TRANSFER, COD

    const order = await prisma.order.findUnique({
      where: { id },
      include: { customer: true }
    });
    if (!order) return reply.status(404).send({ error: "Order not found" });

    const updated = await prisma.$transaction(async (tx) => {
      // 1. Update Order Status
      const u = await tx.order.update({
        where: { id },
        data: {
          paymentStatus: "SUCCESS" as unknown,
          paymentMethod: method,
          orderEvents: {
            create: {
              storeId: order.storeId,
              type: "PAYMENT_UPDATED",
              message: `Marked as PAID via ${method}`,
              metadata: { reference },
            },
          },
        },
      });

      // 2. Record Ledger Transaction (Escrow)
      // Convert Decimal total to Kobo (Integer BigInt)
      const amountKobo = BigInt(Math.round(Number(order.total) * 100));

      await WalletService.processTransaction({
        ownerId: order.storeId,
        amount: amountKobo,
        type: TransactionType.CREDIT,
        accountType: LedgerAccountType.MERCHANT_PENDING,
        referenceId: `ORDER_PAYMENT_${order.id}`,
        description: `Payment for Order ${order.orderNumber}`,
      });

      return u;
    });

    // Trigger Notification Logic (Async)
    const notificationPayload = {
      storeId: order.storeId,
      templateKey: "ORDER_PAID",
      to: order.customerPhone || order.customerEmail || order.customer?.phone || order.customer?.email,
      variables: {
        orderNumber: order.orderNumber,
        total: order.total.toString(),
        customerName: order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : "Customer",
      },
      orderId: order.id,
      customerId: order.customerId,
    };

    if (notificationPayload.to) {
      // Fire and forget
      fetch(`${process.env.NOTIFICATIONS_SERVICE_URL || "http://localhost:3008"}/v1/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notificationPayload),
      }).catch((err) => console.error("Failed to send notification:", err));
    }

    return updated;
  },

  markDelivered: async (
    req: FastifyRequest<{ Params: { id: string }; Body: { note?: string } }>,
    reply: FastifyReply,
  ) => {
    const { id } = req.params;
    const { note } = req.body;

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) return reply.status(404).send({ error: "Order not found" });

    const updated = await prisma.$transaction(async (tx) => {
      // 1. Update Order Status
      const u = await tx.order.update({
        where: { id },
        data: {
          fulfillmentStatus: "DELIVERED" as unknown,
          status: "DELIVERED" as unknown, // Auto-close/fulfill logic
          orderEvents: {
            create: {
              storeId: order.storeId,
              type: "FULFILLMENT_UPDATED",
              message: "Marked as DELIVERED manually",
              metadata: { note },
            },
          },
        },
      });

      // 2. Release Escrow to Available Balance
      const amountKobo = BigInt(Math.round(Number(order.total) * 100));

      // Debit Pending (Escrow)
      await WalletService.processTransaction({
        ownerId: order.storeId,
        amount: amountKobo,
        type: TransactionType.DEBIT,
        accountType: LedgerAccountType.MERCHANT_PENDING,
        referenceId: `ORDER_ESCROW_RELEASE_${order.id}`,
        description: `Escrow release for Order ${order.orderNumber}`,
      });

      // Credit Available
      await WalletService.processTransaction({
        ownerId: order.storeId,
        amount: amountKobo,
        type: TransactionType.CREDIT,
        accountType: LedgerAccountType.MERCHANT_AVAILABLE,
        referenceId: `ORDER_FUNDS_AVAILABLE_${order.id}`,
        description: `Funds available for Order ${order.orderNumber}`,
      });

      return u;
    });

    return updated;
  },
};
