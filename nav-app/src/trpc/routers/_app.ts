import prisma from '@/src/lib/prisma';
import { TRPCError } from '@trpc/server';
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
    .query(async ({ input, ctx }) => {
      if (!input || input.trim() === '') {
        return [];
      }
      return prisma.user.findMany({
        where: {
          AND: [
            {
              name: {
                contains: input.trim(),
                mode: 'insensitive'
              }
            },
            {
              id: {
                not: ctx.auth.user.id
              }
            }
          ]
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

      if (senderId === receiverId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Cannot send a friend request to yourself'
        });
      }

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
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Friend request already exists or users are already friends'
        });
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
  rejectFriendRequest: protectedProcedure
    .input(z.string())
    .mutation(async ({ input: requestId, ctx }) => {
      const userId = ctx.auth.user.id;

      return prisma.friend.deleteMany({
        where: {
          id: requestId,
          receiverId: userId,
          status: 'pending'
        }
      });
    }),
  getFriendRequests: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.auth.user.id;

    const requests = await prisma.friend.findMany({
      where: {
        receiverId: userId,
        status: 'pending'
      },
      include: {
        sender: {
          select: { id: true, name: true, email: true, image: true }
        }
      }
    });

    return requests;
  }),
  getSentFriendRequestIds: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.auth.user.id;

    const sentRequests = await prisma.friend.findMany({
      where: {
        senderId: userId,
        status: 'pending'
      },
      select: {
        receiverId: true
      }
    });

    return sentRequests.map(r => r.receiverId);
  }),
  getFriendIds: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.auth.user.id;

    const friends = await prisma.friend.findMany({
      where: {
        OR: [
          { senderId: userId, status: 'accepted' },
          { receiverId: userId, status: 'accepted' }
        ]
      },
      select: {
        senderId: true,
        receiverId: true
      }
    });

    const friendIds = new Set<string>();
    friends.forEach(friend => {
      if (friend.senderId !== userId) friendIds.add(friend.senderId);
      if (friend.receiverId !== userId) friendIds.add(friend.receiverId);
    });

    return Array.from(friendIds);
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
