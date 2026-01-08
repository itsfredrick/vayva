import { prisma } from "@vayva/db";

export enum AuditAction {
  LOGIN_SUCCESS = "LOGIN_SUCCESS",
  LOGIN_FAILED = "LOGIN_FAILED",
  PROFILE_UPDATED = "PROFILE_UPDATED",
  BANK_ACCOUNT_UPDATED = "BANK_ACCOUNT_UPDATED",
  TEMPLATE_CHANGED = "TEMPLATE_CHANGED",
  PLAN_CHANGED = "PLAN_CHANGED",
  KYC_SUBMITTED = "KYC_SUBMITTED",
  KYC_RESULT_RECEIVED = "KYC_RESULT_RECEIVED",
  WEBHOOK_FAILURE_SPIKE = "WEBHOOK_FAILURE_SPIKE",
  REFUND_PROCESSED = "REFUND_PROCESSED",
  ORDER_CANCELLED = "ORDER_CANCELLED",
  TEAM_INVITE_SENT = "TEAM_INVITE_SENT",
  TEAM_MEMBER_REMOVED = "TEAM_MEMBER_REMOVED",
  EXPORT_GENERATED = "EXPORT_GENERATED",
}

export type AuditActor = {
  type: "USER" | "SYSTEM" | "OPS";
  id: string;
  label: string;
};

export async function logAudit(params: {
  storeId?: string;
  actor: AuditActor;
  action: AuditAction | string;
  entity?: { type: string; id: string };
  before?: any;
  after?: any;
  ipAddress?: string;
  userAgent?: string;
  correlationId?: string;
}) {
  try {
    await (prisma as any).auditLog.create({
      data: {
        storeId: params.storeId,
        actorType: params.actor.type,
        actorId: params.actor.id,
        actorLabel: params.actor.label,
        action: params.action,
        entityType: params.entity?.type,
        entityId: params.entity?.id,
        beforeState: params.before,
        afterState: params.after,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
        correlationId: params.correlationId || `req_${Date.now()}`,
      },
    });
  } catch (error: any) {
    console.error("[Audit] Failed to log action:", params.action, error);
  }
}

// Backward compatibility for legacy code
export enum AuditEventType {
  ORDER_BULK_STATUS_CHANGED = "ORDER_BULK_STATUS_CHANGED",
  ORDER_STATUS_CHANGED = "ORDER_STATUS_CHANGED",
  ORDER_EXPORTED = "ORDER_EXPORTED",
  WITHDRAWAL_REQUESTED = "WITHDRAWAL_REQUESTED",
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
  SETTINGS_CHANGED = "SETTINGS_CHANGED",
  REFUND_PROCESSED = "REFUND_PROCESSED",
  PRODUCT_CREATED = "PRODUCT_CREATED",
  PRODUCT_UPDATED = "PRODUCT_UPDATED",
  DOMAIN_CHANGED = "DOMAIN_CHANGED",
  PAYOUT_SETTING_CHANGED = "PAYOUT_SETTING_CHANGED",
  ACCOUNT_SECURITY_ACTION = "ACCOUNT_SECURITY_ACTION",
}

export async function logAuditEvent(
  merchantId: string,
  userId: string,
  type: AuditEventType | string,
  metadata: any = {},
) {
  return logAudit({
    storeId: merchantId,
    actor: { type: "USER", id: userId, label: "Merchant" },
    action: type.toString(),
    after: metadata,
  });
}
