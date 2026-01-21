import { prisma } from "@vayva/db";
import { logger } from "@/lib/logger";
export class EscalationService {
    /**
     * Trigger a handoff from AI to Human Support
     */
    static async triggerHandoff(params) {
        try {
            // 1. Create Support Ticket
            const ticket = await prisma.supportTicket.create({
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
            await prisma.handoffEvent.create({
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
        }
        catch (error) {
            logger.error("[EscalationService] Failed to trigger handoff", error);
            throw error; // Rethrow so the bot knows it failed
        }
    }
    static mapTriggerToPriority(trigger) {
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
    static mapTriggerToCategory(trigger) {
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
    static mapTriggerToType(trigger) {
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
