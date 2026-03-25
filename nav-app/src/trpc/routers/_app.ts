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
  getFriends: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.auth.user.id;
    const friends = await prisma.friend.findMany({
      where: {
        OR: [
          { senderId: userId, status: 'accepted' },
          { receiverId: userId, status: 'accepted' }
        ]
      },
      include: {
        sender: {
          select: { id: true, name: true, email: true, image: true }
        },
        receiver: {
          select: { id: true, name: true, email: true, image: true }
        }
      }
    });

    return friends.map(friend => 
      friend.senderId === userId ? friend.receiver : friend.sender
    );
  }),
  sendFriendRequest: protectedProcedure
    .input(z.string())
    .mutation(async ({ input: receiverId, ctx }) => {
      const senderId = ctx.auth.user.id;

      // Check if they're already friends or have a pending request
      const existing = await prisma.friend.findFirst({
        where: {
          OR: [
            { senderId, receiverId },
            { senderId: receiverId, receiverId: senderId }
          ]
        }
      });

      if (existing) {
        throw new Error('Friend request already exists or users are already friends');
      }

      return prisma.friend.create({
        data: {
          senderId,
          receiverId,
          status: 'pending'
        }
      });
    }),
  acceptFriendRequest: protectedProcedure
    .input(z.string())
    .mutation(async ({ input: requestId, ctx }) => {
      const userId = ctx.auth.user.id;

      return prisma.friend.updateMany({
        where: {
          id: requestId,
          receiverId: userId,
          status: 'pending'
        },
        data: {
          status: 'accepted'
        }
      });
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
