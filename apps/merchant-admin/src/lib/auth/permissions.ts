import { prisma } from "@vayva/db";
export const PERMISSIONS = {
    TEAM_MANAGE: "team.manage",
    REFUNDS_MANAGE: "refunds.manage",
    DELIVERY_MANAGE: "delivery.manage",
    TEMPLATES_MANAGE: "templates.manage",
    CAMPAIGNS_SEND: "campaigns.send",
    POLICIES_PUBLISH: "policies.publish",
    AUDIT_VIEW: "audit.view",
    OPS_VIEW: "ops.view",
    BILLING_MANAGE: "billing.manage",
    ORDERS_MANAGE: "orders.manage",
    PRODUCTS_MANAGE: "products.manage",
    SETTINGS_MANAGE: "settings.manage",
    // Approvals
    APPROVALS_VIEW: "approvals.view",
    APPROVALS_DECIDE: "approvals.decide",
    APPROVALS_REQUEST: "approvals.request",
    // Sensitive Action Gates
    REFUNDS_APPROVE: "refunds.approve",
    CAMPAIGNS_APPROVE: "campaigns.approve",
    POLICIES_APPROVE: "policies.approve",
    DELIVERY_APPROVE: "delivery.approve",
};
export const PERMISSION_GROUPS = [
    {
        name: "General",
        id: "general",
        permissions: [
            { id: PERMISSIONS.TEAM_MANAGE, label: "Manage Staff", description: "Invite and remove staff members" },
            { id: PERMISSIONS.SETTINGS_MANAGE, label: "Manage Settings", description: "Edit store profile and general configurations" },
            { id: PERMISSIONS.AUDIT_VIEW, label: "View Audit Logs", description: "See platform-wide activity logs" }
        ]
    },
    {
        name: "Sales & Orders",
        id: "sales",
        permissions: [
            { id: PERMISSIONS.ORDERS_MANAGE, label: "Manage Orders", description: "View and process customer orders" },
            { id: PERMISSIONS.PRODUCTS_MANAGE, label: "Manage Products", description: "Edit catalog and inventory" }
        ]
    },
    {
        name: "Finance",
        id: "finance",
        permissions: [
            { id: PERMISSIONS.BILLING_MANAGE, label: "Manage Billing", description: "View invoices and pay subscription" },
            { id: PERMISSIONS.REFUNDS_MANAGE, label: "Manage Refunds", description: "Initiate refund requests" },
            { id: PERMISSIONS.REFUNDS_APPROVE, label: "Approve Refunds", description: "SENSITIVE: High-level financial approval" }
        ]
    },
    {
        name: "Operations",
        id: "ops",
        permissions: [
            { id: PERMISSIONS.DELIVERY_MANAGE, label: "Manage Delivery", description: "Organize shipments and logistics" },
            { id: PERMISSIONS.APPROVALS_DECIDE, label: "Decide Approvals", description: "Approve or reject platform-level requests" }
        ]
    }
];
const ROLE_PERMISSIONS = {
    owner: Object.values(PERMISSIONS),
    admin: [
        PERMISSIONS.TEAM_MANAGE,
        PERMISSIONS.TEMPLATES_MANAGE,
        PERMISSIONS.CAMPAIGNS_SEND,
        PERMISSIONS.POLICIES_PUBLISH,
        PERMISSIONS.ORDERS_MANAGE,
        PERMISSIONS.PRODUCTS_MANAGE,
        PERMISSIONS.DELIVERY_MANAGE,
        PERMISSIONS.SETTINGS_MANAGE,
        PERMISSIONS.AUDIT_VIEW,
        // Approvals
        PERMISSIONS.APPROVALS_VIEW,
        PERMISSIONS.APPROVALS_DECIDE,
        PERMISSIONS.CAMPAIGNS_APPROVE,
        PERMISSIONS.POLICIES_APPROVE,
        PERMISSIONS.DELIVERY_APPROVE,
        // Admin usually CANNOT approve refunds? Or logic says YES?
        // Map says Finance approves refunds. Admin controls staff/settings.
        // Let's give Admin Refund Approve too for simplicity on smaller teams?
        // Prompt says: "Admin: approvals.view + decide + policies + delivery + campaigns"
        // Prompt says: "Finance: refunds.approve"
    ],
    finance: [
        PERMISSIONS.REFUNDS_MANAGE,
        PERMISSIONS.BILLING_MANAGE,
        PERMISSIONS.AUDIT_VIEW,
        // Approvals
        PERMISSIONS.APPROVALS_VIEW,
        PERMISSIONS.APPROVALS_DECIDE,
        PERMISSIONS.REFUNDS_APPROVE,
    ],
    support: [
        PERMISSIONS.ORDERS_MANAGE,
        PERMISSIONS.APPROVALS_VIEW, // Can see pending requests if they made them?
        PERMISSIONS.APPROVALS_REQUEST,
    ],
    viewer: [PERMISSIONS.APPROVALS_VIEW],
};
/**
 * Checks if a role has a specific permission.
 */
export function hasRolePermission(role: any, permission: any) {
    if (!role || !ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS])
        return false;
    return ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS].includes(permission);
}
/**
 * Server-side check: verifying if a specific user has permission in a store.
 * Requires fetching the membership role and its associated permissions.
 */
export async function hasPermission(userId: any, storeId: any, permission: any) {
    const membership = await prisma.membership.findUnique({
        where: {
            userId_storeId: {
                userId,
                storeId,
            },
        },
        include: {
            role: {
                include: {
                    rolePermissions: {
                        include: {
                            permission: true
                        }
                    }
                }
            }
        }
    });
    if (!membership)
        return false;
    // 1. Check Custom Role (DB)
    if (membership.role) {
        const hasPerm = membership.role.rolePermissions.some(rp => rp.permission.key === permission);
        if (hasPerm)
            return true;
    }
    // 2. Fallback to System Role (Hardcoded map)
    const role = membership.role_enum.toLowerCase();
    return hasRolePermission(role, permission);
}
export const PLAN_SEAT_LIMITS = {
    STARTER: 1, // Growth/Free
    GROWTH: 1,
    PRO: 5,
    ENTERPRISE: 20,
};
export async function getPlanSeatLimit(storeId: any) {
    const store = await prisma.store.findUnique({
        where: { id: storeId },
        select: { plan: true },
    });
    if (!store)
        return 1;
    // Map schema plan enum to limits. Assuming Schema has SubscriptionPlan enum.
    // We'll trust the keys match or map them safely.
    const plan = store.plan;
    return PLAN_SEAT_LIMITS[plan as keyof typeof PLAN_SEAT_LIMITS] || 1;
}
export async function canInviteMember(storeId: any) {
    const limit = await getPlanSeatLimit(storeId);
    const current = await prisma.membership.count({
        where: {
            storeId,
            status: "active", // Only count active seats? Or all? Usually active.
        },
    });
    // Pending invites also consume seats?
    // Ideally yes to prevent invite spam bypassing limits upon acceptance.
    const pending = await prisma.staffInvite.count({
        where: { storeId },
    });
    const used = current + pending; // Or maybe pending don't count until accepted?
    // "On invite create... block if seats exceeded" implies pending counts.
    return {
        allowed: used < limit,
        limit,
        current: used,
    };
}
