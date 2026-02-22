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
}

const LOCATION_MAP: Record<string, [number, number]> = {
  "DATCU Stadium": [33.2104, -97.1503],
  "University Union": [33.2100, -97.1478],
  "Willis Library": [33.2115, -97.1465],
  "Discovery Park": [33.2533, -97.1526],
  "UNT Campus": [33.2108, -97.1459], 
};

const UNTEventsPage: React.FC = () => {
  const [events, setEvents] = useState<UNTEvent[]>([]);
  const [activeEventId, setActiveEventId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Fetching directly from UNT's Public API
        const response = await fetch('https://calendar.unt.edu/api/2/events?days=30&pp=20');
        if (!response.ok) throw new Error("Failed to reach UNT Calendar");
        
        const data = await response.json();
        
        // The API returns an object with an 'events' array
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

  const handleGoToMap = (event: UNTEvent) => {
    const query = new URLSearchParams();
    query.set("event", event.title);
    const coords = LOCATION_MAP[event.location_name] || [33.2108, -97.1459];
    query.set("lat", coords[0].toString());
    query.set("lng", coords[1].toString());
    router.push(`/home?${query.toString()}`);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="w-12 h-12 border-4 border-t-[#00853E] border-gray-200 rounded-full animate-spin mb-4"></div>
      <p className="text-[#00853E] font-black uppercase tracking-widest text-xs">Syncing UNT Data...</p>
    </div>
  );

  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50 text-gray-900 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-black text-[#00853E] uppercase tracking-tighter">UNT Events</h1>
          <div className="h-1.5 w-12 bg-[#00853E] mt-1"></div>
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
                <p className="text-[10px] font-black text-[#00853E] uppercase mb-1">{new Date(event.first_date).toLocaleDateString()}</p>
                <h3 className="font-bold leading-tight text-gray-800">{event.title}</h3>
              </button>
            ))}
          </div>

          {/* Detail View */}
          <div className="md:col-span-8 p-10 overflow-y-auto bg-white">
            {activeEvent && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-4xl font-black mb-6 leading-tight">{activeEvent.title}</h2>
                <div className="flex items-center gap-3 mb-10">
                  <div className="w-10 h-10 flex items-center justify-center bg-green-50 rounded-full text-lg">📍</div>
                  <p className="font-bold text-gray-700">{activeEvent.location_name || "UNT Campus"}</p>
                </div>
                <div className="prose prose-slate max-w-none mb-12">
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {activeEvent.description_text ? activeEvent.description_text.substring(0, 500) + "..." : "No description provided."}
                  </p>
                </div>
                <div className="flex flex-wrap gap-4 pt-6 border-t">
                  <a href={activeEvent.localist_url} target="_blank" rel="noreferrer" className="px-10 py-4 bg-[#00853E] text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-[#006a31] transition-all">Official Page</a>
                  <button onClick={() => handleGoToMap(activeEvent)} className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all">View on Map</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default UNTEventsPage;