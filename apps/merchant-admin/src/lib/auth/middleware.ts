import { NextResponse } from "next/server";
import { getSessionUser } from "../session";
import { can } from "../team/permissions";

/**
 * Robust RBAC Middleware supporting multiple usage patterns:
 * 1. withRBAC(handler, [permissions]) (Kitchen Style)
 * 2. withRBAC(permission, handler) (Analytics Style)
 */
export function withRBAC(arg1: unknown, arg2?: unknown) {
    let handler: Function;
    let permissions: string[];

    if (typeof arg1 === "function") {
        // Usage: withRBAC(handler, permissions[])
        handler = arg1;
        permissions = Array.isArray(arg2) ? arg2 : arg2 ? [arg2] : [];
    } else {
        // Usage: withRBAC(permission, handler)
        permissions = Array.isArray(arg1) ? arg1 : [arg1];
        handler = arg2;
    }

    return async (req: Request, ...args: unknown[]) => {
        try {
            const user = await getSessionUser();
            if (!user) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }

            // Check permissions
            const hasPermission =
                permissions.length === 0 || permissions.some((p) => can(user.role, p));

            if (!hasPermission) {
                return NextResponse.json(
                    { error: "Forbidden: Insufficient permissions" },
                    { status: 403 }
                );
            }

            const storeId = user.storeId;
            // App Router passes { params } as second arg to route handlers
            const params = args[0]?.params || {};

            // Pattern Detection: 
            // If we called withRBAC(handler, [...]), we likely expect (req, {user, storeId, params})
            // If we called withRBAC(permission, handler), we likely expect (session, req)

            if (typeof arg1 === "function") {
                // Signature: (req, context)
                return await handler(req, { user, storeId, params });
            } else {
                // Signature: (session, req, ...args)
                // session object here matches what AnalyticsService expect (session.user.storeId)
                const session = { ...user, user };
                return await handler(session, req, ...args);
            }
        } catch (error: unknown) {
            console.error("[RBAC Middleware Error]:", error);
            if (error.message === "Unauthorized") {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
            return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        }
    };
}

export function withStoreAuth(handler: Function, permissions: string[] = []) {
    return withRBAC(handler, permissions);
}
