import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@vayva/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const storeId = searchParams.get("storeId");

  if (!storeId) {
    return NextResponse.json({ error: "Store ID required" }, { status: 400 });
  }

  try {
    const activeSale = await prisma.flashSale.findFirst({
      where: {
        storeId,
        isActive: true,
        startTime: { lte: new Date() },
        endTime: { gt: new Date() },
      },
      orderBy: { endTime: "asc" }, // Get the one ending soonest if multiple
    });

    if (!activeSale) {
      return NextResponse.json({});
    }

    return NextResponse.json(activeSale);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
