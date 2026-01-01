import { FastifyInstance } from "fastify";
import { AdminController } from "./controller";

export async function adminRoutes(server: FastifyInstance) {
  // --- Merchant Management ---
  server.get("/merchants/search", async (req: any, reply) => {
    const { q } = req.query;
    return await AdminController.searchMerchants(q);
  });

  server.get("/merchants/:id", async (req: any, reply) => {
    const { id } = req.params;
    return await AdminController.getMerchantDetail(id);
  });

  server.post("/merchants/:id/suspend", async (req: any, reply) => {
    const { id } = req.params;
    const { reason } = req.body;
    const actorUserId = req.headers["x-admin-user-id"];
    const ipAddress = req.ip;
    return await AdminController.suspendMerchant(
      id,
      reason,
      actorUserId,
      ipAddress,
    );
  });

  // --- Kill Switches ---
  server.get("/killswitches", async (req: any, reply) => {
    return await AdminController.listKillSwitches();
  });

  server.post("/killswitches/:key/toggle", async (req: any, reply) => {
    const { key } = req.params;
    const { enabled, reason } = req.body;
    const actorUserId = req.headers["x-admin-user-id"];
    return await AdminController.toggleKillSwitch(
      key,
      enabled,
      reason,
      actorUserId,
    );
  });

  // --- Moderation ---
  server.get("/moderation/reviews", async (req: any, reply) => {
    return await AdminController.listPendingReviews();
  });

  server.post("/moderation/reviews/:id", async (req: any, reply) => {
    const { id } = req.params;
    const { action, reason } = req.body;
    const actorUserId = req.headers["x-admin-user-id"];
    return await AdminController.moderateReview(
      id,
      action,
      reason,
      actorUserId,
    );
  });

  // --- Support Cases ---
  server.get("/support/cases", async (req: any, reply) => {
    const { status } = req.query;
    return await AdminController.listSupportCases(status);
  });

  server.post("/support/cases", async (req: any, reply) => {
    const actorUserId = req.headers["x-admin-user-id"];
    return await AdminController.createSupportCase(req.body, actorUserId);
  });

  // --- System Health ---
  server.get("/health/system", async (req: any, reply) => {
    return await AdminController.getSystemHealth();
  });
}
