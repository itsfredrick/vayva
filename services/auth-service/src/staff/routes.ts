import { FastifyInstance } from "fastify";
import {
  inviteStaffHandler,
  getInvitesHandler,
  acceptInviteHandler,
  getStaffHandler,
  removeStaffHandler,
} from "./controller";

export const staffRoutes = async (server: FastifyInstance) => {
  // Public routes (Accepting invite)
  server.post("/invites/accept", acceptInviteHandler);

  // Authenticated routes
  server.post(
    "/invite",
    { onRequest: [server.authenticate] },
    inviteStaffHandler,
  );
  server.get(
    "/invites",
    { onRequest: [server.authenticate] },
    getInvitesHandler,
  );
  server.get("/", { onRequest: [server.authenticate] }, getStaffHandler);
  server.delete(
    "/:id",
    { onRequest: [server.authenticate] },
    removeStaffHandler,
  );
};
