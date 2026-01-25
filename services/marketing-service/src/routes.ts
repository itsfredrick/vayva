import { FastifyInstance, FastifyRequest } from "fastify";
import { MarketingController } from "./controller";

export async function marketingRoutes(server: FastifyInstance) {
  // --- Discounts ---
  server.get("/discounts/rules", async (req: FastifyRequest, _reply) => {
    const storeId = (req.headers["x-store-id"] as string);
    return await MarketingController.listDiscountRules(storeId);
  });

  server.post("/discounts/rules", async (req: FastifyRequest, _reply) => {
    const storeId = (req.headers["x-store-id"] as string);
    return await MarketingController.createDiscountRule(storeId, req.body as {
      name: string;
      code: string;
      value: number;
      type: "PERCENTAGE" | "FIXED";
    });
  });

  server.post("/discounts/coupons", async (req: FastifyRequest, _reply) => {
    const storeId = (req.headers["x-store-id"] as string);
    const { ruleId, code } = req.body as Record<string, string>;
    return await MarketingController.createCoupon(storeId, {
      discountRuleId: ruleId,
      code,
    });
  });

  // --- Segments ---
  server.get("/segments", async (req: FastifyRequest, _reply) => {
    const storeId = (req.headers["x-store-id"] as string);
    return await MarketingController.listSegments(storeId);
  });

  server.post("/segments", async (req: FastifyRequest, _reply) => {
    const storeId = (req.headers["x-store-id"] as string);
    return await MarketingController.createSegment(storeId, req.body as {
      name: string;
      criteria: Record<string, unknown>;
    });
  });

  // --- Campaigns ---
  server.get("/campaigns", async (req: FastifyRequest, _reply) => {
    const storeId = (req.headers["x-store-id"] as string);
    return await MarketingController.listCampaigns(storeId);
  });

  server.post("/campaigns", async (req: FastifyRequest, _reply) => {
    const storeId = (req.headers["x-store-id"] as string);
    const userId = (req.headers["x-user-id"] as string | undefined) || "system";
    const campaignData = req.body as {
      name: string;
      subject?: string;
      body?: string;
      segmentId?: string;
      channel: "EMAIL" | "SMS" | "WHATSAPP";
    };
    return await MarketingController.createCampaign(storeId, {
      ...campaignData,
      userId,
    });
  });

  // --- Automations ---
  server.get("/automations", async (req: FastifyRequest, _reply) => {
    const storeId = (req.headers["x-store-id"] as string);
    return await MarketingController.listAutomationRules(storeId);
  });

  server.put("/automations/:key", async (req: FastifyRequest, _reply) => {
    const storeId = (req.headers["x-store-id"] as string);
    const { key } = req.params as Record<string, string>;
    return await MarketingController.upsertAutomationRule(
      storeId,
      key,
      req.body as {
        name: string;
        triggerEvent: string;
        actions: unknown[];
        enabled: boolean;
      },
    );
  });
}
