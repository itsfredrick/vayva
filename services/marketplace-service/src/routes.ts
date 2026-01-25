import { FastifyInstance, FastifyRequest } from "fastify";
import { MarketplaceController } from "./controller";

export async function marketplaceRoutes(server: FastifyInstance) {
  // --- Directory ---
  server.get("/stores", async (req: FastifyRequest, _reply) => {
    return await MarketplaceController.searchStores(req.query as Record<string, string>);
  });

  server.get("/stores/:slug", async (req: FastifyRequest, _reply) => {
    const { slug } = req.params as { slug: string };
    return await MarketplaceController.getStoreProfile(slug);
  });

  // --- Reviews ---
  server.post("/reviews", async (req: FastifyRequest, _reply) => {
    return await MarketplaceController.createReview(req.body as {
      storeId: string;
      rating: number;
      comment?: string;
      userId: string;
    });
  });

  server.get("/reviews", async (req: FastifyRequest, _reply) => {
    const storeId = req.headers["x-store-id"] as string;
    const { status } = req.query as { status?: string };
    return await MarketplaceController.listReviews(storeId, status);
  });

  server.post("/reviews/:id/publish", async (req: FastifyRequest, _reply) => {
    const { id } = req.params as { id: string };
    return await MarketplaceController.publishReview(id);
  });

  server.post("/reviews/:id/hide", async (req: FastifyRequest, _reply) => {
    const { id } = req.params as { id: string };
    return await MarketplaceController.hideReview(id);
  });

  // --- Trust Badges ---
  server.get("/trust-badges/:storeId", async (req: FastifyRequest, _reply) => {
    const { storeId } = req.params as { storeId: string };
    return await MarketplaceController.computeTrustBadges(storeId);
  });

  // --- Reports ---
  server.post("/reports", async (req: FastifyRequest, _reply) => {
    return await MarketplaceController.createReport(req.body as {
      targetType: string;
      targetId: string;
      reason: string;
      userId: string;
    });
  });

  server.get("/reports", async (req: FastifyRequest, _reply) => {
    const { status } = req.query as { status?: string };
    return await MarketplaceController.listReports(status as string);
  });
}
