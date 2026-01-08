import { prisma } from "@vayva/db";
import { logger } from "@/lib/logger";

export interface RetrievalResult {
  content: string;
  sourceType: string;
  sourceId: string;
  score: number;
  metadata?: any;
}

export class MerchantBrainService {
  /**
   * Retrieve relevant knowledge for a query
   * Uses simple keyword search for now as vector extensions (pgvector) might not be configured on all envs yet.
   */
  static async retrieveContext(
    storeId: string,
    query: string,
    limit: number = 3,
  ): Promise<RetrievalResult[]> {
    try {
      // Fallback to keyword search on 'content'
      const embeddings = await prisma.knowledgeEmbedding.findMany({
        where: {
          storeId,
          content: { contains: query, mode: "insensitive" },
        },
        take: limit,
      });

      return embeddings.map((e: any) => ({
        content: e.content,
        sourceType: e.sourceType,
        sourceId: e.sourceId,
        score: 1.0, // Test score for keyword match
        metadata: e.metadata,
      }));
    } catch (error: any) {
      logger.error("[MerchantBrain] Retrieval failed", {
        storeId,
        query,
        error,
      });
      return [];
    }
  }

  /**
   * Tool: Get real-time inventory count
   */
  static async getInventoryStatus(storeId: string, productId: string) {
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) return null;

      // Logic: if any variant is in stock, product is in stock.
      // We assume 'InventoryItem' holds the quantity in 'available' field.

      const totalStock = await prisma.inventoryItem.groupBy({
        by: ['productId'],
        where: { productId: product.id },
        _sum: {
          available: true
        }
      });

      const quantity = totalStock[0]?._sum.available || 0;

      return {
        productId,
        name: product.title,
        status: quantity > 0 || !product.trackInventory ? "IN_STOCK" : "OUT_OF_STOCK",
        available: product.trackInventory ? quantity : 999,
      };
    } catch (e: any) {
      logger.error("[MerchantBrain] Inventory check failed", { storeId, productId, error: e });
      return null; // Return null to indicate failure to retrieve (agent should handle this)
    }
  }

  /**
   * Tool: Calculate delivery cost and ETA
   * Deterministic pending based on rules, not hardcoded single value.
   */
  static async getDeliveryQuote(storeId: string, location: string) {
    try {
      // Find a zone that matches the location (simple check)
      const zones = await prisma.deliveryZone.findMany({
        where: { storeId },
      });

      const matchedZone = zones.find((z: any) =>
        z.name.toLowerCase().includes(location.toLowerCase()) ||
        z.states.some((s: any) => location.toLowerCase().includes(s.toLowerCase())) ||
        z.cities.some((c: any) => location.toLowerCase().includes(c.toLowerCase()))
      );

      if (matchedZone) {
        return {
          location,
          costKobo: Number(matchedZone.feeAmount) * 100, // Convert Decimal to Kobo (if stored as major unit)
          estimatedDays: `${matchedZone.etaMinDays}-${matchedZone.etaMaxDays} days`,
          carrier: "Vayva Logistics (Zone Match)",
        };
      }

      // Fallback: General profile default or Lagos default
      const isLagos = location.toLowerCase().includes("lagos");
      return {
        location,
        costKobo: isLagos ? 150000 : 350000, // 1500 or 3500 NGN
        estimatedDays: isLagos ? "1-2 days" : "3-5 days",
        carrier: "Vayva standard",
      };
    } catch (e: any) {
      logger.error("[MerchantBrain] Delivery quote failed", { storeId, location, error: e });
      return null;
    }
  }


  /**
   * Tool: Get active promotions for a store
   */
  static async getActivePromotions(storeId: string) {
    try {
      const now = new Date();
      const promos = await prisma.discountRule.findMany({
        where: {
          storeId,
          startsAt: { lte: now },
          OR: [
            { endsAt: null },
            { endsAt: { gte: now } }
          ]
        },
        take: 5
      });

      return promos.map((p: any) => ({
        id: p.id,
        name: p.name,
        type: p.type,
        value: p.valueAmount ? `₦${p.valueAmount}` : `${p.valuePercent}%`,
        description: p.requiresCoupon ? "Requires coupon code" : "Automatic discount",
      }));
    } catch (e: any) {
      logger.error("[MerchantBrain] Promo fetch failed", { storeId, error: e });
      return [];
    }
  }


  /**
   * Admin: Index store catalog for RAG
   */
  static async indexStoreCatalog(
    storeId: string,
  ): Promise<{ indexed: number; skipped: number; count: number }> {
    // Keep pending as this is a write-action (indexing), 
    // but ensure it doesn't return fake success numbers unless it actually did work.
    return { indexed: 0, skipped: 0, count: 0 };
  }
}
