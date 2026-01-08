import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { MerchantBrainService } from "@/lib/ai/merchant-brain.service";

/**
 * Trigger re-indexing of store catalog for AI
 */
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const storeId = session.user.storeId;

    if (!storeId) {
      return NextResponse.json(
        { error: "No store associated with this account" },
        { status: 400 },
      );
    }

    const result = await MerchantBrainService.indexStoreCatalog(storeId);

    return NextResponse.json({
      success: true,
      message: `Successfully indexed ${result.count} products.`,
      data: result,
    });
  } catch (error) {
    console.error("[AI Index API] Error:", error);
    return NextResponse.json(
      {
        error: "Failed to index store catalog",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
