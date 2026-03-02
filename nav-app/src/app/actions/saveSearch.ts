"use server";

import prisma from "@/src/lib/prisma";
import { requireAuth } from "@/src/lib/auth-utils";

export async function saveSearch(query: string) {
  if (!query.trim()) return;

  const session = await requireAuth();

  await prisma.searchHistory.create({
    data: {
      query: query.trim(),
      userId: session.user.id,
    },
  });
}