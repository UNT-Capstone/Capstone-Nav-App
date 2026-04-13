import { NextResponse } from "next/server";
import { Resend } from "resend";
import  prisma  from "@/src/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: Request) {
  // 1. Security Check: Ensure only Vercel (or you with the secret key) can trigger this
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 2. Figure out what time it is right now, PLUS 15 minutes
    const now = new Date();
    const targetTime = new Date(now.getTime() + 15 * 60000);
    
    // 3. Format the target time to match your database (e.g., "M" and "2:30 PM")
    const dayMap = ["Su", "M", "Tu", "W", "Th", "F", "Sa"];
    const currentDayCode = dayMap[targetTime.getDay()]; 
    
    const targetTimeStr = targetTime.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    // 4. Fetch all classes from the database, including the user's email
    const allClasses = await prisma.class.findMany({
      include: { user: true }
    });

    // 5. Filter for classes that happen TODAY and start in EXACTLY 15 MINS
    const classesToNotify = allClasses.filter((cls) => {
      if (!cls.time) return false;
      const happensToday = cls.time.includes(currentDayCode);
      const startsNow = cls.time.includes(targetTimeStr);
      return happensToday && startsNow;
    });

    if (classesToNotify.length === 0) {
      return NextResponse.json({ message: "No classes starting in 15 mins." });
    }

    // 6. Send the emails!
    for (const cls of classesToNotify) {
      if (!cls.user.email) continue;

      await resend.emails.send({
        from: "UNT Navigator <onboarding@resend.dev>", // Resend's default testing address
        to: cls.user.email,
        subject: `Reminder: ${cls.name} starts in 15 minutes!`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; max-width: 600px;">
            <h2 style="color: #00853E; margin-bottom: 5px;">Time to head to class!</h2>
            <p style="color: #4b5563; font-size: 16px;">
              Your class <strong>${cls.name}</strong> at <strong>${cls.location}</strong> starts in 15 minutes.
            </p>
            <a href="https://your-app-domain.vercel.app/?location=${encodeURIComponent(cls.location)}" 
               style="background-color: #00853E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin-top: 15px; font-weight: bold;">
              Navigate Now
            </a>
          </div>
        `,
      });
    }
    
    return NextResponse.json({ message: `Sent ${classesToNotify.length} reminders successfully.` });
        
  } catch (error) {
    console.error("Cron Error:", error);
    return NextResponse.json({ error: "Failed to run cron job" }, { status: 500 });
  }
}