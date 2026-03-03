"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface UNTEvent {
  id: number;
  title: string;
  description_text: string;
  location_name: string;
  localist_url: string;
  first_date: string;
  geo?: {
    latitude: string;
    longitude: string;
  };
}

const UNTEventsPage: React.FC = () => {
  const [events, setEvents] = useState<UNTEvent[]>([]);
  const [activeEventId, setActiveEventId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('https://calendar.unt.edu/api/2/events?days=30&pp=20');
        if (!response.ok) throw new Error("Failed to reach UNT Calendar");
        
        const data = await response.json();
        // Extract the event objects from the API response
        const eventList = data.events.map((item: any) => item.event);
        
        setEvents(eventList);
        if (eventList.length > 0) setActiveEventId(eventList[0].id);
        setLoading(false);
      } catch (err) {
        setError("Could not load events. Please check your connection.");
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const activeEvent = events.find(e => e.id === activeEventId);

  const handleGoToMap = async (event: UNTEvent) => {
    const query = new URLSearchParams();
    query.set("event", event.title);

    let lat = event.geo?.latitude;
    let lng = event.geo?.longitude;

    // FALLBACK: If API has no coordinates, try to find the building via Geocoding
    if (!lat || !lng) {
      try {
        const searchName = event.location_name || "UNT Denton";
        const geoResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchName + " UNT Denton")}`
        );
        const geoData = await geoResponse.json();

        if (geoData && geoData.length > 0) {
          lat = geoData[0].lat;
          lng = geoData[0].lon;
        }
      } catch (err) {
        console.error("Geocoding failed", err);
      }
    }

    // FIXED: Using the nullish coalescing operator (||) to ensure strings are passed.
    // This resolves the "Argument of type 'string | undefined' is not assignable" error.
    query.set("lat", lat || "33.2108");
    query.set("lng", lng || "-97.1459");
    
    router.push(`/home?${query.toString()}`);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="w-12 h-12 border-4 border-t-[#00853E] border-gray-200 rounded-full animate-spin mb-4"></div>
      <p className="text-[#00853E] font-black uppercase tracking-widest text-xs">Fetching Live Data...</p>
    </div>
  );

  if (error) return <div className="p-10 text-center text-red-500 font-bold">{error}</div>;

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50 text-gray-900 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-[#00853E] uppercase tracking-tighter">UNT Events</h1>
            <div className="h-1.5 w-12 bg-[#00853E] mt-1"></div>
          </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Live Campus Feed</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 bg-white rounded-3xl shadow-2xl overflow-hidden h-[700px] border border-gray-100">
          {/* Sidebar */}
          <div className="md:col-span-4 border-r overflow-y-auto bg-[#fafafa]">
            {events.map((event) => (
              <button
                key={event.id}
                onClick={() => setActiveEventId(event.id)}
                className={`w-full text-left p-6 border-b transition-all ${activeEventId === event.id ? "bg-white border-l-8 border-l-[#00853E] shadow-md" : "opacity-60 hover:opacity-100"}`}
              >
                <p className="text-[10px] font-black text-[#00853E] uppercase mb-1">
                  {new Date(event.first_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </p>
                <h3 className="font-bold leading-tight text-gray-800 line-clamp-2">{event.title}</h3>
                <p className="text-xs text-gray-500 mt-2 truncate">📍 {event.location_name || "Check Official Page"}</p>
              </button>
            ))}
          </div>

          {/* Detail View */}
          <div className="md:col-span-8 p-10 overflow-y-auto bg-white flex flex-col">
            {activeEvent ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
                <h2 className="text-4xl font-black mb-6 leading-tight text-gray-900">{activeEvent.title}</h2>
                
                <div className="flex flex-col gap-3 mb-10">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📍</span>
                    <p className="font-bold text-gray-700">{activeEvent.location_name || "Location via Map"}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📅</span>
                    <p className="font-bold text-gray-700">
                      {new Date(activeEvent.first_date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                <div className="prose prose-slate max-w-none flex-grow">
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {activeEvent.description_text 
                      ? activeEvent.description_text.replace(/<[^>]*>?/gm, '').substring(0, 1000) 
                      : "No additional details provided for this event."}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 pt-8 border-t mt-8">
                  <a 
                    href={activeEvent.localist_url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="px-8 py-4 bg-gray-100 text-gray-900 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-gray-200 transition-all border border-gray-200"
                  >
                    Details
                  </a>
                  <button 
                    onClick={() => handleGoToMap(activeEvent)} 
                    className="px-8 py-4 bg-[#00853E] text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-[#006a31] shadow-lg shadow-green-100 transition-all"
                  >
                    View & Route on Map
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 font-bold uppercase tracking-widest">
                Select an event to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default UNTEventsPage;