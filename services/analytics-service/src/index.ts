import Fastify from "fastify";
import cors from "@fastify/cors";
import { analyticsRoutes } from "./routes";

const server = Fastify({ logger: true });

server.register(cors);

// Health check
server.get("/health", async () => ({ status: "ok" }));

// Register Routes
server.register(analyticsRoutes, { prefix: "/v1/analytics" });

const start = async () => {
  try {
    await server.listen({ port: 3016, host: "0.0.0.0" });
    console.log("Analytics Service running on port 3016");
  } catch (err) {
    (server.log as any).error(err);
    process.exit(1);
  }
};

start();
