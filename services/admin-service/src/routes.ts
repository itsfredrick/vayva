import { FastifyInstance, FastifyRequest } from "fastify";
import { AdminController, CreateSupportCaseData } from "./controller";

export async function adminRoutes(server: FastifyInstance) {
  // --- Merchant Management ---
  server.get("/merchants/search", async (req: FastifyRequest<{ Querystring: { q: string } }>, _reply) => {
    const { q } = req.query;
    return await AdminController.searchStores(q);
  });

  server.get("/merchants/:id", async (req: FastifyRequest<{ Params: { id: string } }>, _reply) => {
    const { id } = req.params;
    return await AdminController.getMerchantDetail(id);
  });

  server.post("/merchants/:id/suspend", async (req: FastifyRequest<{ Params: { id: string }; Body: { reason: string } }>, _reply) => {
    const { id } = req.params;
    const { reason } = req.body;
    const actorUserId = (req.headers["x-admin-user-id"] as string) || "SYSTEM";
    const ipAddress = req.ip;
    return await AdminController.suspendMerchant(
      id,
      reason,
      actorUserId,
      ipAddress,
    );
  });

  // --- Kill Switches ---
  server.get("/killswitches", async (_req: FastifyRequest, _reply) => {
    return await AdminController.listKillSwitches();
  });

  server.post("/killswitches/:key/toggle", async (req: FastifyRequest<{ Params: { key: string }; Body: { enabled: boolean; reason: string } }>, _reply) => {
    const { key } = req.params;
    const { enabled, reason } = req.body;
    const actorUserId = (req.headers["x-admin-user-id"] as string) || "SYSTEM";
    return await AdminController.toggleKillSwitch(
      key,
      enabled,
      reason,
      actorUserId,
    );
  });

  // --- Moderation ---
  server.get("/moderation/reviews", async (_req: FastifyRequest, _reply) => {
    return await AdminController.listPendingReviews();
  });

  server.post("/moderation/reviews/:id", async (req: FastifyRequest<{ Params: { id: string }; Body: { action: "PUBLISHED" | "REJECTED" | "HIDDEN"; reason: string } }>, _reply) => {
    const { id } = req.params;
    const { action, reason } = req.body;
    const actorUserId = (req.headers["x-admin-user-id"] as string) || "SYSTEM";
    return await AdminController.moderateReview(
      id,
      action,
      reason,
      actorUserId,
    );
  });

  // --- Support Cases ---
  server.get("/support/cases", async (req: FastifyRequest<{ Querystring: { status?: string } }>, _reply) => {
    const { status } = req.query;
    return await AdminController.listSupportCases(status);
  });

  server.post("/support/cases", async (req: FastifyRequest<{ Body: CreateSupportCaseData }>, _reply) => {
    const actorUserId = (req.headers["x-admin-user-id"] as string) || "SYSTEM";
    return await AdminController.createSupportCase(req.body, actorUserId);
  });

  // --- System Health ---
  server.get("/health/system", async (_req: FastifyRequest, _reply) => {
    return await AdminController.getSystemHealth();
  });
}
