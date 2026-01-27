import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OpsAuthService } from "@/lib/ops-auth";
export async function GET(request: Request) {
    const session = await OpsAuthService.getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";
    const status = searchParams.get("status");
    try {
        const merchants = await prisma.store.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: "insensitive" } },
                    { slug: { contains: query, mode: "insensitive" } },
                ],
                // Add status filter if needed
            },
            include: {
                kycRecord: true,
                memberships: {
                    where: { role_enum: "OWNER" },
                    include: { user: { select: { email: true } } },
                    take: 1,
                },
            },
            orderBy: { createdAt: "desc" },
            take: 50,
        });
        const formatted = merchants.map((m: any) => ({
            id: m.id,
            name: m.name,
            slug: m.slug,
            ownerEmail: m.memberships?.[0]?.user?.email || "Unknown",
            plan: m.plan || "STARTER",
            kycStatus: m.kycStatus || "PENDING",
            onboardingStatus: m.onboardingStatus,
            industrySlug: m.industrySlug,
            isActive: m.isActive,
            createdAt: m.createdAt,
            lastActive: m.updatedAt,
        }));
        return NextResponse.json(formatted);
    }
    catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
