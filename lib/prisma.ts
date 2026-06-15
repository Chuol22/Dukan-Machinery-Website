// prisma.ts — singleton Prisma client with build-time safety
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create Prisma client with appropriate logging
const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" 
      ? ["query", "error", "warn"] 
      : ["error"],
  });
};

// Export prisma client safely for both build and runtime
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// In development, reuse client across HMR to prevent too many connections
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Optional: Handle connection errors gracefully
if (process.env.NODE_ENV === "development") {
  prisma.$connect()
    .then(() => console.log("✅ Prisma connected to database"))
    .catch((err) => console.error("❌ Prisma connection error:", err));
}

export default prisma;