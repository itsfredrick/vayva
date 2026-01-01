import { FastifyRequest, FastifyReply } from "fastify";
import { StripeProvider } from "../providers/stripe";
import { prisma } from "@vayva/db";
import { Queue } from "bullmq";

const paymentsQueue = new Queue("payment-events", {
  connection: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
  },
});

export const handleStripeWebhook = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  // 1. Get Secret (Ideally from DB based on merchant, but for V1 we might use env if single platform account, or query DB)
  // For platform connect, we verify using platform secret.
  const sig = req.headers["stripe-signature"] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret || !process.env.STRIPE_SECRET_KEY) {
    (req.log as any).error("Missing Stripe Config");
    return reply.status(500).send({ error: "Server Config Error" });
  }

  const provider = new StripeProvider(
    process.env.STRIPE_SECRET_KEY,
    webhookSecret,
  );

  // Fastify raw body is needed here. Ensure content type parser is set for raw/buffer
  const bodyStr = (req as any).rawBody || JSON.stringify(req.body);
  const result = await provider.verifyWebhookSignature(bodyStr, sig);

  if (!result.isValid) {
    (req.log as any).warn(`Invalid Webhook Signature: ${result.error}`);
    return reply.status(400).send({ error: `Webhook Error: ${result.error}` });
  }

  const event = result.event;
  if (!event) {
    return reply.status(400).send({ error: "Event data missing" });
  }

  // 2. Idempotency Check & Persist
  const existing = await prisma.paymentWebhookEvent.findUnique({
    where: {
      provider_providerEventId: {
        provider: "stripe",
        providerEventId: event.id,
      },
    },
  });

  if (existing) {
    return reply.status(200).send({ received: true });
  }

  await prisma.paymentWebhookEvent.create({
    data: {
      provider: "stripe",
      providerEventId: event.id,
      eventType: event.type,
      payload: event.data,
      status: "RECEIVED",
    },
  });

  // 3. Enqueue for async processing
  await paymentsQueue.add("process-stripe-event", {
    provider: "stripe",
    eventId: event.id,
    type: event.type,
    data: event.data,
  });

  return reply.status(200).send({ received: true });
};
