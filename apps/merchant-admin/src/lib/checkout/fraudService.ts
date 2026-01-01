import { prisma } from "@vayva/db";

export class FraudService {
  static async trackSignal(data: {
    storeId: string;
    merchantId: string;
    type: string;
    severity?: string;
    metadata?: any;
    correlationId: string;
  }) {
    await prisma.fraud_signal.create({
      data: {
        storeId: data.storeId,
        merchantId: data.merchantId,
        type: data.type,
        severity: data.severity || "low",
        metadata: data.metadata || {},
        correlationId: data.correlationId,
      },
    });

    if (data.severity === "high") {
      console.warn(
        `[FRAUD] High risk signal: ${data.type} for ${data.storeId}`,
      );
    }
  }
}
