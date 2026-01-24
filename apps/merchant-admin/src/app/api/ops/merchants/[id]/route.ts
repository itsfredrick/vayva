import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OpsAuthService } from "@/lib/ops-auth";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const session = await OpsAuthService.getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const merchant = await prisma.store.findUnique({
            where: { id: params.id },
            include: {
                kycRecord: true,
                wallet: true,
            }
        });

        if (!merchant) {
            return NextResponse.json({ error: "Merchant not found" }, { status: 404 });
        }

        // Fetch verification audit logs
        const auditLogs = await prisma.auditLog.findMany({
            where: {
                storeId: params.id,
                action: { in: ["KYC_VERIFIED", "KYC_FAILED", "BANK_RESOLVED", "ONBOARDING_COMPLETED"] }
            },
            orderBy: { createdAt: "desc" },
            take: 20
        });

        return NextResponse.json({
            id: merchant.id,
            name: merchant.name,
            slug: merchant.slug,
            onboardingStatus: merchant.onboardingStatus,
            industrySlug: merchant.industrySlug,
            kycStatus: merchant.kycStatus,
            isActive: merchant.isActive,
            payoutsEnabled: merchant.payoutsEnabled,
            verificationLevel: merchant.verificationLevel,
            kycDetails: merchant.kycRecord,
            walletStatus: {
                isLocked: merchant.wallet?.isLocked,
                availableKobo: Number(merchant.wallet?.availableKobo || 0),
            },
            history: auditLogs.map(log => ({
                action: log.action,
                timestamp: log.createdAt,
                ip: log.ipAddress,
            }))
        });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
