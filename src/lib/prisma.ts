// src/lib/prisma.ts
import { PrismaClient } from "@/generated/prisma";  // 👈 use your custom output path

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
