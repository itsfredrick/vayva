
import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { OpsAuthService } from "@/lib/ops-auth";

export const dynamic = "force-dynamic";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { user } = await OpsAuthService.requireSession();
        // Strict Role Check for Approvals
        if (!["OPS_OWNER", "OPS_ADMIN"].includes(user.role)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const resolvedParams = await params;
        const { id } = resolvedParams;
        const body = await request.json();
        const { decision, reason } = body; // 'APPROVED' | 'REJECTED'

        if (!["APPROVED", "REJECTED"].includes(decision)) {
            return NextResponse.json({ error: "Invalid decision" }, { status: 400 });
        }

        const approval = await prisma.approval.findUnique({ where: { id } });
        if (!approval) return NextResponse.json({ error: "Approval not found" }, { status: 404 });

        // @ts-ignore - Enum comparison
        if (approval.status !== "PENDING") {
            return NextResponse.json({ error: "Request is not PENDING" }, { status: 400 });
        }

        const updated = await prisma.approval.update({
            where: { id },
            data: {
                // @ts-ignore
                status: decision,
                decidedByUserId: user.id,
                decidedByLabel: user.email, // or name
                decidedAt: new Date(),
                decisionReason: reason
            }
        });

        await OpsAuthService.logEvent(user.id, "DECISION_APPROVAL", {
            approvalId: id,
            decision,
            reason
        });

        // TODO: Trigger actual business logic execution (Refund, Withdrawal, etc.)
        // This would usually be handled by an event bus or a direct service call here.
        // For now, we update the record status.

        return NextResponse.json({ success: true, data: updated });

    } catch (error) {
        console.error("Approval Decision Error:", error);
        return NextResponse.json({ error: "Decision failed" }, { status: 500 });
    }
}
