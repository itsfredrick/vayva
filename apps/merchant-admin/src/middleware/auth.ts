import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
/**
 * Authentication middleware for API routes
 * Validates JWT token and attaches user info to request
 */
export async function withAuth(handler: any, options: any= {}) {
    return async (req: any) => {
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
        catch (error: any) {
            console.error("Auth middleware error:", error);
            return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
        }
    };
}
/**
 * Helper to extract user from authenticated request
 */
export function getRequestUser(req: any) {
    if (!req.user) {
        throw new Error("User not authenticated");
    }
    return req.user;
}
