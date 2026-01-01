import { prisma } from "@vayva/db";
import {
  OpsReadiness,
  ReadinessIssue,
  ReadinessLevel,
} from "./readinessContract";

export async function computeMerchantReadiness(
  storeId: string,
): Promise<OpsReadiness> {
  const store = await prisma.store.findUnique({
    where: { id: storeId },
    include: {
      merchantPolicies: true,
      paymentAccounts: true,
    },
  });

  if (!store) throw new Error("Store not found");

  const issues: ReadinessIssue[] = [];

  // 4. Policies
  const requiredPolicies = [
    "terms",
    "privacy",
    "returns",
    "refunds",
    "shipping",
  ];
  const publishedTypes = store.merchantPolicies
    .filter((p) => p.status === "PUBLISHED")
    .map((p) => p.type);
  const missingPolicies = requiredPolicies.filter(
    (t) => !publishedTypes.includes(t as any),
  );

  if (missingPolicies.length > 0) {
    issues.push({
      code: "missing_policies",
      title: "Legal Policies Incomplete",
      description: `Missing: ${missingPolicies.join(", ")}`,
      severity: "blocker",
      fixable: true,
      actionUrl: "/dashboard/control-center/policies",
    });
  }

  // 6. Payments
  const paymentConnected =
    store.paymentAccounts?.some((acc: any) => acc.isActive) ?? false;

  if (!paymentConnected) {
    issues.push({
      code: "payment_disconnected",
      title: "Payments not connected",
      description: "You cannot accept online payments yet.",
      severity: "warning",
      actionUrl: "/dashboard/settings/payments",
    });
  }

  // Summary calculation
  const blockers = issues.filter((i) => i.severity === "blocker");
  const level: ReadinessLevel =
    blockers.length > 0 ? "blocked" : issues.length > 0 ? "warning" : "ready";

  const hasPlan = !!store.plan;

  // Strict verification: if we cannot prove delivery is set up, it's UNKNOWN (false/null)
  const deliveryStatus = false;

  return {
    level,
    issues,
    summary: {
      identity: !!store.slug,
      plan: hasPlan,
      template: !issues.some((i) => i.code === "missing_template"),
      policies: missingPolicies.length === 0,
      delivery: deliveryStatus,
      payments: paymentConnected,
    },
  };
}
