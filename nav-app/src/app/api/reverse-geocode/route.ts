import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    if (!lat || !lon) {
      return NextResponse.json({ error: "Missing lat/lon" }, { status: 400 });
    }

    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "unt-nav-app/1.0 (contact@example.com)",
        "Accept": "application/json",
      },
    });

    if (!res.ok) {
      console.error("Nominatim reverse error:", res.status, await res.text());
      return NextResponse.json({ error: "Nominatim request failed" }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (err) {
    console.error("Reverse geocode route error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}