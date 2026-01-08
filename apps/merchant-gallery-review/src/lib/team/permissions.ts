export const PERMISSIONS = {
  TEAM_MANAGE: "team:manage",
  REFUNDS_MANAGE: "refunds:manage",
  SETTINGS_VIEW: "settings:view",
  PAYOUTS_MANAGE: "payouts:manage",
  DOMAINS_MANAGE: "domains:manage",
  INTEGRATIONS_MANAGE: "integrations:manage",
  TEMPLATES_MANAGE: "templates:manage",
  KYC_MANAGE: "kyc:manage",
  BILLING_MANAGE: "billing:manage",
  COMMERCE_MANAGE: "commerce:manage",
  COMMERCE_VIEW: "commerce:view",
  VIEWER: "viewer",
  METRICS_VIEW: "metrics:view",
};

export const ROLES = {
  OWNER: "owner",
  ADMIN: "admin",
  STAFF: "staff",
  FINANCE: "finance",
  SUPPORT: "support",
  VIEWER: "viewer",
};

const ROLE_PERMISSIONS: Record<string, string[]> = {
  [ROLES.OWNER]: ["*"], // wildcard
  [ROLES.ADMIN]: [
    PERMISSIONS.TEAM_MANAGE,
    PERMISSIONS.REFUNDS_MANAGE,
    PERMISSIONS.SETTINGS_VIEW,
    PERMISSIONS.PAYOUTS_MANAGE,
    PERMISSIONS.DOMAINS_MANAGE,
    PERMISSIONS.INTEGRATIONS_MANAGE,
    PERMISSIONS.TEMPLATES_MANAGE,
    PERMISSIONS.KYC_MANAGE,
    PERMISSIONS.BILLING_MANAGE,
    PERMISSIONS.COMMERCE_MANAGE,
    PERMISSIONS.COMMERCE_VIEW,
    PERMISSIONS.METRICS_VIEW,
  ],
  [ROLES.STAFF]: [
    PERMISSIONS.SETTINGS_VIEW,
    PERMISSIONS.REFUNDS_MANAGE,
    PERMISSIONS.COMMERCE_MANAGE,
    PERMISSIONS.COMMERCE_VIEW,
  ],
  [ROLES.FINANCE]: [
    PERMISSIONS.REFUNDS_MANAGE,
    PERMISSIONS.SETTINGS_VIEW,
    PERMISSIONS.PAYOUTS_MANAGE,
    PERMISSIONS.COMMERCE_VIEW,
  ],
  [ROLES.SUPPORT]: [
    PERMISSIONS.SETTINGS_VIEW,
    PERMISSIONS.REFUNDS_MANAGE,
    PERMISSIONS.COMMERCE_VIEW,
  ],
  [ROLES.VIEWER]: [PERMISSIONS.VIEWER],
};

export function can(role: string, action: string): boolean {
  const perms = ROLE_PERMISSIONS[role] || [];
  if (perms.includes("*")) return true;
  return perms.includes(action);
}
