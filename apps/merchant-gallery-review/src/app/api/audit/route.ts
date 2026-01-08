import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const storeId = (session.user as any).storeId;
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const type = searchParams.get("type") || "ALL";
    const query = searchParams.get("q") || "";

    const limit = 20;
    const skip = (page - 1) * limit;

    const where: any = { storeId };

    if (type !== "ALL") {
      if (type === "LOGIN") where.action = { startsWith: "LOGIN" };
      if (type === "PAYOUT")
        where.action = {
          in: [
            "WITHDRAWAL_REQUESTED",
            "BANK_ACCOUNT_UPDATED",
            "REFUND_PROCESSED",
          ],
        };
      if (type === "TEAM") where.action = { startsWith: "TEAM" };
      if (type === "SETTINGS")
        where.action = {
          in: ["PROFILE_UPDATED", "PLAN_CHANGED", "SETTINGS_CHANGED"],
        };
    }

    if (query) {
      where.OR = [
        { action: { contains: query, mode: "insensitive" } },
        { actorLabel: { contains: query, mode: "insensitive" } },
        { entityType: { contains: query, mode: "insensitive" } },
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
    console.error("Audit fetch error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
