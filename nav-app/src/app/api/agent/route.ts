import { Groq } from "groq-sdk";

export const runtime = "nodejs";

// Test route (browser GET request)
export async function GET() {
  return Response.json({
    status: "API is working",
  });
}

// AI route (POST request from frontend or Postman)
export async function POST(req: Request) {
  try {
    // Initialize inside the function to prevent build-time crashes
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const { message } = await req.json();

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are Navi, a campus navigation assistant. Help users with directions and app features.",
        },
        {
          role: "user",
          content: message,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

    return Response.json({
      reply: completion.choices[0].message.content,
    });
  } catch (error: any) {
    console.error("Agent Error:", error);
    return Response.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
