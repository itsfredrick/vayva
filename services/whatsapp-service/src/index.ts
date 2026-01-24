import Fastify from "fastify";
import cors from "@fastify/cors";
import { whatsappRoutes } from "./routes";

const server = Fastify({ logger: true });

server.register(cors);

// Health check
server.get("/health", async () => ({ status: "ok" }));

// Register Custom Parser for Webhook Signature Verification
server.addContentTypeParser("application/json", { parseAs: "buffer" }, (req, body, done) => {
  try {
    (req as unknown).rawBody = body; // Store buffer for HMAC verification
    const json = JSON.parse(body.toString());
    done(null, json);
  } catch (err: unknown) {
    err.statusCode = 400;
    done(err, undefined);
  }
});

// Register Routes
server.register(whatsappRoutes, { prefix: "/v1/whatsapp" });

const start = async () => {
  try {
    await server.listen({ port: 3005, host: "0.0.0.0" });
  } catch (err) {
    (server.log as unknown).error(err);
    process.exit(1);
  }
};

start();
