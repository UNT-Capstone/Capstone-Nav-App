"use client";

import { useEffect, useState } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

// Simple blue-dot style marker for live user location
const userIcon = L.divIcon({
  className: "user-location-icon",
  html: `
    <div style="
      width:14px;
      height:14px;
      background:#2563eb;
      border:3px solid white;
      border-radius:50%;
      box-shadow:0 0 10px rgba(37,99,235,0.8);
    "></div>
  `,
  iconSize: [14, 14],
});

export default function UserLiveLocationMarker() {
  const map = useMap();
  const [position, setPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const newPosition: [number, number] = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];

        setPosition(newPosition);
        map.flyTo(newPosition, map.getZoom(), { animate: true });
      },
      (err) => {
        console.error("Geolocation error:", err);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [map]);

  if (!position) return null;

  return (
    <Marker position={position} icon={userIcon}>
      <Popup>You are here</Popup>
    </Marker>
  );
}
