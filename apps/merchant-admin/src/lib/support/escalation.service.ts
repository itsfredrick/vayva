import { prisma } from "@vayva/db";
import { logger } from "@/lib/logger";

export type EscalationTrigger =
  | "PAYMENT_DISPUTE"
  | "FRAUD_RISK"
  | "SENTIMENT"
  | "LOW_CONFIDENCE"
  | "MANUAL_REQUEST"
  | "BILLING_ERROR";

export class EscalationService {
  /**
   * Trigger a handoff from AI to Human Support
   */
  static async triggerHandoff(params: {
    storeId: string;
    conversationId: string;
    trigger: EscalationTrigger;
    reason: string;
    aiSummary: string;
    metadata?: any;
  }) {
    try {
      // 1. Create Support Ticket
      const ticket = await (prisma as any).supportTicket.create({
        data: {
          storeId: params.storeId,
          type: this.mapTriggerToType(params.trigger),
          category: this.mapTriggerToCategory(params.trigger),
          status: "OPEN",
          priority: this.mapTriggerToPriority(params.trigger),
          subject: `AI Escalation: ${params.trigger} - ${params.reason.substring(0, 30)}...`,
          summary: params.aiSummary,
          lastMessageAt: new Date(),
          // Optional: Link to conversation if schema allows
          // conversationId: params.conversationId
        },
      });

      // 2. Create Audit Event
      await (prisma as any).handoffEvent.create({
        data: {
          storeId: params.storeId,
          conversationId: params.conversationId,
          ticketId: ticket.id,
          trigger: params.trigger,
          reason: params.reason,
          aiSummary: params.aiSummary,
          metadata: params.metadata || {},
        },
      });

      logger.info("[EscalationService] Handoff triggered", {
        ticketId: ticket.id,
        ...params,
      });
      return ticket;
    } catch (error: any) {
      logger.error("[EscalationService] Failed to trigger handoff", error);
      throw error; // Rethrow so the bot knows it failed
    }
  }

  private static mapTriggerToPriority(trigger: EscalationTrigger): string {
    switch (trigger) {
      case "PAYMENT_DISPUTE":
        return "URGENT";
      case "FRAUD_RISK":
        return "URGENT";
      case "BILLING_ERROR":
        return "HIGH";
      case "SENTIMENT":
        return "HIGH";
      default:
        return "MEDIUM";
    }
  }

  private static mapTriggerToCategory(trigger: EscalationTrigger): string {
    switch (trigger) {
      case "PAYMENT_DISPUTE":
        return "PAYMENT";
      case "FRAUD_RISK":
        return "FRAUD";
      case "BILLING_ERROR":
        return "BILLING";
      case "SENTIMENT":
        return "OTHER";
      default:
        return "GENERAL";
    }
  }

  private static mapTriggerToType(trigger: EscalationTrigger): string {
    switch (trigger) {
      case "BILLING_ERROR":
        return "BILLING";
      case "PAYMENT_DISPUTE":
        return "BILLING";
      default:
        return "GENERAL";
    }
  }
}
