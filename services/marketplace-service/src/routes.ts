import { FastifyInstance } from "fastify";
import { MarketplaceController } from "./controller";

export async function marketplaceRoutes(server: FastifyInstance) {
  // --- Directory ---
  server.get("/stores", async (req: any, reply) => {
    return await MarketplaceController.searchStores(req.query);
  });

  server.get("/stores/:slug", async (req: any, reply) => {
    const { slug } = req.params;
    return await MarketplaceController.getStoreProfile(slug);
  });

  // --- Reviews ---
  server.post("/reviews", async (req: any, reply) => {
    return await MarketplaceController.createReview(req.body);
  });

  server.get("/reviews", async (req: any, reply) => {
    const storeId = req.headers["x-store-id"];
    const { status } = req.query;
    return await MarketplaceController.listReviews(storeId, status);
  });

  server.post("/reviews/:id/publish", async (req: any, reply) => {
    const { id } = req.params;
    return await MarketplaceController.publishReview(id);
  });

  server.post("/reviews/:id/hide", async (req: any, reply) => {
    const { id } = req.params;
    return await MarketplaceController.hideReview(id);
  });

  // --- Trust Badges ---
  server.get("/trust-badges/:storeId", async (req: any, reply) => {
    const { storeId } = req.params;
    return await MarketplaceController.computeTrustBadges(storeId);
  });

  // --- Reports ---
  server.post("/reports", async (req: any, reply) => {
    return await MarketplaceController.createReport(req.body);
  });

  server.get("/reports", async (req: any, reply) => {
    const { status } = req.query;
    return await MarketplaceController.listReports(status);
  });
}
