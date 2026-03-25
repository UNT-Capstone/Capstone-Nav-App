import prisma from '@/src/lib/prisma';
import { baseProcedure, createTRPCRouter, protectedProcedure } from '../init';
import { z } from 'zod';
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
  searchUsers: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      if (!input || input.trim() === '') {
        return [];
      }
      return prisma.user.findMany({
        where: {
          name: {
            contains: input.trim(),
            mode: 'insensitive'
          }
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      });
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;