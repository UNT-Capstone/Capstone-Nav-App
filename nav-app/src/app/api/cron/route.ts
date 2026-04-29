import { NextResponse } from "next/server";
import { Resend } from "resend";
import prisma from "@/src/lib/prisma"; // FIXED: No curly braces

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Force Texas Timezone for comparison
    const now = new Date();
    const texasTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Chicago" }));
    const targetTime = new Date(texasTime.getTime() + 15 * 60000);
    
    const dayMap = ["Su", "M", "Tu", "W", "Th", "F", "Sa"];
    const currentDayCode = dayMap[targetTime.getDay()]; 
    
    const targetTimeStr = targetTime.toLocaleTimeString("en-US", {
      timeZone: "America/Chicago",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    // Fetch classes including the user relation for the email address
    const allClasses = await prisma.class.findMany({
      include: { user: true }
    });

    // Filter logic
    const toNotify = allClasses.filter((cls) => {
      if (!cls.time) return false;
      return cls.time.includes(currentDayCode) && cls.time.includes(targetTimeStr);
    });

    if (toNotify.length === 0) return NextResponse.json({ message: "No classes soon." });

    // Execute emails
    for (const cls of toNotify) {
      if (!cls.user?.email) continue;
      await resend.emails.send({
        from: "UNT Navigator <noreply@untnavigation.me>",
        to: cls.user.email,
        subject: `Reminder: ${cls.name} starts in 15 mins!`,
        html: `<p>Head to <b>${cls.location}</b>. Your class starts at ${targetTimeStr}.</p>`
      });
    }
    
    return NextResponse.json({ success: true, count: toNotify.length });
        
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
