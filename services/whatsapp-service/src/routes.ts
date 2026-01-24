import { FastifyInstance } from "fastify";
import {
  webhookHandler,
  verifyWebhook,
  listThreads,
  getThread,
  sendMessage,
  syncAgentContext,
} from "./controller";

export const whatsappRoutes = async (server: FastifyInstance): Promise<void> => {
  // Webhooks
  server.get("/webhooks/whatsapp", verifyWebhook);
  server.post("/webhooks/whatsapp", webhookHandler);

  // Merchant API
  server.get("/threads", listThreads);
  server.get("/threads/:id", getThread);
  server.post("/threads/:conversationId/messages", sendMessage);

  // Internal/Admin API
  server.post("/internal/agent/sync", syncAgentContext);
};
