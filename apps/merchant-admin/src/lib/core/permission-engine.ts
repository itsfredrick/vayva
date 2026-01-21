
import { ROLE_PERMISSIONS, ROLES, PermissionKey } from "./permissions";

export interface UserContext {
    role: string;
    isOwner?: boolean;
    plan?: string;
    kycStatus?: string;
}

/**
 * Unified Permission Engine
 * Supports:
 * 1. Role-based permissions (is the role allowed?)
 * 2. Wildcards (e.g. *)
 * 3. Future: Plan-based gating and KYC gating
 */
export class PermissionEngine {
    /**
     * Core check logic
     */
    static can(user: UserContext, permission: PermissionKey): boolean {
        // 1. Owners have all permissions
        if (user.isOwner || user.role === ROLES.OWNER) return true;

        const allowedPermissions = ROLE_PERMISSIONS[user.role as keyof typeof ROLE_PERMISSIONS] || [];

        // 2. Check for global wildcard
        if (allowedPermissions.includes("*")) return true;

        // 3. Exact match
        if (allowedPermissions.includes(permission)) return true;

        // 4. Group wildcard (e.g. commerce:* or orders:*)
        const group = permission.split(':')[0];
        if (allowedPermissions.includes(`${group}:*`)) return true;

        return false;
    }

    /**
     * Check multiple permissions (must have all)
     */
    static canAll(user: UserContext, permissions: PermissionKey[]): boolean {
        return permissions.every(p => this.can(user, p));
    }

    /**
     * Check multiple permissions (must have any)
     */
    static canAny(user: UserContext, permissions: PermissionKey[]): boolean {
        return permissions.some(p => this.can(user, p));
    }
}
