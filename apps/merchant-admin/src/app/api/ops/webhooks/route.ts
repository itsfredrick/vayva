import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { OpsAuthService } from "@/lib/ops-auth";

export async function GET(request: Request) {
  const session = await OpsAuthService.getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const provider = searchParams.get("provider");
  const status = searchParams.get("status");

  try {
    const events = await prisma.webhookEvent.findMany({
      where: {
        provider: provider || undefined,
        status: status || undefined,
      },
      include: {
        store: true,
      },
      orderBy: { receivedAt: "desc" },
      take: 50,
    });

    const formatted = events.map((e) => ({
      id: e.id,
      provider: e.provider,
      storeId: e.merchantId,
      storeName: e.store?.name || "Unknown",
      eventType: e.eventType,
      status: e.status === "received" ? "200" : "500", // Mapping to status code for UI
      originalStatus: e.status,
      receivedAt: e.receivedAt,
      // Redact payload (very basic version)
      payload: JSON.stringify(e.payload).substring(0, 100) + "...",
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
