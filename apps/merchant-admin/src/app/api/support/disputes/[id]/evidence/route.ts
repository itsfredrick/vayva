import { NextResponse } from "next/server";
import { withVayvaAPI } from "@/lib/api-handler";
import { prisma } from "@vayva/db";
import { PERMISSIONS } from "@/lib/team/permissions";
export const POST = withVayvaAPI(PERMISSIONS.SUPPORT_MANAGE, async (req, { storeId, params }) => {
    try {
        const disputeId = params?.id;
        const body = await req.json();
        // Create Evidence Record
        await prisma.disputeEvidence.create({
            data: {
                disputeId: disputeId,
                type: "OTHER",
                textExcerpt: body.text || "",
                url: body.fileUrl || null,
                metadata: {}
            }
        });
        // Update Dispute Status
        await prisma.dispute.update({
            where: { id: disputeId },
            data: {
                status: "SUBMITTED",
                updatedAt: new Date(),
                evidenceDueAt: null // Evidence provided
            }
        });
        return NextResponse.json({ success: true });
    }
    catch (error) {
        console.error("[DISPUTE_EVIDENCE]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
});
