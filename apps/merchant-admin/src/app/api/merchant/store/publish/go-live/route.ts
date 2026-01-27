import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withVayvaAPI } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";

function computeReadiness(input: {
  store: any;
  hasStorefrontPublished: boolean;
  policies: Array<{ type: string; status: string }>;
}) {
  const issues: Array<{ code: string; title: string; severity: "blocker" | "warning"; actionUrl?: string }> = [];

  if (!input.store?.isActive) {
    issues.push({
      code: "STORE_SUSPENDED",
      title: "Store is suspended",
      severity: "blocker",
    });
  }

  if (!input.store?.onboardingCompleted) {
    issues.push({
      code: "ONBOARDING_INCOMPLETE",
      title: "Complete onboarding",
      severity: "blocker",
      actionUrl: "/onboarding",
    });
  }

  if (!input.hasStorefrontPublished) {
    issues.push({
      code: "STOREFRONT_NOT_PUBLISHED",
      title: "Publish your storefront",
      severity: "blocker",
      actionUrl: "/dashboard/control-center",
    });
  }

  const requiredPolicyTypes = ["TERMS", "PRIVACY", "RETURNS", "REFUNDS", "SHIPPING_DELIVERY"];
  const policyStatusByType = new Map(input.policies.map((p) => [p.type, p.status]));
  const missingOrUnpublished = requiredPolicyTypes.filter((t) => policyStatusByType.get(t) !== "PUBLISHED");

  if (missingOrUnpublished.length > 0) {
    issues.push({
      code: "POLICIES_NOT_PUBLISHED",
      title: "Publish required store policies",
      severity: "blocker",
      actionUrl: "/dashboard/settings/store-policies",
    });
  }

  const blockers = issues.filter((i) => i.severity === "blocker");

  return {
    level: blockers.length === 0 ? "ready" : "blocked",
    issues,
  };
}

export const POST = withVayvaAPI(PERMISSIONS.SETTINGS_EDIT, async (_req, { storeId }) => {
  const store = await prisma.store.findUnique({
    where: { id: storeId },
    select: { id: true, isLive: true, isActive: true, onboardingCompleted: true },
  });

  if (!store) {
    return NextResponse.json({ error: "Store not found" }, { status: 404 });
  }

  const [storefrontPublished, policies] = await Promise.all([
    prisma.storefrontPublished.findUnique({ where: { storeId } }),
    prisma.merchantPolicy.findMany({
      where: { storeId },
      select: { type: true, status: true },
    }),
  ]);

  const readiness = computeReadiness({
    store,
    hasStorefrontPublished: Boolean(storefrontPublished),
    policies: policies.map((p: any) => ({ type: String(p.type), status: String(p.status) })),
  });

  if (readiness.level !== "ready") {
    return NextResponse.json({
      message: "Store is not ready to go live",
      readiness,
    }, { status: 409 });
  }

  await prisma.store.update({
    where: { id: storeId },
    data: { isLive: true },
  });

  return NextResponse.json({ success: true });
});
