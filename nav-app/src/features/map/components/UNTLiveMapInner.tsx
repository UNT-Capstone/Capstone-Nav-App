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

export const FlyToMarker = ({ position }: any) => {
  const map = useMap();

  useEffect(() => {
    if (map && position) {
      map.flyTo(position, 15, { duration: 1.5 });
    }
  }, [position]);

  return null;
};

const FitRouteBounds = ({ start, end }: any) => {
  const map = useMap();

  useEffect(() => {
    if (!start || !end) return;

    const bounds = L.latLngBounds([start, end]);

    map.fitBounds(bounds, {
      padding: [100, 100],
      maxZoom: 16,
      animate: true,
    });
  }, [start, end]);

  return null;
};

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
            opacity: index === activeIndex ? 1 : 0.6,
          },
        }).addTo(map);

        layer.on("click", () => {
          setActiveIndex(index);

          setDirections(
            data.features[index]?.properties?.segments?.[0]?.steps || []
          );

          routeLayersRef.current.forEach((l, i) => {
            l.setStyle({
              color: i === index ? "#00853E" : "#9CA3AF",
              weight: i === index ? 6 : 4,
              opacity: i === index ? 1 : 0.6,
            });
          });
        });

        routeLayersRef.current.push(layer);
      });

      map.fitBounds(L.geoJSON(data.features[0]).getBounds(), {
        padding: [100, 100],
        maxZoom: 16,
      });
    };

    fetchRoute();

    return () => {
      routeLayersRef.current.forEach((l) => map.removeLayer(l));
    };
  }, [start, end]);

  return null;
};

export default function UNTLiveMapInner() {
  const searchParams = useSearchParams();

  const defaultPosition: [number, number] = [33.2104, -97.1503];

  const [userPosition, setUserPosition] = useState<any>(null);
  const [destination, setDestination] = useState<any>(null);
  const [nearestLocationName, setNearestLocationName] =
    useState("Current Location");

  const [showParking, setShowParking] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [directions, setDirections] = useState<any[]>([]);

  const routeStart = userPosition ?? defaultPosition;

  const showSearchBar = !destination;

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
      setDestination([parseFloat(lat), parseFloat(lng)]);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!userPosition) return;

    getNearestLocation(userPosition[0], userPosition[1]).then(
      setNearestLocationName
    );
  }, [userPosition]);

  const handleGetDirections = () => {
    if (!selectedLocation) return;
    setDestination([selectedLocation.lat, selectedLocation.lng]);
    setSelectedLocation(null);
  };

  const handleEndRoute = () => {
    setDestination(null);
    setDirections([]);
    setSelectedLocation(null);
  };

  return (
    <div className="h-screen w-screen relative">

      {showSearchBar && (
        <div className="fixed top-28 left-1/2 -translate-x-1/2 z-[2000] w-[92vw] md:w-[420px]">
          <UNTSearchBar onSelect={setSelectedLocation} />
        </div>
      )}

      <LocationDetailsPanel
        location={selectedLocation}
        onClose={() => setSelectedLocation(null)}
        onDirections={handleGetDirections}
      />

      <div className="h-full w-full">
        <MapContainer
          center={defaultPosition}
          zoom={15}
          minZoom={13}
          maxZoom={18}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {destination ? (
            <FitRouteBounds start={routeStart} end={destination} />
          ) : (
            <FlyToMarker position={userPosition} />
          )}

          {userPosition && (
            <Marker position={userPosition} icon={userIcon}>
              <Popup>You ({nearestLocationName})</Popup>
            </Marker>
          )}

          {destination && (
            <Marker position={destination} icon={destinationIcon}>
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

        <div className="absolute top-[110px] left-6 z-[999]">
          <button
            onClick={() => setShowParking(!showParking)}
            className="bg-white px-4 py-2 rounded-xl shadow"
          >
            {showParking ? "Hide Parking" : "Show Parking"}
          </button>
        </div>
      </div>

      {destination && directions.length > 0 && (
        <div className="
          md:absolute md:top-28 md:left-4 md:w-[460px] md:max-h-[70vh]
          fixed bottom-0 left-0 right-0 h-[80vh]
          bg-white shadow-2xl rounded-t-2xl md:rounded-xl z-[2000] flex flex-col
        ">
          <div className="bg-[#00853E] text-white p-3 font-bold">
            Directions
          </div>

          <div className="overflow-y-auto p-3 space-y-2 text-sm flex-1">
            {directions.map((step, i) => (
              <div key={i} className="p-2 hover:bg-gray-100 rounded">
                {i + 1}. {step.instruction}
                <div className="text-gray-500 text-xs">
                  {Math.round(step.distance)} m
                </div>
              </div>
            ))}
          </div>

          <div className="p-3">
            <button
              onClick={handleEndRoute}
              className="w-full bg-red-500 text-white py-2 rounded-lg font-semibold"
            >
              End Route
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
