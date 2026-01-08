import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@vayva/db";
import { CustomerStatus } from "@vayva/shared";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.toLowerCase();
    const session = await requireAuth();
    const storeId = session.user.storeId;

    // Pagination
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 50;
    const skip = (page - 1) * limit;

    const where: any = { storeId };
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        include: {
          orders: {
            select: {
              total: true,
              createdAt: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.customer.count({ where }),
    ]);

    const formattedCustomers = customers.map((c: any) => {
      const totalOrders = c.orders.length;
      const totalSpend = c.orders.reduce(
        (sum: any, order: any) => sum + Number(order.total || 0),
        0,
      );
      const lastOrder = c.orders.sort((a: { createdAt: Date }, b: { createdAt: Date }) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];

      // Determine status based on activity
      let status = CustomerStatus.NEW;
      if (totalOrders > 5 && totalSpend > 100000) status = CustomerStatus.VIP;
      else if (totalOrders > 1) status = CustomerStatus.RETURNING;

      return {
        id: c.id,
        merchantId: c.storeId,
        name: `${c.firstName ?? ""} ${c.lastName ?? ""}`.trim() || "Guest",
        phone: c.phone || "",
        firstSeenAt: c.createdAt.toISOString(),
        lastSeenAt:
          lastOrder?.createdAt.toISOString() || c.createdAt.toISOString(),
        totalOrders,
        totalSpend,
        status, // Using calculated status
        preferredChannel: "whatsapp", // Default or derive from Customer data if available
      };
    });

    return NextResponse.json({
      data: formattedCustomers,
      meta: {
        total,
        page,
        limit,
      },
    });
  } catch (error) {
    console.error("Fetch Customers Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 },
    );
  }
}
