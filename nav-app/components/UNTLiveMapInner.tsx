"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";


delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function UNTLiveMap() {
  const untPosition: [number, number] = [33.2104, -97.1503];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-b from-blue-50 to-blue-100">
      <h1 className="text-3xl font-bold mb-4 text-blue-700">
        UNT Campus Map
      </h1>

      <MapContainer
        center={untPosition}
        zoom={16}
        scrollWheelZoom={true}
        className="w-[90vw] h-[75vh] rounded-2xl shadow-lg z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        />
        <Marker position={untPosition}>
          <Popup>University of North Texas</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
