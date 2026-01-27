import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Adjust import path as needed
import { prisma } from "@/lib/prisma";
export async function GET(req: any) {
    const session = await getServerSession(authOptions);
    // Use storeId from session or header (depending on auth strategy)
    // Assuming session.user.storeId exists based on project patterns
    const storeId = session?.user?.storeId;
    if (!storeId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        // 1. Get Plan
        const subscription = await prisma.merchantAiSubscription.findUnique({
            where: { storeId },
            select: { planKey: true },
        });
        const planKey = subscription?.planKey || "STARTER";
        // 2. Count Products
        const used = await prisma.product.count({
            where: { storeId, status: { not: "ARCHIVED" } },
        });
        // 3. Determine Limit
        let limit = 50; // Starter
        if (planKey === "GROWTH")
            limit = 500;
        if (planKey === "PRO")
            limit = "unlimited" as any;
        return NextResponse.json({
            used,
            limit,
            plan: planKey.toLowerCase(),
        });
    }
    catch (error: any) {
        console.error("[PRODUCTS_LIMITS]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
