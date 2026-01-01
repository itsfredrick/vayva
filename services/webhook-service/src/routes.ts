import { FastifyInstance } from "fastify";
import { WebhookController } from "./controller";

export async function webhookRoutes(server: FastifyInstance) {
  // --- API Keys ---
  server.get("/api-keys", async (req: any, reply) => {
    const storeId = req.headers["x-store-id"];
    return await WebhookController.listApiKeys(storeId);
  });

  server.post("/api-keys", async (req: any, reply) => {
    const storeId = req.headers["x-store-id"];
    const { name, scopes } = req.body;
    return await WebhookController.createApiKey(storeId, name, scopes);
  });

  server.post("/api-keys/:id/revoke", async (req: any, reply) => {
    const { id } = req.params;
    return await WebhookController.revokeApiKey(id);
  });

  // --- Webhook Endpoints ---
  server.get("/endpoints", async (req: any, reply) => {
    const storeId = req.headers["x-store-id"];
    return await WebhookController.listWebhookEndpoints(storeId);
  });

  server.post("/endpoints", async (req: any, reply) => {
    const storeId = req.headers["x-store-id"];
    const { url, events } = req.body;
    return await WebhookController.createWebhookEndpoint(storeId, url, events);
  });

  // --- Deliveries & Logs ---
  server.get("/deliveries", async (req: any, reply) => {
    const storeId = req.headers["x-store-id"];
    const { endpointId } = req.query;
    return await WebhookController.listDeliveries(storeId, endpointId);
  });

  server.post("/deliveries/:id/replay", async (req: any, reply) => {
    const { id } = req.params;
    await WebhookController.replayDelivery(id);
    return { success: true };
  });
}
