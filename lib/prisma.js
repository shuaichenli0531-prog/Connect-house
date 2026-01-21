import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

// Log DATABASE_URL for debugging (only in build time)
if (process.env.NODE_ENV === "production" && !globalForPrisma.prisma) {
  console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
  console.log("DATABASE_URL starts with:", process.env.DATABASE_URL?.substring(0, 20));
}

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === "production" ? ["error", "warn"] : ["query", "error", "warn"],
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
