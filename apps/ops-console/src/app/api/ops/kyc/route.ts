import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { OpsAuthService } from "@/lib/ops-auth";

export async function GET() {
    await OpsAuthService.requireSession();

    try {
        const records = await prisma.kycRecord.findMany({
            where: { status: "PENDING" },
            include: {
                store: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        industrySlug: true,
                        onboardingStatus: true,
                        onboardingLastStep: true,
                    }
                }
            },
            orderBy: { submittedAt: "asc" },
        });

        // Get bank info for each record
        const data = await Promise.all(
            records.map(async (rec) => {
                const bank = await prisma.bankBeneficiary.findFirst({
                    where: { storeId: rec.storeId, isDefault: true },
                    select: {
                        bankName: true,
                        bankCode: true,
                        accountNumber: true,
                        accountName: true,
                    }
                });

                return {
                    id: rec.id,
                    storeId: rec.storeId,
                    status: rec.status,
                    ninLast4: rec.ninLast4 || "",
                    bvnLast4: rec.bvnLast4 || "",
                    cacNumberEncrypted: rec.cacNumberEncrypted,
                    submittedAt: rec.submittedAt?.toISOString() || rec.createdAt.toISOString(),
                    reviewedAt: rec.reviewedAt?.toISOString() || null,
                    notes: rec.notes,
                    store: rec.store,
                    bank,
                };
            })
        );

        return NextResponse.json({ data });
    } catch (error: any) {
        console.error("KYC queue error:", error);
        return NextResponse.json({ error: "Failed to fetch KYC queue" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const { user } = await OpsAuthService.requireSession();

    try {
        const { id, action, notes, rejectionReason } = await req.json();

        if (!id || !["approve", "reject"].includes(action)) {
            return NextResponse.json({ error: "Invalid request" }, { status: 400 });
        }

        const record = await prisma.kycRecord.findUnique({
            where: { id },
            include: { store: true }
        });

        if (!record) {
            return NextResponse.json({ error: "Record not found" }, { status: 404 });
        }

        const newStatus = action === "approve" ? "APPROVED" : "REJECTED";

        // Update KYC record
        await prisma.kycRecord.update({
            where: { id },
            data: {
                status: newStatus as any,
                reviewedAt: new Date(),
                reviewedBy: user.id || "ops_admin",
                notes: notes || null,
                rejectionReason: action === "reject" ? rejectionReason : null,
            },
        });

        // Update store KYC status (use the enum value)
        const storeKycStatus = action === "approve" ? "VERIFIED" : "REJECTED";
        await prisma.store.update({
            where: { id: record.storeId },
            data: {
                kycStatus: storeKycStatus as any,
            },
        });

        // Update wallet KYC status if exists
        await prisma.wallet.updateMany({
            where: { storeId: record.storeId },
            data: {
                kycStatus: storeKycStatus,
            },
        });

        // Log audit event
        await OpsAuthService.logEvent(user.id, `KYC_${action.toUpperCase()}`, {
            kycRecordId: id,
            storeId: record.storeId,
            storeName: record.store?.name,
            notes,
            rejectionReason: action === "reject" ? rejectionReason : undefined,
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("KYC action error:", error);
        return NextResponse.json({ error: "Failed to process KYC action" }, { status: 500 });
    }
}
