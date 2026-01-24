import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function requireAuth() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        throw new Error("Unauthorized");
    }
    // Security Hardening:
    // Verify user actually exists in DB and isn't banned/stale
    // (Prevents JWT persistence after account deletion)
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, isEmailVerified: true } // Add 'isActive' if in schema
    });
    if (!user) {
        throw new Error("Unauthorized - User not found");
    }
    return session;
}
export async function requireStoreAccess(storeId: any) {
    const session = await requireAuth();
    // If storeId provided, verify access
    if (storeId && session.user.storeId !== storeId) {
        throw new Error("Forbidden: Access to this store denied");
    }
    return session;
}
// Helper for wrapping API routes with auth
export function withAuth(handler: any) {
    return async (request: any, context: any) => {
        try {
            const session = await requireAuth();
            return await handler(request, session);
        }
        catch (error: any) {
            if (error.message === "Unauthorized") {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
            if (error.message.startsWith("Forbidden")) {
                return NextResponse.json({ error: "Forbidden" }, { status: 403 });
            }
            return NextResponse.json({ error: "Internal server error" }, { status: 500 });
        }
    };
}
