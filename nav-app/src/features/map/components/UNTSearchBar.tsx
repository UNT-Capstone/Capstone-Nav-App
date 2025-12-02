"use client";

import { useState } from "react";

export const LOCATIONS = [
  { name: "Union", lat: 33.2125, lng: -97.1480 },
  { name: "Willis Library", lat: 33.2103, lng: -97.1503 },
  { name: "Discovery Park", lat: 33.2902, lng: -97.1530 },
  { name: "BLB - Business Leadership Building", lat: 33.2095, lng: -97.1450 },
  { name: "Parking Lot A", lat: 33.2110, lng: -97.1490 },
  { name: "Parking Lot B", lat: 33.2080, lng: -97.1520 },
];

interface UNTSearchBarProps {
  onSelect: (lat: number, lng: number, name: string) => void;
}

export default function UNTSearchBar({ onSelect }: UNTSearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(LOCATIONS);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    const filtered = LOCATIONS.filter((loc) =>
      loc.name.toLowerCase().includes(value.toLowerCase())
    );
    setResults(filtered);
  };

  return (
    <div className="relative w-full max-w-md mb-4">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search for a building or parking lot..."
        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {query && results.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto">
          {results.map((loc) => (
            <li
              key={loc.name}
              onClick={() => {
                onSelect(loc.lat, loc.lng, loc.name);
                setQuery("");
                setResults(LOCATIONS);
              }}
              className="cursor-pointer p-2 hover:bg-blue-100"
            >
              {loc.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
