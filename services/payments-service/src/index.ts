import Fastify from "fastify";
import cors from "@fastify/cors";
import { env } from "./env";
import { ApiErrorCode, apiError } from "@vayva/shared";

const server = Fastify({
  logger: true,
});

server.setErrorHandler((err, _req, reply) => {
  const statusCode = reply.statusCode >= 400 ? reply.statusCode : 500;
  reply.status(statusCode).send(
    apiError(
      ApiErrorCode.INTERNAL_SERVER_ERROR,
      "Internal Server Error",
      err instanceof Error ? err.message : err,
    ),
  );
});

server.addHook("onSend", async (_request, reply, payload) => {
  if (reply.statusCode < 400) return payload;

  if (payload && typeof payload === "object" && "success" in (payload as any)) {
    return payload;
  }

  const codeFromStatus = (status: number) => {
    if (status === 400) return ApiErrorCode.VALIDATION_ERROR;
    if (status === 401) return ApiErrorCode.UNAUTHORIZED;
    if (status === 403) return ApiErrorCode.FORBIDDEN;
    if (status === 404) return ApiErrorCode.NOT_FOUND;
    if (status === 429) return ApiErrorCode.RATE_LIMIT_EXCEEDED;
    return ApiErrorCode.INTERNAL_SERVER_ERROR;
  };

  const status = reply.statusCode;
  const code = codeFromStatus(status);

  if (typeof payload === "string") {
    return apiError(code, payload);
  }

  const obj = payload as any;
  if (obj && typeof obj === "object" && "error" in obj) {
    if (typeof obj.error === "string") {
      return apiError(code, obj.error, obj.details);
    }
    if (obj.error && typeof obj.error === "object") {
      const errObj = obj.error as { code?: string; message?: string; details?: unknown };
      return apiError(errObj.code || code, errObj.message || "Request failed", errObj.details ?? obj.details);
    }
  }

  if (obj && typeof obj === "object" && "message" in obj && typeof obj.message === "string") {
    return apiError(code, obj.message, obj);
  }

  return apiError(code, "Request failed", payload);
});

server.register(cors);

server.get("/health", async () => {
  return { status: "ok", service: "paystack-payments-service" };
});

import { startWorker } from "./worker";

const start = async () => {
  try {
    await server.listen({ port: env.PORT, host: env.HOST });

    // Start Background Worker
    startWorker();

  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
