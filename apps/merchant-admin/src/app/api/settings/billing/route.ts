import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await requireAuth();
    const storeId = session.user.storeId;

    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });

    const subscription = await prisma.merchantAiSubscription.findFirst({
      where: { storeId },
      orderBy: { updatedAt: "desc" },
    });

    // Real Invoices (Charges)
    const charges = await prisma.charge.findMany({
      where: { storeId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    const invoices = charges.map(c => ({
      id: c.id,
      amount: `₦${Number(c.amount).toLocaleString()}`,
      date: c.createdAt.toISOString(),
      status: c.status,
      plan: "CHARGE", // Or derive from metadata
    }));

    // Real Usage Metrics
    const productsCount = await prisma.product.count({ where: { storeId } });
    const ordersCount = await prisma.order.count({ where: { storeId } });

    return NextResponse.json({
      plan: store?.plan || "FREE",
      status: subscription?.status || "ACTIVE",
      renewalDate: subscription?.periodEnd || null,
      usage: {
        products: productsCount,
        orders: ordersCount,
        storage: "120MB", // Placeholder (Storage calc is expensive)
      },
      invoices,
    });
  } catch (error: any) {
    console.error("Billing fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch billing info" },
      { status: 500 },
    );
  }
}
