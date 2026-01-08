import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const disputes = await prisma.dispute.findMany({
      where: status ? { status: status as any } : undefined,
      include: {
        store: { select: { name: true } },
        order: { select: { id: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    const formattedDisputes = disputes.map((d: any) => ({
      id: d.id,
      merchant: d.store.name,
      amount: d.amount,
      currency: d.currency,
      status: d.status,
      reason: d.reasonCode || "N/A",
      created: d.createdAt,
      deadline: d.evidenceDueAt,
      orderId: d.order?.id,
    }));

    return NextResponse.json({ disputes: formattedDisputes });
  } catch (error) {
    console.error("Audit Disputes Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch disputes" },
      { status: 500 },
    );
  }
}
