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

// UNT + Denton + Discovery Park area
const BBOX = {
  left: -97.35,
  right: -97.05,
  top: 33.30,
  bottom: 33.10,
};

async function geocodeLocation(query: string): Promise<LocationResult[]> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&limit=8&bounded=1&viewbox=${BBOX.left},${BBOX.top},${BBOX.right},${BBOX.bottom}`
    );

    const results = await response.json();

    if (!Array.isArray(results)) return [];

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
    <div className="w-full relative">
      <div className="relative">
        <input
          type="text"
          placeholder="Search UNT buildings, dining halls..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 rounded-xl shadow border focus:outline-none focus:ring-2 focus:ring-green-600 bg-white"
        />

        {loading && (
          <div className="absolute right-3 top-3 text-gray-500 text-sm">
            Loading...
          </div>
        )}
      </div>

      {query.length > 0 && (
        <div className="bg-white border rounded-xl shadow mt-2 max-h-64 overflow-y-auto">
          {filtered.length > 0 ? (
            filtered.map((loc, index) => {
              const placeName = loc.name.split(",")[0];

              return (
                <div
                  key={index}
                  className="p-3 hover:bg-green-50 cursor-pointer border-b last:border-b-0"
                  onClick={() => {
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
                  <div className="text-sm font-medium">{placeName}</div>
                  <div className="text-xs text-gray-500">{loc.name}</div>
                </div>
              );
            })
          ) : !loading ? (
            <p className="p-3 text-gray-500 text-center">
              No UNT-area results found
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}