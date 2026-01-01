import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { OpsAuthService } from "@/lib/ops-auth";

export async function GET(request: Request) {
    const { user } = await OpsAuthService.requireSession();
    if (!["OPS_OWNER", "OPS_ADMIN", "OPS_SUPPORT"].includes(user.role)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "OPEN";
    const category = searchParams.get("category");

    const where: any = {};
    if (status !== "ALL") where.status = status;
    if (category) where.category = category;

    const cases = await prisma.supportCase.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        take: 50
    });

    // Manual join to fetch stores
    const storeIds = [...new Set(cases.map(c => c.storeId))];
    const stores = await prisma.store.findMany({
        where: { id: { in: storeIds } },
        select: { id: true, name: true, slug: true, logoUrl: true }
    });

    const storeMap = new Map(stores.map(s => [s.id, s]));

    const data = cases.map(c => ({
        ...c,
        store: storeMap.get(c.storeId)
    }));

    return NextResponse.json({ data });
}

export async function POST(request: Request) {
    const { user } = await OpsAuthService.requireSession();
    if (!["OPS_OWNER", "OPS_ADMIN", "OPS_SUPPORT"].includes(user.role)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { storeId, category, summary, description } = body;

    const supportCase = await prisma.supportCase.create({
        data: {
            storeId,
            category,
            summary,
            status: "OPEN",
            createdByAdminId: user.id,
            links: description ? { description } : undefined
        }
    });

    return NextResponse.json({ success: true, data: supportCase });
}
