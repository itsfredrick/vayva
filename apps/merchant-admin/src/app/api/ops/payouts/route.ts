import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { OpsAuthService } from "@/lib/ops-auth";

export async function GET(request: Request) {
  const session = await OpsAuthService.getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const merchants = await prisma.store.findMany({
      include: {
        kycRecord: true,
        bankBeneficiaries: { where: { isDefault: true } },
        merchantSubscription: true,
      },
      take: 100,
    });

    const formatted = merchants.map((m: any) => {
      const kycStatus = m.kycRecord?.status || "NOT_STARTED";
      const bankExists = m.bankBeneficiaries.length > 0;
      const reasons = [];

      if (kycStatus !== "VERIFIED") reasons.push("KYC_NOT_VERIFIED");
      if (!bankExists) reasons.push("MISSING_BANK");

      return {
        id: m.id,
        name: m.name,
        plan: m.merchantSubscription?.plan || "FREE",
        kycStatus,
        isReady: reasons.length === 0,
        blockReasons: reasons,
        lastAttempt: null,
      };
    });

    return NextResponse.json(formatted);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
