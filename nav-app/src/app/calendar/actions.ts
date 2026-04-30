"use server";

import prisma from "@/src/lib/prisma";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";


export async function addClass(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized: Please log in first.");

  const name = formData.get("name") as string;
  const location = formData.get("location") as string;
  const timeStr = formData.get("time") as string; 

  const newClass = await prisma.class.create({
    data: {
      name,
      location,
      time: timeStr,
      userId: session.user.id,
    },
  });

  return newClass;
}

export async function getClasses() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return [];
  return await prisma.class.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "asc" },
  });
}

export async function deleteClass(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");
  await prisma.class.delete({ where: { id, userId: session.user.id } });
}
