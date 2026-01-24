import Fastify from "fastify";
import cors from "@fastify/cors";
import { auditRoutes } from "./routes";

const server = Fastify({ logger: true });

server.register(cors);

// Health check
server.get("/health", async () => ({ status: "ok" }));

// Register Routes
server.register(auditRoutes, { prefix: "/v1/audit" });

const start = async () => {
  try {
    await server.listen({ port: 3004, host: "0.0.0.0" });
  } catch (err) {
    (server.log as unknown).error(err);
    process.exit(1);
  }
};

start();
