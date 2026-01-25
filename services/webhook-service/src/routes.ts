import { FastifyInstance, FastifyRequest } from "fastify";
import { WebhookController } from "./controller";

export async function webhookRoutes(server: FastifyInstance) {
  // --- API Keys ---
  server.get("/api-keys", async (req: FastifyRequest, _reply) => {
    const storeId = req.headers["x-store-id"] as string;
    return await WebhookController.listApiKeys(storeId);
  });

  server.post("/api-keys", async (req: FastifyRequest<{ Body: { name: string; scopes: string[] } }>, _reply) => {
    const storeId = req.headers["x-store-id"] as string;
    const { name, scopes } = req.body;
    return await WebhookController.createApiKey(storeId, name, scopes);
  });

  server.post("/api-keys/:id/revoke", async (req: FastifyRequest<{ Params: { id: string } }>, _reply) => {
    const { id } = req.params;
    return await WebhookController.revokeApiKey(id);
  });

  // --- Webhook Endpoints ---
  server.get("/endpoints", async (req: FastifyRequest, _reply) => {
    const storeId = req.headers["x-store-id"] as string;
    return await WebhookController.listWebhookEndpoints(storeId);
  });

  server.post("/endpoints", async (req: FastifyRequest<{ Body: { url: string; events: string[] } }>, _reply) => {
    const storeId = req.headers["x-store-id"] as string;
    const { url, events } = req.body;
    return await WebhookController.createWebhookEndpoint(storeId, url, events);
  });

  // --- Deliveries & Logs ---
  server.get("/deliveries", async (req: FastifyRequest<{ Querystring: { endpointId?: string } }>, _reply) => {
    const storeId = req.headers["x-store-id"] as string;
    const { endpointId } = req.query;
    return await WebhookController.listDeliveries(storeId, endpointId);
  });

  server.post("/deliveries/:id/replay", async (req: FastifyRequest<{ Params: { id: string } }>, _reply) => {
    const { id } = req.params;
    await WebhookController.replayDelivery(id);
    return { success: true };
  });

  // --- Trigger (Internal) ---
  server.post("/trigger", async (req: FastifyRequest<{ Body: { type: string; payload: Record<string, unknown> } }>, _reply) => {
    const storeId = req.headers["x-store-id"] as string;
    const { type, payload } = req.body;
    return await WebhookController.publishEvent(storeId, type, payload);
  });
}
