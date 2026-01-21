import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withVayvaAPI, HandlerContext } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";

export const GET = withVayvaAPI(
  PERMISSIONS.COMMERCE_VIEW,
  async (request: NextRequest, { storeId }: HandlerContext) => {
    try {
      const { searchParams } = new URL(request.url);
      const limit = parseInt(searchParams.get("limit") || "50");

      const customers = await prisma.customer.findMany({
        where: { storeId },
        orderBy: { updatedAt: "desc" },
        take: limit,
        include: {
          _count: {
            select: { orders: true }
          }
        }
      });

      const transformed = customers.map((c: any) => ({
        id: c.id,
        merchantId: c.storeId,
        name: `${c.firstName || ""} ${c.lastName || ""}`.trim() || "Unknown",
        phone: c.phone || "",
        email: c.email || "",
        firstSeenAt: c.createdAt?.toISOString(),
        lastSeenAt: c.updatedAt?.toISOString(),
        totalOrders: c._count.orders || 0,
        totalSpend: 0, // Not tracked on Customer model yet
        status: (c._count.orders || 0) > 0 ? "RETURNING" : "NEW",
        preferredChannel: "website"
      }));

      return NextResponse.json(transformed);
    } catch (error) {
      console.error("Fetch Customers Error:", error);
      return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
    }
  }
);
