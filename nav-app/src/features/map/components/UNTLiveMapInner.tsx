"use client";

import { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { useSearchParams } from "next/navigation";
import UNTSearchBar from "./UNTSearchBar";
import ParkingOverlay from "../../parking/components/ParkingOverlay";
import LocationDetailsPanel from "./LocationDetailsPanel";

// ---------------- Reverse Geocoding ----------------
const getNearestLocation = async (lat: number, lng: number) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
    );
    const data = await res.json();
    return data?.display_name?.split(",")[0] || "Current Location";
  } catch {
    return "Current Location";
  }
};

// ---------------- FlyTo ----------------
export const FlyToMarker = ({ position, isEvent }: any) => {
  const map = useMap();

  useEffect(() => {
    if (map && position) {
      map.flyTo(position, isEvent ? 16 : 15, {
        duration: 1.5,
      });
    }
  }, [position, map, isEvent]);

  return null;
};

// ---------------- Fit Bounds ----------------
const FitRouteBounds = ({ start, end }: any) => {
  const map = useMap();

  useEffect(() => {
    if (!start || !end) return;

    const bounds = L.latLngBounds([start, end]);

    map.fitBounds(bounds, {
      padding: [120, 120],
      maxZoom: 16,
      animate: true,
    });
  }, [start, end, map]);

  return null;
};

// ---------------- Routing ----------------
const ORSRouting = ({ start, end, setDirections }: any) => {
  const map = useMap();
  const routeLayersRef = useRef<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!start || !end) return;

    const fetchRoute = async () => {
      const res = await fetch("/api/map", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coordinates: [
            [start[1], start[0]],
            [end[1], end[0]],
          ],
        }),
      });

      const data = await res.json();

      if (!data?.features?.length) return;

      routeLayersRef.current.forEach((l) => map.removeLayer(l));
      routeLayersRef.current = [];

      const steps =
        data.features[0]?.properties?.segments?.[0]?.steps || [];

      setDirections(steps);

      data.features.forEach((feature: any, index: number) => {
        const layer = L.geoJSON(feature, {
          style: {
            color: index === activeIndex ? "#00853E" : "#9CA3AF",
            weight: index === activeIndex ? 6 : 4,
            opacity: index === activeIndex ? 1 : 0.5,
          },
        }).addTo(map);

        layer.on("click", () => {
          setActiveIndex(index);

          const newSteps =
            data.features[index]?.properties?.segments?.[0]?.steps || [];

          setDirections(newSteps);

          routeLayersRef.current.forEach((l, i) => {
            l.setStyle({
              color: i === index ? "#00853E" : "#9CA3AF",
              weight: i === index ? 6 : 4,
              opacity: i === index ? 1 : 0.5,
            });
          });
        });

        routeLayersRef.current.push(layer);
      });

      map.fitBounds(L.geoJSON(data.features[0]).getBounds(), {
        padding: [100, 100],
        maxZoom: 16,
        animate: true,
      });
    };

    fetchRoute();

    return () => {
      routeLayersRef.current.forEach((l) => map.removeLayer(l));
    };
  }, [start, end]);

  return null;
};

// ---------------- MAIN ----------------
export default function UNTLiveMapInner() {
  const searchParams = useSearchParams();

  const defaultPosition: [number, number] = [33.2104, -97.1503];

  const [userPosition, setUserPosition] = useState<any>(null);
  const [destination, setDestination] = useState<any>(null);
  const [nearestLocationName, setNearestLocationName] =
    useState("Current Location");

  const [showParking, setShowParking] = useState(false);
  const [isEventTarget, setIsEventTarget] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [directions, setDirections] = useState<any[]>([]);

  // for live rerouting threshold
  const prevRouteStart = useRef<any>(null);

  const routeStart = userPosition ?? defaultPosition;

  // fix leaflet icons
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  // GPS
  useEffect(() => {
    if (!navigator.geolocation) return;

    const id = navigator.geolocation.watchPosition((pos) => {
      setUserPosition([pos.coords.latitude, pos.coords.longitude]);
    });

    return () => navigator.geolocation.clearWatch(id);
  }, []);

  // URL params
  useEffect(() => {
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");

    if (lat && lng) {
      setDestination([parseFloat(lat), parseFloat(lng)]);
      setIsEventTarget(true);
    }
  }, [searchParams]);

  // reverse geocode
  useEffect(() => {
    if (!userPosition) return;

    getNearestLocation(userPosition[0], userPosition[1]).then(
      setNearestLocationName
    );
  }, [userPosition]);

  // live rerouting — only when destination is active and user moved ~20m+
  useEffect(() => {
    if (!destination || !userPosition) return;

    const [prevLat, prevLng] = prevRouteStart.current ?? [null, null];
    const [newLat, newLng] = userPosition;

    if (prevLat === null) {
      prevRouteStart.current = userPosition;
      return;
    }

    const dist = Math.sqrt(
      (newLat - prevLat) ** 2 + (newLng - prevLng) ** 2
    );

    // ~0.0002 degrees ≈ 20 meters
    if (dist < 0.0002) return;

    prevRouteStart.current = userPosition;
    // trigger ORSRouting re-fetch by nudging destination reference
    setDestination((d: any) => (d ? [...d] : d));
  }, [userPosition]);

  const handleGetDirections = () => {
    if (!selectedLocation) return;

    setDestination([selectedLocation.lat, selectedLocation.lng]);
    setSelectedLocation(null);
    setIsEventTarget(false);
    prevRouteStart.current = null; // reset reroute ref on new route
  };

  const handleEndRoute = () => {
    setDestination(null);
    setDirections([]);
    prevRouteStart.current = null;
  };

  return (
    <div className="h-screen w-screen relative">

      {!showParking && (
        <UNTSearchBar onSelect={setSelectedLocation} />
      )}

      <LocationDetailsPanel
        location={selectedLocation}
        onClose={() => setSelectedLocation(null)}
        onDirections={handleGetDirections}
      />

      <MapContainer
        center={defaultPosition}
        zoom={15}
        minZoom={13}
        maxZoom={18}
        zoomSnap={0.5}
        zoomDelta={0.5}
        wheelPxPerZoomLevel={120}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {destination ? (
          <FitRouteBounds start={routeStart} end={destination} />
        ) : (
          <FlyToMarker position={userPosition} isEvent={isEventTarget} />
        )}

        {userPosition && (
          <Marker position={userPosition}>
            <Popup>You are here ({nearestLocationName})</Popup>
          </Marker>
        )}

        {destination && (
          <Marker position={destination}>
            <Popup>Destination</Popup>
          </Marker>
        )}

        {destination && (
          <ORSRouting
            start={routeStart}
            end={destination}
            setDirections={setDirections}
          />
        )}

        {showParking && <ParkingOverlay />}
      </MapContainer>

      {/* Directions panel */}
      {destination && directions.length > 0 && (
        <div className="absolute top-20 right-4 w-80 max-h-[70vh] bg-white shadow-2xl rounded-xl z-[9999] flex flex-col">
          <div className="bg-[#00853E] text-white p-3 font-bold rounded-t-xl">
            Directions
          </div>

          <div className="overflow-y-auto p-3 space-y-3 text-sm">
            {directions.map((step, i) => (
              <div key={i} className="p-2 hover:bg-gray-100 rounded">
                <div>
                  {i + 1}. {step.instruction}
                </div>
                <div className="text-gray-500 text-xs">
                  {Math.round(step.distance)} m
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* End Route button */}
      {destination && (
        <button
          onClick={handleEndRoute}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full shadow-lg z-[9999] font-semibold"
        >
          End Route
        </button>
      )}

      <button
        onClick={() => setShowParking(!showParking)}
        className="absolute top-20 left-4 bg-white px-4 py-2 rounded-xl shadow z-[999]"
      >
        {showParking ? "Hide Parking" : "Show Parking"}
      </button>
    </div>
  );
}