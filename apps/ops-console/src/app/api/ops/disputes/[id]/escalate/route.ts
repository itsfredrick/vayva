import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@vayva/db";
import { OpsAuthService } from "@/lib/ops-auth";
import { logger } from "@/lib/logger";

export async function POST(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const { user } = await OpsAuthService.requireSession();

        try {
            OpsAuthService.requireRole(user, "OPS_ADMIN");
        } catch (e: any) {
            return NextResponse.json({ error: (e as any).message }, { status: 403 });
        }

        const disputeId = params.id;
        const body = await request.json();
        const { note } = body;

        // Fetch dispute
        const dispute = await prisma.dispute.findUnique({
            where: { id: disputeId },
        });

        if (!dispute) {
            return NextResponse.json(
                { error: "Dispute not found" },
                { status: 404 }
            );
        }

        // Update dispute status to escalated
        const updatedDispute = await prisma.dispute.update({
            where: { id: disputeId },
            data: {
                status: "UNDER_REVIEW",
            },
        });

        // Create timeline event
        await prisma.disputeTimelineEvent.create({
            data: {
                disputeId,
                eventType: "ADMIN_ACTION",
                payload: {
                    action: "ESCALATE",
                    adminId: user.id,
                    note,
                    description: `Dispute escalated by Ops Admin: ${user.email}`,
                },
            },
        });

        return NextResponse.json({
            success: true,
            dispute: updatedDispute,
            message: "Dispute escalated for senior review",
        });
    } catch (error: any) {
        logger.error("Escalate dispute error", error);
        return NextResponse.json(
            { error: "Failed to escalate dispute" },
            { status: 500 }
        );
    }
}
