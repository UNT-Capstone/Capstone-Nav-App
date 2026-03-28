"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useSearchParams } from "next/navigation";
import UNTSearchBar from "./UNTSearchBar";
import ParkingOverlay from "../../parking/components/ParkingOverlay";
import LocationDetailsPanel from "./LocationDetailsPanel";

// --- Helper: Reverse Geocoding ---
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
  isEvent?: boolean;
}> = ({ position, isEvent }) => {
  const map = useMap();

  useEffect(() => {
    if (map && position) {
      const zoomLevel = isEvent ? 16 : 15;
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
          showAlternatives: true,
          collapsible: true,
          show: true,

          lineOptions: {
            styles: [{ color: "#00853E", weight: 6 }],
          },

          altLineOptions: {
            styles: [{ color: "#999999", weight: 5, dashArray: "6,10" }],
          },

          createMarker: (_: number, wp: any) => L.marker(wp.latLng),
        }).addTo(map);

        // Helper: show only the directions panel for the given route index
        const showOnlyRouteInstructions = (activeIndex: number) => {
          const container = control.getContainer();
          if (!container) return;

          const altPanels = container.querySelectorAll(".leaflet-routing-alt");
          altPanels.forEach((panel: Element, i: number) => {
            (panel as HTMLElement).style.display =
              i === activeIndex ? "block" : "none";
          });
        };

        // After routes are found, hide alt directions and wire up click handlers
        control.on("routesfound", (e: any) => {
          const routes = e.routes;

          setTimeout(() => {
            showOnlyRouteInstructions(0);

            const container = control.getContainer();
            if (!container) return;

            const altPanels = container.querySelectorAll(".leaflet-routing-alt");
            altPanels.forEach((panel: Element, i: number) => {
              const header = panel.querySelector("h3, h2");
              if (header) {
                (header as HTMLElement).style.cursor = "pointer";
                header.addEventListener("click", () => {
                  showOnlyRouteInstructions(i);
                });
              }
            });
          }, 150);

          control.on("routeselected", (ev: any) => {
            const selectedIndex = routes.findIndex(
              (r: any) => r === ev.route
            );
            if (selectedIndex !== -1) {
              showOnlyRouteInstructions(selectedIndex);
            }
          });
        });
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
    return () => {
      map.off("click", onClick);
    };
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
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
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

  const handleLocationSelect = (loc: {
    name: string;
    lat: number;
    lng: number;
  }) => {
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
            attribution="&copy; OpenStreetMap contributors"
          />

          {!showParking && <ClickToGetCoords />}

          <FlyToMarker
            position={destination || userPosition}
            isEvent={isEventTarget}
          />

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
        /* ── Desktop: top-right corner ── */
        .leaflet-routing-container {
          background-color: #00853e !important;
          color: white !important;
          font-family: sans-serif;
          border-radius: 14px;
          padding: 14px 16px;
          width: 300px !important;
          max-width: 92vw !important;
          max-height: 60vh !important;
          overflow: hidden;
          display: flex !important;
          flex-direction: column;
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.28);
        }

        /* ── Mobile: bottom sheet, full width, shorter height ── */
        @media (max-width: 640px) {
          .leaflet-routing-container {
            position: fixed !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            top: auto !important;
            width: 100vw !important;
            max-width: 100vw !important;
            max-height: 35vh !important;
            border-radius: 16px 16px 0 0 !important;
            padding: 12px 16px !important;
            z-index: 1000 !important;
          }
        }

        /* Top summary */
        .leaflet-routing-container > h2 {
          font-size: 13px !important;
          font-weight: 700;
          margin: 0 0 8px 0 !important;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(255,255,255,0.3);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex-shrink: 0;
        }

        /* Hide all alt panels by default */
        .leaflet-routing-alt {
          display: none;
          flex: 1;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.4) transparent;
        }
        .leaflet-routing-alt::-webkit-scrollbar {
          width: 5px;
        }
        .leaflet-routing-alt::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.4);
          border-radius: 4px;
        }

        /* Alt route header */
        .leaflet-routing-alt h3,
        .leaflet-routing-alt h2 {
          cursor: pointer;
          font-size: 13px !important;
          font-weight: 700;
          padding: 4px 0 6px 0;
          margin: 0 0 6px 0;
          border-bottom: 1px solid rgba(255,255,255,0.2);
          flex-shrink: 0;
        }
        .leaflet-routing-alt h3:hover,
        .leaflet-routing-alt h2:hover {
          text-decoration: underline;
        }

        /* Instruction rows */
        .leaflet-routing-alt table {
          width: 100%;
          border-collapse: collapse;
        }
        .leaflet-routing-alt td {
          padding: 6px 4px;
          font-size: 13px;
          line-height: 1.45;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          vertical-align: middle;
        }

        @media (max-width: 640px) {
          .leaflet-routing-alt td {
            font-size: 12px;
            padding: 5px 4px;
          }
        }

        .leaflet-routing-alt tr:last-child td {
          border-bottom: none;
        }

        /* Distance badge */
        .leaflet-routing-alt td:last-child {
          text-align: right;
          white-space: nowrap;
          padding-left: 10px;
          font-weight: 600;
          font-size: 12px;
          opacity: 0.85;
        }

        /* Turn icons */
        .leaflet-routing-icon {
          filter: brightness(10);
          width: 18px;
          height: 18px;
        }

        /* Collapse button */
        .leaflet-routing-collapse-btn {
          background: rgba(255,255,255,0.2) !important;
          border-radius: 6px !important;
          color: white !important;
          font-size: 12px !important;
          padding: 2px 8px !important;
          border: none !important;
          cursor: pointer !important;
          margin-top: 6px;
          flex-shrink: 0;
        }
        .leaflet-routing-collapse-btn:hover {
          background: rgba(255,255,255,0.35) !important;
        }
      `}</style>
    </div>
  );
}
