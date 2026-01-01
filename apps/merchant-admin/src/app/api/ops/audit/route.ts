import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { OpsAuthService } from "@/lib/ops-auth";

export async function GET(req: Request) {
  try {
    await OpsAuthService.requireSession(); // Throws 401/403 if not authorized

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const query = searchParams.get("q") || "";

    const limit = 50;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query) {
      where.OR = [
        { action: { contains: query, mode: "insensitive" } },
        { actorLabel: { contains: query, mode: "insensitive" } },
        { storeId: { contains: query, mode: "insensitive" } },
      ];
    }

    const logs = await (prisma as any).auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip,
    });

    return NextResponse.json({ logs });
  } catch (error: any) {
    console.error("Ops Audit fetch error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
