// @ts-ignore - Ignore this if it shows red until you run the generate command
import { PrismaClient } from '../../prisma/generated/prisma/client';

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

// Logic to maintain a single connection (Singleton)
const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;