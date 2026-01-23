import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
// GET /api/merchant/onboarding/products - count products for onboarding checks
export async function GET(_req: unknown) {
    try {
        const sessionUser = await getSessionUser();
        if (!sessionUser) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }
        const count = await prisma.product.count({
            where: { storeId: sessionUser.storeId },
        });
        return NextResponse.json({ count });
    }
    catch (error) {
        console.error("Product count check failed", error);
        return NextResponse.json({ error: "Failed to count products" }, { status: 500 });
    }
}
