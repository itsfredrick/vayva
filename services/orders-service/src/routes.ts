import { FastifyInstance } from "fastify";
import { OrdersController } from "./controller";
import {
  createReturnHandler,
  updateReturnStatusHandler,
  listReturnsHandler,
} from "./controllers/return.controller";

export const orderRoutes = async (server: FastifyInstance) => {
  // Basic Routes
  server.get("/orders", OrdersController.getOrders);
  server.get("/orders/:id", OrdersController.getOrder);
  server.post("/orders", OrdersController.createOrder); // Includes CRM logic

  // Actions
  server.post("/orders/:id/mark-paid", OrdersController.markPaid);
  server.post("/orders/:id/mark-delivered", OrdersController.markDelivered);

  // Legacy mapping (keep if needed or remove)
  // server.post('/publish', ...);

  // Returns (Integration 22A)
  server.post("/returns", createReturnHandler);
  server.post("/returns/:id/status", updateReturnStatusHandler);
  server.get("/returns", listReturnsHandler);
};
