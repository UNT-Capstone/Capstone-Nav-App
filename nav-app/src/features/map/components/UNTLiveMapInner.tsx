"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import UNTSearchBar, { LOCATIONS } from "./UNTSearchBar";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const FlyToMarker: React.FC<{ position: [number, number] }> = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 18, { duration: 1.5 });
    }
  }, [position, map]);

  return null;
};

export default function UNTLiveMap() {
  const searchParams = useSearchParams();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const eventTitle = searchParams.get("event");

  const defaultPosition: [number, number] = [33.2104, -97.1503];
  const eventPosition: [number, number] =
    lat && lng ? [parseFloat(lat), parseFloat(lng)] : defaultPosition;

  // Added states for search bar 
  const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(
    null
  );
  const [selectedName, setSelectedName] = useState<string | null>(null);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-linear-to-b from-blue-50 to-blue-100">
      
      {/* ---------- Search bar ---------- */}
      <UNTSearchBar
        onSelect={(lat, lng, name) => {
          setSelectedPosition([lat, lng]);
          setSelectedName(name);
        }}
      />

      {/* ---------- Map ---------- */}
      <MapContainer
        center={defaultPosition}
        zoom={16}
        scrollWheelZoom={true}
        className="w-[90vw] h-[90vh] rounded-2xl shadow-lg z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        />

        {/* Default UNT marker */}
        <Marker position={defaultPosition}>
          <Popup>University of North Texas</Popup>
        </Marker>

        {/* Event marker */}
        {lat && lng && eventTitle && (
          <Marker position={eventPosition}>
            <Popup>{eventTitle}</Popup>
          </Marker>
        )}

        {/* Fly smoothly to event */}
        {lat && lng && <FlyToMarker position={eventPosition} />}

        {/* Marker & fly for search bar selection */}
        {selectedPosition && selectedName && (
          <>
            <Marker position={selectedPosition}>
              <Popup>{selectedName}</Popup>
            </Marker>
            <FlyToMarker position={selectedPosition} />
          </>
        )}
      </MapContainer>
    </div>
  );
}
