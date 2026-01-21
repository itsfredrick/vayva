
import { requireAuth } from "@/lib/auth/session";
import { PermissionEngine } from "@/lib/core/permission-engine";
import { PermissionKey } from "@/lib/core/permissions";
import { NextResponse, NextRequest } from "next/server";
import { redirect } from "next/navigation";

/**
 * withPermission
 * Higher-order function for API routes.
 * 
 * Usage:
 * export const POST = withPermission("orders:manage", async (req, session) => { ... });
 */
export function withPermission(permission: PermissionKey, handler: Function) {
    return async (req: NextRequest, ...args: any[]) => {
        try {
            const session = await requireAuth();

            const allowed = PermissionEngine.can({
                role: session.user.role,
                isOwner: session.user.role === "owner"
            }, permission);

            if (!allowed) {
                return NextResponse.json(
                    { error: "Forbidden: Insufficient permissions", permission },
                    { status: 403 }
                );
            }

            return await handler(req, session, ...args);
        } catch (error: any) {
            if (error.message === "Unauthorized") {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
            console.error("RBAC Error:", error);
            return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        }
    };
}

/**
 * requirePermission
 * Use this in Server Components.
 */
export async function requirePermission(permission: PermissionKey) {
    const session = await requireAuth();

    const allowed = PermissionEngine.can({
        role: session.user.role,
        isOwner: session.user.role === "owner"
    }, permission);

    if (!allowed) {
        // For pages, we redirect to an access-denied page or dashboard
        redirect("/dashboard?error=access-denied");
    }

    return session;
}
