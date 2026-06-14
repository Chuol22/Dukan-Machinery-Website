// prisma.ts — singleton Prisma client for dev hot-reload
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// Reuse client across HMR in development
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
