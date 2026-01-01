import { FastifyInstance } from "fastify";
import { AnalyticsController } from "./controller";

export async function analyticsRoutes(server: FastifyInstance) {
  // --- Overview ---
  server.get("/overview", async (req: any, reply) => {
    const storeId = req.headers["x-store-id"];
    if (!storeId) return reply.status(400).send({ error: "Store ID required" });
    const { range } = req.query;
    return await AnalyticsController.getOverview(storeId, range);
  });

  // --- Reports ---
  server.get("/reports/sales", async (req: any, reply) => {
    const storeId = req.headers["x-store-id"];
    return await AnalyticsController.getSalesReport(storeId, req.query);
  });

  // --- Goals ---
  server.get("/goals", async (req: any, reply) => {
    const storeId = req.headers["x-store-id"];
    return await AnalyticsController.listGoals(storeId);
  });

  server.post("/goals", async (req: any, reply) => {
    const storeId = req.headers["x-store-id"];
    return await AnalyticsController.createGoal(storeId, req.body);
  });
}
