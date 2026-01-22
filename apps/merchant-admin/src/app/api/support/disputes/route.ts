import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { withVayvaAPI, HandlerContext } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";

export const GET = withVayvaAPI(
    PERMISSIONS.SUPPORT_MANAGE,
    async (req: NextRequest, { storeId }: HandlerContext) => {
        try {
            const disputes = await prisma.dispute.findMany({
                where: { storeId },
                include: {
                    order: { select: { orderNumber: true, customerEmail: true } }
                },
                orderBy: { evidenceDueAt: "asc" }
            });

            const formatted = disputes.map((d: unknown) => ({
                id: d.id,
                amount: Number(d.amount),
                currency: d.currency,
                status: d.status,
                reason: d.reasonCode || "General Dispute",
                dueAt: d.evidenceDueAt,
                orderNumber: d.order?.orderNumber || "N/A",
                customerEmail: d.order?.customerEmail || "N/A",
                createdAt: d.createdAt
            }));

            return NextResponse.json({ success: true, data: formatted });
        } catch (error) {
            console.error("Disputes API Error:", error);
            return NextResponse.json(
                { error: "Failed to fetch disputes" },
                { status: 500 }
            );
        }
    }
);
