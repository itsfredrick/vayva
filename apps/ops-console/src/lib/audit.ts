import { prisma } from "@vayva/db";

// Helper to Log Admin Actions
export async function logAdminAction(data: {
  userId: string; // Admin ID
  action: string; // VERIFY_SELLER, UPDATE_IMPORT
  resourceId: string; // Store ID / Import ID
  details: any; // JSON Diff
}) {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: data.userId,
        actorType: "ADMIN", // Ops Console context
        actorLabel: `Admin ${data.userId.slice(0, 8)}`, // Fallback label
        action: data.action,
        entityId: data.resourceId,
        entityType: "STORE", // Defaulting to STORE based on usage context
        afterState: (data.details as any) ?? {},
        correlationId: crypto.randomUUID(), // Ensure uniqueness
      }
    });

  } catch (error: any) {
    console.error("Audit Log Failed:", error);
    // Don't block main action, but log error
  }
}

export const AuditEventType = {
  OPERATION_SLOW: "OPERATION_SLOW",
  // Add others as needed
};

export async function logAuditEvent(
  storeId: string,
  userId: string,
  eventType: string,
  details: any) {
  try {
    await prisma.auditLog.create({
      data: {
        storeId,
        actorId: userId,
        actorType: "SYSTEM", // Or USER depending on context
        actorLabel: `User ${userId.slice(0, 8)}`,
        action: eventType,
        entityType: "PERFORMANCE",
        entityId: "N/A",
        afterState: details as any,
        correlationId: crypto.randomUUID(),
      },
    });
  } catch (error: any) {
    console.error("Audit Event Log Failed:", error);
  }
}
