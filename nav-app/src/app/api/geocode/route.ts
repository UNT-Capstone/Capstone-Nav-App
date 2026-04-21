export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q) {
    return Response.json([]);
  }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        q
      )}&limit=8&bounded=1&viewbox=-97.20,33.24,-97.10,33.18`,
      {
        headers: {
          "User-Agent": "UNT-Navigation-App",
        },
      }
    );

    const data = await res.json();

    if (!Array.isArray(data)) return Response.json([]);

    
    const filtered = data.filter((item: any) => {
      const lat = parseFloat(item.lat);
      const lng = parseFloat(item.lon);

      return (
        lat >= 33.18 &&
        lat <= 33.24 &&
        lng >= -97.20 &&
        lng <= -97.10
      );
    });

    return Response.json(filtered);
  } catch {
    return Response.json([]);
  }
}