"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// FlyTo helper
const FlyToMarker: React.FC<{ position: [number, number] }> = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 18, { duration: 1.5 });
    }
  }, [position, map]);

  return null;
};

export default function UNTLiveMapInner({
  selectedLocation,
}: {
  selectedLocation?: { lat: number; lng: number; name: string } | null;
}) {
  // Default UNT campus position
  const defaultPosition: [number, number] = [33.2104, -97.1503];

  const searchPosition: [number, number] | null = selectedLocation
    ? [selectedLocation.lat, selectedLocation.lng]
    : null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-b from-blue-50 to-blue-100">
      <h1 className="text-3xl font-bold mb-4 text-blue-700">UNT Campus Map</h1>

      <MapContainer
        center={defaultPosition}
        zoom={16}
        scrollWheelZoom={true}
        className="w-[90vw] h-[75vh] rounded-2xl shadow-lg z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        />

        {/* Default UNT Marker */}
        <Marker position={defaultPosition}>
          <Popup>University of North Texas</Popup>
        </Marker>

        {/* Search result marker */}
        {searchPosition && selectedLocation && (
          <Marker position={searchPosition}>
            <Popup>{selectedLocation.name}</Popup>
          </Marker>
        )}

        {/* Smooth fly animation */}
        {searchPosition && <FlyToMarker position={searchPosition} />}
      </MapContainer>
    </div>
  );
}
