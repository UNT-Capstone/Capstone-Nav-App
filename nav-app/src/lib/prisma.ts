// @ts-ignore - Ignore this if it shows red until you run the generate command
import { PrismaClient } from '../../prisma/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

// Logic to maintain a single connection (Singleton)
let prisma: PrismaClient;

if (!globalForPrisma.prisma) {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const adapter = new PrismaPg(pool);

  prisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  });

  globalForPrisma.prisma = prisma;
} else {
  prisma = globalForPrisma.prisma;
}

export default prisma;
