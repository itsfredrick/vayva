import { NextResponse } from "next/server";
import { verifyPaystackSignature } from "@/lib/webhooks/verify";
import { prisma } from "@/lib/prisma";
import { getPaymentsQueue } from "@/lib/queue";
/**
 * Paystack Webhook Handler (Asynchronous)
 * Purely responsible for verification, persistence, and hand-off to background worker.
 */
export async function POST(req: any) {
    const rawBody = await req.text();
    const signature = req.headers.get("x-paystack-signature") || "";
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
        console.error("PAYSTACK_SECRET_KEY is not configured");
        return NextResponse.json({ error: "Webhook Misconfigured" }, { status: 500 });
    }
    let event;
    try {
        event = JSON.parse(rawBody);
    }
    catch (e: any) {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    if (!verifyPaystackSignature(rawBody, signature, secret)) {
        return NextResponse.json({ error: "Invalid Signature" }, { status: 401 });
    }
    const eventType = event.event;
    const data = event.data;
    const providerEventId = String(data.id || event.id);
    try {
        // 1. Persist Event for Observability
        await prisma.paymentWebhookEvent.upsert({
            where: {
                provider_providerEventId: {
                    provider: "PAYSTACK",
                    providerEventId,
                },
            },
            create: {
                provider: "PAYSTACK",
                providerEventId,
                eventType,
                payload: event,
                status: "RECEIVED",
            },
            update: {
            // Already exists, just hand-off again if needed
            },
        });
        // 2. Hand-off to Background Worker
        const paymentsQueue = getPaymentsQueue();
        await paymentsQueue.add(eventType, {
            provider: "PAYSTACK",
            providerEventId,
            eventType,
            data: data,
            metadata: data.metadata,
        }, {
            jobId: `paystack_job_${providerEventId}`,
            removeOnComplete: true,
            attempts: 3,
            backoff: { type: "exponential", delay: 1000 },
        });
        // 3. Subscription Handling
        if (eventType === "charge.success" && data.metadata?.type === "subscription") {
            const { storeId, newPlan } = data.metadata;
            if (storeId && newPlan) {
                try {
                    await prisma.merchantAiSubscription.upsert({
                        where: { storeId },
                        create: {
                            store: {
                                connect: { id: storeId }
                            },
                            plan: {
                                connect: { name: newPlan.toUpperCase() }
                            },
                            planKey: newPlan.toUpperCase(),
                            status: "active",
                            periodStart: new Date(),
                            periodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                            trialExpiresAt: new Date(),
                        },
                        update: {
                            planKey: newPlan.toUpperCase(),
                            status: "active",
                            periodStart: new Date(),
                            periodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                            trialExpiresAt: new Date(),
                        }
                    });
                }
                catch (subErr: any) {
                    console.error("Failed to update merchant subscription", subErr);
                }
            }
        }
        // 4. INTEGRATION: WhatsApp Receipt (If 'charge.success')
        // We do this immediately here for Reliability in this specific task scope
        // Ideally this goes into the Worker, but we are ensuring it works now.
        if (eventType === "charge.success" && data.customer?.phone && data.metadata?.type !== "subscription") {
            try {
                // Attempt to find Order ID from metadata or fetch via reference
                // Metadata often has { orderId: "..." }
                const orderId = data.metadata?.orderId || data.reference;
                const amount = Number(data.amount) / 100; // Paystack is in Kobo
                const currency = data.currency;
                // Fetch Store if possible? Metadata should ideally have storeId
                // For demo, we might need to lookup or pass minimal info.
                // Assuming we have subdomain in metadata or we let the receipt API handle defaults.
                const storeName = "Vayva Store";
                const subdomain = "";
                // Optimization: If metadata has storeId, fetch name?
                // Avoiding prisma Store fetch here to keep webhook fast? 
                // Let's fire-and-forget the receipt call.
                // The Receipt API is internal, so we need full URL if calling it via fetch
                // OR we define a shared function? simpler to fetch for now.
                const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
                fetch(`${appUrl}/api/integrations/whatsapp/send-receipt`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        orderId,
                        amount,
                        currency,
                        customerName: data.metadata?.customerName || data.customer?.first_name,
                        customerPhone: data.customer?.phone, // Paystack standard field
                        storeName: data.metadata?.storeName, // Expecting this in payment metadata
                        subdomain: data.metadata?.subdomain // Expecting this in payment metadata
                    })
                }).catch(err => console.error("Receipt Send Trigger Failed", err));
            }
            catch (receiptErr: any) {
                console.error("Receipt logic error", receiptErr);
            }
        }
        return NextResponse.json({ success: true }, { status: 200 });
    }
    catch (e: any) {
        console.error("Webhook ingestion error:", e);
        return NextResponse.json({ error: "Webhook processing error" }, { status: 500 });
    }
}
