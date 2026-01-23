import { prisma } from "@/lib/prisma";
export var AuditEventType;
(function (AuditEventType) {
    AuditEventType["SETTINGS_CHANGED"] = "SETTINGS_CHANGED";
    AuditEventType["WITHDRAWAL_REQUESTED"] = "WITHDRAWAL_REQUESTED";
    AuditEventType["USER_INVITED"] = "USER_INVITED";
    AuditEventType["ROLE_UPDATED"] = "ROLE_UPDATED";
    AuditEventType["API_KEY_CREATED"] = "API_KEY_CREATED";
    AuditEventType["WEBHOOK_UPDATED"] = "WEBHOOK_UPDATED";
    AuditEventType["LOGIN_ATTEMPT_FAILED"] = "LOGIN_ATTEMPT_FAILED";
    AuditEventType["SENSITIVE_ACCESS"] = "SENSITIVE_ACCESS";
    // Legacy mappings
    AuditEventType["ORDER_BULK_STATUS_CHANGED"] = "ORDER_BULK_STATUS_CHANGED";
    AuditEventType["ORDER_STATUS_CHANGED"] = "ORDER_STATUS_CHANGED";
    AuditEventType["ORDER_EXPORTED"] = "ORDER_EXPORTED";
    AuditEventType["WITHDRAWAL_BLOCKED_KYC"] = "WITHDRAWAL_BLOCKED_KYC";
    AuditEventType["WITHDRAWAL_STATUS_CHANGED"] = "WITHDRAWAL_STATUS_CHANGED";
    AuditEventType["WITHDRAWAL_EXPORTED"] = "WITHDRAWAL_EXPORTED";
    AuditEventType["SECURITY_RATE_LIMIT_BLOCKED"] = "SECURITY_RATE_LIMIT_BLOCKED";
    AuditEventType["SECURITY_STEP_UP_REQUIRED"] = "SECURITY_STEP_UP_REQUIRED";
    AuditEventType["EXPORT_CREATED"] = "EXPORT_CREATED";
    AuditEventType["EXPORT_DOWNLOADED"] = "EXPORT_DOWNLOADED";
    AuditEventType["SECURITY_SESSION_INVALIDATED"] = "SECURITY_SESSION_INVALIDATED";
    AuditEventType["IDEMPOTENCY_REPLAYED"] = "IDEMPOTENCY_REPLAYED";
    AuditEventType["OPERATION_LOCKED"] = "OPERATION_LOCKED";
    AuditEventType["OPERATION_LOCK_TIMEOUT"] = "OPERATION_LOCK_TIMEOUT";
    AuditEventType["OPERATION_FAILED"] = "OPERATION_FAILED";
    AuditEventType["OPERATION_STUCK"] = "OPERATION_STUCK";
    AuditEventType["OPERATION_SLOW"] = "OPERATION_SLOW";
    AuditEventType["COMPLIANCE_REPORT_CREATED"] = "COMPLIANCE_REPORT_CREATED";
    AuditEventType["COMPLIANCE_REPORT_DOWNLOADED"] = "COMPLIANCE_REPORT_DOWNLOADED";
    AuditEventType["SUDO_SUCCESS"] = "SUDO_SUCCESS";
    AuditEventType["SUDO_FAILED"] = "SUDO_FAILED";
    AuditEventType["TEAM_INVITE_SENT"] = "TEAM_INVITE_SENT";
    AuditEventType["TEAM_ROLE_CHANGED"] = "TEAM_ROLE_CHANGED";
    AuditEventType["TEAM_MEMBER_REMOVED"] = "TEAM_MEMBER_REMOVED";
    AuditEventType["REFUND_PROCESSED"] = "REFUND_PROCESSED";
    AuditEventType["PRODUCT_CREATED"] = "PRODUCT_CREATED";
    AuditEventType["PRODUCT_UPDATED"] = "PRODUCT_UPDATED";
    AuditEventType["DOMAIN_CHANGED"] = "DOMAIN_CHANGED";
    AuditEventType["PAYOUT_SETTING_CHANGED"] = "PAYOUT_SETTING_CHANGED";
    AuditEventType["ACCOUNT_SECURITY_ACTION"] = "ACCOUNT_SECURITY_ACTION";
})(AuditEventType || (AuditEventType = {}));
export async function logAuditEvent(storeId: any, userId: any, action: any, details: any) {
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
    }
    catch (error) {
        console.error("Failed to write audit log:", error);
    }
}
// Helper for diffing
export function computeDiff(oldObj: any, newObj: any) {
    const before = {};
    const after = {};
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
