import { FastifyRequest, FastifyReply } from "fastify";
import fp from "fastify-plugin";

export interface AuthOptions {
  audience: "merchant" | "customer" | "ops" | "ops-pre-mfa";
}

export const authenticate = (options: AuthOptions) => {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const decoded = await req.jwtVerify<any>();
      if (decoded.aud !== options.audience) {
        return reply.status(401).send({ error: "Invalid token audience" });
      }
      // Attach user to request (fastify-jwt does this automatically to req.user)
    } catch (err) {
      return reply.status(401).send({ error: "Unauthorized", details: err });
    }
  };
};
