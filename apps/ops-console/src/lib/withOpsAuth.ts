import { NextRequest, NextResponse } from "next/server";
import { OpsAuthService } from "./ops-auth";

/**
 * Ops API Auth Wrapper
 * 
 * This wrapper makes auth enforcement STRUCTURAL - impossible to forget.
 * All Ops API routes MUST use this wrapper unless explicitly whitelisted.
 * 
 * @example
 * ```typescript
 * export const GET = withOpsAuth(async (req, { user, session }) => {
 *   // user and session are guaranteed to exist
 *   return NextResponse.json({ data: "protected" });
 * });
 * ```
 * 
 * @example With role requirement
 * ```typescript
 * export const POST = withOpsAuth(
 *   async (req, { user }) => {
 *     // Only OPS_OWNER can access
 *     return NextResponse.json({ success: true });
 *   },
 *   { requiredRole: "OPS_OWNER" }
 * );
 * ```
 */

export interface OpsAuthContext {
    user: unknown; // OpsUser from Prisma
    session: unknown; // OpsSession from Prisma
}

export interface WithOpsAuthOptions {
    /** Required role level (optional) */
    requiredRole?: "OPS_OWNER" | "SUPERVISOR" | "OPERATOR" | "OPS_SUPPORT";
    /** Skip auth check (ONLY for health/ping endpoints) */
    skipAuth?: boolean;
}

type OpsRouteHandler = (
    req: NextRequest,
    context: OpsAuthContext
) => Promise<NextResponse> | NextResponse;

/**
 * Wraps an Ops API route handler with authentication
 */
export function withOpsAuth(
    handler: OpsRouteHandler,
    options: WithOpsAuthOptions = {}
): (req: NextRequest) => Promise<NextResponse> {
    return async (req: NextRequest) => {
        try {
            // Skip auth for whitelisted endpoints
            if (options.skipAuth) {
                // Still provide empty context for type safety
                return handler(req, { user: null, session: null } as unknown);
            }

            // Require session
            const authContext = await OpsAuthService.requireSession();

            // Check role if specified
            if (options.requiredRole) {
                OpsAuthService.requireRole(authContext.user, options.requiredRole);
            }

            // Call handler with authenticated context
            return handler(req, authContext);
        } catch (error: unknown) {
            // Handle auth errors
            if (error.message === "Unauthorized" || error.message.includes("Insufficient permissions")) {
                return NextResponse.json(
                    { error: error.message },
                    { status: 401 }
                );
            }

            // Re-throw other errors to be handled by route
            throw error;
        }
    };
}

/**
 * Validation helper to ensure all Ops routes use withOpsAuth
 * This can be run in CI to catch missing auth
 */
export function validateOpsRouteAuth(routePath: string, handler: unknown): boolean {
    // Check if handler is wrapped by withOpsAuth
    // This is a simple check - in production you'd use AST analysis
    const handlerString = handler.toString();
    return handlerString.includes("withOpsAuth") || handlerString.includes("requireSession");
}
