import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@vayva/db";

export async function GET(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate"); // YYYY-MM-DD
    const endDate = searchParams.get("endDate");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "25");

    const where: any = {
      storeId: user.storeId,
    };

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
      };
    }

    const [withdrawals, total] = await Promise.all([
      prisma.withdrawal.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.withdrawal.count({ where }),
    ]);

    // Convert BigInt to Number for JSON response
    const serialized = withdrawals.map((w: any) => ({
      ...w,
      amountKobo: Number(w.amountKobo),
      feeKobo: Number(w.feeKobo),
      amountNetKobo: Number(w.amountNetKobo),
      // Explicitly include computed fields if needed by UI directly
      amountMajor: Number(w.amountKobo) / 100,
      feeMajor: Number(w.feeKobo) / 100,
      netMajor: Number(w.amountNetKobo) / 100,
    }));

    return NextResponse.json({
      data: serialized,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Fetch withdrawals error:", error);
    return NextResponse.json(
      { error: "Failed to fetch withdrawals" },
      { status: 500 },
    );
  }
}
