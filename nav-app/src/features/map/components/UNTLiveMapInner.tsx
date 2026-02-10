"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import UNTSearchBar from "./UNTSearchBar";

export const FlyToMarker: React.FC<{ position: [number, number] }> = ({
  position,
}) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(position, 18, { duration: 1.5 });
  }, [position, map]);
  return null;
};

const Routing = ({
  start,
  end,
}: {
  start: [number, number];
  end: [number, number];
}) => {
  const map = useMap();
  useEffect((): void | (() => void) => {
    if (!start || !end) return;
    if (typeof window === "undefined") return;

    let control: any;

    const loadRouting = async () => {
      try {
        await import("leaflet-routing-machine");
        control = (L as any).Routing.control({
          waypoints: [
            L.latLng(start[0], start[1]),
            L.latLng(end[0], end[1]),
          ],
          routeWhileDragging: false,
          lineOptions: { styles: [{ color: "#2563eb", weight: 4 }] } as any,
          createMarker: (_: number, wp: any) => L.marker(wp.latLng),
        }).addTo(map);
      } catch (err) {
        console.error("Failed to load routing machine:", err);
      }
    };

    loadRouting();

    return () => {
      if (control) map.removeControl(control);
    };
  }, [map, start, end]);

  return null;
};

const ClickToGetCoords = () => {
  const map = useMap();
  useEffect((): void | (() => void) => {
    const onClick = (e: any) => {
      const { lat, lng } = e.latlng;
      alert(`Latitude: ${lat.toFixed(6)}, Longitude: ${lng.toFixed(6)}`);
    };
    map.on("click", onClick);
    return () => map.off("click", onClick);
  }, [map]);
  return null;
};

export default function UNTLiveMapInner() {
  const defaultPosition: [number, number] = [33.2104, -97.1503];

  const [userPosition, setUserPosition] = useState<[number, number] | null>(
    null
  );
  const [destination, setDestination] = useState<[number, number] | null>(null);
  const [selectedLocationName, setSelectedLocationName] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  useEffect((): void | (() => void) => {
    if (!navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => setUserPosition([pos.coords.latitude, pos.coords.longitude]),
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const handleLocationSelect = (loc: {
    name: string;
    lat: number;
    lng: number;
  }) => {
    setSelectedLocationName(loc.name);
    setDestination([loc.lat, loc.lng]);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 w-full">
      <div className="relative w-[90vw] h-[90vh]">
        <UNTSearchBar onSelect={handleLocationSelect} />

        <MapContainer
          center={defaultPosition}
          zoom={16}
          scrollWheelZoom
          className="w-full h-full rounded-2xl shadow-lg"
        >
          <ClickToGetCoords />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          />

          {userPosition && (
            <Marker position={userPosition}>
              <Popup>You are here</Popup>
            </Marker>
          )}

          {userPosition && <FlyToMarker position={userPosition} />}

          {destination && (
            <Marker position={destination}>
              <Popup>Destination</Popup>
            </Marker>
          )}

          {userPosition && destination && (
            <Routing start={userPosition} end={destination} />
          )}
        </MapContainer>
      </div>

      <style jsx global>{`
        .leaflet-routing-container {
          background-color: #00693e !important;
          color: white !important;
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
