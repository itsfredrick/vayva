import { FastifyInstance, FastifyRequest } from "fastify";
import { MarketingController } from "./controller";

interface CreateDiscountRuleBody {
  name: string;
  code: string;
  value?: number;
  valuePercent?: number;
  valueAmount?: number;
  type?: "PERCENT" | "AMOUNT" | "FREE_SHIPPING" | "PERCENTAGE" | "FIXED";
  startsAt?: string;
  endsAt?: string;
}

function isCreateDiscountRuleBody(body: unknown): body is CreateDiscountRuleBody {
  return (
    typeof body === "object" &&
    body !== null &&
    "name" in body &&
    "code" in body
  );
}

interface CreateCouponBody {
  ruleId: string;
  code: string;
}

function isCreateCouponBody(body: unknown): body is CreateCouponBody {
  return (
    typeof body === "object" &&
    body !== null &&
    "ruleId" in body &&
    "code" in body
  );
}

interface CreateSegmentBody {
  name: string;
  criteria: Record<string, unknown>;
}

function isCreateSegmentBody(body: unknown): body is CreateSegmentBody {
  return (
    typeof body === "object" &&
    body !== null &&
    "name" in body &&
    "criteria" in body
  );
}

interface CreateCampaignBody {
  name: string;
  type?: "BROADCAST" | "AUTOMATION";
  channel?: "WHATSAPP" | "SMS" | "EMAIL";
  segmentId: string;
  content?: string;
  scheduledAt?: string;
}

function isCreateCampaignBody(body: unknown): body is CreateCampaignBody {
  return (
    typeof body === "object" &&
    body !== null &&
    "name" in body &&
    "segmentId" in body
  );
}

interface UpsertAutomationRuleBody {
  name?: string;
  enabled?: boolean;
  triggerEvent?: string;
  triggerType?: string;
  actionType?: string;
  actions?: unknown[];
  config?: Record<string, unknown>;
}

function isUpsertAutomationRuleBody(body: unknown): body is UpsertAutomationRuleBody {
  return typeof body === "object" && body !== null;
}

export async function marketingRoutes(server: FastifyInstance) {
  // --- Discounts ---
  server.get("/discounts/rules", async (req: FastifyRequest, _reply) => {
    const storeId = req.headers["x-store-id"] as string;
    return await MarketingController.listDiscountRules(storeId);
  });

  server.post("/discounts/rules", async (req: FastifyRequest, _reply) => {
    const storeId = req.headers["x-store-id"] as string;
    const body = req.body;

    if (!isCreateDiscountRuleBody(body)) {
      throw new Error("Invalid request body");
    }

    // Fix: correct shape for CreateDiscountRule and remove legacy any
    const payload = {
      name: body.name,
      code: body.code,
      type: (body.type === "PERCENTAGE" ? "PERCENT" : body.type === "FIXED" ? "AMOUNT" : body.type) as "PERCENT" | "AMOUNT" | "FREE_SHIPPING" || "PERCENT",
      valuePercent: body.valuePercent ?? (body.type === "PERCENTAGE" ? body.value : undefined),
      valueAmount: body.valueAmount ?? (body.type === "FIXED" ? body.value : undefined),
      startsAt: body.startsAt || new Date().toISOString(),
      endsAt: body.endsAt,
    };
    return await MarketingController.createDiscountRule(storeId, payload);
  });

  server.post("/discounts/coupons", async (req: FastifyRequest, _reply) => {
    const storeId = req.headers["x-store-id"] as string;
    const body = req.body;

    if (!isCreateCouponBody(body)) {
      throw new Error("Invalid request body");
    }

    return await MarketingController.createCoupon(storeId, {
      discountRuleId: body.ruleId,
      code: body.code,
    });
  });

  // --- Segments ---
  server.get("/segments", async (req: FastifyRequest, _reply) => {
    const storeId = req.headers["x-store-id"] as string;
    return await MarketingController.listSegments(storeId);
  });

  server.post("/segments", async (req: FastifyRequest, _reply) => {
    const storeId = req.headers["x-store-id"] as string;
    const body = req.body;

    if (!isCreateSegmentBody(body)) {
      throw new Error("Invalid request body");
    }

    return await MarketingController.createSegment(storeId, {
      name: body.name,
      criteria: body.criteria,
    });
  });

  // --- Campaigns ---
  server.get("/campaigns", async (req: FastifyRequest, _reply) => {
    const storeId = req.headers["x-store-id"] as string;
    return await MarketingController.listCampaigns(storeId);
  });

  server.post("/campaigns", async (req: FastifyRequest, _reply) => {
    const storeId = req.headers["x-store-id"] as string;
    const userId = (req.headers["x-user-id"] as string | undefined) || "system";
    const body = req.body;

    if (!isCreateCampaignBody(body)) {
      throw new Error("Invalid request body");
    }

    return await MarketingController.createCampaign(storeId, {
      ...body,
      segmentId: body.segmentId,
      userId,
    });
  });

  // --- Automations ---
  server.get("/automations", async (req: FastifyRequest, _reply) => {
    const storeId = req.headers["x-store-id"] as string;
    return await MarketingController.listAutomationRules(storeId);
  });

  server.put("/automations/:key", async (req: FastifyRequest, _reply) => {
    const storeId = req.headers["x-store-id"] as string;
    const { key } = req.params as { key: string };
    const body = req.body;

    if (!isUpsertAutomationRuleBody(body)) {
      throw new Error("Invalid request body");
    }

    return await MarketingController.upsertAutomationRule(
      storeId,
      key,
      {
        name: body.name,
        triggerType: body.triggerType || "EVENT",
        actionType: body.actionType || "SEND_MESSAGE",
        enabled: body.enabled,
        config: body.config || {
          triggerEvent: body.triggerEvent,
          actions: body.actions,
        },
      }
    );
  });
}
