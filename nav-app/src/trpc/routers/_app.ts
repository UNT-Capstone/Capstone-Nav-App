import prisma from '@/src/lib/prisma';
import { TRPCError } from '@trpc/server';
import { baseProcedure, createTRPCRouter, protectedProcedure } from '../init';
import { z } from 'zod';

export const appRouter = createTRPCRouter({
  // ─── USERS ───────────────────────────────────────────────────────────────
  getUsers: protectedProcedure.query(({ ctx }) => {
    return prisma.user.findMany({
      where: { id: ctx.auth.user.id }
    });
  }),

  searchUsers: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      if (!input || input.trim() === '') return [];
      return prisma.user.findMany({
        where: {
          AND: [
            { name: { contains: input.trim(), mode: 'insensitive' } },
            { id: { not: ctx.auth.user.id } }
          ]
        },
        select: { id: true, name: true, email: true, image: true }
      });
    }),

  // ─── FRIENDS ─────────────────────────────────────────────────────────────
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
        sender: { select: { id: true, name: true, email: true, image: true } },
        receiver: { select: { id: true, name: true, email: true, image: true } }
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
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Cannot send a friend request to yourself' });
      }
      const existing = await prisma.friend.findFirst({
        where: {
          OR: [
            { senderId, receiverId },
            { senderId: receiverId, receiverId: senderId }
          ]
        }
      });
      if (existing) {
        throw new TRPCError({ code: 'CONFLICT', message: 'Friend request already exists or users are already friends' });
      }
      return prisma.friend.create({ data: { senderId, receiverId, status: 'pending' } });
    }),

  acceptFriendRequest: protectedProcedure
    .input(z.string())
    .mutation(async ({ input: requestId, ctx }) => {
      return prisma.friend.updateMany({
        where: { id: requestId, receiverId: ctx.auth.user.id, status: 'pending' },
        data: { status: 'accepted' }
      });
    }),

  rejectFriendRequest: protectedProcedure
    .input(z.string())
    .mutation(async ({ input: requestId, ctx }) => {
      return prisma.friend.deleteMany({
        where: { id: requestId, receiverId: ctx.auth.user.id, status: 'pending' }
      });
    }),

  getFriendRequests: protectedProcedure.query(async ({ ctx }) => {
    return prisma.friend.findMany({
      where: { receiverId: ctx.auth.user.id, status: 'pending' },
      include: { sender: { select: { id: true, name: true, email: true, image: true } } }
    });
  }),

  getSentFriendRequestIds: protectedProcedure.query(async ({ ctx }) => {
    const sentRequests = await prisma.friend.findMany({
      where: { senderId: ctx.auth.user.id, status: 'pending' },
      select: { receiverId: true }
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
      select: { senderId: true, receiverId: true }
    });
    const friendIds = new Set<string>();
    friends.forEach(friend => {
      if (friend.senderId !== userId) friendIds.add(friend.senderId);
      if (friend.receiverId !== userId) friendIds.add(friend.receiverId);
    });
    return Array.from(friendIds);
  }),

  // ─── FAVORITE LOCATIONS ──────────────────────────────────────────────────
  addFavoriteLocation: protectedProcedure
    .input(z.object({ name: z.string(), lat: z.number(), lng: z.number() }))
    .mutation(async ({ input, ctx }) => {
      try {
        return await prisma.favoriteLocation.create({
          data: { ...input, userId: ctx.auth.user.id }
        });
      } catch (error: any) {
        if (error.code === 'P2002') {
          throw new TRPCError({ code: 'CONFLICT', message: 'This location is already in your favorites' });
        }
        throw error;
      }
    }),

  removeFavoriteLocation: protectedProcedure
    .input(z.object({ name: z.string(), lat: z.number(), lng: z.number() }))
    .mutation(async ({ input, ctx }) => {
      return prisma.favoriteLocation.deleteMany({
        where: { userId: ctx.auth.user.id, ...input }
      });
    }),

  isFavoriteLocation: protectedProcedure
    .input(z.object({ name: z.string(), lat: z.number(), lng: z.number() }))
    .query(async ({ input, ctx }) => {
      const favorite = await prisma.favoriteLocation.findFirst({
        where: { userId: ctx.auth.user.id, ...input }
      });
      return !!favorite;
    }),

  getFavoriteLocations: protectedProcedure.query(async ({ ctx }) => {
    return prisma.favoriteLocation.findMany({
      where: { userId: ctx.auth.user.id },
      orderBy: { createdAt: 'desc' }
    });
  }),

  // ─── COMMUNITY EVENTS ────────────────────────────────────────────────────

  // Get all community events (everyone can see all, "My Events" is filtered on the frontend)
  getCommunityEvents: protectedProcedure.query(async ({ ctx }) => {
    const events = await prisma.communityEvent.findMany({
      include: {
        createdBy: { select: { id: true, name: true, image: true } },
        taggedFriends: {
          include: { user: { select: { id: true, name: true, image: true } } }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return events;
  }),

  // Create a new community event and tag friends
  createCommunityEvent: protectedProcedure
    .input(z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      location: z.string().min(1),
      date: z.string(),        // ISO string e.g. "2025-05-10T14:00"
      lat: z.number(),
      lng: z.number(),
      taggedFriendIds: z.array(z.string())
    }))
    .mutation(async ({ input, ctx }) => {
      return prisma.communityEvent.create({
        data: {
          title: input.title,
          description: input.description,
          location: input.location,
          date: new Date(input.date),
          lat: input.lat,
          lng: input.lng,
          createdById: ctx.auth.user.id,
          taggedFriends: {
            create: input.taggedFriendIds.map(userId => ({ userId }))
          }
        },
        include: {
          createdBy: { select: { id: true, name: true, image: true } },
          taggedFriends: {
            include: { user: { select: { id: true, name: true, image: true } } }
          }
        }
      });
    }),

  // Edit an existing community event (only the creator can edit)
  updateCommunityEvent: protectedProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().min(1),
      description: z.string().min(1),
      location: z.string().min(1),
      date: z.string(),
      lat: z.number(),
      lng: z.number(),
      taggedFriendIds: z.array(z.string())
    }))
    .mutation(async ({ input, ctx }) => {
      // Verify ownership
      const event = await prisma.communityEvent.findUnique({ where: { id: input.id } });
      if (!event || event.createdById !== ctx.auth.user.id) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'You can only edit your own events' });
      }
      // Delete old tags and recreate
      await prisma.eventTag.deleteMany({ where: { eventId: input.id } });
      return prisma.communityEvent.update({
        where: { id: input.id },
        data: {
          title: input.title,
          description: input.description,
          location: input.location,
          date: new Date(input.date),
          lat: input.lat,
          lng: input.lng,
          taggedFriends: {
            create: input.taggedFriendIds.map(userId => ({ userId }))
          }
        },
        include: {
          createdBy: { select: { id: true, name: true, image: true } },
          taggedFriends: {
            include: { user: { select: { id: true, name: true, image: true } } }
          }
        }
      });
    }),

  // Delete a community event (only creator)
  deleteCommunityEvent: protectedProcedure
    .input(z.string())
    .mutation(async ({ input: eventId, ctx }) => {
      const event = await prisma.communityEvent.findUnique({ where: { id: eventId } });
      if (!event || event.createdById !== ctx.auth.user.id) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'You can only delete your own events' });
      }
      return prisma.communityEvent.delete({ where: { id: eventId } });
    }),

  // ─── EVENT COMMENTS ───────────────────────────────────────────────────────

  // Get all comments for a specific event
  getComments: protectedProcedure
    .input(z.object({ eventId: z.string() }))
    .query(async ({ input }) => {
      return prisma.eventComment.findMany({
        where: { eventId: input.eventId },
        include: {
          user: { select: { id: true, name: true, image: true } }
        },
        orderBy: { createdAt: 'asc' }
      });
    }),

  // Post a comment or a reply to a comment
  postComment: protectedProcedure
    .input(z.object({
      eventId: z.string(),
      text: z.string().min(1),
      parentId: z.string().optional()
    }))
    .mutation(async ({ input, ctx }) => {
      return prisma.eventComment.create({
        data: {
          eventId: input.eventId,
          text: input.text,
          parentId: input.parentId ?? null,
          userId: ctx.auth.user.id
        },
        include: {
          user: { select: { id: true, name: true, image: true } }
        }
      });
    }),

  // Delete a comment (only the author)
  deleteComment: protectedProcedure
    .input(z.string())
    .mutation(async ({ input: commentId, ctx }) => {
      const comment = await prisma.eventComment.findUnique({ where: { id: commentId } });
      if (!comment || comment.userId !== ctx.auth.user.id) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'You can only delete your own comments' });
      }
      return prisma.eventComment.delete({ where: { id: commentId } });
    }),
});

export type AppRouter = typeof appRouter;
