import { FastifyInstance } from "fastify";
import { notifyHandler, listNotificationsHandler } from "./controller";

export const notificationRoutes = async (server: FastifyInstance) => {
  server.post("/notify", notifyHandler);
  server.get("/", listNotificationsHandler);
};
