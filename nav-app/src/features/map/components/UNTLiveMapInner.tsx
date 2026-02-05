"use client";

import { useEffect, useState, Suspense } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useSearchParams } from "next/navigation";
import L from "leaflet";


interface PositionProps {
  position: [number, number];
}

interface RoutingProps {
  start: [number, number];
  end: [number, number];
}

const createBuildingIcon = (url: string) => L.icon({
  iconUrl: url,
  iconSize: [50, 50],
  iconAnchor: [25, 50],
  popupAnchor: [0, -50],
  className: "rounded-full border-2 border-[#00853E] shadow-xl object-cover bg-white"
});

const FlyToMarker: React.FC<PositionProps> = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 18, { duration: 1.5 });
    }
  }, [position, map]);
  return null;
};

const Routing: React.FC<RoutingProps> = ({ start, end }) => {
  const map = useMap();
  useEffect(() => {
    if (!start || !end || typeof window === "undefined") return;
    let control: any;

    const loadRouting = async () => {
      try {
        await import("leaflet-routing-machine");
        control = (L as any).Routing.control({
          waypoints: [L.latLng(start[0], start[1]), L.latLng(end[0], end[1])],
          routeWhileDragging: false,
          addWaypoints: false,
          show: false, 
          lineOptions: { styles: [{ color: "#00853E", weight: 6, opacity: 0.8 }] } as any,
          createMarker: () => null,
        }).addTo(map);
      } catch (err) {
        console.error("Failed to load routing machine:", err);
      }
    };
    loadRouting();
    return () => { if (control) map.removeControl(control); };
  }, [map, start, end]);
  return null;
};

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

function MapLogic({ 
  locations, 
  setDestination, 
  setSelectedLocation 
}: { 
  locations: Record<string, { pos: [number, number]; img: string }>,
  setDestination: (pos: [number, number]) => void,
  setSelectedLocation: (name: string) => void
}) {
  const searchParams = useSearchParams();
  useEffect(() => {
    const navTo = searchParams.get('navTo');
    if (navTo && locations[navTo]) {
      setDestination(locations[navTo].pos);
      setSelectedLocation(navTo);
    }
  }, [searchParams, locations, setDestination, setSelectedLocation]);
  return null;
}

export default function UNTLiveMapInner() {
  const defaultPosition: [number, number] = [33.2104, -97.1503];
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [destination, setDestination] = useState<[number, number] | null>(null);
  const [selectedLocation, setSelectedLocation] = useState("");

  const locations: Record<string, { pos: [number, number]; img: string }> = {
    "Willis Library": { pos: [33.209929, -97.149024], img: "https://library.unt.edu/wp-content/uploads/2017/08/willis-library-exterior.jpg" },
    "Pohl Recreation Center": { pos: [33.21207, -97.15404], img: "https://recsports.unt.edu/sites/default/files/pohl-exterior.jpg" },
    "University Union": { pos: [33.2106, -97.147418], img: "https://studentaffairs.unt.edu/sites/default/files/images/union-exterior.jpg" },
    "Coliseum": { pos: [33.208687, -97.154113], img: "https://digital.library.unt.edu/ark:/67531/metadc856885/thumbnail/" },
    "Discovery Park": { pos: [33.2536, -97.1526], img: "https://engineering.unt.edu/sites/default/files/dp-exterior.jpg" },
    "Discovery Park B Building": { pos: [33.2902, -97.1530], img: "https://engineering.unt.edu/sites/default/files/dp-exterior.jpg" },
    "BLB – Business Leadership Building": { pos: [33.2076, -97.1523], img: "https://cob.unt.edu/sites/default/files/blb_exterior.jpg" },
    "General Academic Building (GAB)": { pos: [33.2118, -97.1526], img: "https://goclass.unt.edu/sites/default/files/styles/building_image/public/GAB.jpg" },
    "Art Building": { pos: [33.2125, -97.1535], img: "https://news.cvad.unt.edu/sites/default/files/styles/large/public/art-building-exterior.jpg" },
    "Business Leadership Building": { pos: [33.212, -97.152], img: "https://cob.unt.edu/sites/default/files/blb_exterior.jpg" },
    "Chemistry Building": { pos: [33.2128, -97.1538], img: "https://chemistry.unt.edu/sites/default/files/chemistry-building.jpg" },
    "Bain Hall": { pos: [33.211, -97.1528], img: "https://housing.unt.edu/sites/default/files/bain-hall.jpg" },
    "Bruce Hall": { pos: [33.2123, -97.154], img: "https://housing.unt.edu/sites/default/files/bruce-hall.jpg" },
    "Chestnut Hall": { pos: [33.2126, -97.1505], img: "https://studentaffairs.unt.edu/sites/default/files/chestnut-hall.jpg" },
    "Curry Hall": { pos: [33.213, -97.1522], img: "https://cob.unt.edu/sites/default/files/curry-hall.jpg" },
    "General Academic Building": { pos: [33.2118, -97.1526], img: "https://goclass.unt.edu/sites/default/files/styles/building_image/public/GAB.jpg" },
    "Gateway Center": { pos: [33.2135, -97.153], img: "https://gatewayservices.unt.edu/sites/default/files/gateway-center.jpg" },
    "Eagle Student Services Center": { pos: [33.2119, -97.1519], img: "https://essc.unt.edu/sites/default/files/essc-exterior.jpg" },
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => setUserPosition([pos.coords.latitude, pos.coords.longitude]),
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 w-full">
      <div className="relative w-[90vw] h-[90vh]">
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-[2000] pointer-events-auto">
          <select
            value={selectedLocation}
            onChange={(e) => {
              const name = e.target.value;
              setSelectedLocation(name);
              // FIXED: correctly accessing .pos from the new object structure
              if (locations[name]) {
                setDestination(locations[name].pos);
              }
            }}
            className="bg-[#00693E] text-white font-bold text-xl border-2 border-black rounded-xl px-8 py-4 shadow-lg"
          >
            <option value="" disabled>SELECT DESTINATION</option>
            {Object.keys(locations).sort().map((name) => (
              <option key={name} value={name}>{name.toUpperCase()}</option>
            ))}
          </select>
        </div>

        <MapContainer center={defaultPosition} zoom={16} className="w-full h-full rounded-2xl shadow-lg">
          <ClickToGetCoords />
          <Suspense fallback={null}>
            <MapLogic 
              locations={locations} 
              setDestination={setDestination} 
              setSelectedLocation={setSelectedLocation} 
            />
          </Suspense>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          
          {userPosition && (
            <Marker position={userPosition}>
              <Popup>You are here</Popup>
            </Marker>
          )}

          {userPosition && <FlyToMarker position={userPosition} />}

          {destination && (
            <Marker 
              position={destination} 
              icon={createBuildingIcon(locations[selectedLocation]?.img || "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png")}
            >
              <Popup>
                <div className="w-40 text-black">
                  <img src={locations[selectedLocation]?.img} className="rounded-lg mb-2 h-24 w-full object-cover" />
                  <p className="font-bold text-center text-[#00853E]">{selectedLocation}</p>
                </div>
              </Popup>
            </Marker>
          )}

          {userPosition && destination && <Routing start={userPosition} end={destination} />}
        </MapContainer>
      </div>
      
      <style jsx global>{`
        .leaflet-routing-container { display: none !important; }
      `}</style>
    </div>
  );
}