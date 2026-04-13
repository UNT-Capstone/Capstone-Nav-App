import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const apiKey = process.env.ORS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing ORS API key" },
        { status: 500 }
      );
    }

    const res = await fetch(
      "https://api.openrouteservice.org/v2/directions/foot-walking/geojson",
      {
        method: "POST",
        headers: {
          Authorization: apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...body,

          
          instructions: true,
          preference: "recommended",
          alternative_routes: {
            target_count: 3,
          },
        }),
      }
    );

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Route error" },
      { status: 500 }
    );
  }
}