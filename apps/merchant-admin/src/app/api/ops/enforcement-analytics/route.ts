import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { withVayvaAPI } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";

/**
 * GET /api/ops/enforcement-analytics
 * Fetch enforcement statistics for ops dashboard
 */
export const GET = withVayvaAPI(PERMISSIONS.OPS_VIEW, async (req) => {
  try {
    const stores = await prisma.store.findMany({
      select: {
        id: true,
        settings: true,
      },
    });

    let totalStores = stores.length;
    let restrictedStores = 0;
    let totalWarnings = 0;
    let totalAppeals = 0;
    let resolvedAppeals = 0;

    const restrictionBreakdown = {
      ordersDisabled: 0,
      productsDisabled: 0,
      marketingDisabled: 0,
      settingsEditsDisabled: 0,
      salesDisabled: 0,
      paymentsDisabled: 0,
      uploadsDisabled: 0,
      aiDisabled: 0,
    };

    for (const store of stores) {
      const settings = (store.settings as any) || {};
      const restrictions = settings.restrictions || {};
      const warnings = Array.isArray(settings.warnings) ? settings.warnings : [];
      const appeals = Array.isArray(settings.appeals) ? settings.appeals : [];

      // Count restrictions
      const hasRestrictions = Object.values(restrictions).some(disabled => disabled === true);
      if (hasRestrictions) {
        restrictedStores++;
      }

      // Count by type
      if (restrictions.ordersDisabled) restrictionBreakdown.ordersDisabled++;
      if (restrictions.productsDisabled) restrictionBreakdown.productsDisabled++;
      if (restrictions.marketingDisabled) restrictionBreakdown.marketingDisabled++;
      if (restrictions.settingsEditsDisabled) restrictionBreakdown.settingsEditsDisabled++;
      if (restrictions.salesDisabled) restrictionBreakdown.salesDisabled++;
      if (restrictions.paymentsDisabled) restrictionBreakdown.paymentsDisabled++;
      if (restrictions.uploadsDisabled) restrictionBreakdown.uploadsDisabled++;
      if (restrictions.aiDisabled) restrictionBreakdown.aiDisabled++;

      // Count warnings and appeals
      totalWarnings += warnings.length;
      totalAppeals += appeals.length;
      resolvedAppeals += appeals.filter((a: any) => a.status === "RESOLVED").length;
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalStores,
        restrictedStores,
        totalWarnings,
        totalAppeals,
        resolvedAppeals,
        restrictionBreakdown,
      },
    });
  } catch (error: any) {
    console.error("Enforcement analytics error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
});
