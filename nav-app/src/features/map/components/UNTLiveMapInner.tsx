"use client";

import { useEffect, useState, Suspense } from "react"; // Added Suspense
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useSearchParams } from "next/navigation"; // NEEDED for "Go to Class"
import L from "leaflet";
import UNTSearchBar from "./UNTSearchBar";

// 1. RE-USE YOUR DATA: We need this to look up coordinates by name from the URL
const BUILDING_DATA: Record<string, [number, number]> = {
  "Willis Library": [33.209929, -97.149024],
  "Pohl Recreation Center": [33.21207, -97.15404],
  "University Union": [33.2106, -97.147418],
  "Coliseum": [33.208687, -97.154113],
  "Discovery Park": [33.2536, -97.1526],
  "General Academic Building (GAB)": [33.2118, -97.1526],
  // ... add others as needed
};

// This component must be defined before it can be used on line 70
const ClickToGetCoords = () => {
  const map = useMap();

  useEffect(() => {
    // We wrap this in a function to avoid the 'EffectCallback' error 
    // you saw in Vercel previously
    const onClick = (e: any) => {
      const { lat, lng } = e.latlng;
      alert(`Latitude: ${lat.toFixed(6)}, Longitude: ${lng.toFixed(6)}`);
    };

    map.on("click", onClick);

    return () => {
      map.off("click", onClick);
    };
  }, [map]);

  return null;
};

// 2. THE BRIDGE: This component listens to the URL and updates the map state
function MapUrlListener({ 
  setDestination, 
  setSelectedName 
}: { 
  setDestination: (pos: [number, number]) => void;
  setSelectedName: (name: string) => void;
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const navTo = searchParams.get('navTo');
    if (navTo && BUILDING_DATA[navTo]) {
      setDestination(BUILDING_DATA[navTo]);
      setSelectedName(navTo);
    }
  }, [searchParams, setDestination, setSelectedName]);

  return null;
}

// ... Keep FlyToMarker, Routing, and ClickToGetCoords as your teammate wrote them ...

export default function UNTLiveMapInner() {
  const defaultPosition: [number, number] = [33.2104, -97.1503];
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [destination, setDestination] = useState<[number, number] | null>(null);
  const [selectedLocationName, setSelectedLocationName] = useState("");

  // ... Keep teammate's Icon and Geolocation effects ...

  const handleLocationSelect = (loc: { name: string; lat: number; lng: number }) => {
    setSelectedLocationName(loc.name);
    setDestination([loc.lat, loc.lng]);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 w-full">
      <div className="relative w-[90vw] h-[90vh]">
        <UNTSearchBar onSelect={handleLocationSelect} />

        <MapContainer center={defaultPosition} zoom={16} className="w-full h-full rounded-2xl shadow-lg">
          {/* 3. ATTACH THE LISTENER: This makes the "Go to Class" button work again */}
          <Suspense fallback={null}>
            <MapUrlListener 
              setDestination={setDestination} 
              setSelectedName={setSelectedLocationName} 
            />
          </Suspense>

          <ClickToGetCoords />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* Markers and Routing logic below... */}
          {destination && (
            <Marker position={destination}>
              <Popup>{selectedLocationName || "Destination"}</Popup>
            </Marker>
          )}
          {userPosition && destination && <Routing start={userPosition} end={destination} />}
        </MapContainer>
      </div>
    </div>
  );
}