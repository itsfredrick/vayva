import { describe, it, expect, vi, beforeEach } from "vitest";
import { MerchantBrainService } from "./merchant-brain.service";
import { prisma } from "@vayva/db";


// Mock Prisma
const mockFindMany = vi.fn();
const mockFindUnique = vi.fn();
const mockGroupBy = vi.fn();

vi.mock("@vayva/db", () => ({
  prisma: {
    knowledgeEmbedding: {
      findMany: (...args: any[]) => mockFindMany(...args),
    },
    product: {
      findUnique: (...args: any[]) => mockFindUnique(...args),
    },
    inventoryItem: {
      groupBy: (...args: any[]) => mockGroupBy(...args),
    },
    deliveryZone: {
      findMany: vi.fn(),
    },
    discountRule: {
      findMany: vi.fn(),
    }
  },
}));


// Mock logger
vi.mock("@/lib/logger", () => ({
  logger: {
    error: vi.fn(),
  },
}));

describe("MerchantBrainService", () => {
  const TEST_STORE_A = "store-a-uuid";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("retrieveContext", () => {
    it("should return mapped results from knowledge embeddings", async () => {
      mockFindMany.mockResolvedValue([
        { content: "Return policy", sourceType: "POLICY", sourceId: "pol-1", metadata: {} }
      ]);

      const results = await MerchantBrainService.retrieveContext(TEST_STORE_A, "policy");

      expect(mockFindMany).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.objectContaining({
          storeId: TEST_STORE_A,
          content: expect.objectContaining({ contains: "policy" })
        })
      }));
      expect(results).toHaveLength(1);
      expect(results[0].content).toBe("Return policy");
    });

    it("should handle errors gracefully", async () => {
      mockFindMany.mockRejectedValue(new Error("DB Error"));
      const results = await MerchantBrainService.retrieveContext(TEST_STORE_A, "fail");
      expect(results).toEqual([]);
    });
  });

  describe("getInventoryStatus", () => {
    it("should return IN_STOCK if items available", async () => {
      mockFindUnique.mockResolvedValue({ id: "prod-1", title: "Test Product", trackInventory: true });
      mockGroupBy.mockResolvedValue([
        { _sum: { available: 5 } }
      ]);

      const result = await MerchantBrainService.getInventoryStatus(TEST_STORE_A, "prod-1");

      expect(result).not.toBeNull();
      if (!result) return;
      expect(result.status).toBe("IN_STOCK");
      expect(result.available).toBe(5);
      expect(result.name).toBe("Test Product");
    });

    it("should return OUT_OF_STOCK if 0 items available", async () => {
      mockFindUnique.mockResolvedValue({ id: "prod-1", title: "Test Product", trackInventory: true });
      mockGroupBy.mockResolvedValue([
        { _sum: { available: 0 } }
      ]);

      const result = await MerchantBrainService.getInventoryStatus(TEST_STORE_A, "prod-1");

      expect(result).not.toBeNull();
      if (!result) return;
      expect(result.status).toBe("OUT_OF_STOCK");
      expect(result.available).toBe(0);
    });

    it("should return OUT_OF_STOCK (0) if groupBy returns empty array (no record)", async () => {
      mockFindUnique.mockResolvedValue({ id: "prod-1", title: "Test Product", trackInventory: true });
      mockGroupBy.mockResolvedValue([]);

      const result = await MerchantBrainService.getInventoryStatus(TEST_STORE_A, "prod-1");

      expect(result).not.toBeNull();
      if (!result) return;
      expect(result.status).toBe("OUT_OF_STOCK");
      expect(result.available).toBe(0);
    });

    it("should ALWAYS return IN_STOCK if trackInventory is false", async () => {
      // If trackInventory is false, we don't care about inventory items count (logic in service: available: product.trackInventory ? quantity : 999)
      mockFindUnique.mockResolvedValue({ id: "prod-1", title: "Digital Product", trackInventory: false });
      // Even if DB says 0 available or whatever
      mockGroupBy.mockResolvedValue([]);

      const result = await MerchantBrainService.getInventoryStatus(TEST_STORE_A, "prod-1");

      expect(result).not.toBeNull();
      if (!result) return;
      expect(result.status).toBe("IN_STOCK");
      expect(result.available).toBe(999);
    });
  });

  describe("getDeliveryQuote", () => {
    it("should match a specific delivery zone", async () => {
      (prisma.deliveryZone.findMany as any).mockResolvedValue([
        { name: "Lekki Zone", states: ["Lagos"], cities: ["Lekki"], feeAmount: 2000, etaMinDays: 1, etaMaxDays: 1 }
      ]);

      const result = await MerchantBrainService.getDeliveryQuote(TEST_STORE_A, "Lekki");

      expect(result?.costKobo).toBe(200000);
      expect(result?.carrier).toContain("Zone Match");
    });

    it("should fallback to Lagos default cost if no zone matches", async () => {
      (prisma.deliveryZone.findMany as any).mockResolvedValue([]);

      const result = await MerchantBrainService.getDeliveryQuote(TEST_STORE_A, "Ikeja, Lagos");

      expect(result?.costKobo).toBe(150000);
      expect(result?.estimatedDays).toBe("1-2 days");
    });
  });

  describe("getActivePromotions", () => {
    it("should return active promotions", async () => {
      (prisma.discountRule.findMany as any).mockResolvedValue([
        { id: "promo-1", name: "Summer Sale", type: "PERCENTAGE", valuePercent: 10, valueAmount: null, requiresCoupon: false }
      ]);

      const result = await MerchantBrainService.getActivePromotions(TEST_STORE_A);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Summer Sale");
      expect(result[0].value).toBe("10%");
    });
  });
});

