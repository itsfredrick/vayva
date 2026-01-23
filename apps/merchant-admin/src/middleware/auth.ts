import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
/**
 * Authentication middleware for API routes
 * Validates JWT token and attaches user info to request
 */
export async function withAuth(handler: unknown, options: unknown= {}) {
    return async (req: unknown) => {
        try {
            const session = await getSession();
            if (!session && !options.optional) {
                return NextResponse.json({ error: "Unauthorized - Please login" }, { status: 401 });
            }
            // Attach user to request
            const authReq = req;
            if (session) {
                authReq.user = session;
            }
            return handler(authReq);
        }
        catch (error) {
            console.error("Auth middleware error:", error);
            return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
        }
    };
}
/**
 * Helper to extract user from authenticated request
 */
export function getRequestUser(req: unknown) {
    if (!req.user) {
        throw new Error("User not authenticated");
    }
    return req.user;
}
