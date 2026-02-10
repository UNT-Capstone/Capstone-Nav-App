"use client";

import { useState, useEffect } from "react";
interface LocationResult {
  name: string;
  lat: number;
  lng: number;
}

interface UNTSearchBarProps {
  onSelect: (loc: { name: string; lat: number; lng: number }) => void;
}

// Geocode location using Nominatim API
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

  // Fetch results from Nominatim as user types
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
    }, 300); // Debounce search

    return () => clearTimeout(timer);
  }, [query]);

  const filtered = results.slice(0, 8);


  return (
    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-11/12 max-w-2xl z-[2000] pointer-events-auto">
      <div className="relative">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-xl">
          🔍
        </div>
        <input
          type="text"
          placeholder="Search buildings, parking, or locations..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-4 pl-12 text-lg border-2 border-blue-600 rounded-xl shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-700 bg-white font-semibold text-gray-900"
        />
        {loading && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 text-sm font-bold">
            ⏳ Loading...
          </div>
        )}
      </div>

      {query.length > 0 && (
        <div className="bg-white border-2 border-blue-600 rounded-xl shadow-2xl mt-3 max-h-72 overflow-y-auto">
          {filtered.length > 0 ? (
            filtered.map((loc, index) => (
              <div
                key={index}
                className="p-4 hover:bg-blue-50 cursor-pointer border-b-2 last:border-b-0 transition-colors"
                onClick={() => {
                  onSelect({
                    name: loc.name.split(",")[0], // Use first part of full address
                    lat: loc.lat,
                    lng: loc.lng,
                  });
                  setQuery(""); // reset search
                  setResults([]);
                }}
              >
                <div className="font-bold text-base text-gray-800">{loc.name}</div>
              </div>
            ))
          ) : !loading && query.length > 0 ? (
            <p className="p-4 text-gray-600 text-center font-semibold">No locations found</p>
          ) : null}
        </div>
      )}
    </div>
  );
}
