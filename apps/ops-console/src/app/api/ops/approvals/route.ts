
import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { OpsAuthService } from "@/lib/ops-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    try {
        const { user } = await OpsAuthService.requireSession();
        // Only Admin/Owner can view approvals? Or maybe Support too?
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status") || "PENDING";
        const limit = parseInt(searchParams.get("limit") || "50");

        const approvals = await prisma.approval.findMany({
            where: {
                // @ts-ignore
                status: status === "HISTORY" ? { in: ["APPROVED", "REJECTED", "FAILED"] } : status,
            },
            orderBy: { createdAt: "desc" },
            take: limit,
            // We might want to include merchant name, but Approval model usually has merchantId
            // Let's infer details client-side or fetch store names if needed.
        });

        // Fetch store names if storeId is present
        const storeIds = [...new Set(approvals.map(a => a.storeId).filter(Boolean) as string[])];
        const stores = await prisma.store.findMany({
            where: { id: { in: storeIds } },
            select: { id: true, name: true, slug: true }
        });

        const storeMap = new Map(stores.map(s => [s.id, s]));

        const data = approvals.map(a => ({
            ...a,
            store: a.storeId ? storeMap.get(a.storeId) : null
        }));

        return NextResponse.json({ data });

    } catch (error) {
        console.error("Fetch Approvals Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
