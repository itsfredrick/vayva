import { FastifyInstance } from "fastify";
import { listApprovalsHandler, approveHandler } from "./controller";

export const approvalRoutes = async (server: FastifyInstance) => {
  server.get("/", listApprovalsHandler);
  server.post("/:id/approve", approveHandler);
};
