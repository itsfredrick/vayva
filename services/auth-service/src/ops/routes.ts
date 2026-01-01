import { FastifyInstance } from "fastify";
import {
  loginHandler,
  verifyMfaHandler,
  getMeHandler,
  logoutHandler,
  registerOpsHandler,
  setupMfaHandler,
} from "./controller";

export const opsRoutes = async (server: FastifyInstance) => {
  server.post("/login", loginHandler);
  server.post("/verify-mfa", verifyMfaHandler);

  server.get("/me", { onRequest: [server.authenticate] }, getMeHandler);
  server.post("/logout", { onRequest: [server.authenticate] }, logoutHandler);

  // Internal/Bootstrap utils
  server.post("/register", registerOpsHandler);
  server.post("/mfa/setup", setupMfaHandler); // Helper to generate secret
};
