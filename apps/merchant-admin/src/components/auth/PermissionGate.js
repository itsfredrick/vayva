"use client";
import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { useAuth } from "@/context/AuthContext";
import { PermissionEngine } from "@/lib/core/permission-engine";
/**
 * PermissionGate
 * Declarative way to hide UI elements based on permissions.
 *
 * Usage:
 * <PermissionGate permission="orders:manage">
 *    <Button>Refund Order</Button>
 * </PermissionGate>
 */
export const PermissionGate = ({ permission, all, any, fallback = null, children }) => {
    const { merchant, user } = useAuth(); // Context might provide 'user' which is the session
    // Normalize user context for the engine
    const activeUser = (user || merchant);
    if (!activeUser)
        return _jsx(_Fragment, { children: fallback });
    const userCtx = {
        role: activeUser.role || "viewer",
        isOwner: activeUser.role === "owner"
    };
    let allowed = false;
    if (permission) {
        allowed = PermissionEngine.can(userCtx, permission);
    }
    else if (all) {
        allowed = PermissionEngine.canAll(userCtx, all);
    }
    else if (any) {
        allowed = PermissionEngine.canAny(userCtx, any);
    }
    if (!allowed)
        return _jsx(_Fragment, { children: fallback });
    return _jsx(_Fragment, { children: children });
};
