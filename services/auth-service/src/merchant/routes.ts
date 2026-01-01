import { FastifyInstance } from "fastify";
import {
  loginHandler,
  registerHandler,
  verifyOtpHandler,
  resendOtpHandler,
  logoutHandler,
  getMeHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
} from "./controller";

export const merchantRoutes = async (server: FastifyInstance) => {
  // Public routes
  server.post("/login", loginHandler);
  server.post("/register", registerHandler);
  server.post("/verify-otp", verifyOtpHandler);
  server.post("/resend-otp", resendOtpHandler);
  server.post("/forgot-password", forgotPasswordHandler);
  server.post("/reset-password", resetPasswordHandler);

  // Authenticated routes
  server.get("/me", { onRequest: [server.authenticate] }, getMeHandler);
  server.post("/logout", { onRequest: [server.authenticate] }, logoutHandler);
};
