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


const FlyToMarker = ({ position }: any) => {
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

      const layer = L.geoJSON(data.features[0], {
        style: {
          color: "#00853E",
          weight: 6,
        },
      }).addTo(map);

      routeLayersRef.current.push(layer);

      map.fitBounds(layer.getBounds(), {
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
  };

  return (
    <div className="h-screen w-screen flex flex-col">

      {}
      <div className="pt-28 px-4 flex justify-center z-[1000]">
        {!showParking && (
          <div className="w-full max-w-md">
            <UNTSearchBar onSelect={setSelectedLocation} />
          </div>
        )}
      </div>

      <LocationDetailsPanel
        location={selectedLocation}
        onClose={() => setSelectedLocation(null)}
        onDirections={handleGetDirections}
      />

      {}
      <div className="flex-1 relative">
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
            <Marker position={userPosition}>
              <Popup>You ({nearestLocationName})</Popup>
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

        {}
        <div className="absolute top-4 left-4 flex flex-col gap-3 z-[1000]">
          <button
            onClick={() => setShowParking(!showParking)}
            className="bg-white px-4 py-2 rounded-xl shadow"
          >
            {showParking ? "Hide Parking" : "Show Parking"}
          </button>
        </div>

        {}
        {destination && (
          <button
            onClick={handleEndRoute}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-2 rounded-full shadow z-[1000]"
          >
            End Route
          </button>
        )}
      </div>

      {}
      {destination && directions.length > 0 && (
        <div className="
          md:absolute md:top-28 md:right-4 md:w-80 md:max-h-[70vh]
          fixed bottom-0 left-0 right-0 h-[40vh]
          bg-white shadow-2xl rounded-t-2xl md:rounded-xl z-[2000] flex flex-col
        ">
          <div className="bg-[#00853E] text-white p-3 font-bold">
            Directions
          </div>

          <div className="overflow-y-auto p-3 space-y-2 text-sm">
            {directions.map((step, i) => (
              <div key={i} className="p-2 hover:bg-gray-100 rounded">
                {i + 1}. {step.instruction}
                <div className="text-gray-500 text-xs">
                  {Math.round(step.distance)} m
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}