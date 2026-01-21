
import { NextResponse } from "next/server";
import { prisma, ApprovalStatus } from "@vayva/db";
import { OpsAuthService } from "@/lib/ops-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    try {
        const { user } = await OpsAuthService.requireSession();
        // Only Admin/Owner can view approvals? Or maybe Support too?
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const status = (searchParams.get("status") || "PENDING") as ApprovalStatus | "HISTORY";
        const skip = (page - 1) * limit;

        const whereCondition: { status: ApprovalStatus | { in: ApprovalStatus[] } } = {
            status: status === "HISTORY" ? { in: ["APPROVED", "REJECTED", "FAILED"] as ApprovalStatus[] } : status,
        };

        const [approvals, total] = await Promise.all([
            prisma.approval.findMany({
                where: whereCondition,
                orderBy: { createdAt: "desc" },
                take: limit,
                skip
            }),
            prisma.approval.count({
                where: whereCondition
            })
        ]);

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

        return NextResponse.json({
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error("Fetch Approvals Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
