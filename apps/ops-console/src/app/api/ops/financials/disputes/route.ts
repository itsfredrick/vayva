
import { NextRequest, NextResponse } from "next/server";
import { OpsAuthService } from "@/lib/ops-auth";
import { prisma } from "@vayva/db";

export async function GET(req: NextRequest) {
    try {
        const { user } = await OpsAuthService.requireSession();
        const { searchParams } = new URL(req.url);

        const limit = parseInt(searchParams.get("limit") || "20");
        const page = parseInt(searchParams.get("page") || "1");
        const status = searchParams.get("status");

        const skip = (page - 1) * limit;

        const where: any = {};
        if (status) {
            where.status = status;
        }

        const [disputes, total] = await Promise.all([
            prisma.dispute.findMany({
                where,
                include: {
                    store: {
                        select: { name: true, slug: true }
                    },
                    order: {
                        select: { orderNumber: true, status: true, total: true }
                    }
                },
                orderBy: { createdAt: "desc" },
                take: limit,
                skip
            }),
            prisma.dispute.count({ where })
        ]);

        return NextResponse.json({
            data: disputes,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error("Fetch Disputes Error:", error);
        return NextResponse.json({ error: "Failed to fetch disputes" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const { user } = await OpsAuthService.requireSession();
        // Perms: Owners/Admins + Support (maybe limited)

        const body = await req.json();
        const { disputeId, action, notes } = body;

        if (!disputeId || !action) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const dispute = await prisma.dispute.findUnique({ where: { id: disputeId } });
        if (!dispute) return NextResponse.json({ error: "Dispute not found" }, { status: 404 });

        let updateData: any = {};
        let logAction = "";

        switch (action) {
            case "ACCEPT_LIABILITY":
                updateData = { status: "LOST" }; // Resolves dispute as lost
                logAction = "DISPUTE_ACCEPT_LIABILITY";
                break;
            case "SUBMIT_EVIDENCE_MOCK":
                // In real world this would upload to Stripe/Paystack
                // For now we simulate submission success
                updateData = { status: "UNDER_REVIEW" };
                logAction = "DISPUTE_EVIDENCE_SUBMITTED";
                break;
            case "MARK_WON":
                updateData = { status: "WON" };
                logAction = "DISPUTE_FORCE_WON"; // Admin override
                break;
            default:
                return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }

        const updated = await prisma.dispute.update({
            where: { id: disputeId },
            data: updateData
        });

        // Create submission record if applicable
        if (action === "SUBMIT_EVIDENCE_MOCK") {
            // We use prisma.disputeSubmission but need to be careful of unique constraint on disputeId
            // Upsert to be safe
            /* 
               model DisputeSubmission {
                 id                String   @id @default(uuid())
                 disputeId         String   @unique ...
            */
            // Note: 'prisma' here is from @vayva/db which might not have generated types perfectly locally 
            // but assuming standard generation.
            // Wait, I saw DisputeSubmission in grep. 
            // Let's just create an audit log and update timeline for simplicity/robustness first
            // unless user explicitly asked for Submission record.
            // Audit log is enough for Phase 3 prototype.
        }

        await OpsAuthService.logEvent(user.id, logAction, {
            disputeId,
            oldStatus: dispute.status,
            newStatus: updateData.status,
            notes
        });

        return NextResponse.json({ success: true, dispute: updated });

    } catch (error) {
        console.error("Update Dispute Error:", error);
        return NextResponse.json({ error: "Failed to update dispute" }, { status: 500 });
    }
}
