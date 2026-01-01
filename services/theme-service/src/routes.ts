import { FastifyInstance } from "fastify";
import { ThemeController } from "./controller";

export async function themeRoutes(server: FastifyInstance) {
  // --- Template Gallery ---
  server.get("/templates", async (req: any, reply) => {
    return await ThemeController.listTemplates(req.query);
  });

  server.get("/templates/:key", async (req: any, reply) => {
    const { key } = req.params;
    return await ThemeController.getTemplate(key);
  });

  // --- Merchant Theme ---
  server.get("/theme", async (req: any, reply) => {
    const storeId = req.headers["x-store-id"];
    return await ThemeController.getMerchantTheme(storeId);
  });

  server.post("/theme/apply", async (req: any, reply) => {
    const storeId = req.headers["x-store-id"];
    const userId = req.headers["x-user-id"];
    const { templateKey } = req.body;
    return await ThemeController.applyTemplate(storeId, templateKey, userId);
  });

  server.put("/theme/settings", async (req: any, reply) => {
    const storeId = req.headers["x-store-id"];
    return await ThemeController.updateSettings(storeId, req.body);
  });

  server.post("/theme/publish", async (req: any, reply) => {
    const storeId = req.headers["x-store-id"];
    const userId = req.headers["x-user-id"];
    return await ThemeController.publishTheme(storeId, userId);
  });
}
