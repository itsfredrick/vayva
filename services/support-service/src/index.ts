import Fastify from "fastify";
import cors from "@fastify/cors";
import { publicRoutes, protectedRoutes } from "./api/routes";
import dotenv from "dotenv";
// import { prisma } from '@vayva/db'; // Use shared client if needed here

dotenv.config();

const server = Fastify({
  logger: true,
});

// Database Client

const start = async () => {
  try {
    await server.register(cors, {
      origin: true, // Allow all for V1
    });

    // Register Routes
    await server.register(publicRoutes, { prefix: "/v1" });
    await server.register(protectedRoutes, { prefix: "/v1" });

    const port = process.env.PORT ? parseInt(process.env.PORT) : 3014;
    await server.listen({ port, host: "0.0.0.0" });
    console.log(`Support Service running on port ${port}`);
  } catch (err) {
    (server.log as any).error(err);
    process.exit(1);
  }
};

start();
