import { NextRequest, NextResponse } from "next/server";
import { verifyPaystackSignature } from "@/lib/webhooks/verify";
import { prisma } from "@vayva/db";
import { paymentsQueue } from "@/lib/queue";

/**
 * Paystack Webhook Handler (Asynchronous)
 * Purely responsible for verification, persistence, and hand-off to background worker.
 */
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature") || "";

  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    console.error("PAYSTACK_SECRET_KEY is not configured");
    return new NextResponse("Webhook Misconfigured", { status: 500 });
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch (e) {
    return new NextResponse("Invalid JSON", { status: 400 });
  }

  if (!verifyPaystackSignature(event, signature, secret)) {
    return new NextResponse("Invalid Signature", { status: 401 });
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
        payload: event as any,
        status: "RECEIVED",
      },
      update: {
        // Already exists, just hand-off again if needed
      },
    });

    // 2. Hand-off to Background Worker
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

    console.log(`[Webhook] Received and Queued: ${eventType} (${providerEventId})`);
    return new NextResponse("OK", { status: 200 });
  } catch (e: any) {
    console.error("Webhook ingestion error:", e);
    return new NextResponse("Error", { status: 500 });
  }
}
