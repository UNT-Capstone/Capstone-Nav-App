import { initTRPC, TRPCError } from '@trpc/server';
import { cache } from 'react';
import { auth } from '@/src/lib/auth';
import { headers } from 'next/headers';

export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  const headersList = await headers();
  
  try {
    const session = await auth.api.getSession({
      headers: headersList,
    });

    return { 
      auth: session,
      userId: session?.user?.id
    };
  } catch (error) {
    return { 
      auth: null,
      userId: null
    };
  }
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  // transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = baseProcedure.use(async ({ ctx, next}) => {
  if (!ctx.auth || !ctx.userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Unauthorized",
    });
  }

  return next({ ctx });
})