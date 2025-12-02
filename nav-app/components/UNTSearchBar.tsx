"use client";

import { useState } from "react";

const LOCATIONS = [
  // ============================
  // ACADEMIC BUILDINGS
  // ============================
  { name: "General Academic Building (GAB)", lat: 33.2131612, lng: -97.148094 },
  { name: "Language Building", lat: 33.213876, lng: -97.146334 },
  { name: "Chemistry Building", lat: 33.214107, lng: -97.14998 },
  { name: "Physics Building", lat: 33.2136, lng: -97.1538 }, // need to find this one
  { name: "Biology Building", lat: 33.2137, lng: -97.1549 }, // need more information
  { name: "Engineering Technology Building", lat: 33.2140, lng: -97.1560 },
  { name: "Sage Hall", lat: 33.212101, lng: -97.146674 },
  { name: "Music Building", lat: 33.2147, lng: -97.1503 },
  { name: "Art Building", lat: 33.2123, lng: -97.1509 },
  { name: "Environmental Education, Science & Technology (EESAT)", lat: 33.2130, lng: -97.1565 },
  { name: "Matthews Hall", lat: 33.2120, lng: -97.1523 },
  { name: "Chilton Hall", lat: 33.2125, lng: -97.1510 },
  { name: "Wooten Hall", lat: 33.2109, lng: -97.1494 },
  { name: "Curry Hall", lat: 33.2114, lng: -97.1493 },
  { name: "Hickory Hall", lat: 33.2129, lng: -97.1555 },
  { name: "Kendall Hall", lat: 33.2125, lng: -97.1536 },
  { name: "BLB – Business Leadership Building", lat: 33.2076, lng: -97.1523 },
  { name: "Sycamore Hall", lat: 33.2105, lng: -97.1507 },
  { name: "Gateway Center", lat: 33.2089, lng: -97.1538 },
  { name: "RTVF Building (Radio, TV, Film)", lat: 33.2099, lng: -97.1528 },
  { name: "Speech & Hearing Building", lat: 33.2134, lng: -97.1559 },

  // ============================
  // LIBRARIES
  // ============================
  { name: "Willis Library", lat: 33.2103, lng: -97.1503 },
  { name: "Discovery Park Library", lat: 33.2910, lng: -97.1534 },

  // ============================
  // STUDENT LIFE & DINING
  // ============================
  { name: "University Union", lat: 33.2125, lng: -97.1480 },
  { name: "Pohl Recreation Center", lat: 33.2071, lng: -97.1566 },
  { name: "Eagle Landing Dining Hall", lat: 33.2073, lng: -97.1560 },
  { name: "Mean Greens Dining", lat: 33.2076, lng: -97.1531 },
  { name: "Champs Dining", lat: 33.2107, lng: -97.1563 },
  
  // ============================
  // DORMS
  // ============================
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

  // ============================
  // PARKING LOTS & GARAGES
  // (Top requested category)
  // ============================
  { name: "Highland Street Garage", lat: 33.2115, lng: -97.1464 },
  { name: "Union Circle Garage", lat: 33.2127, lng: -97.1471 },
  { name: "Lot 1", lat: 33.2105, lng: -97.1598 },
  { name: "Lot 2", lat: 33.2095, lng: -97.1588 },
  { name: "Lot 3", lat: 33.2082, lng: -97.1580 },
  { name: "Lot 4", lat: 33.2074, lng: -97.1573 },
  { name: "Lot 5", lat: 33.2065, lng: -97.1567 },
  { name: "Lot 6", lat: 33.2058, lng: -97.1558 },
  { name: "Lot 7", lat: 33.2108, lng: -97.1551 },
  { name: "Lot 8", lat: 33.2121, lng: -97.1558 },
  { name: "Lot 9", lat: 33.2119, lng: -97.1575 },
  { name: "Lot 10", lat: 33.2097, lng: -97.1528 },
  { name: "Lot 11", lat: 33.2088, lng: -97.1530 },
  { name: "Lot 12", lat: 33.2077, lng: -97.1535 },
  { name: "Lot 13", lat: 33.2077, lng: -97.1515 },
  { name: "Lot 14", lat: 33.2085, lng: -97.1508 },
  { name: "Lot 15", lat: 33.2092, lng: -97.1500 },
  { name: "Lot 16", lat: 33.2100, lng: -97.1488 },
  { name: "Lot 17", lat: 33.2108, lng: -97.1478 },
  { name: "Lot 18", lat: 33.2119, lng: -97.1467 },
  { name: "Lot 19", lat: 33.2128, lng: -97.1458 },
  { name: "Lot 20", lat: 33.2088, lng: -97.1581 },
  { name: "Lot 26", lat: 33.2099, lng: -97.1542 },
  { name: "Lot 27", lat: 33.2123, lng: -97.1530 },
  { name: "Lot 30", lat: 33.2141, lng: -97.1494 },
  { name: "Lot 31", lat: 33.2149, lng: -97.1487 },
  { name: "Lot 36", lat: 33.2078, lng: -97.1594 },

  // ============================
  // SPORTS FACILITIES
  // ============================
  { name: "DATCU Stadium (Apogee Stadium)", lat: 33.2014, lng: -97.1641 },
  { name: "Murchison Performing Arts Center", lat: 33.2076, lng: -97.1574 },
  { name: "Super Pit / Coliseum", lat: 33.2107, lng: -97.1577 },
  { name: "Soccer Stadium", lat: 33.2019, lng: -97.1592 },
  { name: "Track & Field Complex", lat: 33.2010, lng: -97.1618 },

  // ============================
  // DISCOVERY PARK
  // ============================
  { name: "Discovery Park A Building", lat: 33.2905, lng: -97.1528 },
  { name: "Discovery Park B Building", lat: 33.2902, lng: -97.1530 },
  { name: "Discovery Park C Building", lat: 33.2899, lng: -97.1532 },
  { name: "Discovery Park Annex", lat: 33.2892, lng: -97.1526 },

  // ============================
  // UNT FRISCO (optional but included)
  // ============================
  { name: "UNT Frisco Hall Park", lat: 33.0972, lng: -96.8268 },
  { name: "UNT Frisco Landing", lat: 33.1520, lng: -96.8426 },

  // ============================
  // ADMINISTRATION BUILDINGS
  // ============================
  { name: "Hurley Administration Building", lat: 33.2113, lng: -97.1513 },
  { name: "Chestnut Hall", lat: 33.2102, lng: -97.1470 },
  { name: "Sage Hall Testing Center", lat: 33.2117, lng: -97.1502 },
  { name: "Facilities Building", lat: 33.2064, lng: -97.1604 },
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
