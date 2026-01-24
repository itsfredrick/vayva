import { prisma, AutomationAction, AutomationTrigger } from "@vayva/db";

export const MarketingController = {
  // --- Discounts ---
  createDiscountRule: async (
    storeId: string,
    data: {
      name: string;
      type: "PERCENT" | "AMOUNT" | "FREE_SHIPPING";
      valueAmount?: number;
      valuePercent?: number;
      appliesTo?: string;
      productIds?: string[];
      collectionIds?: string[];
      minOrderAmount?: number;
      maxDiscountAmount?: number;
      startsAt: string;
      endsAt?: string;
      usageLimitTotal?: number;
      usageLimitPerCustomer?: number;
      requiresCoupon?: boolean;
    },
  ) => {
    return await prisma.discountRule.create({
      data: {
        storeId,
        name: data.name,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        type: data.type as any, // Enum mismatch in input vs schema sometimes requires cast if not fully aligned
        valueAmount: data.valueAmount,
        valuePercent: data.valuePercent,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        appliesTo: (data.appliesTo as any) || "ALL",
        productIds: data.productIds || [],
        collectionIds: data.collectionIds || [],
        minOrderAmount: data.minOrderAmount,
        maxDiscountAmount: data.maxDiscountAmount,
        startsAt: new Date(data.startsAt),
        endsAt: data.endsAt ? new Date(data.endsAt) : null,
        usageLimitTotal: data.usageLimitTotal,
        usageLimitPerCustomer: data.usageLimitPerCustomer,
        requiresCoupon: data.requiresCoupon || false,
      },
    });
  },

  listDiscountRules: async (storeId: string) => {
    return await prisma.discountRule.findMany({
      where: { storeId },
      orderBy: { createdAt: "desc" },
    });
  },

  // --- Coupons ---
  createCoupon: async (
    storeId: string,
    data: { discountRuleId: string; code: string },
  ) => {
    return await prisma.coupon.create({
      data: {
        storeId,
        ruleId: data.discountRuleId,
        code: data.code,
        // status default ACTIVE
      },
    });
  },

  // --- Segments ---
  listSegments: async (storeId: string) => {
    return await prisma.segment.findMany({
      where: { storeId },
      orderBy: { createdAt: "desc" },
    });
  },

  createSegment: async (
    storeId: string,
    data: { name: string; criteria: Record<string, unknown> },
  ) => {
    return await prisma.segment.create({
      data: {
        storeId,
        name: data.name,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        definition: (data.criteria as any) || {},
      },
    });
  },

  // --- Campaigns ---
  listCampaigns: async (storeId: string) => {
    return await prisma.campaign.findMany({
      where: { storeId },
      orderBy: { createdAt: "desc" },
    });
  },

  createCampaign: async (
    storeId: string,
    data: {
      name: string;
      type?: "BROADCAST" | "AUTOMATION";
      channel?: "WHATSAPP" | "SMS" | "EMAIL";
      segmentId: string;
      content?: string;
      scheduledAt?: string;
      userId?: string;
    },
  ) => {
    return await prisma.campaign.create({
      data: {
        storeId,
        name: data.name,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        type: (data.type as any) || "BROADCAST",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        channel: (data.channel as any) || "EMAIL",
        status: "DRAFT",
        segmentId: data.segmentId,
        messageBody: data.content || "",
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
        createdByUserId: data.userId || "system",
      },
    });
  },

  // --- Automations ---
  upsertAutomationRule: async (
    storeId: string,
    key: string,
    data: {
      triggerType: string;
      actionType: string;
      name?: string;
      enabled?: boolean;
      config?: Record<string, unknown>;
    },
  ) => {
    const triggerType = data.triggerType as AutomationTrigger | undefined;
    const actionType = data.actionType as AutomationAction | undefined;

    if (!triggerType || !actionType) {
      throw new Error("triggerType and actionType are required");
    }

    return await prisma.automationRule.upsert({
      where: { id: key },
      create: {
        id: key,
        key: key,
        storeId,
        name: data.name ?? key,
        triggerType,
        actionType,
        enabled: data.enabled || false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        config: (data.config as any) || {},
      },
      update: {
        name: data.name ?? key,
        triggerType,
        actionType,
        enabled: data.enabled ?? undefined,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        config: (data.config as any) ?? undefined,
      },
    });
  },

  listAutomationRules: async (storeId: string) => {
    return await prisma.automationRule.findMany({
      where: { storeId },
    });
  },
};
