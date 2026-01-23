import { requireAuth } from "@/lib/auth/session";
import { PermissionEngine } from "@/lib/core/permission-engine";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
/**
 * withPermission
 * Higher-order function for API routes.
 *
 * Usage:
 * export const POST = withPermission("orders:manage", async (req: unknown, session: unknown) => { ... });
 */
export function withPermission(permission: unknown, handler: unknown) {
    return async (req, ...args) => {
        try {
            const session = await requireAuth();
            const allowed = PermissionEngine.can({
                role: session.user.role,
                isOwner: session.user.role === "owner"
            }, permission);
            if (!allowed) {
                return NextResponse.json({ error: "Forbidden: Insufficient permissions", permission }, { status: 403 });
            }
            return await handler(req, session, ...args);
        }
        catch (error) {
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
export async function requirePermission(permission: unknown) {
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
