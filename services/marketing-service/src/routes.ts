import { FastifyInstance } from "fastify";
import { MarketingController } from "./controller";

export async function marketingRoutes(server: FastifyInstance) {
  // --- Discounts ---
  server.get("/discounts/rules", async (req: unknown, _reply) => {
    const storeId = req.headers["x-store-id"];
    return await MarketingController.listDiscountRules(storeId);
  });

  server.post("/discounts/rules", async (req: unknown, _reply) => {
    const storeId = req.headers["x-store-id"];
    return await MarketingController.createDiscountRule(storeId, req.body);
  });

  server.post("/discounts/coupons", async (req: unknown, _reply) => {
    const storeId = req.headers["x-store-id"];
    const { ruleId, code } = req.body;
    return await MarketingController.createCoupon(storeId, {
      discountRuleId: ruleId,
      code,
    });
  });

  // --- Segments ---
  server.get("/segments", async (req: unknown, _reply) => {
    const storeId = req.headers["x-store-id"];
    return await MarketingController.listSegments(storeId);
  });

  server.post("/segments", async (req: unknown, _reply) => {
    const storeId = req.headers["x-store-id"];
    return await MarketingController.createSegment(storeId, req.body);
  });

  // --- Campaigns ---
  server.get("/campaigns", async (req: unknown, _reply) => {
    const storeId = req.headers["x-store-id"];
    return await MarketingController.listCampaigns(storeId);
  });

  server.post("/campaigns", async (req: unknown, _reply) => {
    const storeId = req.headers["x-store-id"];
    const userId = req.headers["x-user-id"] || "system";
    return await MarketingController.createCampaign(storeId, {
      ...req.body,
      userId,
    });
  });

  // --- Automations ---
  server.get("/automations", async (req: unknown, _reply) => {
    const storeId = req.headers["x-store-id"];
    return await MarketingController.listAutomationRules(storeId);
  });

  server.put("/automations/:key", async (req: unknown, _reply) => {
    const storeId = req.headers["x-store-id"];
    const { key } = req.params as Record<string, string>;
    return await MarketingController.upsertAutomationRule(
      storeId,
      key,
      req.body,
    );
  });
}
