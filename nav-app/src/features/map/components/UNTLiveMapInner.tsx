"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

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
      map.flyTo(position, 18, { duration: 1.5 }); // zoom 18, 1.5s animation
    }
  }, [position, map]);

  return null;
};

export default function UNTLiveMap() {
  const searchParams = useSearchParams();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const eventTitle = searchParams.get("event");

  // Default UNT campus position
  const defaultPosition: [number, number] = [33.2104, -97.1503];

  // Use event coordinates if provided
  const eventPosition: [number, number] =
    lat && lng ? [parseFloat(lat), parseFloat(lng)] : defaultPosition;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-b from-blue-50 to-blue-100">

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
      </MapContainer>
    </div>
  );
}
