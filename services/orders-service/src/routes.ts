import { FastifyInstance } from "fastify";
import { OrdersController } from "./controller";
import {
  createReturnHandler,
  updateReturnStatusHandler,
  listReturnsHandler,
} from "./controllers/return.controller";

export const orderRoutes = async (server: FastifyInstance) => {
  // Basic Routes
  server.get("/", OrdersController.getOrders);
  server.get("/:id", OrdersController.getOrder);
  server.post("/", OrdersController.createOrder); // Includes CRM logic

  // Actions
  server.post("/:id/mark-paid", OrdersController.markPaid);
  server.post("/:id/mark-delivered", OrdersController.markDelivered);

  // Legacy mapping (keep if needed or remove)
  // server.post('/publish', ...);

  // Returns (Integration 22A)
  server.post("/returns", createReturnHandler);
  server.post("/returns/:id/status", updateReturnStatusHandler);
  server.get("/returns", listReturnsHandler);
};
