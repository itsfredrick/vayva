import Fastify from "fastify";
import cors from "@fastify/cors";
import { RiskScope, RiskSeverity } from "@vayva/db";

const server = Fastify({
  logger: true,
});

server.register(cors);

server.get("/health", async () => {
  return { status: "ok", service: "risk-service" };
});

import { riskEngine } from "./lib/risk-engine";

// Risk Evaluation Endpoint
server.post<{
  Body: {
    merchantId: string;
    scope: RiskScope;
    scopeId?: string;
    key: string;
    severity: RiskSeverity;
    metadata?: Record<string, unknown>;
  };
}>("/v1/risk/evaluate", async (request, reply) => {
  try {
    const result = await riskEngine.ingestSignal(request.body);
    return { status: "evaluated", signalId: result.id };
  } catch (error) {
    request.log.error(error);
    reply.code(500).send({ error: "Internal Server Error" });
  }
});

const start = async () => {
  try {
    await server.listen({ port: 3020, host: "0.0.0.0" }); // Port 3020 for Risk Service
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
