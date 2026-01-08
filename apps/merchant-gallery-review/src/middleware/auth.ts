import { NextRequest, NextResponse } from "next/server";
import { getSession, SessionPayload } from "@/lib/session";

export interface AuthenticatedRequest extends NextRequest {
  user?: SessionPayload;
}

/**
 * Authentication middleware for API routes
 * Validates JWT token and attaches user info to request
 */
export async function withAuth(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>,
  options: { optional?: boolean } = {},
) {
  return async (req: NextRequest) => {
    try {
      const session = await getSession();

      if (!session && !options.optional) {
        return NextResponse.json(
          { error: "Unauthorized - Please login" },
          { status: 401 },
        );
      }

      // Attach user to request
      const authReq = req as AuthenticatedRequest;
      if (session) {
        authReq.user = session;
      }

      return handler(authReq);
    } catch (error) {
      console.error("Auth middleware error:", error);
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 401 },
      );
    }
  };
}

/**
 * Helper to extract user from authenticated request
 */
export function getRequestUser(req: AuthenticatedRequest): SessionPayload {
  if (!req.user) {
    throw new Error("User not authenticated");
  }
  return req.user;
}
