import { FastifyInstance } from "fastify";
import { FulfillmentController } from "./controller";

export async function fulfillmentRoutes(server: FastifyInstance) {
  // Profiles & Zones
  server.post("/delivery/profiles", FulfillmentController.createProfile);
  server.get("/delivery/profiles", FulfillmentController.getProfiles);
  server.post("/delivery/zones", FulfillmentController.createZone);

  // Shipments
  server.post("/shipments", FulfillmentController.createShipment);
  server.post("/shipments/dispatch", FulfillmentController.dispatchShipment);
}
