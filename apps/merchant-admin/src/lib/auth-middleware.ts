import { NextResponse } from "next/server";
import { getSessionUser } from "./session";

/**
 * Authentication middleware for API routes
 * Use this to protect routes that require authentication
 */
export async function requireAuth() {
  const user = await getSessionUser();

  if (!user) {
    return {
      error: NextResponse.json(
        { error: "Unauthorized - Please login" },
        { status: 401 },
      ),
      user: null,
    };
  }

  return { error: null, user };
}

/**
 * Check if user has specific role
 */
export function requireRole(user: any, allowedRoles: string[]) {
  if (!user.role || !allowedRoles.includes(user.role)) {
    return NextResponse.json(
      { error: "Forbidden - Insufficient permissions" },
      { status: 403 },
    );
  }
  return null;
}

/**
 * Wrapper for API routes that require authentication
 */
export function withAuth(
  handler: (request: Request, user: any) => Promise<NextResponse>,
) {
  return async (request: Request) => {
    const { error, user } = await requireAuth();
    if (error) return error;
    return handler(request, user);
  };
}
