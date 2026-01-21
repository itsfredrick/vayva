
"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { PermissionEngine } from "@/lib/core/permission-engine";
import { PermissionKey } from "@/lib/core/permissions";

interface PermissionGateProps {
    permission?: PermissionKey;
    all?: PermissionKey[];
    any?: PermissionKey[];
    fallback?: React.ReactNode;
    children: React.ReactNode;
}

/**
 * PermissionGate
 * Declarative way to hide UI elements based on permissions.
 * 
 * Usage:
 * <PermissionGate permission="orders:manage">
 *    <Button>Refund Order</Button>
 * </PermissionGate>
 */
export const PermissionGate = ({
    permission,
    all,
    any,
    fallback = null,
    children
}: PermissionGateProps) => {
    const { merchant, user } = useAuth(); // Context might provide 'user' which is the session

    // Normalize user context for the engine
    const activeUser = (user || merchant) as any;
    if (!activeUser) return <>{fallback}</>;

    const userCtx = {
        role: activeUser.role || "viewer",
        isOwner: activeUser.role === "owner"
    };

    let allowed = false;

    if (permission) {
        allowed = PermissionEngine.can(userCtx, permission);
    } else if (all) {
        allowed = PermissionEngine.canAll(userCtx, all);
    } else if (any) {
        allowed = PermissionEngine.canAny(userCtx, any);
    }

    if (!allowed) return <>{fallback}</>;

    return <>{children}</>;
};
