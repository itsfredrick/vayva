import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@vayva/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({
        plan: "free",
        source: "fallback",
        isAuthenticated: false,
      });
    }

    const user = session.user as any;
    const storeId = user.storeId;

    if (!storeId) {
      return NextResponse.json({
        plan: "free",
        source: "fallback_no_store",
        isAuthenticated: true,
      });
    }

    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      return NextResponse.json({
        plan: "free",
        source: "fallback_store_not_found",
        isAuthenticated: true,
      });
    }

    // Determine Plan
    let dbPlan = "free";
    let source = "store_fallback";

    if (store.plan) {
      dbPlan = (store.plan as string).toLowerCase();
      source = "store_settings";
    }

    // Normalized to BillingPlan (free | growth | pro)
    // Note: DB values might still be 'business' etc if legacy, so we map them safely.
    // We treat legacy 'business/enterprise' as 'pro' for access.

    let normalizedPlan = "free";

    switch (dbPlan) {
      case "free":
        normalizedPlan = "free";
        break;
      case "growth":
        normalizedPlan = "growth";
        break;
      case "pro":
        normalizedPlan = "pro";
        break;
      case "business":
        normalizedPlan = "pro";
        break; // Deprecated -> Pro
      case "enterprise":
        normalizedPlan = "pro";
        break; // Deprecated -> Pro
      default:
        normalizedPlan = "free";
    }

    return NextResponse.json({
      plan: normalizedPlan,
      source,
      isAuthenticated: true,
    });
  } catch (error) {
    console.error("API /me/plan error:", error);
    return NextResponse.json(
      { plan: "free", source: "error", isAuthenticated: false },
      { status: 500 },
    );
  }
}
