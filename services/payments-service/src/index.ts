import Fastify from "fastify";
import cors from "@fastify/cors";

const server = Fastify({
  logger: true,
});

server.register(cors);

server.get("/health", async () => {
  return { status: "ok", service: "paystack-payments-service" };
});

import { startWorker } from "./worker";

const start = async () => {
  try {
    await server.listen({ port: 3006, host: "0.0.0.0" });

    // Start Background Worker
    startWorker();

  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
