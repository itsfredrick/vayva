import { FastifyInstance, FastifyRequest } from "fastify";
import { ThemeController } from "./controller";

export async function themeRoutes(server: FastifyInstance) {
  // --- Template Gallery ---
  server.get("/templates", async (req: FastifyRequest, _reply) => {
    return await ThemeController.listTemplates(req.query as { category?: string });
  });

  server.get("/templates/:key", async (req: FastifyRequest, _reply) => {
    const { key } = req.params as { key: string };
    return await ThemeController.getTemplate(key);
  });

  // --- Merchant Theme ---
  server.get("/theme", async (req: FastifyRequest, _reply) => {
    const storeId = req.headers["x-store-id"] as string;
    return await ThemeController.getMerchantTheme(storeId);
  });

  server.post("/theme/apply", async (req: FastifyRequest, _reply) => {
    const storeId = req.headers["x-store-id"] as string;
    const userId = (req.headers["x-user-id"] as string | undefined) as string | undefined;
    const { templateKey } = req.body as { templateKey: string };
    return await ThemeController.applyTemplate(storeId, templateKey, userId);
  });

  server.put("/theme/settings", async (req: FastifyRequest, _reply) => {
    const storeId = req.headers["x-store-id"] as string;
    return await ThemeController.updateSettings(storeId, req.body as Record<string, unknown>);
  });

  server.post("/theme/publish", async (req: FastifyRequest, _reply) => {
    const storeId = req.headers["x-store-id"] as string;
    const userId = (req.headers["x-user-id"] as string | undefined) as string | undefined;
    return await ThemeController.publishTheme(storeId, userId);
  });
}
