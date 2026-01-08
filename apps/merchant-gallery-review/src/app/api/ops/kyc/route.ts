import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { OpsAuthService } from "@/lib/ops-auth";

export async function GET(request: Request) {
  const session = await OpsAuthService.getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "PENDING";

  try {
    const records = await prisma.kycRecord.findMany({
      where: { status: status as any },
      include: {
        store: {
          include: {
            merchantSubscription: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    const formatted = records.map((r: any) => {
      const auditData = (r.audit as any[]) || [];
      const latestAttempt =
        auditData.length > 0 ? auditData[auditData.length - 1] : {};

      return {
        id: r.id,
        storeId: r.storeId,
        storeName: (r.store as any).name,
        ownerName: latestAttempt.firstName
          ? `${latestAttempt.firstName} ${latestAttempt.lastName}`
          : "Merchant",
        method: latestAttempt.method || "Unknown",
        provider: latestAttempt.provider || "Internal",
        status: r.status,
        attemptTime: r.createdAt,
        plan: (r.store as any).merchantSubscription?.plan || "FREE",
      };
    });

    return NextResponse.json(formatted);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
