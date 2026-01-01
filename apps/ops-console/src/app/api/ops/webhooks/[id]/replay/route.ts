import { NextRequest, NextResponse } from "next/server";
import { OpsAuthService } from "@/lib/ops-auth";
import { prisma } from "@vayva/db";

export const dynamic = "force-dynamic";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { user } = await OpsAuthService.requireSession();
        // Replay is safe enough for OPERATORS
        OpsAuthService.requireRole(user, "OPERATOR");

        const { id } = await params;

        const webhook = await prisma.webhookEvent.findUnique({
            where: { id },
            include: { store: { select: { name: true } } },
        });

        if (!webhook) {
            return NextResponse.json({ error: "Webhook not found" }, { status: 404 });
        }

        // Reset webhook to raw state
        await prisma.webhookEvent.update({
            where: { id },
            data: {
                status: "received",
                error: null,
                processedAt: null,
                // receivedAt is NOT reset to preserve history order
            },
        });

        // Create audit log
        await OpsAuthService.logEvent(user.id, "WEBHOOK_REPLAY", {
            targetType: "WebhookEvent",
            targetId: id,
            reason: "Manual replay triggered by operator",
            storeName: webhook.store?.name,
            webhookType: webhook.eventType,
        });

        return NextResponse.json({
            success: true,
            message: "Webhook queued for reprocessing",
        });
    } catch (error: any) {
        if (error.message === "Unauthorized") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (error.message?.includes("Insufficient permissions")) {
            return NextResponse.json(
                { error: "Insufficient permissions" },
                { status: 403 }
            );
        }
        console.error("Webhook replay error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
