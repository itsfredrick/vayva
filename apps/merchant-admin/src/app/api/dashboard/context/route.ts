import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@vayva/db";
import { FEATURES } from "@/lib/env-validation";

export async function GET(request: Request) {
  try {
    // Get real session
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - Please login" },
        { status: 401 },
      );
    }

    // Get store details with integrations
    const store: any = await prisma.store.findUnique({
      where: { id: user.storeId },
      include: {
        paymentAccounts: true, // For Payment Status
        waAgentSettings: true, // For WhatsApp Status
      },
    } as any);

    // Get wallet for KYC status
    const wallet = await prisma.wallet.findUnique({
      where: { storeId: user.storeId },
    });

    // Determine Payment Status
    let paymentStatus = "NOT_CONFIGURED";
    if (store?.paymentAccounts?.some((acc: any) => acc.isActive)) {
      paymentStatus = "CONNECTED";
    }

    // Determine WhatsApp Status
    let whatsappStatus = "NOT_CONFIGURED";
    if (FEATURES.WHATSAPP_ENABLED) {
      if (store?.waAgentSettings?.isActive) {
        whatsappStatus = "ACTIVE";
      } else if (store?.waAgentSettings) {
        whatsappStatus = "ATTENTION"; // Exists but inactive
      }
    } else {
      whatsappStatus = "DISABLED"; // Feature flag off
    }

    // Real context data from database
    const data = {
      firstName: user.firstName || "User",
      initials: (user.firstName?.[0] || "U") + (user.lastName?.[0] || ""),
      businessType: store?.category || "UNKNOWN",
      storeStatus: store?.onboardingStatus === "COMPLETE" ? "LIVE" : "DRAFT",
      paymentStatus,
      whatsappStatus,
      kycStatus: wallet?.kycStatus || "NOT_STARTED",
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error("Dashboard Context Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch context" },
      { status: 500 },
    );
  }
}
