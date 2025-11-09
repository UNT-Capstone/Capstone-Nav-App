import prisma from '@/src/lib/prisma';
import { baseProcedure, createTRPCRouter } from '../init';

export const appRouter = createTRPCRouter({
  getUsers: baseProcedure.query(() => {
      return prisma.user.findMany()
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;