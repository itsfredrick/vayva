import { NextResponse } from "next/server";
import { MerchantBrainService } from "@/lib/ai/merchant-brain.service";
import { prisma } from "@vayva/db";

/**
 * POST /api/ai/retrieve
 * Body: { storeId, query, limit }
 */
export async function POST(req: Request) {
  try {
    const { storeId, query, limit } = await req.json();

    if (!storeId || !query) {
      return NextResponse.json(
        { error: "Missing storeId or query" },
        { status: 400 },
      );
    }

    const context = await MerchantBrainService.retrieveContext(
      storeId,
      query,
      limit,
    );
    return NextResponse.json({ context });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

/**
 * GET /api/ai/tools/inventory
 * Query: ?storeId=...&productId=...
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const storeId = searchParams.get("storeId");
  const productId = searchParams.get("productId");

  if (!storeId || !productId) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const inventory = await MerchantBrainService.getInventoryStatus(
    storeId,
    productId,
  );
  return NextResponse.json(inventory);
}
