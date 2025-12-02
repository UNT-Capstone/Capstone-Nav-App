"use client";

import { useState } from "react";

const LOCATIONS = [
  { name: "Union", lat: 33.2125, lng: -97.1480 },
  { name: "Willis Library", lat: 33.2103, lng: -97.1503 },
  { name: "Discovery Park", lat: 33.2902, lng: -97.1530 },
  { name: "BLB - Business Leadership Building", lat: 33.2076, lng: -97.1523 },
  { name: "Pohl Rec Center", lat: 33.2071, lng: -97.1566 },

  // Parking lots
  { name: "Parking Lot 20", lat: 33.2088, lng: -97.1581 },
  { name: "Parking Lot 7", lat: 33.2108, lng: -97.1551 },
  { name: "Parking Garage (Union Circle)", lat: 33.2127, lng: -97.1471 },

  // Add more buildings/lots as needed
];

export default function UNTSearchBar({ onSelect }: { onSelect: (loc: any) => void }) {
  const [query, setQuery] = useState("");

  const filtered = LOCATIONS.filter((loc) =>
    loc.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="w-full max-w-xl">
      <input
        type="text"
        placeholder="Search buildings or parking..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 border rounded-lg shadow"
      />

      {query.length > 0 && (
        <div className="bg-white border rounded-lg shadow mt-2 max-h-60 overflow-y-auto">
          {filtered.map((loc, index) => (
            <div
              key={index}
              className="p-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => {
                onSelect(loc);
                setQuery(""); // reset search
              }}
            >
              {loc.name}
            </div>
          ))}

          {filtered.length === 0 && (
            <p className="p-2 text-gray-500">No locations found</p>
          )}
        </div>
      )}
    </div>
  );
}
