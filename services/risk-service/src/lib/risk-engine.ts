import { prisma } from "@vayva/db";
import {
  RiskScope,
  RiskSeverity,
  RiskStatus,
  EnforcementActionType,
  Prisma,
} from "@prisma/client";

export class RiskEngine {
  // Ingest a signal and evaluate side effects
  async ingestSignal(data: {
    merchantId: string;
    scope: RiskScope;
    scopeId?: string;
    key: string;
    severity: RiskSeverity;
    metadata?: any;
  }) {
    const scoreDelta = this.getScoreDelta(data.severity);

    // 1. Store Signal
    const signal = await prisma.riskSignal.create({
      data: {
        merchantId: data.merchantId,
        scope: data.scope,
        scopeId: data.scopeId,
        key: data.key,
        severity: data.severity,
        scoreDelta: scoreDelta,
        metadata: data.metadata || {},
      },
    });

    // 2. Update Risk Profile (Merchant or Customer)
    if (data.scope === "MERCHANT") {
      await this.updateMerchantRisk(data.merchantId, scoreDelta);
    } else if (data.scope === "CUSTOMER" && data.scopeId) {
      await this.updateCustomerRisk(data.merchantId, data.scopeId, scoreDelta);
    }

    // 3. Evaluate Rules (Async to avoid blocking)
    // In production, this might be offloaded to a queue
    await this.evaluateRules(data.merchantId);

    return signal;
  }

  private getScoreDelta(severity: RiskSeverity): number {
    switch (severity) {
      case "HIGH":
        return 50;
      case "MEDIUM":
        return 20;
      case "LOW":
        return 5;
      default:
        return 0;
    }
  }

  private async updateMerchantRisk(merchantId: string, delta: number) {
    // Upsert profile
    const profile = await prisma.riskProfile.upsert({
      where: { merchantId },
      update: {
        merchantRiskScore: { increment: delta },
        lastEvaluatedAt: new Date(),
      },
      create: {
        merchantId,
        merchantRiskScore: delta,
        lastEvaluatedAt: new Date(),
      },
    });

    // Simple threshold check for Status
    if (
      profile.merchantRiskScore > 100 &&
      profile.status !== ("RESTRICTED" as any) &&
      profile.status !== ("SUSPENDED" as any)
    ) {
      await prisma.riskProfile.update({
        where: { merchantId },
        data: { status: "RESTRICTED" as any },
      });
      // Auto-enforce
      await this.createEnforcement(
        merchantId,
        "REQUIRE_MANUAL_APPROVAL",
        "MERCHANT",
        null,
        "Risk score exceeded 100",
      );
    }
  }

  private async updateCustomerRisk(
    merchantId: string,
    customerId: string,
    delta: number,
  ) {
    await prisma.customerRiskProfile.upsert({
      where: { merchantId_customerId: { merchantId, customerId } },
      update: { riskScore: { increment: delta } },
      create: { merchantId, customerId, riskScore: delta },
    });
  }

  private async createEnforcement(
    merchantId: string,
    action: EnforcementActionType,
    scope: any,
    scopeId: string | null,
    reason: string,
  ) {
    // Check if active enforcement exists
    // Note: Logic simplification, real world would check expiry
    const active = await prisma.enforcementAction.findFirst({
      where: {
        merchantId,
        action,
        scope, // Prisma enum match
        scopeId,
      },
    });

    if (!active) {
      await prisma.enforcementAction.create({
        data: {
          merchantId,
          action,
          scope,
          scopeId,
          reason,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days default
        },
      });
    }
  }

  private async evaluateRules(merchantId: string) {
    // Placeholder for complex rule logic (e.g. velocity checks provided by User)
    // Example: Check COD failure rate
    // In a real system, this would query aggregations
  }
}

export const riskEngine = new RiskEngine();
