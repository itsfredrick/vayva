/**
 * Prisma client for tests
 * Re-exports from the infra/db package
 */

// Import from the generated client
import { PrismaClient } from "@prisma/client";

// Create singleton instance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl:
      process.env.DATABASE_URL ||
      "postgresql://postgres:postgres@localhost:5432/vayva_test?schema=public",
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Re-export types
export * from "@prisma/client";
