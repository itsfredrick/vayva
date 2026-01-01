import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@vayva/db";

export async function GET() {
  try {
    const session = await requireAuth();
    const storeId = session.user.storeId;

    // Fetch all relevant account data in parallel for performance
    const [
      store,
      bankAccount,
      security,
      domain,
      recentLogs,
      kyc,
      subscription,
      whatsapp,
    ] = await Promise.all([
      prisma.store.findUnique({
        where: { id: storeId },
        select: {
          name: true,
          slug: true,
          category: true,
          plan: true,
          isLive: true,
          onboardingCompleted: true,
          settings: true,
        },
      }),
      prisma.bankBeneficiary.findFirst({
        where: { storeId, isDefault: true },
      }),
      prisma.securitySetting.findUnique({
        where: { storeId },
      }),
      prisma.domainMapping.findFirst({
        where: { storeId },
      }),
      prisma.auditLog.findMany({
        where: { storeId },
        take: 10,
        orderBy: { createdAt: "desc" },
      }),
      prisma.kycRecord.findUnique({
        where: { storeId },
      }),
      prisma.merchantSubscription.findUnique({
        where: { storeId },
      }),
      prisma.whatsappChannel.findUnique({
        where: { storeId },
      }),
    ]);

    if (!store) {
      return NextResponse.json(
        { error: "Store context not found" },
        { status: 404 },
      );
    }

    const lastAudit = recentLogs[0];
    const storeSettings = (store.settings as any) || {};

    const data = {
      profile: {
        name: store.name || "Unset",
        category: store.category || "General",
        plan: subscription?.planSlug || (store as any).plan || "STARTER",
        isLive: store.isLive || false,
        onboardingCompleted: store.onboardingCompleted || false,
      },
      subscription: {
        plan: subscription?.planSlug || (store as any).plan || "STARTER",
        status: subscription?.status || "ACTIVE",
        renewalDate: subscription?.currentPeriodEnd || null,
        canUpgrade: true,
      },
      kyc: {
        status: kyc?.status || "NOT_STARTED",
        lastAttempt: kyc?.updatedAt || null,
        rejectionReason: null,
        missingDocs: [],
        canWithdraw: kyc?.status === "VERIFIED",
      },
      payouts: {
        bankConnected: !!bankAccount,
        payoutsEnabled: !!bankAccount && kyc?.status === "VERIFIED",
        maskedAccount: bankAccount
          ? `******${bankAccount.accountNumber.slice(-4)}`
          : null,
        bankName: bankAccount?.bankName || null,
      },
      domains: {
        customDomain: domain?.domain || null,
        subdomain: `${store.slug || "store"}.vayva.ng`,
        status: domain?.status || "PENDING",
        sslEnabled: domain?.status === "verified",
      },
      integrations: {
        whatsapp: whatsapp ? "CONNECTED" : "DISCONNECTED",
        payments: storeSettings.paystack?.connected
          ? "CONNECTED"
          : "DISCONNECTED",
        delivery: storeSettings.delivery?.connected
          ? "CONNECTED"
          : "DISCONNECTED",
        lastWebhook: lastAudit?.createdAt
          ? new Date(lastAudit.createdAt).toISOString()
          : new Date().toISOString(),
      },
      security: {
        mfaEnabled: security?.mfaRequired || false,
        recentLogins: recentLogs.filter((l: any) =>
          l.action.toLowerCase().includes("login"),
        ).length,
        apiKeyStatus: storeSettings.api?.active ? "ACTIVE" : "INACTIVE",
      },
      alerts: buildAlerts(store, bankAccount, kyc),
    };

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Account overview fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch account overview" },
      { status: 500 },
    );
  }
}

function buildAlerts(store: any, bankAccount: any, kyc: any) {
  const alerts = [];

  if (!store.onboardingCompleted) {
    alerts.push({
      id: "onboarding",
      severity: "warning",
      message:
        "Onboarding Incomplete. Finish setting up your store to go live.",
      action: ACCOUNT_ROUTES_PLACEHOLDER.ONBOARDING,
    });
  }

  if (!bankAccount) {
    alerts.push({
      id: "payouts",
      severity: "error",
      message: "Payouts Disabled. Add a bank account to receive your earnings.",
      action: "Update Payouts",
    });
  }

  if (!kyc || kyc.status !== "VERIFIED") {
    alerts.push({
      id: "kyc",
      severity: "info",
      message:
        "Identity Verification. Verify your identity to increase withdrawal limits.",
      action: "Verify Now",
    });
  }

  return alerts;
}

const ACCOUNT_ROUTES_PLACEHOLDER = {
  ONBOARDING: "/onboarding/resume",
};
