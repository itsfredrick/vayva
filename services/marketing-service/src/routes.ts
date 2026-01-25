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
    // Fix: correct shape for CreateDiscountRule
    const payload: {
      name: string;
      code: string;
      valuePercent?: number;
      type: "PERCENT" | "AMOUNT" | "FREE_SHIPPING";
      startsAt: string;
    } = {
      ...(req.body as any),
      type: "PERCENT",
      valuePercent: (req.body as any).value || 0,
      startsAt: new Date().toISOString(),
    };
    return await MarketingController.createDiscountRule(storeId, payload);
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
      segmentId?: string; // Input allows optional, but service might require string
      channel: "EMAIL" | "SMS" | "WHATSAPP";
    };

    if (!campaignData.segmentId) {
      // Logic to handle missing segmentId if required, or let it throw if controller expects string
      throw new Error("segmentId is required");
    }

    return await MarketingController.createCampaign(storeId, {
      ...campaignData,
      segmentId: campaignData.segmentId,
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
      {
        name: (req.body as any).name,
        triggerType: "EVENT",
        actionType: "SEND_MESSAGE",
        enabled: (req.body as any).enabled,
        config: {
          triggerEvent: (req.body as any).triggerEvent,
          actions: (req.body as any).actions,
        },
      }
    );
  });
}
