import { NextRequest, NextResponse } from "next/server";
import { withVayvaAPI, HandlerContext } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
import { prisma } from "@vayva/db";
import { OrderStateService } from "@/services/order-state.service";

// GET /api/orders/[id] - Get Order Details
export const GET = withVayvaAPI(
  PERMISSIONS.ORDERS_VIEW,
  async (req: NextRequest, { storeId, params }: HandlerContext) => {
    try {
      const { id } = params;

      const order = await prisma.order.findUnique({
        where: { id, storeId },
        include: {
          items: { include: { productVariant: true } },
          customer: true, // lowercase per schema
          shipment: true,
          paymentTransactions: true,
          orderEvents: { orderBy: { createdAt: 'desc' } }
        }
      });

      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      return NextResponse.json(order);
    } catch (error: any) {
      console.error("[ORDER_GET]", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
);

// PATCH /api/orders/[id] - Update Order Status
export const PATCH = withVayvaAPI(
  PERMISSIONS.ORDERS_MANAGE,
  async (req: NextRequest, { storeId, user, params }: HandlerContext) => {
    try {
      const { id } = params;
      const body = await req.json();
      const { status } = body; // Expecting FulfillmentStatus

      if (!status) {
        return NextResponse.json({ error: "Missing status" }, { status: 400 });
      }

      // Use OrderStateService for transition logic & notifications
      const updatedOrder = await OrderStateService.transition(id, status, user.id, storeId);

      return NextResponse.json({ success: true, order: updatedOrder });
    } catch (error: any) {
      console.error("[ORDER_UPDATE]", error);
      const status = error.message === "Order not found" ? 404 : 500;
      return NextResponse.json({ error: error.message }, { status });
    }
  }
);
