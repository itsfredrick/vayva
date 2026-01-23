import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const riskLevel = searchParams.get("level");
        const highRiskProfiles = await prisma.riskProfile.findMany({
            where: {
                status: riskLevel
                    ? { equals: riskLevel as any }
                    : { in: ["HIGH", "CRITICAL"] as any },
            },
            include: {
                store: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
            },
            orderBy: { merchantRiskScore: "desc" },
            take: 50,
        });
        const flaggedMerchants = highRiskProfiles.map((profile) => ({
            merchantId: profile.merchantId,
            storeName: (profile as any).store.name,
            riskScore: profile.merchantRiskScore,
            riskLevel: profile.status,
            lastEvaluated: profile.lastEvaluatedAt,
            reason: (profile.metadata as any)?.reason || "Automated Signal",
            actionRequired: profile.status === "CRITICAL" ? "IMMEDIATE_REVIEW" : "MONITOR",
        }));
        return NextResponse.json({
            count: flaggedMerchants.length,
            items: flaggedMerchants,
        });
    }
    catch (error) {
        console.error("Audit AML Error:", error);
        return NextResponse.json({ error: "Failed to fetch AML data" }, { status: 500 });
    }
}
