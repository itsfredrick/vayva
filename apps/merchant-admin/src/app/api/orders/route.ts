import { NextRequest, NextResponse } from "next/server";
import { prisma, OrderStatus, PaymentStatus, FulfillmentStatus } from "@vayva/db";
import { withVayvaAPI, HandlerContext } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
import type { OrderListRequest } from "@/types/api";

export const GET = withVayvaAPI(
  PERMISSIONS.ORDERS_VIEW,
  async (req: NextRequest, { storeId }: HandlerContext) => {
    try {
      const { searchParams } = new URL(req.url);
      const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
      const offset = parseInt(searchParams.get("offset") || "0");

      const status = searchParams.get("status") as OrderStatus | "ALL";
      const paymentStatus = searchParams.get("paymentStatus") as PaymentStatus | "ALL";
      const fulfillmentStatus = searchParams.get("fulfillmentStatus") as FulfillmentStatus | "ALL";
      const q = searchParams.get("q");
      const fromDate = searchParams.get("from");
      const toDate = searchParams.get("to");

      // Build where clause with proper typing
      const where: {
        storeId: string;
        status?: OrderStatus;
        paymentStatus?: PaymentStatus;
        fulfillmentStatus?: FulfillmentStatus;
        OR?: Array<{ [key: string]: any }>;
        createdAt?: { gte?: Date; lte?: Date };
      } = { storeId };

      if (status && status !== "ALL") where.status = status;
      if (paymentStatus && paymentStatus !== "ALL")
        where.paymentStatus = paymentStatus;
      if (fulfillmentStatus && fulfillmentStatus !== "ALL")
        where.fulfillmentStatus = fulfillmentStatus;

      if (q) {
        where.OR = [
          { orderNumber: { contains: q, mode: "insensitive" } },
          { refCode: { contains: q, mode: "insensitive" } },
          { customerEmail: { contains: q, mode: "insensitive" } },
        ];
      }

      if (fromDate || toDate) {
        where.createdAt = {};
        if (fromDate) where.createdAt.gte = new Date(fromDate);
        if (toDate) where.createdAt.lte = new Date(toDate);
      }

      const [orders, total] = await Promise.all([
        prisma.order.findMany({
          where,
          orderBy: { createdAt: "desc" },
          take: limit,
          skip: offset,
        }),
        prisma.order.count({ where })
      ]);

      const transformedOrders = orders.map((order) => ({
        id: order.id,
        merchantId: order.storeId,
        orderNumber: order.orderNumber,
        refCode: order.refCode,
        status: order.status,
        paymentStatus: order.paymentStatus,
        fulfillmentStatus: order.fulfillmentStatus,
        customer: {
          id: order.customerId || "",
          email: order.customerEmail || "",
          phone: order.customerPhone || "",
        },
        totalAmount: Number(order.total),
        subtotal: Number(order.subtotal),
        tax: Number(order.tax),
        shippingTotal: Number(order.shippingTotal),
        discountTotal: Number(order.discountTotal),
        currency: order.currency,
        source: order.source,
        paymentMethod: order.paymentMethod || "",
        deliveryMethod: order.deliveryMethod || "",
        timestamps: {
          createdAt: order.createdAt.toISOString(),
          updatedAt: order.updatedAt.toISOString(),
        },
      }));

      return NextResponse.json({
        success: true,
        data: transformedOrders,
        meta: {
          total,
          limit,
          offset,
        },
      });
    } catch (error) {
      console.error("Fetch Orders Error:", error);
      return NextResponse.json(
        { error: "Failed to fetch orders" },
        { status: 500 },
      );
    }
  },
);

export const POST = withVayvaAPI(
  PERMISSIONS.ORDERS_MANAGE,
  async (req: NextRequest, { storeId }: HandlerContext) => {
    try {
      const body = await req.json();

      // Basic Validation
      if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
        if (!body.total) {
          return NextResponse.json({ error: "Order must have items or explicit totals" }, { status: 400 });
        }
      }

      const total = Number(body.total);
      if (isNaN(total) || total < 0) {
        return NextResponse.json({ error: "Invalid total amount" }, { status: 400 });
      }

      const result = await prisma.$transaction(async (tx) => {
        // 1. Atomic Upsert & Return Sequence
        const counter = await tx.$queryRaw<Array<{ orderSeq: number }>>`
                INSERT INTO "StoreCounter" ("storeId", "orderSeq")
                VALUES (${storeId}, 1)
                ON CONFLICT ("storeId")
                DO UPDATE SET "orderSeq" = "StoreCounter"."orderSeq" + 1
                RETURNING "orderSeq"
            `;

        const orderNumber = `ORD-${counter[0].orderSeq.toString().padStart(6, "0")}`;

        // 2. Create Order (Using storeId from context for isolation)
        const order = await tx.order.create({
          data: {
            storeId,
            orderNumber,
            total: total,
            subtotal: Number(body.subtotal) || total,
            tax: Number(body.tax) || 0,
            shippingTotal: Number(body.shipping) || 0,
            discountTotal: Number(body.discount) || 0,
            currency: body.currency || "NGN",
            status: "PENDING_PAYMENT",
            paymentStatus: "INITIATED",
            fulfillmentStatus: "UNFULFILLED",
            source: "MANUAL",
            refCode: `ORD-${Date.now()}-${Math.random().toString(36).substring(7)}`,
            customerEmail: body.customer?.email?.toLowerCase() || null,
            customerPhone: body.customer?.phone || null,
            items: body.items ? {
              create: body.items.map((item: any) => ({
                productId: item.productId,
                productName: item.title || "Item",
                quantity: Number(item.quantity) || 1,
                price: Number(item.price) || 0
              }))
            } : undefined
          },
        });

        return { order };
      });

      return NextResponse.json(result.order);
    } catch (error) {
      console.error("Create Order Error:", error);
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 },
      );
    }
  },
);
