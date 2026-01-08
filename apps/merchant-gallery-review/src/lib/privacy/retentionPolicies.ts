export const RETENTION_POLICIES = {
  WEBHOOK_PAYLOAD_DAYS: 30,
  JOB_LOG_DAYS: 30,
  SUPPORT_ATTACHMENT_DAYS: 180,
  MESSAGE_BODY_DAYS: 180,
};

export function shouldPurge(createdAt: Date, policyDays: number): boolean {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - policyDays);
  return createdAt < cutoff;
}
