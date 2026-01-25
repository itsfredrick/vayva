import { FastifyInstance, FastifyRequest } from "fastify";
import { AnalyticsController } from "./controller";

export async function analyticsRoutes(server: FastifyInstance) {
  // --- Overview ---
  server.get("/overview", async (req: FastifyRequest, reply) => {
    const storeId = (req.headers["x-store-id"] as string);
    if (!storeId) return reply.status(400).send({ error: "Store ID required" });
    const { range } = req.query as Record<string, string>;
    return await AnalyticsController.getOverview(storeId, range);
  });

  // --- Reports ---
  server.get("/reports/sales", async (req: FastifyRequest, _reply) => {
    const storeId = req.headers["x-store-id"] as string;
    return await AnalyticsController.getSalesReport(storeId, req.query as { dateFrom?: string; dateTo?: string });
  });

  // --- Goals ---
  server.get("/goals", async (req: FastifyRequest, _reply) => {
    const storeId = req.headers["x-store-id"] as string;
    return await AnalyticsController.listGoals(storeId);
  });

  server.post("/goals", async (req: FastifyRequest, _reply) => {
    const storeId = req.headers["x-store-id"] as string;
    return await AnalyticsController.createGoal(storeId, req.body as {
      metricKey: string;
      period: string;
      targetValue: number;
      startDate: string | Date;
    });
  });
}
