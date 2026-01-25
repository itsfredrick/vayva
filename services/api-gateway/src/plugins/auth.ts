import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { UserPayload } from "../types/auth";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;
  }
}

export default fp(async (fastify: FastifyInstance) => {
  fastify.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET || "cookie-secret",
  });

  fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || "supersecret",
  });

  fastify.decorate(
    "authenticate",
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        // Check cookie first, fallback to header
        const cookieToken = request.cookies.vayva_session;
        const headerToken = request.headers.authorization?.replace(
          "Bearer ",
          "",
        );

        const token = cookieToken || headerToken;

        if (!token) {
          return reply.status(401).send({ error: "UNAUTHENTICATED" });
        }

        // Verify manually if it's from cookie or if jwtVerify fails on req
        const decoded = fastify.jwt.verify<UserPayload>(token);
        request.user = decoded;
      } catch (err: unknown) {
        reply.status(401).send({ error: "UNAUTHENTICATED", details: err });
      }
    },
  );
});
