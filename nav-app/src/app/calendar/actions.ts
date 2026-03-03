"use server";

import { prisma } from "@/src/lib/prisma";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function addClass(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  await prisma.class.create({
    data: {
      name: formData.get("name") as string,
      location: formData.get("location") as string,
      time: formData.get("time") as string,
      userId: session.user.id,
    },
  });
  revalidatePath("/calendar");
}

export async function getClasses() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return [];

  return await prisma.class.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  });
}

export async function deleteClass(id: string) {
  await prisma.class.delete({ where: { id } });
  revalidatePath("/calendar");
}