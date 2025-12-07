import prisma from '@/src/lib/prisma';
import { baseProcedure, createTRPCRouter, protectedProcedure } from '../init';
import { log } from 'console';

export const appRouter = createTRPCRouter({
  // getUsers: baseProcedure.query(() => {
  //     return prisma.user.findMany()
  //   }),
  getUsers: protectedProcedure.query(({ctx}) => {
      return prisma.user.findMany({
        where: {
          id: ctx.auth.user.id
        }
      })
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;