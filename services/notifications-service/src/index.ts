import Fastify from "fastify";
import cors from "@fastify/cors";
import { protectedRoutes, publicRoutes } from "./api/routes";
import { prisma } from "@vayva/db";

const server = Fastify({
  logger: true,
});

server.register(cors);

// Database Client
// export const prisma = new PrismaClient(); // Use shared

const start = async () => {
  try {
    await server.register(publicRoutes, { prefix: "/v1" });
    await server.register(protectedRoutes, { prefix: "/v1" });

    await server.listen({ port: 3008, host: "0.0.0.0" });
    console.log("Notifications Service running on port 3008");
  } catch (err) {
    (server.log as any).error(err);
    process.exit(1);
  }
};

start();
