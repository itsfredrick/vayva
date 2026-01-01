import Fastify from "fastify";
import cors from "@fastify/cors";
import { billingRoutes } from "./routes";

const server = Fastify({ logger: true });

server.register(cors);

// Health check
server.get("/health", async () => ({ status: "ok" }));

// Register Routes
server.register(billingRoutes, { prefix: "/v1/billing" });

const start = async () => {
  try {
    await server.listen({ port: 3021, host: "0.0.0.0" });
    console.log("Billing Service running on port 3021");
  } catch (err) {
    (server.log as any).error(err);
    process.exit(1);
  }
};

start();
