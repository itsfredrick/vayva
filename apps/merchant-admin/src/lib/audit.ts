
import { prisma } from "@/lib/prisma";

export enum AuditEventType {
  SETTINGS_CHANGED = "SETTINGS_CHANGED",
  WITHDRAWAL_REQUESTED = "WITHDRAWAL_REQUESTED",
  USER_INVITED = "USER_INVITED",
  ROLE_UPDATED = "ROLE_UPDATED",
  API_KEY_CREATED = "API_KEY_CREATED",
  WEBHOOK_UPDATED = "WEBHOOK_UPDATED",
  LOGIN_ATTEMPT_FAILED = "LOGIN_ATTEMPT_FAILED",
  SENSITIVE_ACCESS = "SENSITIVE_ACCESS",
  // Legacy mappings
  ORDER_BULK_STATUS_CHANGED = "ORDER_BULK_STATUS_CHANGED",
  ORDER_STATUS_CHANGED = "ORDER_STATUS_CHANGED",
  ORDER_EXPORTED = "ORDER_EXPORTED",
  WITHDRAWAL_BLOCKED_KYC = "WITHDRAWAL_BLOCKED_KYC",
  WITHDRAWAL_STATUS_CHANGED = "WITHDRAWAL_STATUS_CHANGED",
  WITHDRAWAL_EXPORTED = "WITHDRAWAL_EXPORTED",
  SECURITY_RATE_LIMIT_BLOCKED = "SECURITY_RATE_LIMIT_BLOCKED",
  SECURITY_STEP_UP_REQUIRED = "SECURITY_STEP_UP_REQUIRED",
  EXPORT_CREATED = "EXPORT_CREATED",
  EXPORT_DOWNLOADED = "EXPORT_DOWNLOADED",
  SECURITY_SESSION_INVALIDATED = "SECURITY_SESSION_INVALIDATED",
  IDEMPOTENCY_REPLAYED = "IDEMPOTENCY_REPLAYED",
  OPERATION_LOCKED = "OPERATION_LOCKED",
  OPERATION_LOCK_TIMEOUT = "OPERATION_LOCK_TIMEOUT",
  OPERATION_FAILED = "OPERATION_FAILED",
  OPERATION_STUCK = "OPERATION_STUCK",
  OPERATION_SLOW = "OPERATION_SLOW",
  COMPLIANCE_REPORT_CREATED = "COMPLIANCE_REPORT_CREATED",
  COMPLIANCE_REPORT_DOWNLOADED = "COMPLIANCE_REPORT_DOWNLOADED",
  SUDO_SUCCESS = "SUDO_SUCCESS",
  SUDO_FAILED = "SUDO_FAILED",
  TEAM_INVITE_SENT = "TEAM_INVITE_SENT",
  TEAM_ROLE_CHANGED = "TEAM_ROLE_CHANGED",
  TEAM_MEMBER_REMOVED = "TEAM_MEMBER_REMOVED",
  REFUND_PROCESSED = "REFUND_PROCESSED",
  PRODUCT_CREATED = "PRODUCT_CREATED",
  PRODUCT_UPDATED = "PRODUCT_UPDATED",
  DOMAIN_CHANGED = "DOMAIN_CHANGED",
  PAYOUT_SETTING_CHANGED = "PAYOUT_SETTING_CHANGED",
  ACCOUNT_SECURITY_ACTION = "ACCOUNT_SECURITY_ACTION",
}

// Type alias for backward compatibility
export type AuditAction = AuditEventType;

export async function logAuditEvent(
  storeId: string | null,
  userId: string,
  action: AuditEventType | string,
  details: {
    targetType?: string;
    targetId?: string;
    reason?: string;
    before?: unknown;
    after?: unknown;
    keysChanged?: string[];
    meta?: unknown;
    ipAddress?: string;
    userAgent?: string;
  }
) {
  try {
    await prisma.adminAuditLog.create({
      data: {
        storeId,
        actorUserId: userId,
        action: action.toString(),
        targetType: details.targetType,
        targetId: details.targetId,
        reason: details.reason,
        before: details.before ? JSON.parse(JSON.stringify(details.before)) : undefined,
        after: details.after ? JSON.parse(JSON.stringify(details.after)) : undefined,
        ipAddress: details.ipAddress,
        userAgent: details.userAgent,
      },
    });
  } catch (error) {
    console.error("Failed to write audit log:", error);
  }
}

// Helper for diffing
export function computeDiff(oldObj: unknown, newObj: unknown): { before: unknown; after: unknown } {
  const before: unknown = {};
  const after: unknown = {};

  const allKeys = new Set([...Object.keys(oldObj || {}), ...Object.keys(newObj || {})]);

  for (const key of Array.from(allKeys)) {
    const oldVal = oldObj?.[key];
    const newVal = newObj?.[key];
    if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
      before[key] = oldVal;
      after[key] = newVal;
    }
  }

  return { before, after };
}
