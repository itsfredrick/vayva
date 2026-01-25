import { FastifyInstance, FastifyRequest } from "fastify";
import { OnboardingController } from "./controller";

export async function onboardingRoutes(server: FastifyInstance) {
  // --- Wizard ---
  server.get("/wizard", async (req: FastifyRequest, reply) => {
    const storeId = req.headers["x-store-id"] as string;
    if (!storeId) return reply.status(400).send({ error: "Store ID required" });
    return await OnboardingController.getWizardState(storeId);
  });

  server.post("/wizard/step", async (req: FastifyRequest<{ Body: { stepKey: string; action: "skip" | "complete" } }>, _reply) => {
    const storeId = req.headers["x-store-id"] as string;
    const { stepKey, action } = req.body;
    return await OnboardingController.updateWizardStep(
      storeId,
      stepKey,
      action,
    );
  });

  // --- Checklist ---
  server.get("/checklist", async (req: FastifyRequest, _reply) => {
    const storeId = req.headers["x-store-id"] as string;
    return await OnboardingController.getChecklist(storeId);
  });

  // --- Storefront ---
  server.get("/storefront", async (req: FastifyRequest, _reply) => {
    const storeId = req.headers["x-store-id"] as string;
    return await OnboardingController.getStorefrontSettings(storeId);
  });

  server.put("/storefront", async (req: FastifyRequest<{ Body: Record<string, unknown> }>, _reply) => {
    const storeId = req.headers["x-store-id"] as string;
    return await OnboardingController.updateStorefrontSettings(
      storeId,
      req.body,
    );
  });
}
