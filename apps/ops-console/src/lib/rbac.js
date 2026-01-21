import { OpsAuthService } from "@/lib/ops-auth";
import { NextResponse } from "next/server";
/**
 * Middleware/Higher-Order Function for Ops Console API Routes.
 * Enforces session requirement and optional role-based access control.
 *
 * @param requiredRole Minimum role required for this route
 * @param handler The API handler function
 */
export function withOpsRBAC(requiredRole, handler) {
    return async (request, ...args) => {
        try {
            const session = await OpsAuthService.requireSession();
            // Enforce role hierarchy
            OpsAuthService.requireRole(session.user, requiredRole);
            return await handler(session, request, ...args);
        }
        catch (error) {
            console.error("[OpsRBAC Error]:", error.message);
            if (error.message.includes("Unauthorized")) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
            if (error.message.includes("Insufficient permissions")) {
                return NextResponse.json({ error: error.message }, { status: 403 });
            }
            return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        }
    };
}
