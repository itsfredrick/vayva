import Fastify from "fastify";
import cors from "@fastify/cors";
import { whatsappRoutes } from "./routes";

const server = Fastify({ logger: true });

server.register(cors);

// Health check
server.get("/health", async () => ({ status: "ok" }));

// Register Routes
server.register(whatsappRoutes, { prefix: "/v1/whatsapp" });

const start = async () => {
  try {
    await server.listen({ port: 3005, host: "0.0.0.0" });
    console.log("WhatsApp Service running on port 3005");
  } catch (err) {
    (server.log as any).error(err);
    process.exit(1);
  }
};

start();
