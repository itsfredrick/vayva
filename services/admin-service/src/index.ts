import Fastify from "fastify";
import cors from "@fastify/cors";
import { adminRoutes } from "./routes";

const server = Fastify({ logger: true });

server.register(cors);

// Health check
server.get("/health", async () => ({ status: "ok" }));

// Register Routes
server.register(adminRoutes, { prefix: "/v1/admin" });

const start = async () => {
  try {
    await server.listen({ port: 3023, host: "0.0.0.0" });
    console.log("Admin Service running on port 3023");
  } catch (err) {
    (server.log as any).error(err);
    process.exit(1);
  }
};

start();
