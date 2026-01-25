import Fastify, { FastifyRequest } from "fastify";
import cors from "@fastify/cors";
import { whatsappRoutes } from "./routes";

const server = Fastify({ logger: true });

server.register(cors);

// Health check
server.get("/health", async () => ({ status: "ok" }));

interface RawBodyRequest extends FastifyRequest {
  rawBody?: Buffer;
}

// Register Custom Parser for Webhook Signature Verification
server.addContentTypeParser("application/json", { parseAs: "buffer" }, (req, body, done) => {
  try {
    const buffer = body as Buffer;
    (req as RawBodyRequest).rawBody = buffer; // Store buffer for HMAC verification
    const json = JSON.parse(buffer.toString());
    done(null, json);
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error(String(err));
    (error as any).statusCode = 400;
    done(error, undefined);
  }
});

// Register Routes
server.register(whatsappRoutes, { prefix: "/v1/whatsapp" });

const start = async () => {
  try {
    await server.listen({ port: 3005, host: "0.0.0.0" });
  } catch (err) {
    (server.log as any).error(err);
    process.exit(1);
  }
};

start();
