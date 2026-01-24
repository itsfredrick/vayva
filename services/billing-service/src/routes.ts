import { FastifyInstance } from "fastify";
import { BillingController } from "./controller";

export async function billingRoutes(server: FastifyInstance) {
  // --- Plans ---
  server.get("/plans", async (_req: unknown, _reply) => {
    return await BillingController.listPlans();
  });

  // --- Subscriptions ---
  server.get("/subscription", async (req: unknown, _reply) => {
    const storeId = req.headers["x-store-id"];
    return await BillingController.getSubscription(storeId);
  });

  server.post("/subscription", async (req: unknown, _reply) => {
    const storeId = req.headers["x-store-id"];
    const { planKey, trial } = req.body;
    return await BillingController.createSubscription(storeId, planKey, trial);
  });

  server.put("/subscription/upgrade", async (req: unknown, _reply) => {
    const storeId = req.headers["x-store-id"];
    const { planKey } = req.body;
    return await BillingController.upgradePlan(storeId, planKey);
  });

  server.post("/subscription/cancel", async (req: unknown, _reply) => {
    const storeId = req.headers["x-store-id"];
    const { immediate } = req.body;
    return await BillingController.cancelSubscription(storeId, immediate);
  });

  // --- Entitlements ---
  server.get("/entitlements/:feature", async (req: unknown, _reply) => {
    const storeId = req.headers["x-store-id"];
    const { feature } = req.params;
    const allowed = await BillingController.checkEntitlement(storeId, feature);
    return { allowed };
  });

  server.get("/usage/:key", async (req: unknown, _reply) => {
    const storeId = req.headers["x-store-id"];
    const { key } = req.params;
    return await BillingController.getUsageLimit(storeId, key);
  });

  server.post("/usage/:key/increment", async (req: unknown, _reply) => {
    const storeId = req.headers["x-store-id"];
    const { key } = req.params;
    const { amount } = req.body;
    await BillingController.incrementUsage(storeId, key, amount || 1);
    return { success: true };
  });

  // --- Invoices ---
  server.get("/invoices", async (req: unknown, _reply) => {
    const storeId = req.headers["x-store-id"];
    return await BillingController.listInvoices(storeId);
  });
}
