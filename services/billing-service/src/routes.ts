import { FastifyInstance, FastifyRequest } from "fastify";
import { BillingController } from "./controller";

export async function billingRoutes(server: FastifyInstance) {
  // --- Plans ---
  server.get("/plans", async (_req: FastifyRequest, _reply) => {
    return await BillingController.listPlans();
  });

  // --- Subscriptions ---
  server.get("/subscription", async (req: FastifyRequest, _reply) => {
    const storeId = req.headers["x-store-id"] as string;
    return await BillingController.getSubscription(storeId);
  });

  server.post("/subscription", async (req: FastifyRequest<{ Body: { planKey: string; trial?: boolean } }>, _reply) => {
    const storeId = req.headers["x-store-id"] as string;
    const { planKey, trial } = req.body;
    return await BillingController.createSubscription(storeId, planKey, trial);
  });

  server.put("/subscription/upgrade", async (req: FastifyRequest<{ Body: { planKey: string } }>, _reply) => {
    const storeId = req.headers["x-store-id"] as string;
    const { planKey } = req.body;
    return await BillingController.upgradePlan(storeId, planKey);
  });

  server.post("/subscription/cancel", async (req: FastifyRequest<{ Body: { immediate?: boolean } }>, _reply) => {
    const storeId = req.headers["x-store-id"] as string;
    const { immediate } = req.body;
    return await BillingController.cancelSubscription(storeId, immediate);
  });

  // --- Entitlements ---
  server.get("/entitlements/:feature", async (req: FastifyRequest<{ Params: { feature: string } }>, _reply) => {
    const storeId = req.headers["x-store-id"] as string;
    const { feature } = req.params;
    const allowed = await BillingController.checkEntitlement(storeId, feature);
    return { allowed };
  });

  server.get("/usage/:key", async (req: FastifyRequest<{ Params: { key: string } }>, _reply) => {
    const storeId = req.headers["x-store-id"] as string;
    const { key } = req.params;
    return await BillingController.getUsageLimit(storeId, key);
  });

  server.post("/usage/:key/increment", async (req: FastifyRequest<{ Params: { key: string }; Body: { amount?: number } }>, _reply) => {
    const storeId = req.headers["x-store-id"] as string;
    const { key } = req.params;
    const { amount } = req.body;
    await BillingController.incrementUsage(storeId, key, amount || 1);
    return { success: true };
  });

  // --- Invoices ---
  server.get("/invoices", async (req: FastifyRequest, _reply) => {
    const storeId = req.headers["x-store-id"] as string;
    return await BillingController.listInvoices(storeId);
  });
}
