
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";

export type AuthVerificationResult =
    | { success: true; session: any; store?: any }
    | { success: false; response: NextResponse };

/**
 * Verify user has MERCHANT role
 */
export async function verifyMerchantRole(): Promise<AuthVerificationResult> {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return {
            success: false,
            response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
        };
    }

    if (session.user.role !== "MERCHANT") {
        return {
            success: false,
            response: NextResponse.json({ error: "Forbidden - Merchant access only" }, { status: 403 }),
        };
    }

    return { success: true, session };
}

/**
 * Verify user owns the store
 */
export async function verifyStoreOwnership(storeId?: string): Promise<AuthVerificationResult> {
    const authResult = await verifyMerchantRole();
    if (!authResult.success) return authResult;

    const { session } = authResult;
    const userId = session.user.id;

    // If storeId provided, check specific store
    // If not, try to find user's store

    if (storeId) {
        const membership = await prisma.membership.findFirst({
            where: { storeId, userId },
            include: { store: true },
        });

        if (!membership || !membership.store) {
            return {
                success: false,
                response: NextResponse.json({ error: "Forbidden - Store ownership verification failed" }, { status: 403 }),
            };
        }
        return { success: true, session, store: membership.store };
    }

    // Just check if they have ANY store (for general merchant actions)
    const membership = await prisma.membership.findFirst({
        where: { userId },
        include: { store: true },
    });

    if (!membership || !membership.store) {
        return {
            success: false,
            response: NextResponse.json({ error: "No store found for this merchant" }, { status: 404 }),
        };
    }

    return { success: true, session, store: membership.store };
}
