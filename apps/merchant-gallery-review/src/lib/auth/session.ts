import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function requireAuth() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  return session;
}

export async function requireStoreAccess(storeId?: string) {
  const session = await requireAuth();

  // If storeId provided, verify access
  if (storeId && session.user.storeId !== storeId) {
    throw new Error("Forbidden: Access to this store denied");
  }

  return session;
}

// Helper for wrapping API routes with auth
export function withAuth(
  handler: (request: Request, session: any) => Promise<NextResponse>,
) {
  return async (request: Request, context?: any) => {
    try {
      const session = await requireAuth();
      return await handler(request, session);
    } catch (error: any) {
      if (error.message === "Unauthorized") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      if (error.message.startsWith("Forbidden")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
  };
}
