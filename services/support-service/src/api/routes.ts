import { FastifyInstance } from "fastify";
import { SupportController } from "./controller";

export async function publicRoutes(server: FastifyInstance) {
  // None for now, tickets are internal/authed
}

export async function protectedRoutes(server: FastifyInstance) {
  server.post("/tickets", SupportController.createTicket);
  server.get("/tickets", SupportController.getTickets);
  server.get("/tickets/:id", SupportController.getTicket);
  server.put("/tickets/:id", SupportController.updateTicket);

  server.post("/tickets/:id/messages", SupportController.addMessage);
}
