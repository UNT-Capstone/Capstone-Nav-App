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
import { useSearchParams, useRouter } from "next/navigation";
import UNTSearchBar from "./UNTSearchBar";
import ParkingOverlay from "../../parking/components/ParkingOverlay";
import LocationDetailsPanel from "./LocationDetailsPanel";

const userIcon = L.divIcon({
  className: "",
  html: `<div class="w-4 h-4 bg-green-500 rounded-full animate-pulse border-2 border-white shadow-lg"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const destinationIcon = L.divIcon({
  className: "",
  html: `<div class="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const getNearestLocation = async (lat: number, lng: number) => {
  try {
    const res = await fetch(`/api/reverse-geocode?lat=${lat}&lon=${lng}`);
    const data = await res.json();
    return data?.display_name?.split(",")[0] || "Current Location";
  } catch {
    return "Current Location";
  }
};

export const FlyToMarker = ({ position }: { position: [number, number] | null }) => {
  const map = useMap();
  const hasFlewRef = useRef(false);
  useEffect(() => {
    if (map && position && !hasFlewRef.current) {
      hasFlewRef.current = true;
      map.flyTo(position, 15, { duration: 1.5 });
    }
  }, [map, position]);
  return null;
};

const LocationPicker = ({ onPick }: { onPick: (lat: number, lng: number) => void }) => {
  const map = useMap();
  useEffect(() => {
    const onClick = (e: any) => {
      onPick(e.latlng.lat, e.latlng.lng);
    };
    map.on("click", onClick);
    map.getContainer().style.cursor = "crosshair";
    return () => {
      map.off("click", onClick);
      map.getContainer().style.cursor = "";
    };
  }, [map, onPick]);
  return null;
};

const FitRouteBounds = ({ start, end }: { start: [number, number]; end: [number, number] }) => {
  const map = useMap();
  const hasFitRef = useRef(false);
  useEffect(() => {
    if (!start || !end || hasFitRef.current) return;
    hasFitRef.current = true;
    const bounds = L.latLngBounds([start, end]);
    map.fitBounds(bounds, {
      padding: [100, 100],
      maxZoom: 16,
      animate: true,
    });
  }, [map, start, end]);
  return null;
};

const ORSRouting = ({ start, end, setDirections, activeIndex, setActiveIndex }: any) => {
  const map = useMap();
  const routeLayersRef = useRef<any[]>([]);
  const routeDataRef = useRef<any[]>([]);

  useEffect(() => {
    if (!start || !end) return;

    let cancelled = false;

    const fetchRoute = async () => {
      try {
        const res = await fetch("/api/map", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            coordinates: [[start[1], start[0]], [end[1], end[0]]],
          }),
        });

        const data = await res.json();
        if (cancelled) return;
        if (!data?.features?.length) return;

        routeDataRef.current = data.features;

        routeLayersRef.current.forEach((l) => map.removeLayer(l));
        routeLayersRef.current = [];

        setDirections(data.features[0]?.properties?.segments?.[0]?.steps || []);

        if (!map.getPane("routePane")) {
          map.createPane("routePane");
          map.getPane("routePane")!.style.zIndex = "450";
        }

        data.features.forEach((feature: any, index: number) => {
          const layer = L.geoJSON(feature, {
            style: {
              color: index === 0 ? "#00853E" : "#9CA3AF",
              weight: index === 0 ? 6 : 4,
              opacity: index === 0 ? 1 : 0.6,
            },
            pane: "routePane",
          }).addTo(map);

          layer.on("click", () => {
            setActiveIndex(index);
            setDirections(routeDataRef.current[index]?.properties?.segments?.[0]?.steps || []);
          });

          routeLayersRef.current.push(layer);
        });
      } catch (err) {
        console.error("Route fetch failed:", err);
      }
    };

    fetchRoute();

    return () => {
      cancelled = true;
      routeLayersRef.current.forEach((l) => map.removeLayer(l));
      routeLayersRef.current = [];
    };
  }, [start, end]);

  useEffect(() => {
    routeLayersRef.current.forEach((layer, index) => {
      layer.setStyle({
        color: index === activeIndex ? "#00853E" : "#9CA3AF",
        weight: index === activeIndex ? 6 : 4,
        opacity: index === activeIndex ? 1 : 0.6,
      });
    });
  }, [activeIndex]);

  return null;
};

export default function UNTLiveMapInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const defaultPosition: [number, number] = [33.2104, -97.1503];
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [destination, setDestination] = useState<[number, number] | null>(null);
  const [frozenRouteStart, setFrozenRouteStart] = useState<[number, number]>(defaultPosition);
  const [nearestLocationName, setNearestLocationName] = useState("Current Location");
  const [showParking, setShowParking] = useState(false);
  const [isPickingMode, setIsPickingMode] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [directions, setDirections] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });

    if (localStorage.getItem("unt_picking_mode") === "true") {
      setIsPickingMode(true);
    }
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) return;
    const id = navigator.geolocation.watchPosition((pos) => {
      setUserPosition([pos.coords.latitude, pos.coords.longitude]);
    });
    return () => navigator.geolocation.clearWatch(id);
  }, []);

  useEffect(() => {
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    if (lat && lng) {
      const dest: [number, number] = [parseFloat(lat), parseFloat(lng)];
      setFrozenRouteStart(userPosition ?? defaultPosition);
      setDestination(dest);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!userPosition) return;
    getNearestLocation(userPosition[0], userPosition[1]).then(setNearestLocationName);
  }, [userPosition]);

  const handleGetDirections = (location: any) => {
    if (!location) return;
    setFrozenRouteStart(userPosition ?? defaultPosition);
    setDestination([location.lat, location.lng]);
    setSelectedLocation(null);
  };

  const handleMapPick = (lat: number, lng: number) => {
    localStorage.setItem("unt_last_picked_coord", JSON.stringify({ lat: lat.toFixed(6), lng: lng.toFixed(6) }));
    localStorage.removeItem("unt_picking_mode");
    setIsPickingMode(false);
    router.back();
  };

  const handleEndRoute = () => {
    setDestination(null);
    setDirections([]);
    setSelectedLocation(null);
    setActiveIndex(0);
    setFrozenRouteStart(defaultPosition);
  };

  return (
    <div className="h-screen w-screen relative">
      {!isPickingMode && (
        <div className="fixed top-32 md:top-36 left-1/2 -translate-x-1/2 z-[500] w-[92vw] md:w-[420px] px-2 md:px-0">
          <UNTSearchBar onSelect={setSelectedLocation} />
        </div>
      )}

      <LocationDetailsPanel
        location={selectedLocation}
        onClose={() => setSelectedLocation(null)}
        onDirections={() => handleGetDirections(selectedLocation)}
      />

      <div className="h-full w-full">
        {isPickingMode ? (
          <div className="absolute z-[1000] top-40 left-1/2 -translate-x-1/2 bg-[#00853E] text-white px-8 py-4 rounded-2xl shadow-2xl font-black uppercase text-xs tracking-widest flex items-center gap-4 animate-bounce">
            Tap map to set event location
            <button onClick={() => setIsPickingMode(false)} className="bg-white/20 px-3 py-1 rounded-lg text-[10px] hover:bg-white/40">Cancel</button>
          </div>
        ) : (
          <button
            onClick={() => setShowParking(!showParking)}
            className="absolute z-[999] top-20 left-4 bg-white px-4 py-2 rounded-xl shadow font-bold text-[#00853E]"
          >
            {showParking ? "Hide Parking" : "Show Parking"}
          </button>
        )}

        <MapContainer
          center={defaultPosition}
          zoom={15}
          minZoom={13}
          maxZoom={18}
          touchZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />

          {isPickingMode && <LocationPicker onPick={handleMapPick} />}

          <FlyToMarker position={destination || userPosition} />

          {destination && <FitRouteBounds start={frozenRouteStart} end={destination} />}

          {userPosition && (
            <Marker position={userPosition} icon={userIcon}>
              <Popup>You ({nearestLocationName})</Popup>
            </Marker>
          )}

          {destination && (
            <>
              <Marker position={destination} icon={destinationIcon}>
                <Popup>Destination</Popup>
              </Marker>
              <ORSRouting
                start={frozenRouteStart}
                end={destination}
                setDirections={setDirections}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
              />
            </>
          )}

          {showParking && <ParkingOverlay />}
        </MapContainer>
      </div>

      {destination && directions.length > 0 && (
        <div
          className="md:absolute md:top-44 md:left-4 md:w-[460px] md:max-h-[70vh] fixed bottom-0 left-0 right-0 h-[40vh] md:h-[50vh] bg-white shadow-2xl rounded-t-2xl md:rounded-xl z-[2000] flex flex-col"
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div className="bg-[#00853E] text-white p-2 md:p-4 font-bold rounded-t-xl text-xs md:text-base">
            Directions
          </div>

          <div
            className="overflow-y-auto p-2 md:p-4 space-y-2 text-sm flex-1"
            style={{ overflowY: "scroll", WebkitOverflowScrolling: "touch" }}
          >
            <div className="md:hidden">
              {directions.map((step, i) => (
                <div
                  key={i}
                  className={`p-2 border-b last:border-0 ${i === activeIndex ? "bg-[#00853E]/10 border-l-4 border-[#00853E]" : ""}`}
                >
                  <span className="font-bold mr-2 text-xs">{i + 1}.</span>
                  <span className="text-xs">{step.instruction}</span>
                  <div className="text-gray-600 text-xs mt-1">{Math.round(step.distance)} m</div>
                </div>
              ))}
            </div>

            <div className="hidden md:block">
              {directions.map((step, i) => (
                <div
                  key={i}
                  className={`p-2 border-b last:border-0 hover:bg-gray-50 ${i === activeIndex ? "bg-[#00853E]/5 border-l-4 border-[#00853E]" : ""}`}
                >
                  <span className="font-bold mr-2">{i + 1}.</span> {step.instruction}
                  <div className="text-gray-400 text-xs mt-1">{Math.round(step.distance)} m</div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-2 md:p-4 border-t">
            <button
              onClick={handleEndRoute}
              className="w-full bg-red-600 text-white py-1.5 md:py-3 rounded-xl font-bold transition hover:bg-red-700 text.xs md:text-base"
            >
              End Route
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        .leaflet-control-zoom { border: none !important; box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important; }
      `}</style>
    </div>
  );
}