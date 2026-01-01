import { FastifyInstance } from "fastify";
import {
  getOnboardingStateHandler,
  updateOnboardingStateHandler,
} from "./controller";

export const onboardingRoutes = async (server: FastifyInstance) => {
  server.get(
    "/state",
    { onRequest: [server.authenticate] },
    getOnboardingStateHandler,
  );
  server.patch(
    "/state",
    { onRequest: [server.authenticate] },
    updateOnboardingStateHandler,
  );
};
