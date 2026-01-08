import { prisma } from "@vayva/db";
import { logger } from "@/lib/logger";

export interface ExportScope {
  type: "CATALOG" | "ORDERS" | "CONVERSATIONS" | "AI_USAGE" | "SETTINGS";
}

/**
 * Vayva Data Governance Service
 * Handles Export Requests, Deletion, and Privacy Redaction
 */
export class DataGovernanceService {
  /**
   * Initiate a background data export
   */
  static async requestExport(
    storeId: string,
    requestedBy: string,
    scopes: string[],
  ) {
    const request = await prisma.dataExportRequest.create({
      data: {
        storeId,
        requestedBy,
        scopes,
        status: "PENDING",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7-day expiry
      },
    });

    // In a real system, we would enqueue a job here:
    // await QueueService.enqueue('DATA_EXPORT', { requestId: request.id });

    logger.info("Data export requested", { storeId, requestId: request.id });
    return request;
  }

  /**
   * Log a PII-redacted AI trace for audit
   */
  static async logAiTrace(params: {
    storeId: string;
    conversationId?: string;
    requestId?: string;
    model: string;
    toolsUsed: string[];
    retrievedDocs: string[];
    inputSummary: string;
    outputSummary: string;
    guardrailFlags: string[];
    latencyMs?: number;
  }) {
    try {
      await prisma.aiTrace.create({
        data: {
          storeId: params.storeId,
          conversationId: params.conversationId,
          requestId: params.requestId,
          model: params.model,
          toolsUsed: params.toolsUsed,
          retrievedDocs: params.retrievedDocs,
          inputSummary: this.redactPII(params.inputSummary),
          outputSummary: this.redactPII(params.outputSummary),
          guardrailFlags: params.guardrailFlags,
          latencyMs: params.latencyMs,
        },
      });
    } catch (error: any) {
      console.error("[DataGovernance] Failed to log AI trace:", error);
    }
  }

  /**
   * Request full account deletion (Soft-to-Hard transition)
   */
  static async requestDeletion(
    storeId: string,
    requestedBy: string,
    reason?: string,
  ) {
    const request = await prisma.dataDeletionRequest.create({
      data: {
        storeId,
        requestedBy,
        reason,
        status: "PENDING_REVIEW",
        scheduledFor: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default 30-day wait
      },
    });

    // Trigger notification to Ops
    // await NotificationService.notifyOps('DELETION_REQUEST', { storeId, reason });

    return request;
  }

  /**
   * Internal PII Redaction Logic
   * Simple regex-based masking for demo; production would use a dedicated PII detector.
   */
  private static redactPII(text: string): string {
    if (!text) return text;
    return text
      .replace(
        /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
        "[EMAIL_REDACTED]",
      ) // Emails
      .replace(/\+?\d{10,15}/g, "[PHONE_REDACTED]") // Phone numbers
      .replace(/\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g, "[CARD_REDACTED]"); // Card numbers
  }
}
