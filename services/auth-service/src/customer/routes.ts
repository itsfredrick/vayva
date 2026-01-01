import { FastifyInstance } from "fastify";
import { startAuthHandler, verifyAuthHandler } from "./controller";

export const customerRoutes = async (server: FastifyInstance) => {
  server.post("/start", startAuthHandler);
  server.post("/verify", verifyAuthHandler);
  // server.post('/refresh', refreshHandler);
  // server.post('/logout', logoutHandler);
};
