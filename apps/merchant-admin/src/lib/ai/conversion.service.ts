import { prisma } from "@vayva/db";
import { logger } from "@/lib/logger";

export type PersuasionStrategy =
  | "BENEFIT_FRAME"
  | "SOCIAL_PROOF"
  | "RISK_REDUCTION"
  | "NONE";

export class ConversionService {
  /**
   * Detect objections in buyer text
   */
  static classifyObjection(text: string): string | null {
    const lower = text.toLowerCase();
    if (
      lower.includes("expensive") ||
      lower.includes("price") ||
      lower.includes("cost")
    )
      return "PRICE";
    if (
      lower.includes("delivery") ||
      lower.includes("shipping") ||
      lower.includes("how long")
    )
      return "DELIVERY";
    if (
      lower.includes("real") ||
      lower.includes("fake") ||
      lower.includes("trust")
    )
      return "TRUST";
    return null;
  }

  /**
   * Decision engine to choose if/how to persuade
   */
  static async decidePersuasion(params: {
    storeId: string;
    intent: string;
    sentiment: number;
    confidence: number;
    intensity: number; // 0 (Low) to 2 (High)
  }): Promise<PersuasionStrategy> {
    // 1. Safety Override: Negative sentiment kills persuasion
    if (params.sentiment < -0.3) return "NONE";

    // 2. Intent-based logic
    if (params.intent === "COMPLAINING") return "NONE"; // Should escalate instead
    if (params.intent === "EXIT") return "NONE";

    // 3. Confidence Gate
    if (params.confidence < 0.7) return "NONE";

    // 4. Intensity Mapping
    if (params.intensity === 0) return "NONE"; // Clarification only mode

    if (params.intent === "BROWSING") return "BENEFIT_FRAME";
    if (params.intent === "NEGOTIating") return "RISK_REDUCTION"; // Highlight return policy

    return "BENEFIT_FRAME";
  }

  /**
   * Log a persuasion attempt
   */
  static async logPersuasion(data: {
    storeId: string;
    conversationId: string;
    strategy: PersuasionStrategy;
    evidenceIds: string[];
    confidence: number;
  }) {
    try {
      await (prisma as any).persuasionAttempt.create({
        data: {
          storeId: data.storeId,
          conversationId: data.conversationId,
          strategy: data.strategy,
          evidenceIds: data.evidenceIds,
          confidenceScore: data.confidence,
        },
      });
    } catch (error: any) {
      logger.error("[ConversionService] Failed to log persuasion", error);
    }
  }

  /**
   * Record a conversion event (e.g. checkout started)
   */
  static async recordConversion(data: {
    storeId: string;
    conversationId: string;
    eventType: string;
    valueKobo?: bigint;
  }) {
    try {
      await (prisma as any).conversionEvent.create({
        data: {
          storeId: data.storeId,
          conversationId: data.conversationId,
          eventType: data.eventType,
          valueKobo: data.valueKobo || BigInt(0),
          aiAttributionScore: 1.0, // Simple for now
        },
      });
    } catch (error: any) {
      logger.error("[ConversionService] Failed to record conversion", error);
    }
  }
}
