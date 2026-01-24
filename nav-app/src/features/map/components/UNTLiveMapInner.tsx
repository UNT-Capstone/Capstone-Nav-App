"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Smoothly fly to a marker
const FlyToMarker: React.FC<{ position: [number, number] }> = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(position, 18, { duration: 1.5 });
  }, [position, map]);
  return null;
};

// Routing between two points
const Routing = ({
  start,
  end,
}: {
  start: [number, number];
  end: [number, number];
}) => {
  const map = useMap();
  useEffect(() => {
    if (!start || !end) return;
    const control = (L as any).Routing.control({
      waypoints: [L.latLng(start[0], start[1]), L.latLng(end[0], end[1])],
      routeWhileDragging: false,
      lineOptions: { styles: [{ color: "#2563eb", weight: 4 }] },
      createMarker: (i: number, wp: any) => L.marker(wp.latLng),
    }).addTo(map);
    return () => map.removeControl(control);
  }, [map, start, end]);
  return null;
};

// Click-to-get-coordinates
const ClickToGetCoords = () => {
  const map = useMap();

  useEffect(() => {
    const onClick = (e: any) => {
      const { lat, lng } = e.latlng;
      const coordsText = `Latitude: ${lat.toFixed(6)}, Longitude: ${lng.toFixed(6)}`;
      console.log(coordsText);
      alert(coordsText);
    };

    map.on("click", onClick);
    return () => map.off("click", onClick);
  }, [map]);

  return null;
};

// --- Main Component ---
export default function UNTLiveMapInner() {
  const defaultPosition: [number, number] = [33.2104, -97.1503];

  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [destination, setDestination] = useState<[number, number] | null>(null);
  const [selectedLocation, setSelectedLocation] = useState("");

  const locations: Record<string, [number, number]> = {
    "Willis Library": [33.209929, -97.149024],
    "Pohl Recreation Center": [33.21207, -97.15404],
    "University Union": [33.210600, -97.147418],
    "Coliseum": [33.208687, -97.154113],
    "Discovery Park": [33.2300, -97.1270],
    "Art Building": [33.2125, -97.1535],
    "Business Leadership Building": [33.2120, -97.1520],
    "Chemistry Building": [33.2128, -97.1538],
    "Bain Hall": [33.2110, -97.1528],
    "Bruce Hall": [33.2123, -97.1540],
    "Chestnut Hall": [33.2126, -97.1505],
    "Curry Hall": [33.2130, -97.1522],
    "General Academic Building": [33.2118, -97.1526],
    "Gateway Center": [33.2135, -97.1530],
    "Eagle Student Services Center": [33.2119, -97.1519],
  };

  // Track user location
  useEffect(() => {
    if (!navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => setUserPosition([pos.coords.latitude, pos.coords.longitude]),
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 w-full">
      <div className="relative w-[90vw] h-[90vh]">
        {}
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-[2000] pointer-events-auto">
          <select
            value={selectedLocation}
            onChange={(e) => {
              const name = e.target.value;
              setSelectedLocation(name);
              setDestination(locations[name]);
            }}
            className="bg-[#00693E] text-white font-bold text-xl border-2 border-black rounded-xl px-8 py-4 shadow-lg"
          >
            <option value="" disabled>
              SELECT DESTINATION
            </option>
            {Object.keys(locations)
              .sort((a, b) => a.localeCompare(b))
              .map((name) => (
                <option key={name} value={name}>
                  {name.toUpperCase()}
                </option>
              ))}
          </select>
        </div>

        {/* Map */}
        <MapContainer
          center={defaultPosition}
          zoom={16}
          scrollWheelZoom={true}
          className="w-full h-full rounded-2xl shadow-lg"
        >
          <ClickToGetCoords />

          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          />

          {/* User marker */}
          {userPosition && (
            <Marker position={userPosition}>
              <Popup>You are here</Popup>
            </Marker>
          )}

          {/* Fly to user */}
          {userPosition && <FlyToMarker position={userPosition} />}

          {/* Destination marker */}
          {destination && (
            <Marker position={destination}>
              <Popup>Destination</Popup>
            </Marker>
          )}

          {/* Routing */}
          {userPosition && destination && (
            <Routing start={userPosition} end={destination} />
          )}
        </MapContainer>
      </div>

      {/* --- Inline CSS for routing directions box --- */}
      <style jsx global>{`
        .leaflet-routing-container {
          background-color: #00693E !important; /* UNT green */
          color: white !important; /* white text */
          font-weight: bold;
          border-radius: 12px;
          padding: 10px;
        }
        .leaflet-routing-step {
          color: white !important;
          background-color: transparent !important;
        }
        .leaflet-routing-instruction {
          color: white !important;
        }
      `}</style>
    </div>
  );
}
