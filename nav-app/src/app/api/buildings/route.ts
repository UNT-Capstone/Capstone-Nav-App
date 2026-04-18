import { NextResponse } from "next/server";

export async function GET() {
  const buildings = [
    // --- CORE STUDENT SERVICES & HUBS ---
    { name: "University Union", lat: 33.2108, lng: -97.1458 },
    { name: "Willis Library", lat: 33.2104, lng: -97.1484 },
    { name: "Eagle Student Services Center", lat: 33.2108, lng: -97.1467 },
    { name: "Student Health and Wellness Center", lat: 33.2120, lng: -97.1451 },
    { name: "Hurley Administration Building", lat: 33.2114, lng: -97.1488 },
    { name: "Chestnut Hall", lat: 33.2118, lng: -97.1449 },
    
    // --- ACADEMIC BUILDINGS ---
    { name: "Business Leadership Building", lat: 33.2107, lng: -97.1485 },
    { name: "Life Sciences Complex", lat: 33.2117, lng: -97.1490 },
    { name: "General Academic Building (GAB)", lat: 33.2118, lng: -97.1480 },
    { name: "Chemistry Building", lat: 33.2111, lng: -97.1508 },
    { name: "Physics Building", lat: 33.2112, lng: -97.1517 },
    { name: "Environmental Education, Science & Tech (EESAT)", lat: 33.2111, lng: -97.1526 },
    { name: "Wooten Hall", lat: 33.2109, lng: -97.1480 },
    { name: "Language Building", lat: 33.2114, lng: -97.1479 },
    { name: "Chilton Hall", lat: 33.2106, lng: -97.1505 },
    { name: "Music Building", lat: 33.2110, lng: -97.1495 },
    { name: "Art Building", lat: 33.2120, lng: -97.1519 },
    { name: "Curry Hall", lat: 33.2107, lng: -97.1475 },
    { name: "Marquis Hall", lat: 33.2100, lng: -97.1462 },
    { name: "Sage Hall", lat: 33.2100, lng: -97.1478 },
    { name: "Sycamore Hall", lat: 33.2101, lng: -97.1488 },
    { name: "Terrill Hall", lat: 33.2114, lng: -97.1502 },
    { name: "Hickory Hall", lat: 33.2116, lng: -97.1509 },
    { name: "Matthews Hall", lat: 33.2102, lng: -97.1493 },
    { name: "Bain Hall", lat: 33.2115, lng: -97.1519 },
    { name: "Speech and Hearing Center", lat: 33.2132, lng: -97.1458 },
    { name: "Gateway Center", lat: 33.2057, lng: -97.1541 },
    
    // --- ENGINEERING SATELLITE CAMPUS ---
    { name: "Discovery Park", lat: 33.2530, lng: -97.1528 },
    
    // --- RESIDENCE HALLS ---
    { name: "Bruce Hall", lat: 33.2119, lng: -97.1466 },
    { name: "Kerr Hall", lat: 33.2084, lng: -97.1528 },
    { name: "Joe Greene Hall", lat: 33.2078, lng: -97.1515 },
    { name: "Rawlins Hall", lat: 33.2085, lng: -97.1495 },
    { name: "Clark Hall", lat: 33.2091, lng: -97.1505 },
    { name: "Crumley Hall", lat: 33.2100, lng: -97.1449 },
    { name: "Maple Hall", lat: 33.2093, lng: -97.1522 },
    { name: "Mozart Square", lat: 33.2079, lng: -97.1472 },
    { name: "Traditions Hall", lat: 33.2086, lng: -97.1459 },
    { name: "Victory Hall", lat: 33.2013, lng: -97.1598 }, // Near the stadium
    { name: "West Hall", lat: 33.2120, lng: -97.1538 },
    { name: "Honors Hall", lat: 33.2075, lng: -97.1485 },
    
    // --- ATHLETICS & RECREATION ---
    { name: "Super Pit (Coliseum)", lat: 33.2062, lng: -97.1525 },
    { name: "DATCU Stadium", lat: 33.2039, lng: -97.1593 },
    { name: "Pohl Recreation Center", lat: 33.2075, lng: -97.1538 },
    { name: "Athletic Center", lat: 33.2025, lng: -97.1585 },
    { name: "Physical Education Building (PEB)", lat: 33.2095, lng: -97.1530 }
  ];

 
  buildings.sort((a, b) => a.name.localeCompare(b.name));

  return NextResponse.json(buildings, { status: 200 });
}