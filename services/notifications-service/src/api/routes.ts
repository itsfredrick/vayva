import { FastifyInstance } from "fastify";
import { NotificationController } from "./controller";

export async function publicRoutes(server: FastifyInstance) {
  // None
}

export async function protectedRoutes(server: FastifyInstance) {
  server.post("/notifications/send", NotificationController.send);
  server.get("/notifications/templates", NotificationController.getTemplates);
  server.put(
    "/notifications/templates/:id",
    NotificationController.updateTemplate,
  );
}
