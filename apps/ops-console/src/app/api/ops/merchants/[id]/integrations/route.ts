
import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { OpsAuthService } from "@/lib/ops-auth";

export const dynamic = "force-dynamic";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { user } = await OpsAuthService.requireSession();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const resolvedParams = await params;
        const { id } = resolvedParams;

        // 1. WhatsApp Status
        const whatsapp = await prisma.whatsappChannel.findUnique({
            where: { storeId: id },
            select: { status: true, displayPhoneNumber: true, businessName: true, updatedAt: true }
        });

        // 2. Webhook Endpoints
        const webhooks = await prisma.webhookEndpoint.findMany({
            where: { storeId: id },
            select: { id: true, url: true, status: true, updatedAt: true }
        });

        // 3. Recent Integration Events (Failures)
        // Check if IntegrationEvent model exists (it was in schema around line 2675)
        const recentErrors = await prisma.integrationEvent.findMany({
            where: {
                storeId: id,
                status: "FAIL"
            },
            take: 5,
            orderBy: { createdAt: "desc" }
        });

        // 4. Paystack/Payment Provider (via Store Subscription or generic Settings?)
        // For now, let's check Subscription provider
        const subscription = await prisma.subscription.findUnique({
            where: { storeId: id },
            select: { provider: true, status: true }
        });

        return NextResponse.json({
            data: {
                whatsapp: whatsapp || { status: "NOT_CONFIGURED" },
                webhooks,
                recentErrors,
                payment: {
                    provider: subscription?.provider || "UNKNOWN",
                    status: subscription?.status || "INACTIVE"
                }
            }
        });

    } catch (error) {
        console.error("Fetch Integrations Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
