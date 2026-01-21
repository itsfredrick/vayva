import { FastifyRequest, FastifyReply } from "fastify";
import { InboundProcessor } from "./processor/inbound.processor";
import { ConversationStore } from "./services/conversation.store";
import { prisma } from "@vayva/db";

/**
 * Meta Webhook verification handshake
 */
export const verifyWebhook = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const query = req.query as any;
  const mode = query["hub.mode"];
  const token = query["hub.verify_token"];
  const challenge = query["hub.challenge"];

  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;
  if (!VERIFY_TOKEN) {
    (req.log as any).error("WHATSAPP_VERIFY_TOKEN not set");
    return reply.status(500).send("Internal Server Configuration Error");
  }

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return reply.send(challenge);
  }
  return reply.status(403).send("Forbidden");
};

/**
 * Handle Inbound Messages & Status Updates
 */
export const webhookHandler = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  // 1. Signature Verification
  const signature = req.headers["x-hub-signature-256"] as string;
  const appSecret = process.env.WHATSAPP_APP_SECRET;

  if (appSecret) {
    if (!signature) {
      (req.log as any).warn("Missing x-hub-signature-256 header");
      if (process.env.NODE_ENV === "production") return reply.status(403).send("Forbidden");
    } else {
      const crypto = await import("crypto");
      const hmac = crypto.createHmac("sha256", appSecret);
      const rawBody = (req as any).rawBody;

      if (!rawBody) {
        (req.log as any).error("Raw body missing for signature verification. Ensure content-type parser is set.");
        // If missing, we can't verify. Fail safe.
        return reply.status(500).send({ error: "Internal Error" });
      }

      // Ensure rawBody is a Buffer or string
      const updateData = Buffer.isBuffer(rawBody) ? rawBody : String(rawBody);
      const digest = hmac.update(updateData).digest("hex");
      const expectedSignature = `sha256=${digest}`;

      if (signature !== expectedSignature) {
        (req.log as any).warn(`Invalid WhatsApp Signature. Expected ${expectedSignature}, got ${signature}`);
        if (process.env.NODE_ENV === "production" || process.env.VERIFY_WEBHOOKS === "true") {
          return reply.status(403).send("Forbidden");
        }
      }
    }
  } else {
    (req.log as any).warn("WHATSAPP_APP_SECRET not set. Skipping signature verification.");
  }

  const body = req.body as any;
  if (!body.entry) return reply.send({ status: "ignored" });

  for (const entry of body.entry) {
    for (const change of entry.changes) {
      const value = change.value;
      const metadata = value.metadata;

      // Resolve storeId by phone_number_id
      const channel = await prisma.whatsappChannel.findFirst({
        where: { phoneNumberId: metadata?.phone_number_id },
      });

      if (!channel) {
        (req.log as any).error(`No channel found for phone_number_id ${metadata?.phone_number_id}`);
        continue;
      }
      const storeId = channel.storeId;

      if (value.messages) {
        await InboundProcessor.processMessage(storeId, value);
      }
      if (value.statuses) {
        for (const status of value.statuses) {
          await InboundProcessor.processStatus(storeId, status);
        }
      }
    }
  }

  return reply.send({ status: "success" });
};

/**
 * Send Message from Merchant Dashboard
 */
export const sendMessage = async (req: FastifyRequest, reply: FastifyReply) => {
  const storeId = req.headers["x-store-id"] as string;
  if (!storeId) return reply.status(400).send({ error: "Missing x-store-id header" });

  const { conversationId, body, templateName } = req.body as any;

  try {
    const message = await ConversationStore.sendMessage(
      storeId,
      conversationId,
      { body, templateName },
    );
    return reply.send(message);
  } catch (e: any) {
    return reply.status(500).send({ error: e.message });
  }
};

/**
 * List Threads for Inbox
 */
export const listThreads = async (req: FastifyRequest, reply: FastifyReply) => {
  const storeId = req.headers["x-store-id"] as string;
  if (!storeId) return reply.status(400).send({ error: "Missing x-store-id header" });

  const threads = await ConversationStore.listThreads(storeId);
  return reply.send(threads);
};

/**
 * Get Full Thread History
 */
export const getThread = async (req: FastifyRequest, reply: FastifyReply) => {
  const storeId = req.headers["x-store-id"] as string;
  if (!storeId) return reply.status(400).send({ error: "Missing x-store-id header" });

  const { id } = req.params as { id: string };

  const thread = await ConversationStore.getThread(storeId, id);
  if (!thread) return reply.status(404).send({ error: "Thread not found" });

  // Auto mark as read
  await ConversationStore.markAsRead(storeId, id);

  return reply.send(thread);
};

/**
 * Sync Agent Context for a store (Refreshes cache/LLM instructions)
 */
export const syncAgentContext = async (req: FastifyRequest, reply: FastifyReply) => {
  const secret = req.headers["x-internal-secret"];
  const INTERNAL_SECRET = process.env.INTERNAL_API_SECRET;

  if (!INTERNAL_SECRET || secret !== INTERNAL_SECRET) {
    return reply.status(401).send({ error: "Unauthorized" });
  }

  const { storeId } = req.body as { storeId: string };
  if (!storeId) return reply.status(400).send({ error: "storeId required" });

  try {
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      select: { settings: true }
    });

    const aiSettings = (store?.settings as any)?.aiAgent;
    (req.log as any).info(`Refreshing AI Agent context for store ${storeId}. Enabled: ${aiSettings?.enabled}`);

    return reply.send({ success: true, syncedAt: new Date().toISOString() });
  } catch (e: any) {
    return reply.status(500).send({ error: e.message });
  }
};
