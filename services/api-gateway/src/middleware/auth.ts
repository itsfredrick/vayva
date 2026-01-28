import { FastifyRequest, FastifyReply } from "fastify";
import _fp from "fastify-plugin";

import { UserPayload } from "../types/auth";
import { ApiErrorCode, apiError } from "@vayva/shared";

export interface AuthOptions {
  audience: "merchant" | "customer" | "ops" | "ops-pre-mfa";
}

export const authenticate = (options: AuthOptions) => {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const decoded = await req.jwtVerify<UserPayload>();
      if (decoded.aud !== options.audience) {
        return reply
          .status(401)
          .send(apiError(ApiErrorCode.UNAUTHORIZED, "Invalid token audience"));
      }
      // Attach user to request (fastify-jwt does this automatically to req.user)
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      return reply
        .status(401)
        .send(apiError(ApiErrorCode.UNAUTHORIZED, "Unauthorized", error.message));
    }
  };
};
