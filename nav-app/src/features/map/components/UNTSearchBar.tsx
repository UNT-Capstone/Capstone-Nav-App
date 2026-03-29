"use client";

import { useState, useEffect, useTransition } from "react";
import { saveSearch } from "@/src/app/actions/saveSearch";

interface LocationResult {
  name: string;
  lat: number;
  lng: number;
}

interface UNTSearchBarProps {
  onSelect: (loc: { name: string; lat: number; lng: number }) => void;
}

async function geocodeLocation(query: string): Promise<LocationResult[]> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`
    );
    const results = await response.json();
    return results.map((result: any) => ({
      name: result.display_name,
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
    }));
  } catch (error) {
    console.error("Geocoding error:", error);
    return [];
  }
}

export default function UNTSearchBar({ onSelect }: UNTSearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LocationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(true);
      geocodeLocation(query).then((res) => {
        setResults(res);
        setLoading(false);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const filtered = results.slice(0, 8);

  return (
    <div className="fixed top-28 md:top-32 left-1/2 transform -translate-x-1/2 w-[85vw] md:w-80 z-2000">
      <div className="relative">
        <input
          type="text"
          placeholder="Search buildings or locations..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
        {loading && (
          <div className="absolute right-3 top-3 text-gray-500">
            Loading...
          </div>
        )}
      </div>

      {query.length > 0 && (
        <div className="bg-white border rounded-lg shadow mt-2 max-h-60 overflow-y-auto">
          {filtered.length > 0 ? (
            filtered.map((loc, index) => (
              <div
                key={index}
                className="p-3 hover:bg-blue-100 cursor-pointer border-b last:border-b-0"
                onClick={() => {
                  const placeName = loc.name.split(",")[0];

                  onSelect({
                    name: placeName,
                    lat: loc.lat,
                    lng: loc.lng,
                  });

                  startTransition(() => {
                    saveSearch(placeName);
                  });

                  setQuery("");
                  setResults([]);
                }}
              >
                <div className="font-medium text-sm">{loc.name}</div>
              </div>
            ))
          ) : !loading && query.length > 0 ? (
            <p className="p-3 text-gray-500 text-center">No locations found</p>
          ) : null}
        </div>
      )}
    </div>
  );
}
