import { FastifyInstance } from "fastify";
import { processHandler } from "./controller";

export const aiRoutes = async (server: FastifyInstance) => {
  server.post("/process", processHandler);
};
