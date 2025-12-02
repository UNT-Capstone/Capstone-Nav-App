"use client";

import { useState } from "react";

export const LOCATIONS = [
  // Academic Buildings
  { name: "General Academic Building (GAB)", lat: 33.2131612, lng: -97.148094 },
  { name: "Language Building", lat: 33.213876, lng: -97.146334 }, //not accurate
  { name: "Chemistry Building", lat: 33.214107, lng: -97.14998 },
  { name: "Physics Building", lat: 33.2136, lng: -97.1538 },
  { name: "Biology Building", lat: 33.2137, lng: -97.1549 },
  { name: "Engineering Technology Building", lat: 33.2140, lng: -97.1560 },
  { name: "Sage Hall", lat: 33.212101, lng: -97.146674 },
  { name: "Music Building", lat: 33.2147, lng: -97.1503 },
  { name: "Art Building", lat: 33.2123, lng: -97.1509 },
  { name: "EESAT (Environmental Education, Science & Technology)", lat: 33.2130, lng: -97.1565 },
  { name: "Matthews Hall", lat: 33.2120, lng: -97.1523 },
  { name: "Chilton Hall", lat: 33.2125, lng: -97.1510 },
  { name: "Wooten Hall", lat: 33.2109, lng: -97.1494 },
  { name: "Curry Hall", lat: 33.2114, lng: -97.1493 },
  { name: "Hickory Hall", lat: 33.2129, lng: -97.1555 },
  { name: "Kendall Hall", lat: 33.2125, lng: -97.1536 },
  { name: "BLB - Business Leadership Building", lat: 33.2076, lng: -97.1523 },
  { name: "Sycamore Hall", lat: 33.2105, lng: -97.1507 },
  { name: "Gateway Center", lat: 33.2089, lng: -97.1538 },
  { name: "RTVF Building", lat: 33.2099, lng: -97.1528 },
  { name: "Speech & Hearing Building", lat: 33.2134, lng: -97.1559 },

  // Libraries
  { name: "Willis Library", lat: 33.2103, lng: -97.1503 },
  { name: "Discovery Park Library", lat: 33.2910, lng: -97.1534 },

  // Student Life & Dining
  { name: "University Union", lat: 33.2125, lng: -97.1480 },
  { name: "Pohl Recreation Center", lat: 33.2071, lng: -97.1566 },
  { name: "Eagle Landing Dining Hall", lat: 33.2073, lng: -97.1560 },
  { name: "Mean Greens Dining", lat: 33.2076, lng: -97.1531 },
  { name: "Champs Dining", lat: 33.2107, lng: -97.1563 },

  // Dorms
  { name: "Kerr Hall", lat: 33.2099, lng: -97.1583 },
  { name: "Maple Hall", lat: 33.2109, lng: -97.1570 },
  { name: "Rawlins Hall", lat: 33.2096, lng: -97.1572 },
  { name: "Victory Hall", lat: 33.2086, lng: -97.1560 },
  { name: "Honors Hall", lat: 33.2111, lng: -97.1537 },
  { name: "Traditions Hall", lat: 33.2118, lng: -97.1580 },
  { name: "Legends Hall", lat: 33.2113, lng: -97.1590 },
  { name: "Santa Fe Square Apartments", lat: 33.2104, lng: -97.1470 },
  { name: "Mozart Square", lat: 33.2126, lng: -97.1474 },
  { name: "College Inn", lat: 33.2100, lng: -97.1560 },

  // Parking Lots & Garages
  { name: "Highland Street Garage", lat: 33.2115, lng: -97.1464 },
  { name: "Union Circle Garage", lat: 33.2127, lng: -97.1471 },
  { name: "Lot 1", lat: 33.2105, lng: -97.1598 },
  { name: "Lot 2", lat: 33.2095, lng: -97.1588 },
  { name: "Lot 3", lat: 33.2082, lng: -97.1580 },
  { name: "Lot 4", lat: 33.2074, lng: -97.1573 },
  // ... add all other lots
];

interface UNTSearchBarProps {
  onSelect: (loc: { name: string; lat: number; lng: number }) => void;
}

export default function UNTSearchBar({ onSelect }: UNTSearchBarProps) {
  const [query, setQuery] = useState("");

  // Normalize strings for matching
  const normalize = (str: string) =>
    str.toLowerCase().replace(/[–—()]/g, "").trim();

  const filtered = LOCATIONS.filter((loc) =>
    normalize(loc.name).includes(normalize(query))
  );

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-full max-w-xl z-50">
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
