import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";

export async function GET() {
  try {
    // In a real app, verify admin role here

    const totalStores = await prisma.store.count();
    const verifiedStores = await prisma.store.count({
      where: {
        kycRecord: {
          status: "VERIFIED",
        },
      },
    });

    const kycCoverageFn =
      totalStores > 0 ? (verifiedStores / totalStores) * 100 : 0;

    const highRiskStores = await prisma.riskProfile.count({
      where: {
        status: {
          in: ["HIGH", "CRITICAL"],
        },
      },
    });

    // Calculate AML Risk Level based on high risk stores ratio
    const riskRatio = totalStores > 0 ? highRiskStores / totalStores : 0;
    let amlRiskLevel = "LOW";
    if (riskRatio > 0.05) amlRiskLevel = "MEDIUM";
    if (riskRatio > 0.1) amlRiskLevel = "HIGH";

    // Check for global wallet reconciliation issues (simulation check for now)
    // In real system, this would sum up all wallet balances vs bank float
    const walletReconciliationStatus = "IN_SYNC";

    const disputesCount = await prisma.dispute.count({
      where: { status: "OPENED" },
    });

    return NextResponse.json({
      kycCoverage: Math.round(kycCoverageFn),
      amlRiskLevel,
      walletReconciliationStatus,
      disputeRatio: 0.02, // Placeholder for calculated ratio
      outstandingActions: {
        count: disputesCount + highRiskStores,
        severity: highRiskStores > 0 ? "HIGH" : "MEDIUM",
      },
    });
  } catch (error) {
    console.error("Audit Overview Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch audit overview" },
      { status: 500 },
    );
  }
}
