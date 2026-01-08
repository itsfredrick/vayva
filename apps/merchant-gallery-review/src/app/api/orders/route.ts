import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { withRBAC } from "@/lib/team/rbac";
import { PERMISSIONS } from "@/lib/team/permissions";

export const GET = withRBAC(
  PERMISSIONS.COMMERCE_VIEW,
  async (session: any, request: Request) => {
    try {
      const storeId = session.user.storeId;
      const { searchParams } = new URL(request.url);
      const limit = parseInt(searchParams.get("limit") || "50");
      const offset = parseInt(searchParams.get("offset") || "0");

      const status = searchParams.get("status");
      const paymentStatus = searchParams.get("paymentStatus");
      const fulfillmentStatus = searchParams.get("fulfillmentStatus");
      const q = searchParams.get("q");
      const fromDate = searchParams.get("from");
      const toDate = searchParams.get("to");

      const where: any = { storeId };

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

      const orders = await prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      });

      const transformedOrders = orders.map((order: any) => ({
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

      return NextResponse.json(transformedOrders);
    } catch (error) {
      console.error("Fetch Orders Error:", error);
      return NextResponse.json(
        { error: "Failed to fetch orders" },
        { status: 500 },
      );
    }
  },
);

export const POST = withRBAC(
  PERMISSIONS.COMMERCE_MANAGE,
  async (session: any, request: Request) => {
    try {
      const storeId = session.user.storeId;
      const userId = session.user.id;
      const body = await request.json();
      const isTestMode = body.mode === "test";

      const result = await prisma.$transaction(async (tx: any) => {
        // 1. Atomic Upsert & Return Sequence (Postgres)
        const [counter]: any = await tx.$queryRaw`
                INSERT INTO "StoreCounter" ("storeId", "orderSeq")
                VALUES (${storeId}, 1)
                ON CONFLICT ("storeId")
                DO UPDATE SET "orderSeq" = "StoreCounter"."orderSeq" + 1
                RETURNING "orderSeq"
            `;

        const orderNumber = `ORD-${counter.orderSeq.toString().padStart(6, "0")}`;

        // 2. Create Order
        const order = await tx.order.create({
          data: {
            storeId,
            orderNumber: orderNumber as any,
            total: body.total || 5000,
            subtotal: body.subtotal || 4500,
            tax: body.tax || 0,
            shippingTotal: body.shipping || 500,
            discountTotal: 0,
            currency: "NGN",
            status: "PENDING_PAYMENT" as any,
            paymentStatus: "INITIATED" as any,
            fulfillmentStatus: "UNFULFILLED" as any,
            source: isTestMode ? "TEST_MODE" : "MANUAL",
            refCode: `ORD-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          },
        });

        // Deprecated firstOrderAt logic removed

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
