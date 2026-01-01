import { FastifyInstance } from "fastify";
import { OnboardingController } from "./controller";

export async function onboardingRoutes(server: FastifyInstance) {
  // --- Wizard ---
  server.get("/wizard", async (req: any, reply) => {
    const storeId = req.headers["x-store-id"];
    if (!storeId) return reply.status(400).send({ error: "Store ID required" });
    return await OnboardingController.getWizardState(storeId);
  });

  server.post("/wizard/step", async (req: any, reply) => {
    const storeId = req.headers["x-store-id"];
    const { stepKey, action } = req.body;
    return await OnboardingController.updateWizardStep(
      storeId,
      stepKey,
      action,
    );
  });

  // --- Checklist ---
  server.get("/checklist", async (req: any, reply) => {
    const storeId = req.headers["x-store-id"];
    return await OnboardingController.getChecklist(storeId);
  });

  // --- Storefront ---
  server.get("/storefront", async (req: any, reply) => {
    const storeId = req.headers["x-store-id"];
    return await OnboardingController.getStorefrontSettings(storeId);
  });

  server.put("/storefront", async (req: any, reply) => {
    const storeId = req.headers["x-store-id"];
    return await OnboardingController.updateStorefrontSettings(
      storeId,
      req.body,
    );
  });
}
