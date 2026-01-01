
import { NextRequest, NextResponse } from "next/server";
import { OpsAuthService } from "@/lib/ops-auth";
import { prisma } from "@vayva/db";

export async function POST(req: NextRequest) {
    try {
        const { user } = await OpsAuthService.requireSession();
        // Only Admin/Owner
        if (!["OPS_OWNER", "OPS_ADMIN"].includes(user.role)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const body = await req.json();
        const { merchantIds, action } = body;

        if (!merchantIds || !Array.isArray(merchantIds) || merchantIds.length === 0) {
            return NextResponse.json({ error: "Invalid merchant IDs" }, { status: 400 });
        }

        let updatedCount = 0;

        switch (action) {
            case "SUSPEND":
                // Suspend: Disable payouts and take offline
                await prisma.store.updateMany({
                    where: { id: { in: merchantIds } },
                    data: {
                        isLive: false,
                        payoutsEnabled: false
                    }
                });
                updatedCount = merchantIds.length;
                break;

            case "enable_payouts":
                await prisma.store.updateMany({
                    where: { id: { in: merchantIds } },
                    data: { payoutsEnabled: true }
                });
                updatedCount = merchantIds.length;
                break;

            case "disable_payouts":
                await prisma.store.updateMany({
                    where: { id: { in: merchantIds } },
                    data: { payoutsEnabled: false }
                });
                updatedCount = merchantIds.length;
                break;

            case "force_kyc":
                // Reset KYC status to force re-submission or review
                // We update the KycRecord associated with these stores
                // Check if KycRecord exists for these stores, if not we might typically ignore or create.
                // updateMany only updates existing.
                await prisma.kycRecord.updateMany({
                    where: { storeId: { in: merchantIds } },
                    data: { status: "NOT_STARTED" }
                });
                updatedCount = merchantIds.length;
                break;

            default:
                return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }

        // Audit Log
        await OpsAuthService.logEvent(user.id, "OPS_BATCH_ACTION", {
            action,
            count: updatedCount,
            merchantIds
        });

        return NextResponse.json({ success: true, count: updatedCount });

    } catch (error: any) {
        console.error("Batch Action Error:", error);
        return NextResponse.json({ error: "Batch action failed" }, { status: 500 });
    }
}
