import Fastify from "fastify";
import cors from "@fastify/cors";
import { webhookRoutes } from "./routes";

const server = Fastify({ logger: true });

server.register(cors);

// Health check
server.get("/health", async () => ({ status: "ok" }));

// Register Routes
server.register(webhookRoutes, { prefix: "/v1/webhooks" });

const start = async () => {
  try {
    await server.listen({ port: 3022, host: "0.0.0.0" });
    console.log("Webhook Service running on port 3022");
  } catch (err) {
    (server.log as any).error(err);
    process.exit(1);
  }
};

start();
