"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";

interface UNTComment {
  id: number;
  user: string;
  text: string;
  timestamp: string;
}

interface UNTEvent {
  id: number;
  title: string;
  description_text: string;
  location_name: string;
  localist_url: string;
  first_date: string;
  filters: {
    event_types?: { name: string }[];
  };
  geo?: {
    latitude: string;
    longitude: string;
  };
}

const UNTEventsPage: React.FC = () => {
  // Navigation & View State
  const [view, setView] = useState<"official" | "user">("official");
  const [events, setEvents] = useState<UNTEvent[]>([]);
  const [activeEventId, setActiveEventId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Forum State
  const [showForum, setShowForum] = useState(false);
  const [comments, setComments] = useState<Record<number, UNTComment[]>>({});
  const [newComment, setNewComment] = useState("");

  const router = useRouter();

  // Load saved comments
  useEffect(() => {
    const savedComments = localStorage.getItem("unt_event_discussions");
    if (savedComments) {
      try {
        setComments(JSON.parse(savedComments));
      } catch (e) {
        console.error("Failed to parse saved comments", e);
      }
    }
  }, []);

  // Save comments
  useEffect(() => {
    if (Object.keys(comments).length > 0) {
      localStorage.setItem("unt_event_discussions", JSON.stringify(comments));
    }
  }, [comments]);

  // Fetch Official UNT Events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          "https://calendar.unt.edu/api/2/events?days=30&pp=50"
        );
        if (!response.ok) throw new Error("Failed to reach UNT Calendar");
        const data = await response.json();

        const eventList: UNTEvent[] = data.events.map((item: any) => item.event);
        const uniqueEvents = Array.from(
          new Map(eventList.map((e) => [e.id, e])).values()
        );

        setEvents(uniqueEvents);
        if (uniqueEvents.length > 0) setActiveEventId(uniqueEvents[0].id);
        setLoading(false);
      } catch (err) {
        setError("Could not load events. Please check your connection.");
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    events.forEach((e) => {
      e.filters.event_types?.forEach((t) => cats.add(t.name));
    });
    return ["All", ...Array.from(cats).sort()];
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description_text?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === "All" || 
        event.filters.event_types?.some(t => t.name === selectedCategory);

      return matchesSearch && matchesCategory;
    });
  }, [events, searchQuery, selectedCategory]);

  const activeEvent = events.find((e) => e.id === activeEventId);

  const handleGoToMap = async (event: UNTEvent) => {
    const query = new URLSearchParams();
    query.set("event", event.title);
    let lat = event.geo?.latitude;
    let lng = event.geo?.longitude;

    if (!lat || !lng) {
      try {
        const searchName = event.location_name || "UNT Denton";
        const geoResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            searchName + " UNT Denton"
          )}`
        );
        const geoData = await geoResponse.json();
        if (geoData?.[0]) {
          lat = geoData[0].lat;
          lng = geoData[0].lon;
        }
      } catch (err) {
        console.error("Geocoding failed", err);
      }
    }
    query.set("lat", lat || "33.2108");
    query.set("lng", lng || "-97.1459");
    router.push(`/home?${query.toString()}`);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !activeEventId) return;
    const comment: UNTComment = {
      id: Date.now(),
      user: "Student User",
      text: newComment,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setComments((prev) => ({
      ...prev,
      [activeEventId]: [...(prev[activeEventId] || []), comment],
    }));
    setNewComment("");
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 pt-32">
        <div className="w-12 h-12 border-4 border-t-[#00853E] border-gray-200 rounded-full animate-spin mb-4"></div>
        <p className="text-[#00853E] font-black uppercase tracking-widest text-xs">Fetching Live Data...</p>
      </div>
    );

  return (
    <main className="min-h-screen pt-32 pb-12 px-4 md:px-8 bg-gray-50 text-gray-900 font-sans relative z-0 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        
        {/* Updated Header with Toggles */}
        <header className="mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4 bg-gray-200/50 p-1.5 rounded-2xl w-fit">
            <button 
              onClick={() => setView("official")}
              className={`px-6 py-3 rounded-xl font-black uppercase tracking-tighter text-sm transition-all ${
                view === "official" 
                ? "bg-[#00853E] text-white shadow-lg scale-105" 
                : "text-gray-500 hover:text-[#00853E]"
              }`}
            >
              UNT Events
            </button>
            <button 
              onClick={() => setView("user")}
              className={`px-6 py-3 rounded-xl font-black uppercase tracking-tighter text-sm transition-all ${
                view === "user" 
                ? "bg-[#00853E] text-white shadow-lg scale-105" 
                : "text-gray-500 hover:text-[#00853E]"
              }`}
            >
              User Events
            </button>
          </div>
          
          {/* Top Filter Bar (Only visible on Official view) */}
          {view === "official" && (
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto animate-in fade-in duration-500">
              <div className="relative flex-grow">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                <input 
                  type="text" 
                  placeholder="Search keywords..." 
                  className="pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#00853E] outline-none w-full md:w-72 bg-white shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select 
                className="px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white focus:ring-2 focus:ring-[#00853E] outline-none shadow-sm cursor-pointer"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          )}
        </header>

        {view === "official" ? (
          /* Official Events Grid */
          <div className="grid grid-cols-1 md:grid-cols-12 bg-white rounded-[2rem] shadow-2xl overflow-hidden min-h-[600px] md:h-[calc(100vh-340px)] border border-gray-100 animate-in zoom-in-95 duration-300">
            <div className="md:col-span-4 border-r overflow-y-auto bg-[#fafafa]">
              {filteredEvents.map((event) => (
                <button
                  key={event.id}
                  onClick={() => {
                    setActiveEventId(event.id);
                    setShowForum(false);
                  }}
                  className={`w-full text-left p-6 border-b transition-all ${
                    activeEventId === event.id
                      ? "bg-white border-l-[10px] border-l-[#00853E] shadow-inner"
                      : "opacity-60 hover:opacity-100 hover:bg-gray-100"
                  }`}
                >
                  <p className="text-[10px] font-black text-[#00853E] uppercase mb-1">
                    {new Date(event.first_date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </p>
                  <h3 className="font-bold leading-tight text-gray-800 line-clamp-2">{event.title}</h3>
                  <p className="text-xs text-gray-500 mt-2 truncate italic">📍 {event.location_name || "UNT Campus"}</p>
                </button>
              ))}
            </div>

            <div className="md:col-span-8 p-6 md:p-12 overflow-y-auto bg-white flex flex-col relative">
              {activeEvent && (
                <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 h-full flex flex-col">
                  <div className="mb-4 flex flex-wrap gap-2">
                    {activeEvent.filters.event_types?.map(t => (
                      <span key={t.name} className="px-3 py-1 bg-green-50 text-[#00853E] text-[10px] font-black rounded-full uppercase tracking-wider">
                        {t.name}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight text-gray-900 tracking-tight">{activeEvent.title}</h2>
                  <div className="prose prose-lg prose-slate max-w-none flex-grow">
                    <p className="text-gray-600 leading-relaxed">
                      {activeEvent.description_text ? activeEvent.description_text.replace(/<[^>]*>?/gm, "").substring(0, 1000) : "No details provided."}
                    </p>
                  </div>

                  {/* Forum Overlay */}
                  {showForum && (
                    <div className="absolute inset-0 bg-white z-20 p-6 md:p-12 flex flex-col animate-in slide-in-from-right duration-300">
                      <div className="flex justify-between items-center mb-8">
                        <h3 className="text-3xl font-black uppercase text-[#00853E]">Discussion</h3>
                        <button onClick={() => setShowForum(false)} className="text-gray-400 hover:text-black font-bold">✕ CLOSE</button>
                      </div>
                      <div className="flex-grow overflow-y-auto space-y-4 mb-8">
                        {(comments[activeEventId!] || []).map((c) => (
                          <div key={c.id} className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                            <div className="flex justify-between mb-2">
                              <span className="font-black text-sm text-[#00853E]">{c.user}</span>
                              <span className="text-[10px] font-bold text-gray-400">{c.timestamp}</span>
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed">{c.text}</p>
                          </div>
                        ))}
                      </div>
                      <form onSubmit={handleAddComment} className="flex gap-3">
                        <input
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Type a message..."
                          className="flex-grow bg-gray-100 p-5 rounded-2xl outline-none focus:ring-2 focus:ring-[#00853E] text-sm"
                        />
                        <button type="submit" className="bg-[#00853E] text-white px-8 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#006a31]">Post</button>
                      </form>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4 pt-10 border-t mt-10">
                    <button onClick={() => setShowForum(true)} className="px-8 py-5 bg-white text-gray-900 border-2 border-gray-900 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-900 hover:text-white transition-all">
                      💬 Discussion ({(comments[activeEventId!] || []).length})
                    </button>
                    <button onClick={() => handleGoToMap(activeEvent)} className="px-8 py-5 bg-[#00853E] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex-grow text-center shadow-lg">View & Route on Map</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* User Events View */
          <div className="bg-white rounded-[2rem] shadow-2xl p-12 text-center flex flex-col items-center justify-center min-h-[500px] animate-in slide-in-from-left duration-300">
            <span className="text-6xl mb-6">🦅</span>
            <h2 className="text-3xl font-black text-gray-900 uppercase">Student Meetups</h2>
            <p className="text-gray-500 max-w-md mt-4">
              This section is for user-created events and study groups. 
              Coming soon: Post your own events and find classmates to hang out with!
            </p>
            <button className="mt-8 px-8 py-4 bg-[#00853E] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-[#006a31] transition-all">
              + Post New Event
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default UNTEventsPage;