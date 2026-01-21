
/**
 * Unified Permission Registry (Vayva 2026 Spec)
 * Logic: Group:Action
 */
export const PERMISSIONS = {
    // Team Management
    TEAM_VIEW: "team:view",
    TEAM_MANAGE: "team:manage",

    // Orders
    ORDERS_VIEW: "orders:view",
    ORDERS_MANAGE: "orders:manage",
    ORDERS_EDIT: "orders:edit",
    ORDERS_DELETE: "orders:delete",

    // Products
    PRODUCTS_VIEW: "products:view",
    PRODUCTS_MANAGE: "products:manage",
    PRODUCTS_EDIT: "products:edit",

    // Finance
    FINANCE_VIEW: "finance:view",
    FINANCE_MANAGE: "finance:manage",
    REFUNDS_APPROVE: "refunds:approve",
    PAYOUTS_MANAGE: "payouts:manage",

    // Settings & Core
    SETTINGS_VIEW: "settings:view",
    SETTINGS_EDIT: "settings:edit",
    INTEGRATIONS_MANAGE: "integrations:manage",
    DOMAINS_MANAGE: "domains:manage",
    KYC_MANAGE: "kyc:manage",

    // Marketing
    MARKETING_VIEW: "marketing:view",
    MARKETING_MANAGE: "marketing:manage",
    CAMPAIGNS_SEND: "campaigns:send",

    // Infrastructure (Ops / Power Users)
    AUDIT_VIEW: "audit:view",
    TEMPLATES_MANAGE: "templates:manage",

    // Customers
    CUSTOMERS_VIEW: "customers:view",
    CUSTOMERS_MANAGE: "customers:manage",

    // Wildcard
    ALL: "*",
} as const;

export type PermissionKey = typeof PERMISSIONS[keyof typeof PERMISSIONS];

/**
 * Standard Role Definitions
 */
export const ROLES = {
    OWNER: "owner",
    ADMIN: "admin",
    FINANCE: "finance",
    SUPPORT: "support",
    STAFF: "staff",
    VIEWER: "viewer",
} as const;

export type RoleKey = typeof ROLES[keyof typeof ROLES];

/**
 * Role to Permission Mapping
 * This is the fallback if DB-based roles are not found.
 */
export const ROLE_PERMISSIONS: Record<RoleKey, string[]> = {
    [ROLES.OWNER]: [PERMISSIONS.ALL],
    [ROLES.ADMIN]: [
        PERMISSIONS.TEAM_MANAGE,
        PERMISSIONS.ORDERS_MANAGE,
        PERMISSIONS.PRODUCTS_MANAGE,
        PERMISSIONS.SETTINGS_EDIT,
        PERMISSIONS.MARKETING_MANAGE,
        PERMISSIONS.CUSTOMERS_VIEW, // Assuming these keys exist or will be added
    ],
    [ROLES.FINANCE]: [
        PERMISSIONS.FINANCE_VIEW,
        PERMISSIONS.FINANCE_MANAGE,
        PERMISSIONS.REFUNDS_APPROVE,
        PERMISSIONS.PAYOUTS_MANAGE,
        PERMISSIONS.AUDIT_VIEW,
    ],
    [ROLES.SUPPORT]: [
        PERMISSIONS.ORDERS_VIEW,
        PERMISSIONS.ORDERS_MANAGE,
        PERMISSIONS.PRODUCTS_VIEW,
        PERMISSIONS.TEAM_VIEW,
    ],
    [ROLES.STAFF]: [
        PERMISSIONS.ORDERS_VIEW,
        PERMISSIONS.PRODUCTS_VIEW,
        PERMISSIONS.MARKETING_VIEW,
    ],
    [ROLES.VIEWER]: [
        "*:view", // If we implement colon-wildcard parsing
    ],
};
