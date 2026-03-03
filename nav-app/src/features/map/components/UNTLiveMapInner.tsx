"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useSearchParams } from "next/navigation";
import UNTSearchBar from "./UNTSearchBar";
import ParkingOverlay from "../../parking/components/ParkingOverlay";
import LocationDetailsPanel from "./LocationDetailsPanel";

// --- Helper: Reverse Geocoding (MISSING PIECE ADDED BACK) ---
const getNearestLocation = async (lat: number, lng: number) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
    );
    const data = await response.json();
    if (data.display_name) {
      return data.display_name.split(",")[0];
    }
    return "Current Location";
  } catch (err) {
    console.error(err);
    return "Current Location";
  }
};

// --- Component: FlyTo Logic ---
export const FlyToMarker: React.FC<{ 
  position: [number, number] | null; 
  isEvent?: boolean 
}> = ({ position, isEvent }) => {
  const map = useMap();

  useEffect(() => {
    if (map && position) {
      const zoomLevel = isEvent ? 17 : 18; 
      map.flyTo(position, zoomLevel, { duration: 1.5 });
    }
  }, [position, map, isEvent]);

  return null;
};

// --- Component: Routing Engine ---
const Routing = ({
  start,
  end,
}: {
  start: [number, number];
  end: [number, number];
}) => {
  const map = useMap();

  useEffect(() => {
    if (!start || !end || typeof window === "undefined") return;

    let control: any = null;

    const loadRouting = async () => {
      try {
        await import("leaflet-routing-machine");
        control = (L as any).Routing.control({
          waypoints: [L.latLng(start[0], start[1]), L.latLng(end[0], end[1])],
          routeWhileDragging: false,
          lineOptions: { styles: [{ color: "#00853E", weight: 6 }] } as any,
          createMarker: (_: number, wp: any) => L.marker(wp.latLng),
        }).addTo(map);
      } catch (err) {
        console.error("Routing Error:", err);
      }
    };

    loadRouting();

    return () => {
      if (control && map) {
        try {
          map.removeControl(control);
        } catch {}
      }
    };
  }, [start, end, map]);

  return null;
};

// --- Component: Debug Click Logic ---
const ClickToGetCoords = () => {
  const map = useMap();
  useEffect(() => {
    const onClick = (e: any) => {
      const { lat, lng } = e.latlng;
      alert(`Latitude: ${lat.toFixed(6)}, Longitude: ${lng.toFixed(6)}`);
    };
    map.on("click", onClick);
    return () => { map.off("click", onClick); };
  }, [map]);
  return null;
};

// --- Main Component ---
export default function UNTLiveMapInner() {
  const searchParams = useSearchParams(); 
  const defaultPosition: [number, number] = [33.2104, -97.1503];

  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [nearestLocationName, setNearestLocationName] = useState<string>("Current Location");
  const [destination, setDestination] = useState<[number, number] | null>(null);
  const [showParking, setShowParking] = useState(false);
  const [isEventTarget, setIsEventTarget] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    name: string;
    lat: number;
    lng: number;
  } | null>(null);

  // Initialize Icons
  useEffect(() => {
    if (typeof window === "undefined") return;
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  // Geolocation Watcher
  useEffect(() => {
    if (!navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => setUserPosition([pos.coords.latitude, pos.coords.longitude]),
      () => {},
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Sync URL Params
  useEffect(() => {
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    
    if (lat && lng) {
      setDestination([parseFloat(lat), parseFloat(lng)]);
      setIsEventTarget(true); 
    }
  }, [searchParams]);

  // Reverse Geocode User Location
  useEffect(() => {
    if (!userPosition) return;
    const [lat, lng] = userPosition;
    getNearestLocation(lat, lng).then((name) => setNearestLocationName(name));
  }, [userPosition]);

  const handleLocationSelect = (loc: { name: string; lat: number; lng: number }) => {
    setSelectedLocation(loc);
  };

  const handleGetDirections = () => {
    if (selectedLocation) {
      setIsEventTarget(false);
      setDestination([selectedLocation.lat, selectedLocation.lng]);
      setSelectedLocation(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-blue-50 w-screen">
      <div className="relative w-screen h-full">
        <UNTSearchBar onSelect={handleLocationSelect} />

        <LocationDetailsPanel
          location={selectedLocation}
          onClose={() => setSelectedLocation(null)}
          onDirections={handleGetDirections}
        />

        <button
          onClick={() => setShowParking((p) => !p)}
          className="absolute z-[999] top-32 left-4 md:left-16 bg-white px-4 py-2 rounded-xl shadow font-bold text-[#00853E]"
        >
          {showParking ? "Hide Parking" : "Show Parking"}
        </button>

        <MapContainer
          center={defaultPosition}
          zoom={16}
          scrollWheelZoom
          className="w-full h-full rounded-none shadow-lg"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />

          {!showParking && <ClickToGetCoords />}

          {/* Intelligent Focus: Fly to Event Destination first, else User */}
          <FlyToMarker position={destination || userPosition} isEvent={isEventTarget} />

          {userPosition && (
            <Marker position={userPosition}>
              <Popup>You (at {nearestLocationName})</Popup>
            </Marker>
          )}

          {destination && (
            <Marker position={destination}>
              <Popup>{searchParams.get("event") || "Destination"}</Popup>
            </Marker>
          )}

          {userPosition && destination && !showParking && (
            <Routing start={userPosition} end={destination} />
          )}

          {showParking && <ParkingOverlay />}
        </MapContainer>
      </div>

      <style jsx global>{`
        .leaflet-routing-container {
          background-color: #00853E !important;
          color: white !important;
          font-family: sans-serif;
          border-radius: 12px;
          padding: 12px;
          max-width: 300px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        .leaflet-routing-alt {
          max-height: 200px;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
}