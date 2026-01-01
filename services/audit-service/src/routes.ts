import { FastifyInstance } from "fastify";
import { emitAuditHandler, listAuditEventsHandler } from "./controller";

export const auditRoutes = async (server: FastifyInstance) => {
  server.post("/emit", emitAuditHandler);
  server.get("/", listAuditEventsHandler);
};
