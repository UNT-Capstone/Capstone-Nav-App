"use server";

import prisma from "@/src/lib/prisma"; 
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function addClass(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized: Please log in first.");

  const name = formData.get("name") as string;
  const location = formData.get("location") as string;
  const timeStr = formData.get("time") as string; // Example: "MWF 2:30 PM"

  const newClass = await prisma.class.create({
    data: { 
      name, 
      location, 
      time: timeStr, 
      userId: session.user.id 
    },
  });

  try {
    // --- IMPROVED PARSING LOGIC ---
    // Instead of slicing, we look for the last two parts (Time and AM/PM)
    const parts = timeStr.trim().split(/\s+/);
    if (parts.length < 3) throw new Error("Invalid time format from client.");

    const modifier = parts[parts.length - 1]; // "PM" or "AM"
    const timePart = parts[parts.length - 2]; // "2:30"
    
    let [hours, minutes] = timePart.split(':').map(Number);
    
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    // Timezone synchronization (Texas)
    const now = new Date();
    const texasNowStr = now.toLocaleString("en-US", { timeZone: "America/Chicago" });
    const texasNow = new Date(texasNowStr);

    let scheduledDate = new Date(texasNow);
    scheduledDate.setHours(hours, minutes, 0, 0);

    // If target time is in the past today, schedule for tomorrow
    if (scheduledDate.getTime() - 15 * 60000 < texasNow.getTime()) {
      scheduledDate.setDate(scheduledDate.getDate() + 1);
    }

    const notificationTime = new Date(scheduledDate.getTime() - 15 * 60000);

    await resend.emails.send({
      from: "UNT Navigator <noreply@untnavigation.me>",
      to: session.user.email,
      subject: `Upcoming Class: ${name}`,
      scheduled_at: notificationTime.toISOString(),
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #00853E; border-radius: 15px;">
          <h2 style="color: #00853E;">Class Starts Soon!</h2>
          <p>Your class <b>${name}</b> at <b>${location}</b> starts in 15 minutes.</p>
        </div>
      `,
    } as any); 

  } catch (error: any) {
    console.error("[RESEND_SCHEDULING_ERROR]:", error.message);
    // We don't throw here so the DB entry (newClass) still returns to the UI
  }

  return newClass;
}

export async function getClasses() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return [];
  return await prisma.class.findMany({ 
    where: { userId: session.user.id }, 
    orderBy: { createdAt: "asc" } 
  });
}

export async function deleteClass(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");
  await prisma.class.delete({ where: { id, userId: session.user.id } });
}
