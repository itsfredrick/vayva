import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

import { getSessionUser } from "@/lib/session";

export async function GET(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user?.storeId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const count = parseInt(searchParams.get("limit") || "100");

    // Using AuditLog model which we consolidated on
    const logs = await prisma.auditLog.findMany({
      where: {
        storeId: user.storeId,
        ...(type ? { action: { contains: type } } : {})
      },
      orderBy: { createdAt: "desc" },
      take: count,
    });

    return NextResponse.json({ logs });
  } catch (error) {
    console.error("Audit Logs Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch audit logs" },
      { status: 500 },
    );
  }
}
